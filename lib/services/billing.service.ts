import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { AppError } from "@/lib/errors";
import { getEnvWithDefault, requireEnv } from "@/lib/env";

const PRO_AMOUNT_CENTS = Number(getEnvWithDefault("STRIPE_PRO_PRICE_CENTS", "999"));
const PRO_CURRENCY = getEnvWithDefault("STRIPE_PRO_CURRENCY", "usd");
const PRO_UNLOCK_DURATION_SECONDS = Number(
  getEnvWithDefault("STRIPE_PRO_UNLOCK_DURATION_SECONDS", "60"),
);
const BASE_URL = getEnvWithDefault("PUBLIC_APP_URL", "http://localhost:3000");

let stripeClient: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY"));
  }
  return stripeClient;
}

async function invalidateUserPlanCaches(userId: string) {
  await cache.invalidatePattern(`user:${userId}*`);
  await cache.invalidatePattern(`timeline:user:${userId}*`);
}

function getPlanUnlockExpiryDate() {
  const safeSeconds =
    Number.isFinite(PRO_UNLOCK_DURATION_SECONDS) && PRO_UNLOCK_DURATION_SECONDS > 0
      ? PRO_UNLOCK_DURATION_SECONDS
      : 60;
  return new Date(Date.now() + safeSeconds * 1000);
}

async function applyFreePlan(userId: string) {
  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "FREE",
      planStatus: null,
      planStartedAt: null,
      stripeSubscriptionId: null,
      stripeCurrentPeriodEndAt: null,
    },
  });
  await invalidateUserPlanCaches(userId);
  return updated;
}

export async function syncUserPlanExpiration(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      plan: true,
      stripeCurrentPeriodEndAt: true,
    },
  });

  if (!user) return null;

  const isProExpired =
    user.plan === "PRO" &&
    (!user.stripeCurrentPeriodEndAt || user.stripeCurrentPeriodEndAt.getTime() <= Date.now());

  if (!isProExpired) {
    return user;
  }

  return applyFreePlan(userId);
}

async function activateProPlan(
  userId: string,
  data: {
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    stripeCurrentPeriodEndAt?: Date | null;
  },
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const alreadyActive =
    user.plan === "PRO" &&
    user.planStatus === "active" &&
    (user.stripeSubscriptionId ?? null) === (data.stripeSubscriptionId ?? null);
  if (alreadyActive) {
    return user;
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      plan: "PRO",
      planStatus: "active",
      planStartedAt: new Date(),
      stripeCustomerId: data.stripeCustomerId ?? user.stripeCustomerId,
      stripeSubscriptionId: data.stripeSubscriptionId ?? user.stripeSubscriptionId,
      stripeCurrentPeriodEndAt: data.stripeCurrentPeriodEndAt ?? getPlanUnlockExpiryDate(),
    },
  });
  await invalidateUserPlanCaches(userId);
  return updated;
}

export async function getBillingStatus(userId: string) {
  await syncUserPlanExpiration(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      plan: true,
      planStatus: true,
      planStartedAt: true,
      stripeCurrentPeriodEndAt: true,
      stripeSubscriptionId: true,
    },
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function createCheckoutSession(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  if (user.plan === "PRO") throw new AppError("You are already on the Pro plan", 400);

  let customerId = user.stripeCustomerId || "";
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: PRO_CURRENCY,
          product_data: {
            name: "Pro Plan",
            description: "100 character posts, Pro badge, Priority support",
          },
          unit_amount: PRO_AMOUNT_CENTS,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${BASE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/billing`,
    metadata: {
      userId: user.id,
      plan: "PRO",
      unlockDurationSeconds: String(PRO_UNLOCK_DURATION_SECONDS),
    },
  });

  return { url: session.url };
}

export async function createPaymentIntent(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  if (user.plan === "PRO") throw new AppError("You are already on the Pro plan", 400);

  let customerId = user.stripeCustomerId || "";
  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: customerId },
    });
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: PRO_AMOUNT_CENTS,
    currency: PRO_CURRENCY,
    customer: customerId,
    metadata: {
      userId: user.id,
      plan: "PRO",
      unlockDurationSeconds: String(PRO_UNLOCK_DURATION_SECONDS),
    },
    automatic_payment_methods: { enabled: true },
  });

  return { clientSecret: paymentIntent.client_secret };
}

export async function confirmPayment(
  userId: string,
  sessionId?: string,
  paymentIntentId?: string,
) {
  await syncUserPlanExpiration(userId);

  if (sessionId) {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.metadata?.userId !== userId) {
      throw new AppError("Payment does not belong to this user", 403);
    }

    if (session.payment_status === "paid" && session.metadata?.plan === "PRO") {
      await activateProPlan(userId, {
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
        stripeSubscriptionId:
          typeof session.subscription === "string" ? session.subscription : null,
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true, planStatus: true, stripeCurrentPeriodEndAt: true },
    });

    return {
      paymentStatus: session.payment_status,
      amount: session.amount_total,
      currency: session.currency,
      plan: user?.plan ?? "FREE",
      unlockExpiresAt: user?.stripeCurrentPeriodEndAt ?? null,
    };
  }

  if (!paymentIntentId) {
    throw new AppError("Missing session_id or payment_intent_id", 400);
  }

  const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);

  if (pi.metadata?.userId !== userId) {
    throw new AppError("Payment does not belong to this user", 403);
  }

  if (pi.status === "succeeded" && pi.metadata?.plan === "PRO") {
    await activateProPlan(userId, {
      stripeCustomerId: typeof pi.customer === "string" ? pi.customer : (pi.customer?.id ?? null),
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, planStatus: true, stripeCurrentPeriodEndAt: true },
  });

  return {
    paymentStatus: pi.status,
    amount: pi.amount,
    currency: pi.currency,
    plan: user?.plan ?? "FREE",
    unlockExpiresAt: user?.stripeCurrentPeriodEndAt ?? null,
  };
}

export async function downgradePlan(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);
  if (user.plan === "FREE") throw new AppError("You are already on the Free plan", 400);

  if (user.stripeSubscriptionId) {
    try {
      await getStripe().subscriptions.cancel(user.stripeSubscriptionId);
    } catch {
      // Continue with downgrade even if Stripe cancellation fails
    }
  }

  const updated = await applyFreePlan(userId);

  return {
    id: updated.id,
    email: updated.email,
    plan: updated.plan,
    planStatus: updated.planStatus,
  };
}

export async function handleStripeWebhook(
  rawBody: string,
  signature: string,
) {
  const stripeWebhookSecret = requireEnv("STRIPE_WEBHOOK_SECRET");

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      stripeWebhookSecret,
    );
  } catch {
    throw new AppError("Invalid webhook signature", 400);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const eventUserId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    if (eventUserId && plan === "PRO") {
      await activateProPlan(eventUserId, {
        stripeCustomerId:
          typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null),
        stripeSubscriptionId:
          typeof session.subscription === "string" ? session.subscription : null,
      });
    }
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as Stripe.PaymentIntent;
    const eventUserId = pi.metadata?.userId;
    const plan = pi.metadata?.plan;

    if (eventUserId && plan === "PRO") {
      await activateProPlan(eventUserId, {
        stripeCustomerId: typeof pi.customer === "string" ? pi.customer : (pi.customer?.id ?? null),
      });
    }
  }

  return { received: true };
}

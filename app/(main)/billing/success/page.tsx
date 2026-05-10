"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { billingAPI } from "@/lib/services/api";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";

export default function BillingSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { refreshUserProfile, setUserPlan } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("FREE");
  const [unlockExpiresAt, setUnlockExpiresAt] = useState<string | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    // Prevent running multiple times in strict mode
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkPayment = async () => {
      try {
        setIsLoading(true);
        const sessionId = searchParams.get("session_id");
        const piId = searchParams.get("payment_intent_id");

        console.log("\n" + "=".repeat(60));
        console.log("🔄 BillingSuccessPage: Checking payment");
        console.log("=".repeat(60));
        console.log("URL Parameters:");
        console.log("  session_id:", sessionId);
        console.log("  payment_intent_id:", piId);

        if (!sessionId && !piId) {
          throw new Error("Missing payment information");
        }

        // Check payment status with Stripe
        console.log("\n📞 Calling confirmPayment API...");
        const result = await billingAPI.confirmPayment(
          sessionId || undefined,
          piId || undefined,
        );

        console.log("\n✅ confirmPayment Response:");
        console.log("  paymentStatus:", result.paymentStatus);
        console.log("  amount:", result.amount);
        console.log("  currency:", result.currency);
        console.log("  plan:", result.plan);

        setPaymentStatus(result.paymentStatus);
        setPlan(result.plan);
        setUnlockExpiresAt(result.unlockExpiresAt);
        if (result.plan === "FREE" || result.plan === "PRO") {
          setUserPlan(result.plan);
        }

        // If webhook hasn't processed yet, poll a few times
        if (
          (result.paymentStatus === "succeeded" ||
            result.paymentStatus === "paid") &&
          result.plan !== "PRO"
        ) {
          console.log(
            "\n⏳ Payment succeeded but plan not updated. Polling for webhook...",
          );
          for (let i = 0; i < 5; i++) {
            console.log(`  Poll ${i + 1}/5...`);
            await new Promise((r) => setTimeout(r, 1500));
            const retry = await billingAPI.confirmPayment(
              sessionId || undefined,
              piId || undefined,
            );
            console.log(
              `    Response - plan: ${retry.plan}, status: ${retry.paymentStatus}`,
            );
            setPlan(retry.plan);
            setUnlockExpiresAt(retry.unlockExpiresAt);
            if (retry.plan === "FREE" || retry.plan === "PRO") {
              setUserPlan(retry.plan);
            }
            if (retry.plan === "PRO") {
              console.log("  ✅ Plan updated to PRO!");
              break;
            }
          }
        }

        // Refresh user profile once after checking payment
        console.log("\n🔄 Refreshing user profile...");
        await refreshUserProfile();
        console.log("✅ User profile refreshed after payment");

        console.log("=".repeat(60) + "\n");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to confirm payment";
        console.error("❌ Payment confirmation error:", err);
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    checkPayment();
  }, []); // Empty dependency array - run only once

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center space-y-6">
        <div className="text-center">
          <div className="border-primary mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-[15px] text-white/60">
            Confirming your payment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border border-white/15 bg-white/5 p-8 text-center">
        {error ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-none bg-[#fce8e6]">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <h1 className="mb-2 text-[24px] font-medium text-white">
              Payment Error
            </h1>
            <p className="mb-6 text-[15px] text-white/70">{error}</p>
            <div className="flex justify-center gap-3">
              <Button
                onClick={() => router.push("/billing")}
                className="h-11 rounded-none"
              >
                Back to Billing
              </Button>
            </div>
          </>
        ) : paymentStatus === "succeeded" || paymentStatus === "paid" ? (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-none bg-[#e6f4ea]">
                <Check className="h-8 w-8 text-[#0d9488]" />
              </div>
            </div>
            <h1 className="mb-2 text-[24px] font-medium text-white">
              {plan === "PRO" ? "Welcome to Pro!" : "Payment Received!"}
            </h1>
            <p className="mb-6 text-[15px] text-white/70">
              {plan === "PRO"
                ? `Your subscription is now active. Pro features stay unlocked for 1 minute${
                    unlockExpiresAt
                      ? ` (until ${new Date(unlockExpiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })})`
                      : ""
                  }.`
                : "Your payment was successful. Your account will be upgraded shortly."}
            </p>
            <Button
              onClick={() => router.push("/billing")}
              className="h-11 rounded-none"
            >
              View Billing Details
            </Button>
          </>
        ) : (
          <>
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-none bg-[#fce8e6]">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <h1 className="mb-2 text-[24px] font-medium text-white">
              Payment Incomplete
            </h1>
            <p className="mb-6 text-[15px] text-white/70">
              Your payment could not be completed. Please try again.
            </p>
            <Button
              onClick={() => router.push("/billing")}
              className="h-11 rounded-none"
            >
              Try Again
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { successResponse, handleApiError } from "@/lib/errors";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const sessions = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        stripeCustomerId: true,
        plan: true,
        planStatus: true,
        stripeCurrentPeriodEndAt: true,
        stripeSubscriptionId: true,
      },
    });
    return successResponse(sessions);
  } catch (error) {
    return handleApiError(error);
  }
}

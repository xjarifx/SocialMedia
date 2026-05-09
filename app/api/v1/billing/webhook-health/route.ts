import { successResponse, handleApiError } from "@/lib/errors";

export async function GET() {
  try {
    return successResponse({
      status: "healthy",
      timestamp: new Date().toISOString(),
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET ? "configured" : "missing",
    });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { downgradePlan } from "@/lib/services/billing.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function POST(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const result = await downgradePlan(userId);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

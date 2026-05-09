import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { checkBlockStatus } from "@/services/blocks.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId: currentUserId } = authenticateRequest(request);
    const { userId: targetUserId } = await params;
    const status = await checkBlockStatus(currentUserId, targetUserId);
    return successResponse(status);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { unfollowUser } from "@/services/follows.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string; followingId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { followingId } = await params;
    await unfollowUser(userId, followingId);
    return successResponse({ message: "Unfollowed successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

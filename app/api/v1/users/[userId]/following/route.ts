import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getUserFollowing } from "@/lib/services/user.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    authenticateRequest(request);
    const { userId } = await params;
    const following = await getUserFollowing(userId);
    return successResponse(following);
  } catch (error) {
    return handleApiError(error);
  }
}

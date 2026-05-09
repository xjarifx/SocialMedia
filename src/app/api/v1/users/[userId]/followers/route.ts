import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getUserFollowers } from "@/lib/services/user.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const followers = await getUserFollowers(userId);
    return successResponse(followers);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { authenticateOptional } from "@/lib/auth";
import { getUserPosts } from "@/lib/services/user.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const auth = authenticateOptional(request);
    const { userId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = parseInt(searchParams.get("offset") || "0");
    const posts = await getUserPosts(userId, limit, offset, auth?.userId);
    return successResponse(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

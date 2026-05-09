import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { likePost, unlikePost, getPostLikes } from "@/lib/services/likes.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { postId } = await params;
    const result = await likePost(userId, { postId });
    return successResponse(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { postId } = await params;
    await unlikePost(userId, { postId });
    return successResponse({ message: "Unliked successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    authenticateRequest(request);
    const { postId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const likes = await getPostLikes({ postId }, { limit, offset });
    return successResponse(likes);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { likeComment, unlikeComment } from "@/lib/services/comments.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { postId, commentId } = await params;
    const result = await likeComment(userId, { postId, commentId });
    return successResponse(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { postId, commentId } = await params;
    await unlikeComment(userId, { postId, commentId });
    return successResponse({ message: "Unliked successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

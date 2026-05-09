import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest, authenticateOptional } from "@/lib/auth";
import { getPostById, updatePost, deletePost } from "@/services/posts.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const updatePostSchema = z.object({
  content: z.string().max(100).optional(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const auth = authenticateOptional(request);
    const { postId } = await params;
    const post = await getPostById({ postId }, auth?.userId);
    return successResponse(post);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { postId } = await params;
    const body = await request.json();
    const parsed = updatePostSchema.parse(body);
    const post = await updatePost(userId, { postId }, { content: parsed.content, visibility: parsed.visibility });
    return successResponse(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
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
    await deletePost(userId, { postId });
    return successResponse({ message: "Post deleted successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/auth";
import { updateComment, deleteComment } from "@/lib/services/comments.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const updateCommentSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { commentId } = await params;
    const body = await request.json();
    const parsed = updateCommentSchema.parse(body);
    const comment = await updateComment(userId, { commentId }, { content: parsed.content });
    return successResponse(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string; commentId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { commentId } = await params;
    const result = await deleteComment(userId, { commentId });
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

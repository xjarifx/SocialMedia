import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/auth";
import { createComment, getComments } from "@/lib/services/comments.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";
import { parsePaginationParams } from "@/lib/pagination";

const createCommentSchema = z.object({
  content: z.string().min(1).max(500),
  parentId: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ postId: string }> },
) {
  try {
    const { userId } = authenticateRequest(request);
    const { postId } = await params;
    const body = await request.json();
    const parsed = createCommentSchema.parse(body);
    const comment = await createComment(userId, { postId, content: parsed.content, parentId: parsed.parentId });
    return successResponse(comment, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
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
    const { limit, offset } = parsePaginationParams(searchParams, { limit: 5, offset: 0 });
    const parentId = searchParams.get("parentId");
    const comments = await getComments("", { postId }, { limit, offset, parentId });
    return successResponse(comments);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/auth";
import { createPost, getFeed } from "@/services/posts.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const createPostSchema = z.object({
  content: z.string().max(100, "Content exceeds 100 character limit"),
  visibility: z.enum(["PUBLIC", "PRIVATE"]).optional().default("PUBLIC"),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const posts = await getFeed(userId, { limit, offset });
    return successResponse(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const formData = await request.formData();
    const content = (formData.get("content") as string) || "";
    const visibility = (formData.get("visibility") as "PUBLIC" | "PRIVATE") || "PUBLIC";
    const image = formData.get("image") as File | null;

    const parsed = createPostSchema.parse({ content, visibility });
    const post = await createPost(userId, { content: parsed.content, visibility: parsed.visibility }, image);
    return successResponse(post, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { getForYouFeed } from "@/lib/services/posts.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const posts = await getForYouFeed(userId, { limit, offset });
    return successResponse(posts);
  } catch (error) {
    return handleApiError(error);
  }
}

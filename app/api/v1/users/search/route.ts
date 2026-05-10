import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { searchUsers } from "@/lib/services/user.service";
import { successResponse, handleApiError } from "@/lib/errors";
import { parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const { limit, offset } = parsePaginationParams(searchParams, { limit: 10, offset: 0 });
    const results = await searchUsers(query, limit, offset);
    return successResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}

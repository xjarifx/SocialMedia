import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { listNotifications } from "@/lib/services/notifications.service";
import { successResponse, handleApiError } from "@/lib/errors";
import { parsePaginationParams } from "@/lib/pagination";

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const { limit, offset } = parsePaginationParams(searchParams, { limit: 20, offset: 0 });
    const result = await listNotifications(userId, limit, offset);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { listNotifications } from "@/services/notifications.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const result = await listNotifications(userId, limit, offset);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

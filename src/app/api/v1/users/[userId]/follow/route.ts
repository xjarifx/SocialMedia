import { NextRequest } from "next/server";
import { authenticateRequest } from "@/lib/auth";
import { followUser } from "@/services/follows.service";
import { successResponse, handleApiError } from "@/lib/errors";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId: currentUserId } = authenticateRequest(request);
    const { userId: targetUserId } = await params;
    const result = await followUser(currentUserId, targetUserId);
    return successResponse(result, 201);
  } catch (error) {
    return handleApiError(error);
  }
}

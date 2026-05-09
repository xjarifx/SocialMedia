import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/auth";
import { blockUser, unblockUser, getBlockedUsers } from "@/services/blocks.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const blockSchema = z.object({
  username: z.string().min(1),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const result = await getBlockedUsers(userId, limit, offset);
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const body = await request.json();
    const parsed = blockSchema.parse(body);
    const result = await blockUser(userId, parsed.username);
    return successResponse(result, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const body = await request.json();
    const parsed = blockSchema.parse(body);
    await unblockUser(userId, parsed.username);
    return successResponse({ message: "Unblocked successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

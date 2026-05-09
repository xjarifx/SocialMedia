import { NextRequest } from "next/server";
import { z } from "zod";
import { authenticateRequest } from "@/lib/auth";
import { getCurrentProfile, updateProfile } from "@/services/user.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const updateSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const user = await getCurrentProfile(userId);
    return successResponse(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = authenticateRequest(request);
    const body = await request.json();
    const parsed = updateSchema.parse(body);
    const user = await updateProfile(userId, parsed);
    return successResponse(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

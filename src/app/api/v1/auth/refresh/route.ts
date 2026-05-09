import { NextRequest } from "next/server";
import { z } from "zod";
import { refreshTokens } from "@/lib/services/auth.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const refreshSchema = z.object({
  refreshToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = refreshSchema.parse(body);
    const result = await refreshTokens(parsed.refreshToken);
    return successResponse(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    return handleApiError(error);
  }
}

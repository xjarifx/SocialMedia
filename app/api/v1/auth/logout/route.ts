import { NextRequest } from "next/server";
import { z } from "zod";
import { logout } from "@/lib/services/auth.service";
import { successResponse, handleApiError } from "@/lib/errors";

const logoutSchema = z.object({
  refreshToken: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = logoutSchema.parse(body);
    await logout(parsed.refreshToken);
    return successResponse({ message: "Logged out successfully" });
  } catch (error) {
    return handleApiError(error);
  }
}

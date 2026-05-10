import { NextRequest } from "next/server";
import { z } from "zod";
import { login } from "@/lib/services/auth.service";
import { successResponse, handleApiError, AppError } from "@/lib/errors";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.parse(body);
    const result = await login(parsed.email, parsed.password);
    return successResponse(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return handleApiError(new AppError(error.issues[0].message));
    }
    if (error instanceof SyntaxError) {
      return handleApiError(new AppError("Invalid request body", 400));
    }
    return handleApiError(error);
  }
}

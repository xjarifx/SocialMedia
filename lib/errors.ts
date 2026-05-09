import { NextResponse } from "next/server";
import { AuthError } from "./auth";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { success: false, data: null, error: error.message },
      { status: 401 },
    );
  }
  if (error instanceof AppError) {
    return NextResponse.json(
      { success: false, data: null, error: error.message },
      { status: error.statusCode },
    );
  }
  console.error("Unhandled API error:", error);
  return NextResponse.json(
    { success: false, data: null, error: "Internal server error" },
    { status: 500 },
  );
}

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    { success: true, data, error: null },
    { status },
  );
}

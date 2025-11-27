import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import { HTTP_STATUS } from "../../constants/http-status.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 server error
  let statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";
  let errors: any[] | undefined;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;

    // Check if it's a ValidationError with errors array
    if ("errors" in err) {
      errors = (err as any).errors;
    }
  }

  // Log error for debugging (in production, use proper logging service)
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    statusCode,
  });

  // Send error response
  const response: any = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

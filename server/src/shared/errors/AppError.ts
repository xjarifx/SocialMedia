import { HTTP_STATUS } from "../../constants/http-status.js";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    Error.captureStackTrace(this, this.constructor);

    // Set the prototype explicitly
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

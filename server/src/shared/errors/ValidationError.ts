import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/http-status.js";

export class ValidationError extends AppError {
  public readonly errors: any[] | undefined;

  constructor(message: string, errors?: any[]) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

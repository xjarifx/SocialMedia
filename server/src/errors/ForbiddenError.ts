import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { ERROR_MESSAGES } from "../constants/error-messages.js";

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

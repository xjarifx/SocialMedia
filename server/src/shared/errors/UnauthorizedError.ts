import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.js";

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

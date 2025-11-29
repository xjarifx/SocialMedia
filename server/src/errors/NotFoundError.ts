import { AppError } from "./AppError.js";
import { HTTP_STATUS } from "../constants/http-status.js";

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, HTTP_STATUS.NOT_FOUND);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

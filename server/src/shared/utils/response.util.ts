import { ApiResponse } from "../../types/common.types.js";

export function formatSuccessResponse<T>(
  data: T,
  message?: string
): ApiResponse<T> {
  const response: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) {
    response.message = message;
  }
  return response;
}

export function formatErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  };
}

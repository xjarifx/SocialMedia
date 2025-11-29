import { describe, it, expect } from "@jest/globals";
import {
  formatSuccessResponse,
  formatErrorResponse,
} from "../../../src/utils/response.util.js";

describe("Response Utility Functions", () => {
  describe("formatSuccessResponse", () => {
    it("should format a success response with data", () => {
      const data = { id: 1, name: "Test" };
      const response = formatSuccessResponse(data);

      expect(response).toEqual({
        success: true,
        data: data,
      });
    });

    it("should format a success response with data and message", () => {
      const data = { id: 1, name: "Test" };
      const message = "Operation successful";
      const response = formatSuccessResponse(data, message);

      expect(response).toEqual({
        success: true,
        data: data,
        message: message,
      });
    });

    it("should handle null data", () => {
      const response = formatSuccessResponse(null);

      expect(response).toEqual({
        success: true,
        data: null,
      });
    });

    it("should handle array data", () => {
      const data = [1, 2, 3];
      const response = formatSuccessResponse(data);

      expect(response).toEqual({
        success: true,
        data: data,
      });
    });
  });

  describe("formatErrorResponse", () => {
    it("should format an error response", () => {
      const errorMessage = "Something went wrong";
      const response = formatErrorResponse(errorMessage);

      expect(response).toEqual({
        success: false,
        error: errorMessage,
      });
    });

    it("should handle empty error message", () => {
      const response = formatErrorResponse("");

      expect(response).toEqual({
        success: false,
        error: "",
      });
    });
  });
});

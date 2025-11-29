import { describe, it, expect, jest, beforeEach } from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import { authenticateUserToken } from "../../../src/middleware/auth.middleware.js";
import { HTTP_STATUS } from "../../../src/constants/http-status.js";
import { ERROR_MESSAGES } from "../../../src/constants/error-messages.js";

describe("Auth Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn().mockReturnThis();
    mockResponse = {
      status: statusMock as any,
      json: jsonMock as any,
    };
    mockNext = jest.fn() as NextFunction;
    jest.clearAllMocks();
  });

  describe("authenticateUserToken", () => {
    it("should return 401 if no token provided", () => {
      mockRequest.headers = {};

      authenticateUserToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonMock).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.ACCESS_TOKEN_MISSING,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should return 401 for authorization header without Bearer prefix", () => {
      mockRequest.headers = {
        authorization: "invalid_format",
      };

      authenticateUserToken(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(statusMock).toHaveBeenCalledWith(HTTP_STATUS.UNAUTHORIZED);
      expect(jsonMock).toHaveBeenCalledWith({
        message: ERROR_MESSAGES.ACCESS_TOKEN_MISSING,
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});

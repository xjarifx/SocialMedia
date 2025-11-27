import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.util.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import { ERROR_MESSAGES } from "../../constants/error-messages.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";

export const authenticateUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader && authorizationHeader.split(" ")[1];

  if (!accessToken) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      message: ERROR_MESSAGES.ACCESS_TOKEN_MISSING,
    });
  }

  try {
    const decodedPayload = verifyToken(accessToken);
    req.user = {
      id: decodedPayload.id,
      email: decodedPayload.email,
      username: decodedPayload.username,
    };
    next();
  } catch (authenticationError) {
    return res.status(HTTP_STATUS.FORBIDDEN).json({
      message: ERROR_MESSAGES.INVALID_ACCESS_TOKEN,
    });
  }
};

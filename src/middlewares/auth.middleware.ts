import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedUser } from "../types/type.js";

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticateUserToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const accessToken = authorizationHeader && authorizationHeader.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Access token is missing." });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    return res.status(500).json({ message: "JWT secret is not configured." });
  }
  try {
    const decodedPayload = jwt.verify(accessToken, jwtSecret) as any;

    req.user = {
      id: decodedPayload.id,
      email: decodedPayload.email,
      username: decodedPayload.username,
    };
    next();
  } catch (authenticationError) {
    return res.status(403).json({ message: "Invalid access token." });
  }
};

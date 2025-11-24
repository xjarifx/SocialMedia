import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedUser {
  id: number;
  // email: string;
  // username: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

// Validate JWT_SECRET at application startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
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

  try {
    const decodedPayload = jwt.verify(accessToken, JWT_SECRET) as any;

    req.user = {
      id: decodedPayload.id,
      // email: decodedPayload.email,
      // username: decodedPayload.username,
    };
    next();
  } catch (authenticationError) {
    return res.status(403).json({ message: "Invalid access token." });
  }
};

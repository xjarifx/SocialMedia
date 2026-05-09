import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";

export interface AuthResult {
  userId: string;
}

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7);
}

export function verifyToken(token: string): AuthResult | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return { userId: decoded.userId };
  } catch {
    return null;
  }
}

export function authenticateRequest(request: NextRequest): AuthResult {
  const token = getTokenFromRequest(request);
  if (!token) {
    throw new AuthError("Authentication required");
  }
  const result = verifyToken(token);
  if (!result) {
    throw new AuthError("Invalid or expired token");
  }
  return result;
}

export function authenticateOptional(request: NextRequest): AuthResult | null {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}

import jwt from "jsonwebtoken";
import { AuthUser } from "../types/user.types.js";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "24h") as string | number;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export function generateToken(user: AuthUser): string {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as any,
  });
}

export function verifyToken(token: string): AuthUser {
  return jwt.verify(token, JWT_SECRET) as AuthUser;
}

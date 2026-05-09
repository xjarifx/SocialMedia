import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { AppError } from "@/lib/errors";

const SALT_ROUNDS = 10;

const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "5m";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "dev-refresh-secret";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

const generateRefreshToken = (userId: string): string => {
  return jwt.sign(
    { userId, jti: randomBytes(16).toString("hex") },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
};

const getRefreshTokenExpiry = (): Date => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

export async function register(data: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  const { email, username, password, firstName, lastName } = data;

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) throw new AppError("Email already taken", 409);

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) throw new AppError("Username already taken", 409);

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword, firstName, lastName },
  });

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      plan: user.plan,
    },
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new AppError("Invalid email or password", 401);

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

  const accessToken = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      plan: user.plan,
    },
  };
}

export async function logout(refreshToken: string) {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!tokenRecord) throw new AppError("Invalid refresh token", 401);
  if (tokenRecord.revokedAt) throw new AppError("Token already revoked", 401);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revokedAt: new Date() },
  });

  return { message: "Logged out successfully" };
}

export async function refreshTokens(refreshToken: string) {
  const tokenRecord = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!tokenRecord) throw new AppError("Invalid refresh token", 401);
  if (tokenRecord.revokedAt) throw new AppError("Token revoked", 401);
  if (new Date() > tokenRecord.expiresAt) throw new AppError("Token expired", 401);

  try {
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
  } catch {
    throw new AppError("Invalid refresh token", 401);
  }

  const newAccessToken = generateToken(tokenRecord.userId);
  const newRefreshToken = generateRefreshToken(tokenRecord.userId);

  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { revokedAt: new Date() },
  });

  await prisma.refreshToken.create({
    data: {
      userId: tokenRecord.userId,
      token: newRefreshToken,
      expiresAt: getRefreshTokenExpiry(),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: tokenRecord.user.id,
      username: tokenRecord.user.username,
      email: tokenRecord.user.email,
      firstName: tokenRecord.user.firstName,
      lastName: tokenRecord.user.lastName,
      createdAt: tokenRecord.user.createdAt,
      plan: tokenRecord.user.plan,
    },
  };
}

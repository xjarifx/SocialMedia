import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { AppError } from "@/lib/errors";
import { getEnvWithDefault, requireEnv } from "@/lib/env";

const SALT_ROUNDS = 10;

const JWT_EXPIRES_IN = getEnvWithDefault("JWT_EXPIRES_IN", "5m");
const REFRESH_TOKEN_EXPIRES_IN = getEnvWithDefault("REFRESH_TOKEN_EXPIRES_IN", "30d");

function getAuthSecrets() {
  try {
    return {
      jwtSecret: requireEnv("JWT_SECRET"),
      refreshTokenSecret: requireEnv("REFRESH_TOKEN_SECRET"),
    };
  } catch (error) {
    console.error("Missing auth environment variables.", error);
    throw new AppError(
      "Authentication service is temporarily unavailable. Please try again later.",
      503,
    );
  }
}

const generateToken = (userId: string): string => {
  const { jwtSecret } = getAuthSecrets();
  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

const generateRefreshToken = (userId: string): string => {
  const { refreshTokenSecret } = getAuthSecrets();
  return jwt.sign(
    { userId, jti: randomBytes(16).toString("hex") },
    refreshTokenSecret,
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );
};

const getRefreshTokenExpiry = (): Date => {
  return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
};

function mapRefreshTokenPersistenceError(error: unknown): never {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : undefined;

  if (code === "P2021" || code === "P2022") {
    console.error(
      "Refresh token storage is unavailable. Prisma schema is out of sync with production database.",
      error,
    );
  } else if (code) {
    console.error("Refresh token persistence failed with Prisma error code:", code, error);
  } else {
    console.error("Refresh token persistence failed with unexpected error:", error);
  }

  throw new AppError(
    "Authentication service is temporarily unavailable. Please try again later.",
    503,
  );
}

async function persistRefreshToken(userId: string, token: string) {
  try {
    await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: getRefreshTokenExpiry(),
      },
    });
  } catch (error) {
    mapRefreshTokenPersistenceError(error);
  }
}

function validatePasswordStrength(password: string) {
  if (password.length < 8) {
    throw new AppError("Password must be at least 8 characters", 400);
  }
  if (!/[A-Z]/.test(password)) {
    throw new AppError("Password must contain an uppercase letter", 400);
  }
  if (!/[0-9]/.test(password)) {
    throw new AppError("Password must contain a number", 400);
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    throw new AppError("Password must contain a special character", 400);
  }
}

export async function register(data: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  try {
    const { email, username, password, firstName, lastName } = data;
    validatePasswordStrength(password);

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

    await persistRefreshToken(user.id, refreshToken);

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
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Unexpected error during register:", error);
    throw new AppError("An unexpected error occurred. Please try again.", 500);
  }
}

export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid email or password", 401);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new AppError("Invalid email or password", 401);

    const accessToken = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await persistRefreshToken(user.id, refreshToken);

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
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Unexpected error during login:", error);
    throw new AppError("An unexpected error occurred. Please try again.", 500);
  }
}

export async function logout(refreshToken: string) {
  try {
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
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Unexpected error during logout:", error);
    throw new AppError("An unexpected error occurred. Please try again.", 500);
  }
}

export async function refreshTokens(refreshToken: string) {
  try {
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) throw new AppError("Invalid refresh token", 401);
    if (tokenRecord.revokedAt) throw new AppError("Token revoked", 401);
    if (new Date() > tokenRecord.expiresAt) throw new AppError("Token expired", 401);

    try {
      const { refreshTokenSecret } = getAuthSecrets();
      jwt.verify(refreshToken, refreshTokenSecret);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Invalid refresh token", 401);
    }

    const newAccessToken = generateToken(tokenRecord.userId);
    const newRefreshToken = generateRefreshToken(tokenRecord.userId);

    await prisma.refreshToken.update({
      where: { token: refreshToken },
      data: { revokedAt: new Date() },
    });

    await persistRefreshToken(tokenRecord.userId, newRefreshToken);

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
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Unexpected error during token refresh:", error);
    throw new AppError("An unexpected error occurred. Please try again.", 500);
  }
}

import { z } from "zod";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  checkEmailExists,
  checkUsernameExists,
  insertUser,
  getUserByEmail,
} from "../../repositories/user.repository.js";
import { isValidEmail } from "../../utils/index.js";
import { addCloudinaryUrlToUser } from "../../services/cloudinary.service.js";
import { registerSchema, loginSchema } from "./schemas.js";

/**
 * Handle user registration
 * POST /register
 */
export const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { email, username, password } = validatedData;

    if (await checkEmailExists(email)) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (await checkUsernameExists(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const userInsertResult = await insertUser(email, username, password);
    const newUser = userInsertResult.rows[0];

    const userWithAvatarUrl = addCloudinaryUrlToUser(newUser);

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: userWithAvatarUrl.id,
        email: userWithAvatarUrl.email,
        username: userWithAvatarUrl.username,
        avatarUrl: userWithAvatarUrl.avatarUrl,
        bio: userWithAvatarUrl.bio,
        phone: userWithAvatarUrl.phone,
        isPrivate: userWithAvatarUrl.isPrivate,
        createdAt: userWithAvatarUrl.createdAt,
        updatedAt: userWithAvatarUrl.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error(
      "Registration error:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Handle user login
 * POST /login
 */
export const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both email and password" });
    }

    if (typeof email !== "string" || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Email and password must be strings" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const authenticatedUser = await getUserByEmail(email);
    const isPasswordValid = await bcrypt.compare(
      password,
      authenticatedUser?.password || ""
    );

    // Always return same error message to prevent timing attacks
    if (!authenticatedUser || !isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const authenticationToken = jwt.sign(
      {
        id: authenticatedUser.id,
        email: authenticatedUser.email,
        username: authenticatedUser.username,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    const userWithAvatarUrl = addCloudinaryUrlToUser(authenticatedUser);

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: userWithAvatarUrl.id,
        email: userWithAvatarUrl.email,
        username: userWithAvatarUrl.username,
        avatarUrl: userWithAvatarUrl.avatarUrl,
        bio: userWithAvatarUrl.bio,
        phone: userWithAvatarUrl.phone,
        isPrivate: userWithAvatarUrl.isPrivate,
        createdAt: userWithAvatarUrl.createdAt,
        updatedAt: userWithAvatarUrl.updatedAt,
      },
      token: authenticationToken,
    });
  } catch (loginError) {
    console.error(
      "Login error:",
      loginError instanceof Error ? loginError.message : loginError
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

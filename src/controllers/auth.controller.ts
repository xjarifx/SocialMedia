import type { Request, Response } from "express";
import {
  checkEmailExists,
  checkUsernameExists,
  insertUser,
  getUserByEmail,
} from "../db/query.js";
import { SignupRequestBody, SigninRequestBody } from "../types/type.js";
import {
  isValidEmail,
  isValidPassword,
  isValidUsername,
} from "../utils/util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Validate JWT_SECRET at application startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const handleUserSignup = async (req: Request, res: Response) => {
  const { email, username, password } = req.body as SignupRequestBody;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email, username, and password" });
  }

  if (
    typeof email !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string"
  ) {
    return res
      .status(400)
      .json({ message: "Email, username, and password must be strings" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!isValidUsername(username)) {
    return res.status(400).json({
      message:
        "Username must be 3-30 characters long and contain only letters, numbers, and underscores",
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    });
  }

  try {
    if (await checkEmailExists(email)) {
      return res.status(409).json({ message: "Email already exists" });
    }

    if (await checkUsernameExists(username)) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const result = await insertUser(email, username, password);
    const newUser = result.rows[0];
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Signup error:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUserSignin = async (req: Request, res: Response) => {
  const { email, password } = req.body as SigninRequestBody;

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

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const jwtSecret = process.env.JWT_SECRET as string;

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      jwtSecret,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      message: "Signin successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (signinError) {
    console.error(
      "Signin error:",
      signinError instanceof Error ? signinError.message : signinError
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

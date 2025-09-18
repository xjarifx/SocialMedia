import type { Request, Response } from "express";
import { isEmailExist, createUser, findUserByEmail } from "../db/query.js";
import { AuthRequestBody } from "../types/type.js";
import { isValidEmail, isValidPassword } from "../utils/util.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Validate JWT_SECRET at application startup
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body as AuthRequestBody;

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

  if (!isValidPassword(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character",
    });
  }

  try {
    if (await isEmailExist(email)) {
      return res.status(409).json({ message: "Email already exists" });
    }
    const result = await createUser(email, password);
    const newUser = result.rows[0];
    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
        created_at: newUser.created_at,
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

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body as AuthRequestBody;

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
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const JWT_SECRET = process.env.JWT_SECRET as string;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({
      message: "Signin successful",
      user: { id: user.id, email: user.email, created_at: user.created_at },
      token,
    });
  } catch (error) {
    console.error(
      "Signin error:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ message: "Internal server error" });
  }
};

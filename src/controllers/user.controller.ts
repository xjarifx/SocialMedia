import type { Request, Response } from "express";
import { isEmailExist, createUser } from "../db/query.js";
import { SignupRequestBody } from "../types/user.type.js";
import { isValidEmail, isValidPassword } from "../utils/validation.js";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body as SignupRequestBody;

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
    return res.status(400).json({ message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character" });
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
    console.error("Signup error:", error instanceof Error ? error.message : error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

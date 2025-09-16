import type { Request, Response } from "express";
import { isEmailExist, createUser } from "../db/query.js";
import { SignupRequestBody } from "../types/user.type.js";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body as SignupRequestBody;
  try {
    const exist = await isEmailExist(email);
    if (exist) {
      return res.status(409).json({ message: "Email already exists" });
    }
    if (typeof password !== "string") {
      return res.status(400).json({ message: "Password must be a string" });
    }
    const result = await createUser(email, password);
    const newUser = result.rows[0];
    const userResponse = {
      id: newUser.id,
      email: newUser.email,
      created_at: newUser.created_at,
    };
    return res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

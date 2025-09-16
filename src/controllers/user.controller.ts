import type { Request, Response } from "express";
import { isEmailExist } from "../db/query";
import { SignupRequestBody } from "../types/user.type";

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body as SignupRequestBody;
  try {
    const exist = await isEmailExist(email);
    if (exist) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // TODO: add user
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

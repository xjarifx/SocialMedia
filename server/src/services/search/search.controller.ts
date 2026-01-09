import type { Request, Response } from "express";
import { z } from "zod";
import { searchUsersByUsername } from "./search.repository.js";
import { addCloudinaryUrlToUser } from "../upload/cloudinary.service.js";
import { HTTP_STATUS } from "../../shared/constants/http-status.js";
import { ERROR_MESSAGES } from "../../shared/constants/error-messages.js";
import { searchQuerySchema } from "../../shared/validation/common.validation.js";

export const handleSearchByUsername = async (req: Request, res: Response) => {
  try {
    // Validate search query with proper length and sanitization
    const usernameSchema = z.object({
      username: z
        .string()
        .min(1, "Username query cannot be empty")
        .max(50, "Username query too long")
        .trim(),
    });

    const { username } = usernameSchema.parse(req.query);

    const users = await searchUsersByUsername(username);
    const usersWithUrls = users.map((user) => addCloudinaryUrlToUser(user));

    return res.status(HTTP_STATUS.OK).json({ users: usersWithUrls });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    console.error("Error executing search query:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

// TODO: unfinished
export const handleSearch = async (req: Request, res: Response) => {
  try {
    const { q } = searchQuerySchema.parse(req.query);

    // Continue with search logic...
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
    }
    // ...handle other errors
  }
};

import type { Request, Response } from "express";
import { searchUsersByUsername } from "../repositories/search.repository.js";
import { addCloudinaryUrlToUser } from "../services/cloudinary.service.js";
import { HTTP_STATUS } from "../constants/http-status.js";
import { ERROR_MESSAGES } from "../constants/error-messages.js";

export const handleSearchByUsername = async (req: Request, res: Response) => {
  const username = req.query.username as string;

  if (!username) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: ERROR_MESSAGES.USERNAME_REQUIRED,
    });
  }

  try {
    const users = await searchUsersByUsername(username);
    const usersWithUrls = users.map((user) => addCloudinaryUrlToUser(user));

    return res.status(HTTP_STATUS.OK).json({ users: usersWithUrls });
  } catch (error) {
    console.error("Error executing search query:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

import { z } from "zod";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.validators.js";
import { addCloudinaryUrlToUser } from "../../shared/services/cloudinary.service.js";
import { HTTP_STATUS } from "../../constants/http-status.js";
import {
  SUCCESS_MESSAGES,
  ERROR_MESSAGES,
} from "../../constants/error-messages.js";

const authService = new AuthService();

/**
 * Handle user registration
 * POST /register
 */
export const handleUserRegistration = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { user, token } = await authService.register(validatedData);

    const userWithAvatarUrl = addCloudinaryUrlToUser(user);

    return res.status(HTTP_STATUS.CREATED).json({
      message: SUCCESS_MESSAGES.USER_CREATED,
      user: userWithAvatarUrl,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: ERROR_MESSAGES.VALIDATION_FAILED,
        errors: error.issues,
      });
    }

    if (error instanceof Error) {
      if (error.message === ERROR_MESSAGES.EMAIL_ALREADY_EXISTS) {
        return res
          .status(HTTP_STATUS.CONFLICT)
          .json({ message: error.message });
      }
      if (error.message === ERROR_MESSAGES.USERNAME_ALREADY_EXISTS) {
        return res
          .status(HTTP_STATUS.CONFLICT)
          .json({ message: error.message });
      }
    }

    console.error(
      "Registration error:",
      error instanceof Error ? error.message : error
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

/**
 * Handle user login
 * POST /login
 */
export const handleUserLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const { user, token } = await authService.login(email, password);
    const userWithAvatarUrl = addCloudinaryUrlToUser(user);

    return res.status(HTTP_STATUS.OK).json({
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      user: userWithAvatarUrl,
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: ERROR_MESSAGES.VALIDATION_FAILED,
        errors: error.issues,
      });
    }

    console.error(
      "Login error:",
      error instanceof Error ? error.message : error
    );
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};

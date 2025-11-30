import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";
import { isValidPhoneNumber } from "libphonenumber-js";
import {
  USERNAME_REGEX,
  USERNAME_ERROR_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_ERROR_MESSAGE,
} from "./auth.validators.js";

// Validation schemas
export const profileUpdateSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(USERNAME_REGEX, USERNAME_ERROR_MESSAGE)
      .trim()
      .optional(),
    phone: z
      .string()
      .refine(
        (val) => {
          if (!val || val === "") return true;
          return isValidPhoneNumber(val);
        },
        {
          message: "Invalid phone number format",
        }
      )
      .optional(),
    bio: z
      .string()
      .max(500, "Bio must not exceed 500 characters")
      .trim()
      .transform((val) => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] }))
      .optional(),
    isPrivate: z.boolean().optional(),
    avatar: z.string().url("Invalid avatar URL").max(500).optional(),
  })
  .strict(); // Reject unknown fields

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required").max(128),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

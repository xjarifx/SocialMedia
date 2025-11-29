import { z } from "zod";
import { USERNAME_REGEX, USERNAME_ERROR_MESSAGE } from "./auth.validators.js";

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
      .regex(/^(\+?\d{1,3}[- ]?)?(\(?\d{3}\)?[- ]?)?\d{3}[- ]?\d{4}$/)
      .or(z.literal(""))
      .optional(),
    bio: z
      .string()
      .max(500, "Bio must not exceed 500 characters")
      .trim()
      .transform((val) => val.replace(/<[^>]*>/g, "")) // Strip HTML tags
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
      .min(8)
      .max(128)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/),
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

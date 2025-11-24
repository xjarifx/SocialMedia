import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const registerSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .min(5, "Email must be at least 5 characters")
    .max(255, "Email must not exceed 255 characters")
    .trim()
    .toLowerCase(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    )
    .trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Invalid password length"),
});

export const profileUpdateSchema = z
  .object({
    username: z
      .string()
      .min(3)
      .max(50)
      .regex(/^[a-zA-Z0-9_]+$/)
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

export const createPostSchema = z.object({
  content: z
    .string()
    .min(1, "Post content is required")
    .max(5000, "Post content must not exceed 5000 characters")
    .transform((val) => DOMPurify.sanitize(val.trim())),
  mediaUrl: z.string().url("Invalid media URL").max(500).optional(),
  mediaType: z.enum(["image", "video", "none"]).optional().default("none"),
});

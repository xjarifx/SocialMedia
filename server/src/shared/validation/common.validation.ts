import { z } from "zod";

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Page must be greater than 0"),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
});

export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1, "Search query cannot be empty")
    .max(100, "Search query too long")
    .trim(),
});

// Common ID validation schemas
export const postIdParamSchema = z.object({
  postId: z
    .string()
    .regex(/^\d+$/, "Post ID must be a number")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Post ID must be positive"),
});

export const commentIdParamSchema = z.object({
  commentId: z
    .string()
    .regex(/^\d+$/, "Comment ID must be a number")
    .transform((val) => parseInt(val, 10))
    .refine((val) => val > 0, "Comment ID must be positive"),
});

export const usernameParamSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),
});

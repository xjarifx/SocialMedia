import { z } from "zod";

export const createPostSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption cannot be empty")
    .max(2000, "Caption must not exceed 2000 characters")
    .trim()
    .transform((val) => val.replace(/<[^>]*>/g, "")) // Strip HTML tags
    .transform((val) => val.replace(/\s+/g, " ")) // Normalize whitespace
    .refine((val) => val.length > 0, {
      message: "Caption cannot be only whitespace",
    })
    .optional(),
});

export const updatePostSchema = z.object({
  caption: z
    .string()
    .min(1, "Caption cannot be empty")
    .max(2000, "Caption must not exceed 2000 characters")
    .trim()
    .transform((val) => val.replace(/<[^>]*>/g, ""))
    .transform((val) => val.replace(/\s+/g, " "))
    .refine((val) => val.length > 0, {
      message: "Caption cannot be only whitespace",
    }),
});

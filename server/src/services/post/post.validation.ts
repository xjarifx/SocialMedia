import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const createPostSchema = z
  .object({
    caption: z
      .string()
      .min(1, "Caption cannot be empty")
      .max(2000, "Caption must not exceed 2000 characters")
      .trim()
      .transform((val) => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] })) // Better XSS protection
      .transform((val) => val.replace(/\s+/g, " "))
      .refine((val) => val.length > 0, {
        message: "Caption cannot be only whitespace",
      })
      .optional(),
  })
  .strict(); // Reject unknown fields

export const updatePostSchema = z
  .object({
    caption: z
      .string()
      .min(1, "Caption cannot be empty")
      .max(2000, "Caption must not exceed 2000 characters")
      .trim()
      .transform((val) => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] })) // Better XSS protection
      .transform((val) => val.replace(/\s+/g, " "))
      .refine((val) => val.length > 0, {
        message: "Caption cannot be only whitespace",
      }),
  })
  .strict(); // Reject unknown fields

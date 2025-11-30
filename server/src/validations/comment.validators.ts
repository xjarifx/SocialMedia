import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

export const createCommentSchema = z
  .object({
    content: z
      .string()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment must not exceed 500 characters")
      .trim()
      .transform((val) => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] }))
      .transform((val) => val.replace(/\s+/g, " "))
      .refine((val) => val.length > 0, {
        message: "Comment cannot be only whitespace",
      }),
    postId: z.number().int().positive("Invalid post ID"),
  })
  .strict(); // Reject unknown fields

export const updateCommentSchema = z
  .object({
    content: z
      .string()
      .min(1, "Comment cannot be empty")
      .max(500, "Comment must not exceed 500 characters")
      .trim()
      .transform((val) => DOMPurify.sanitize(val, { ALLOWED_TAGS: [] }))
      .transform((val) => val.replace(/\s+/g, " "))
      .refine((val) => val.length > 0, {
        message: "Comment cannot be only whitespace",
      }),
  })
  .strict(); // Reject unknown fields

import { z } from "zod";

export const followUserSchema = z.object({
  targetUserId: z
    .number()
    .int()
    .positive("Invalid user ID")
    .or(
      z
        .string()
        .transform((val) => parseInt(val, 10))
        .refine((val) => !isNaN(val) && val > 0, "Invalid user ID")
    ),
});

// Add middleware to prevent self-follow
export const validateNotSelfFollow = (userId: number, targetUserId: number) => {
  if (userId === targetUserId) {
    throw new Error("Cannot follow yourself");
  }
};

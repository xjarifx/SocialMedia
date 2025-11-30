import { z } from "zod";

// Define username regex as a constant
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,50}$/;
const USERNAME_ERROR_MESSAGE =
  "Username must be 3-50 characters and contain only letters, numbers, and underscores";

// Define password regex as a constant for consistency
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_.])[A-Za-z\d@$!%*?&#+\-_.]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  "Password must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&#+-_.)";

export const registerSchema = z
  .object({
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
      .regex(USERNAME_REGEX, USERNAME_ERROR_MESSAGE)
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must not exceed 128 characters")
      .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
  })
  .strict(); // Reject unknown fields

export const loginSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email format")
      .min(5, "Email must be at least 5 characters")
      .max(255, "Email must not exceed 255 characters")
      .trim()
      .toLowerCase(),
    password: z
      .string()
      .min(1, "Password is required")
      .max(128, "Invalid password length"),
  })
  .strict(); // Reject unknown fields

// Export for reuse in other validators
export {
  USERNAME_REGEX,
  USERNAME_ERROR_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_ERROR_MESSAGE,
};

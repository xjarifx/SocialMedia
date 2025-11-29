import { z } from "zod";

// Define password regex as a constant for consistency
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#+\-_.])[A-Za-z\d@$!%*?&#+\-_.]{8,}$/;
const PASSWORD_ERROR_MESSAGE =
  "Password must contain at least 8 characters with uppercase, lowercase, number, and special character (@$!%*?&#+-_.)";

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
    .regex(PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format").trim().toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Invalid password length"),
});

// Export for reuse in other validators
export { PASSWORD_REGEX, PASSWORD_ERROR_MESSAGE };

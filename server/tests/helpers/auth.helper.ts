import { generateToken } from "../../src/utils/jwt.util.js";
import { AuthUser } from "../../src/types/user.types.js";

/**
 * Generate a test authentication token
 */
export const generateTestToken = (user: AuthUser): string => {
  return generateToken(user);
};

/**
 * Create mock user data
 */
export const mockUser: AuthUser = {
  id: 1,
  email: "test@example.com",
  username: "testuser",
};

/**
 * Create mock user registration data
 */
export const mockRegisterData = {
  email: "newuser@example.com",
  username: "newuser",
  password: "Password123!",
};

/**
 * Create mock login data
 */
export const mockLoginData = {
  email: "test@example.com",
  password: "Password123!",
};

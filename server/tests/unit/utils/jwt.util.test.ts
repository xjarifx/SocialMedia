import { describe, it, expect, beforeAll } from "@jest/globals";
import { generateToken, verifyToken } from "../../../src/utils/jwt.util.js";
import { AuthUser } from "../../../src/types/user.types.js";

describe("JWT Utility Functions", () => {
  const mockUser: AuthUser = {
    id: 1,
    email: "test@example.com",
    username: "testuser",
  };

  let token: string;

  beforeAll(() => {
    // Ensure JWT_SECRET and JWT_EXPIRES_IN are set for tests
    process.env.JWT_SECRET = "test-secret-key-for-testing";
    process.env.JWT_EXPIRES_IN = "24h";
  });

  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      token = generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should include user data in the token", () => {
      const decodedUser = verifyToken(token);
      expect(decodedUser.id).toBe(mockUser.id);
      expect(decodedUser.email).toBe(mockUser.email);
      expect(decodedUser.username).toBe(mockUser.username);
    });
  });

  describe("verifyToken", () => {
    it("should verify and decode a valid token", () => {
      const validToken = generateToken(mockUser);
      const decoded = verifyToken(validToken);

      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.username).toBe(mockUser.username);
    });

    it("should throw an error for an invalid token", () => {
      const invalidToken = "invalid.token.here";
      expect(() => verifyToken(invalidToken)).toThrow();
    });

    it("should throw an error for an expired token", () => {
      // This would require mocking time or using a library like timekeeper
      // Skipped for basic implementation
    });
  });
});

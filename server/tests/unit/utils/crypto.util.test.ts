import { describe, it, expect } from "@jest/globals";
import {
  hashPassword,
  comparePassword,
} from "../../../src/utils/crypto.util.js";

describe("Crypto Utility Functions", () => {
  const plainPassword = "MySecurePassword123!";

  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const hashedPassword = await hashPassword(plainPassword);

      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe("string");
      expect(hashedPassword).not.toBe(plainPassword);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it("should generate different hashes for the same password", async () => {
      const hash1 = await hashPassword(plainPassword);
      const hash2 = await hashPassword(plainPassword);

      expect(hash1).not.toBe(hash2); // bcrypt generates unique salts
    });
  });

  describe("comparePassword", () => {
    it("should return true for matching password and hash", async () => {
      const hashedPassword = await hashPassword(plainPassword);
      const isMatch = await comparePassword(plainPassword, hashedPassword);

      expect(isMatch).toBe(true);
    });

    it("should return false for non-matching password and hash", async () => {
      const hashedPassword = await hashPassword(plainPassword);
      const wrongPassword = "WrongPassword123!";
      const isMatch = await comparePassword(wrongPassword, hashedPassword);

      expect(isMatch).toBe(false);
    });

    it("should return false for empty password", async () => {
      const hashedPassword = await hashPassword(plainPassword);
      const isMatch = await comparePassword("", hashedPassword);

      expect(isMatch).toBe(false);
    });
  });
});

import { describe, it, expect, beforeEach } from "@jest/globals";
import { AuthService } from "../../../src/services/auth.service.js";

describe("AuthService", () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe("AuthService structure", () => {
    it("should have a register method", () => {
      expect(typeof authService.register).toBe("function");
    });

    it("should have a login method", () => {
      expect(typeof authService.login).toBe("function");
    });

    it("should instantiate correctly", () => {
      expect(authService).toBeInstanceOf(AuthService);
    });
  });
});

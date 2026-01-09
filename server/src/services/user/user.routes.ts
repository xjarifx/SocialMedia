import { Router } from "express";
import {
  handleUserProfileGet,
  handleProfileUpdate,
  handlePasswordChange,
} from "./user.controller.js";
import { authenticateUserToken } from "../../shared/middleware/auth.middleware.js";
import uploadMiddleware from "../upload/upload.middleware.js";
import {
  apiLimiter,
  uploadLimiter,
} from "../../shared/middleware/rate-limit.middleware.js";

const router = Router();

// PROFILE ROUTES (protected)
router.get("/", authenticateUserToken, apiLimiter, handleUserProfileGet);
router.put(
  "/",
  authenticateUserToken,
  uploadLimiter,
  uploadMiddleware.single("avatar"),
  handleProfileUpdate
);
router.put(
  "/password",
  authenticateUserToken,
  apiLimiter,
  handlePasswordChange
);

export default router;

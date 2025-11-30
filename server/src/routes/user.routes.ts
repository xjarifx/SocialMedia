import { Router } from "express";
import {
  handleUserProfileGet,
  handleProfileUpdate,
  handlePasswordChange,
} from "../controllers/user.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
import {
  apiLimiter,
  uploadLimiter,
} from "../middleware/rate-limit.middleware.js";

const router = Router();

// PROFILE ROUTES (protected)
router.get("/", apiLimiter, authenticateUserToken, handleUserProfileGet);
router.put(
  "/",
  uploadLimiter,
  authenticateUserToken,
  uploadMiddleware.single("avatar"),
  handleProfileUpdate
);
router.put(
  "/password",
  apiLimiter,
  authenticateUserToken,
  handlePasswordChange
);

export default router;

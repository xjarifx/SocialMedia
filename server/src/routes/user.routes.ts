import { Router } from "express";
import {
  handleUserProfileGet,
  handleProfileUpdate,
  handlePasswordChange,
} from "../controllers/user.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";
import { uploadMiddleware } from "../middleware/upload.middleware.js";

const router = Router();

// PROFILE ROUTES (protected)
router.get("/", authenticateUserToken, handleUserProfileGet);
router.put(
  "/",
  authenticateUserToken,
  uploadMiddleware.single("avatar"),
  handleProfileUpdate
);
router.put("/password", authenticateUserToken, handlePasswordChange);

export default router;

import { Router } from "express";
import {
  handleUserProfileGet,
  handleProfileUpdate,
  handlePasswordChange,
} from "../controllers/user/index.js";
import { authenticateUserToken } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

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

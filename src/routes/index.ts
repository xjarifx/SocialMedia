import { Router } from "express";
import {
  handleUserLogin,
  handleUserRegistration,
  handleUserProfileGet,
  handleUserProfileUpdate,
  handleChangePassword,
} from "../controllers/user-controller.js";
import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// Auth routes (public)
router.post("/users/register", handleUserRegistration);
router.post("/users/login", handleUserLogin);

// Profile routes (protected)
router.get("/users/profile", authenticateUserToken, handleUserProfileGet);
router.put("/users/profile", authenticateUserToken, handleUserProfileUpdate);
router.put("/users/password", authenticateUserToken, handleChangePassword);

export default router;

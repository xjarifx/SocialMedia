import { Router } from "express";
import {
  handleUserLogin,
  handleUserRegistration,
  handleUserProfileGet,
  handleUserProfileUpdate,
  handleChangePassword,
  handleGetFollowing,
  handleGetFollowers,
  handleUnfollowUser,
  handleFollowUser,
} from "../controllers/user-controller.js";
import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// Auth routes (public)
router.post("/users/register", handleUserRegistration);
router.post("/users/login", handleUserLogin);

// Profile routes (protected)
router.get("/users/profile", authenticateUserToken, handleUserProfileGet);
router.put("/users/profile", authenticateUserToken, handleUserProfileUpdate);

// Change password route (protected)
router.put("/users/password", authenticateUserToken, handleChangePassword);

// Follow/Unfollow routes (protected)
router.post("/users/:targetUsername/follow", authenticateUserToken, handleFollowUser);
router.delete("/users/:targetUsername/unfollow", authenticateUserToken, handleUnfollowUser);
router.get("/users/followers", authenticateUserToken, handleGetFollowers);
router.get("/users/following", authenticateUserToken, handleGetFollowing);

export default router;

import { Router } from "express";
import {
  handleGetFollowing,
  handleGetFollowers,
  handleUnfollowUser,
  handleFollowUser,
  handleCheckFollowStatus,
} from "../controllers/follow.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";

const router = Router();

// FOLLOW ROUTES (protected)
router.post("/:targetUsername/follow", authenticateUserToken, handleFollowUser);
router.get(
  "/:targetUsername/follow-status",
  authenticateUserToken,
  handleCheckFollowStatus
);
router.get("/followers", authenticateUserToken, handleGetFollowers);
router.get("/following", authenticateUserToken, handleGetFollowing);
router.delete(
  "/:targetUsername/unfollow",
  authenticateUserToken,
  handleUnfollowUser
);

export default router;

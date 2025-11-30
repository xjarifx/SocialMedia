import { Router } from "express";
import {
  handleGetFollowing,
  handleGetFollowers,
  handleUnfollowUser,
  handleFollowUser,
  handleCheckFollowStatus,
} from "../controllers/follow.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";
import { apiLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// FOLLOW ROUTES (protected)
router.post(
  "/:targetUsername/follow",
  authenticateUserToken,
  apiLimiter,
  handleFollowUser
);
router.get(
  "/:targetUsername/follow-status",
  authenticateUserToken,
  apiLimiter,
  handleCheckFollowStatus
);
router.get("/followers", authenticateUserToken, apiLimiter, handleGetFollowers);
router.get("/following", authenticateUserToken, apiLimiter, handleGetFollowing);
router.delete(
  "/:targetUsername/unfollow",
  authenticateUserToken,
  apiLimiter,
  handleUnfollowUser
);

export default router;

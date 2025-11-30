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
  apiLimiter,
  authenticateUserToken,
  handleFollowUser
);
router.get(
  "/:targetUsername/follow-status",
  apiLimiter,
  authenticateUserToken,
  handleCheckFollowStatus
);
router.get("/followers", apiLimiter, authenticateUserToken, handleGetFollowers);
router.get("/following", apiLimiter, authenticateUserToken, handleGetFollowing);
router.delete(
  "/:targetUsername/unfollow",
  apiLimiter,
  authenticateUserToken,
  handleUnfollowUser
);

export default router;

import { Router } from "express";
import {
  handleLikeCreation,
  handleLikeDeletion,
  handleGetLikeCount,
} from "../controllers/like.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";
import { apiLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// LIKE ROUTES (protected)
router.post(
  "/:postId/likes",
  authenticateUserToken,
  apiLimiter,
  handleLikeCreation
);
router.get(
  "/:postId/likes",
  authenticateUserToken,
  apiLimiter,
  handleGetLikeCount
);
router.delete(
  "/:postId/likes",
  authenticateUserToken,
  apiLimiter,
  handleLikeDeletion
);

export default router;

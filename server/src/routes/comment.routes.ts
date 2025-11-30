import { Router } from "express";
import {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetCommentsByPost,
} from "../controllers/comment.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";
import { apiLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// COMMENT ROUTES (protected)
router.post(
  "/:postId/comments",
  apiLimiter,
  authenticateUserToken,
  handleCreateComment
);
router.get(
  "/:postId/comments",
  apiLimiter,
  authenticateUserToken,
  handleGetCommentsByPost
);
router.put(
  "/:commentId",
  apiLimiter,
  authenticateUserToken,
  handleUpdateComment
);
router.delete(
  "/:commentId",
  apiLimiter,
  authenticateUserToken,
  handleDeleteComment
);

export default router;

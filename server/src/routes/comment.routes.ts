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
  authenticateUserToken,
  apiLimiter,
  handleCreateComment
);
router.get(
  "/:postId/comments",
  authenticateUserToken,
  apiLimiter,
  handleGetCommentsByPost
);
router.put(
  "/:commentId",
  authenticateUserToken,
  apiLimiter,
  handleUpdateComment
);
router.delete(
  "/:commentId",
  authenticateUserToken,
  apiLimiter,
  handleDeleteComment
);

export default router;

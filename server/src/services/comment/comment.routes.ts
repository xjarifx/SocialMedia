import { Router } from "express";
import {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetCommentsByPost,
} from "./comment.controller.js";
import { authenticateUserToken } from "../../shared/middleware/auth.middleware.js";
import { apiLimiter } from "../../shared/middleware/rate-limit.middleware.js";

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

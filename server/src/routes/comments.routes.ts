import { Router } from "express";
import {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetCommentsByPost,
} from "../controllers/comment.controller.js";
import { authenticateUserToken } from "../middlewares/auth.middleware.js";

const router = Router();

// COMMENT ROUTES (protected)
router.post("/:postId/comments", authenticateUserToken, handleCreateComment);
router.get("/:postId/comments", authenticateUserToken, handleGetCommentsByPost);
router.put("/:commentId", authenticateUserToken, handleUpdateComment);
router.delete("/:commentId", authenticateUserToken, handleDeleteComment);

export default router;

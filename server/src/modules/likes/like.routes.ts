import { Router } from "express";
import {
  handleLikeCreation,
  handleLikeDeletion,
  handleGetLikeCount,
} from "./like.controller.js";
import { authenticateUserToken } from "../../shared/middleware/auth.middleware.js";

const router = Router();

// LIKE ROUTES (protected)
router.post("/:postId/likes", authenticateUserToken, handleLikeCreation);
router.get("/:postId/likes", authenticateUserToken, handleGetLikeCount);
router.delete("/:postId/likes", authenticateUserToken, handleLikeDeletion);

export default router;

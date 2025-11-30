import { Router } from "express";
import {
  handlePostCreation,
  handlePostUpdate,
  handlePostDeletion,
  handleGetForYouPosts,
  handleGetFollowingPosts,
  handleGetOwnPosts,
  handleGetPostsByUsername,
} from "../controllers/post.controller.js";
import { authenticateUserToken } from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";
import {
  apiLimiter,
  uploadLimiter,
} from "../middleware/rate-limit.middleware.js";

const router = Router();

// POST ROUTES (protected)
router.post(
  "/",
  authenticateUserToken,
  uploadLimiter,
  uploadMiddleware.single("media"),
  handlePostCreation
);
router.get("/for-you", authenticateUserToken, apiLimiter, handleGetForYouPosts);
router.get(
  "/following",
  authenticateUserToken,
  apiLimiter,
  handleGetFollowingPosts
);
router.get("/mine", authenticateUserToken, apiLimiter, handleGetOwnPosts);
router.get(
  "/:username",
  authenticateUserToken,
  apiLimiter,
  handleGetPostsByUsername
);
router.put(
  "/:postId",
  authenticateUserToken,
  uploadLimiter,
  uploadMiddleware.single("media"),
  handlePostUpdate
);
router.delete(
  "/:postId",
  authenticateUserToken,
  apiLimiter,
  handlePostDeletion
);

export default router;

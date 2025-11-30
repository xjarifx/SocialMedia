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
  uploadLimiter,
  authenticateUserToken,
  uploadMiddleware.single("media"),
  handlePostCreation
);
router.get("/for-you", apiLimiter, authenticateUserToken, handleGetForYouPosts);
router.get(
  "/following",
  apiLimiter,
  authenticateUserToken,
  handleGetFollowingPosts
);
router.get("/mine", apiLimiter, authenticateUserToken, handleGetOwnPosts);
router.get(
  "/:username",
  apiLimiter,
  authenticateUserToken,
  handleGetPostsByUsername
);
router.put(
  "/:postId",
  uploadLimiter,
  authenticateUserToken,
  uploadMiddleware.single("media"),
  handlePostUpdate
);
router.delete(
  "/:postId",
  apiLimiter,
  authenticateUserToken,
  handlePostDeletion
);

export default router;

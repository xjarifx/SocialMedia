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
import { authenticateUserToken } from "../middlewares/auth.middleware.js";
import { uploadMiddleware } from "../middlewares/upload.middleware.js";

const router = Router();

// POST ROUTES (protected)
router.post(
  "/",
  authenticateUserToken,
  uploadMiddleware.single("media"),
  handlePostCreation
);
router.get("/for-you", authenticateUserToken, handleGetForYouPosts);
router.get("/following", authenticateUserToken, handleGetFollowingPosts);
router.get("/mine", authenticateUserToken, handleGetOwnPosts);
router.get("/:username", authenticateUserToken, handleGetPostsByUsername);
router.put(
  "/:postId",
  authenticateUserToken,
  uploadMiddleware.single("media"),
  handlePostUpdate
);
router.delete("/:postId", authenticateUserToken, handlePostDeletion);

export default router;

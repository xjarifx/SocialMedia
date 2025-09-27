import { Router } from "express";
import {
  handleUserLogin,
  handleUserRegistration,
  handleUserProfileGet,
  handleUserProfileUpdate,
  handleChangePassword,
  handleGetFollowing,
  handleGetFollowers,
  handleUnfollowUser,
  handleFollowUser,
} from "../controllers/user-controller.js";
import {
  createPost,
  editPost,
  deletePost,
  // fetchSinglePost,
  // fetchAllPosts,
  // fetchUserFeed,
} from "../controllers/post-controller.js";
import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// =============================================================================================

// USERS ROUTES

// Auth routes (public)
router.post("/users/register", handleUserRegistration);
router.post("/users/login", handleUserLogin);

// Profile routes (protected)
router.get("/users/profile", authenticateUserToken, handleUserProfileGet);
router.put("/users/profile", authenticateUserToken, handleUserProfileUpdate);

// Change password route (protected)
router.put("/users/password", authenticateUserToken, handleChangePassword);

// Follow/Unfollow routes (protected)
router.post(
  "/users/:targetUsername/follow",
  authenticateUserToken,
  handleFollowUser
);
router.delete(
  "/users/:targetUsername/unfollow",
  authenticateUserToken,
  handleUnfollowUser
);
router.get("/users/followers", authenticateUserToken, handleGetFollowers);
router.get("/users/following", authenticateUserToken, handleGetFollowing);

// ===================================================================

// POSTS ROUTES
router.post("/posts", authenticateUserToken, createPost);
router.put("/posts/:postId", authenticateUserToken, editPost);
router.delete("/posts/:postId", authenticateUserToken, deletePost);
// router.get("/posts/:postId", authenticateUserToken, fetchSinglePost);
// router.get("/posts", authenticateUserToken, fetchAllPosts);
// router.get("/users/:userId/feed", authenticateUserToken, fetchUserFeed);

export default router;

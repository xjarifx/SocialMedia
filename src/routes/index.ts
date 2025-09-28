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
  handlePostCreation,
  handlePostUpdate,
  handlePostDeletion,
  // handlePostGet,
  // handleAllPostsGet,
  // handleUserFeedGet,
} from "../controllers/post-controller.js";
import {
  handleCreateComment,
  handleUpdateComment,
  handleDeleteComment,
  handleGetCommentsByPost,
} from "../controllers/comment-controller.js";

import {
  handleLikeCreation,
  handleLikeDeletion,
  handleGetLikeCount,
} from "../controllers/like-controller.js";

import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// HOME ROUTE

router.get("/", (req, res) => {
  res.send("Welcome to the Social Media API. future TODO: newsfeed");
});

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

// POSTS ROUTES
router.post("/posts", authenticateUserToken, handlePostCreation);
router.put("/posts/:postId", authenticateUserToken, handlePostUpdate);
router.delete("/posts/:postId", authenticateUserToken, handlePostDeletion);
// router.get("/posts/:postId", authenticateUserToken, handlePostGet);
// router.get("/posts", authenticateUserToken, handleAllPostsGet);
// router.get("/users/:userId/feed", authenticateUserToken, handleUserFeedGet);

// Comment ROUTES
router.post(
  "/posts/:postId/comments",
  authenticateUserToken,
  handleCreateComment
);
router.put("/comments/:commentId", authenticateUserToken, handleUpdateComment);
router.delete(
  "/comments/:commentId",
  authenticateUserToken,
  handleDeleteComment
);
router.get(
  "/posts/:postId/comments",
  authenticateUserToken,
  handleGetCommentsByPost
);

// Like ROUTES
router.post("/posts/:postId/like", authenticateUserToken, handleLikeCreation);
router.delete("/posts/:postId/like", authenticateUserToken, handleLikeDeletion);
router.get(
  "/posts/:postId/like/count",
  authenticateUserToken,
  handleGetLikeCount
);

export default router;

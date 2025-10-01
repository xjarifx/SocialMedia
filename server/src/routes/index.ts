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
  handleGetForYouPosts,
  handleGetFollowingPosts,
  handleGetOwnPosts,
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
import { handleSearchByUsername } from "../search.js";
import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// newsfeed route (public)
router.get("/", (req, res) => {
  res.send("newsfeed");
});

// AUTH ROUTES (public)
router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);

// PROFILE ROUTES (protected)
router.get("/profile", authenticateUserToken, handleUserProfileGet);
router.put("/profile", authenticateUserToken, handleUserProfileUpdate);
router.put("/password", authenticateUserToken, handleChangePassword);

// FOLLOW ROUTES (protected)
router.post("/:targetUsername/follow", authenticateUserToken, handleFollowUser);
router.get("/followers", authenticateUserToken, handleGetFollowers);
router.get("/following", authenticateUserToken, handleGetFollowing);
router.delete(
  "/:targetUsername/unfollow",
  authenticateUserToken,
  handleUnfollowUser
);

// POST ROUTES (protected)
router.post("/posts", authenticateUserToken, handlePostCreation);
router.get("/posts/for-you", authenticateUserToken, handleGetForYouPosts);
router.get("/posts/following", authenticateUserToken, handleGetFollowingPosts);
router.get("/posts/mine", authenticateUserToken, handleGetOwnPosts);
router.put("/:postId", authenticateUserToken, handlePostUpdate);
router.delete("/:postId", authenticateUserToken, handlePostDeletion);

// COMMENT ROUTES (protected)
router.post("/:postId/comments", authenticateUserToken, handleCreateComment);
router.get("/:postId/comments", authenticateUserToken, handleGetCommentsByPost);
router.put("/:commentId", authenticateUserToken, handleUpdateComment);
router.delete("/:commentId", authenticateUserToken, handleDeleteComment);

// LIKE ROUTES (protected)
router.post("/:postId/likes", authenticateUserToken, handleLikeCreation);
router.get("/:postId/likes", authenticateUserToken, handleGetLikeCount);
router.delete("/:postId/likes", authenticateUserToken, handleLikeDeletion);

// SEARCH ROUTES (public)
router.get("/search", handleSearchByUsername);

export default router;

import { Router } from "express";
import {
  handleUserLogin,
  handleUserRegistration,
} from "../controllers/user-controller.js";
import {
  handleCreatePost,
  handleDeletePost,
} from "../controllers/post-controller.js";
import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// Auth routes
router.post("/users/register", handleUserRegistration);
router.post("/users/login", handleUserLogin);

// Post routes
router.post("/posts", authenticateUserToken, handleCreatePost);
router.delete("/posts/:postId", authenticateUserToken, handleDeletePost);

export default router;

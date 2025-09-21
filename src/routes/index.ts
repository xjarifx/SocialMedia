import { Router } from "express";
import {
  handleUserSignin,
  handleUserSignup,
} from "../controllers/auth-controller.js";
import {
  handleCreatePost,
  handleDeletePost,
} from "../controllers/post-controller.js";
import { authenticateUserToken } from "../middlewares/auth-middleware.js";

const router = Router();

// Auth routes
router.post("/users/signup", handleUserSignup);
router.post("/users/signin", handleUserSignin);

// Post routes
router.post("/posts", authenticateUserToken, handleCreatePost);
router.delete("/posts/:postId", authenticateUserToken, handleDeletePost);

export default router;

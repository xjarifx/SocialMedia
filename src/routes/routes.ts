import { Router } from "express";
import { signin, signup } from "../controllers/auth.controller.js";
import { createPost } from "../controllers/createPost.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/createPost", authenticateToken, createPost);

export default router;

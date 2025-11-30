import { Router } from "express";
import { handleUserRegistration, handleUserLogin } from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

router.post("/register", authLimiter, handleUserRegistration);
router.post("/login", authLimiter, handleUserLogin);

export default router;

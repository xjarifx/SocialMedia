import { Router } from "express";
import { handleUserLogin, handleUserRegistration } from "./auth.controller.js";

const router = Router();

// AUTH ROUTES (public)
router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);

export default router;

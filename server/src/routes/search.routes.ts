import { Router } from "express";
import { handleSearchByUsername } from "../controllers/search.controller.js";
import { searchLimiter } from "../middleware/rate-limit.middleware.js";

const router = Router();

// SEARCH ROUTES (public)
router.get("/", searchLimiter, handleSearchByUsername);

export default router;

import { Router } from "express";
import { handleSearchByUsername } from "./search.controller.js";
import { searchLimiter } from "../../shared/middleware/rate-limit.middleware.js";

const router = Router();

// SEARCH ROUTES (public)
router.get("/", searchLimiter, handleSearchByUsername);

export default router;

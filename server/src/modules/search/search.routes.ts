import { Router } from "express";
import { handleSearchByUsername } from "./search.controller.js";

const router = Router();

// SEARCH ROUTES (public)
router.get("/", handleSearchByUsername);

export default router;

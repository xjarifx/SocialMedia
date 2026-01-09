import express from "express";
import { corsConfig } from "./config/cors.config.js";
import { errorHandler } from "./shared/middleware/error.middleware.js";

// Import routes from services
import { authRoutes } from "./services/auth/auth.module.js";
import { userRoutes } from "./services/user/user.module.js";
import { followRoutes } from "./services/follow/follow.module.js";
import { postRoutes } from "./services/post/post.module.js";
import { commentRoutes } from "./services/comment/comment.module.js";
import { likeRoutes } from "./services/like/like.module.js";
import { searchRoutes } from "./services/search/search.module.js";

const app = express();

// CORS configuration
app.use(corsConfig);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API route
app.get("/api", (req, res) => {
  res.send("newsfeed");
});

// Mount route modules with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/profile", userRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/search", searchRoutes);

// Global error handler (must be last)
app.use(errorHandler);

export default app;

import "./config/env.config.js";
import express from "express";
import { corsConfig } from "./config/cors.config.js";
import { errorHandler } from "./shared/middleware/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import followRoutes from "./modules/follows/follow.routes.js";
import postRoutes from "./modules/posts/post.routes.js";
import commentRoutes from "./modules/comments/comment.routes.js";
import likeRoutes from "./modules/likes/like.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import { env } from "./config/env.config.js";

const app = express();
const PORT = env.port;

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

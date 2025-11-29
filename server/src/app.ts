import express from "express";
import { corsConfig } from "./config/cors.config.js";
import { errorHandler } from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import followRoutes from "./routes/follow.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import likeRoutes from "./routes/like.routes.js";
import searchRoutes from "./routes/search.routes.js";

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

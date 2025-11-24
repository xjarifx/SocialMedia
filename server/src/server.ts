import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import followRoutes from "./routes/follow.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";
import likesRoutes from "./routes/likes.routes.js";
import searchRoutes from "./routes/search.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root API route
app.get("/api", (req, res) => {
  res.send("newsfeed");
});

// Mount route modules with /api prefix
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/search", searchRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

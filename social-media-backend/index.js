import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectMongo from "./config/db.mongo.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// MongoDB connection
connectMongo();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

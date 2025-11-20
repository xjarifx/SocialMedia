import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes with /api prefix
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

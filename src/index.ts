import express from "express";
import { configDotenv } from "dotenv";

const app = express();
configDotenv();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});

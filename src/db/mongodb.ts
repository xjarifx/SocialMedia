import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const mongooseConnection = mongoose.createConnection(
  process.env.MONGODB_URI || "mongodb://localhost:27017/socialmedia"
);

(async () => {
  try {
    await mongooseConnection.asPromise();
  } catch (error) {
    console.error("MongoDB connection error: ", error);
  }
})();

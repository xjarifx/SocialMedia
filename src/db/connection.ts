import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";
import fs from "fs";
import path from "path";

const pool = new Pool({
  connectionString: process.env.DB,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync(path.join(__dirname, "../../ca.pem")).toString(),
  },
});

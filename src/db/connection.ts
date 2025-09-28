import dotenv from "dotenv";
dotenv.config();

import { Pool } from "pg";

const connectionPool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

export default connectionPool;

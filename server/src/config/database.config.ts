import { Pool } from "pg";
import { env } from "./env.config.js";

export const databaseConfig = {
  host: env.database.host,
  user: env.database.user,
  password: env.database.password,
  database: env.database.database,
  port: env.database.port,
  ssl: {
    rejectUnauthorized: false,
  },
};

export function createDatabasePool(): Pool {
  return new Pool(databaseConfig);
}

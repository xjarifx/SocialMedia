import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { requireEnv } from "./lib/env";

config();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: requireEnv("DATABASE_URL"),
  },
});

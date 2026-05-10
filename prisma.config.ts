import { defineConfig } from "prisma/config";
import { config } from "dotenv";
import { getEnvWithDefault } from "./lib/env";

config();

export default defineConfig({
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // `prisma generate` runs during postinstall on Vercel.
    // Allow generation to proceed even when DATABASE_URL is not injected yet.
    url: getEnvWithDefault(
      "DATABASE_URL",
      "postgresql://postgres:postgres@localhost:5432/postgres",
    ),
  },
});

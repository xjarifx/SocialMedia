import { Pool } from "pg";
import { PrismaClient } from "@/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { requireEnv } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new Pool({
  connectionString: requireEnv("DATABASE_URL"),
  ssl: { rejectUnauthorized: false },
});

const adapter = new PrismaPg(pool);

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

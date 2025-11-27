import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface EnvConfig {
  port: number;
  nodeEnv: string;
  jwtSecret: string;
  database: {
    host: string;
    user: string;
    password: string;
    database: string;
    port: number;
  };
  cloudinary: {
    cloudName: string;
    apiKey: string;
    apiSecret: string;
  };
}

function validateEnv(): EnvConfig {
  const requiredEnvVars = [
    "JWT_SECRET",
    "PGHOST",
    "PGUSER",
    "PGPASSWORD",
    "PGDATABASE",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
  ];

  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return {
    port: parseInt(process.env.PORT || "3000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    jwtSecret: process.env.JWT_SECRET!,
    database: {
      host: process.env.PGHOST!,
      user: process.env.PGUSER!,
      password: process.env.PGPASSWORD!,
      database: process.env.PGDATABASE!,
      port: parseInt(process.env.PGPORT || "5432", 10),
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
      apiKey: process.env.CLOUDINARY_API_KEY!,
      apiSecret: process.env.CLOUDINARY_API_SECRET!,
    },
  };
}

export const env = validateEnv();

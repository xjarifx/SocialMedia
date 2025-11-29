import { config } from "dotenv";
import { beforeAll, afterAll } from "@jest/globals";

// Load test environment variables
config({ path: ".env.test" });

// Set test environment
process.env.NODE_ENV = "test";

// Global test setup
beforeAll(() => {
  console.log("Starting test suite...");
});

afterAll(() => {
  console.log("Test suite completed.");
});

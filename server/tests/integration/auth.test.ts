import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
} from "@jest/globals";
import request from "supertest";
import app from "../../src/app.js";
import { clearDatabase, closeDatabase } from "../helpers/db.helper.js";

describe("Auth Integration Tests", () => {
  beforeAll(async () => {
    // Setup test database
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const newUser = {
        email: "newuser@example.com",
        username: "newuser",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(newUser)
        .expect(201);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.username).toBe(newUser.username);
      expect(response.body.user).not.toHaveProperty("password");
    });

    it("should return 400 for invalid email format", async () => {
      const invalidUser = {
        email: "invalid-email",
        username: "testuser",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(invalidUser)
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 for weak password", async () => {
      const weakPasswordUser = {
        email: "test@example.com",
        username: "testuser",
        password: "123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(weakPasswordUser)
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 409 for duplicate email", async () => {
      const user = {
        email: "duplicate@example.com",
        username: "user1",
        password: "Password123!",
      };

      // Register first time
      await request(app).post("/api/auth/register").send(user);

      // Try to register again with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send({ ...user, username: "user2" })
        .expect(409);

      expect(response.body.message).toContain("email");
    });

    it("should return 409 for duplicate username", async () => {
      const user1 = {
        email: "user1@example.com",
        username: "duplicate",
        password: "Password123!",
      };

      // Register first time
      await request(app).post("/api/auth/register").send(user1);

      // Try to register again with same username
      const user2 = {
        email: "user2@example.com",
        username: "duplicate",
        password: "Password123!",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(user2)
        .expect(409);

      expect(response.body.message).toContain("username");
    });
  });

  describe("POST /api/auth/login", () => {
    const testUser = {
      email: "login@example.com",
      username: "loginuser",
      password: "Password123!",
    };

    beforeEach(async () => {
      // Register a user before each login test
      await request(app).post("/api/auth/register").send(testUser);
    });

    it("should login successfully with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("user");
      expect(response.body.user.email).toBe(testUser.email);
    });

    it("should return 401 for invalid email", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: testUser.password,
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("should return 401 for invalid password", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: testUser.email,
          password: "WrongPassword123!",
        })
        .expect(401);

      expect(response.body).toHaveProperty("message");
    });

    it("should return 400 for missing credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });
});

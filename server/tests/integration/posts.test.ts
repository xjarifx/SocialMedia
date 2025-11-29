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
import {
  clearDatabase,
  closeDatabase,
  createTestUser,
  createTestPost,
} from "../helpers/db.helper.js";
import { generateTestToken } from "../helpers/auth.helper.js";
import { hashPassword } from "../../src/utils/crypto.util.js";

describe("Posts Integration Tests", () => {
  let authToken: string;
  let testUserId: number;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();

    // Create a test user and get auth token
    const hashedPassword = await hashPassword("Password123!");
    const user = await createTestUser(
      "test@example.com",
      "testuser",
      hashedPassword
    );
    testUserId = user.id;
    authToken = generateTestToken({
      id: user.id,
      email: user.email,
      username: user.username,
    });
  });

  describe("POST /api/posts", () => {
    it("should create a new post successfully", async () => {
      const newPost = {
        content: "This is a test post!",
      };

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send(newPost)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.content).toBe(newPost.content);
      expect(response.body.userId).toBe(testUserId);
    });

    it("should return 401 without authentication", async () => {
      const newPost = {
        content: "This is a test post!",
      };

      await request(app).post("/api/posts").send(newPost).expect(401);
    });

    it("should return 400 for empty content", async () => {
      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ content: "" })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });

    it("should return 400 for content exceeding max length", async () => {
      const longContent = "a".repeat(5001); // Assuming max length is 5000

      const response = await request(app)
        .post("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ content: longContent })
        .expect(400);

      expect(response.body).toHaveProperty("errors");
    });
  });

  describe("GET /api/posts", () => {
    it("should return a list of posts", async () => {
      // Create some test posts
      await createTestPost(testUserId, "First post");
      await createTestPost(testUserId, "Second post");

      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it("should return empty array when no posts exist", async () => {
      const response = await request(app)
        .get("/api/posts")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe("GET /api/posts/:id", () => {
    it("should return a specific post", async () => {
      const post = await createTestPost(testUserId, "Test post content");

      const response = await request(app)
        .get(`/api/posts/${post.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(post.id);
      expect(response.body.content).toBe(post.content);
    });

    it("should return 404 for non-existent post", async () => {
      await request(app)
        .get("/api/posts/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe("DELETE /api/posts/:id", () => {
    it("should delete own post successfully", async () => {
      const post = await createTestPost(testUserId, "Post to delete");

      await request(app)
        .delete(`/api/posts/${post.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      // Verify post is deleted
      await request(app)
        .get(`/api/posts/${post.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);
    });

    it("should return 403 when deleting another user's post", async () => {
      // Create another user
      const hashedPassword = await hashPassword("Password123!");
      const anotherUser = await createTestUser(
        "another@example.com",
        "anotheruser",
        hashedPassword
      );
      const anotherUserPost = await createTestPost(
        anotherUser.id,
        "Another user's post"
      );

      await request(app)
        .delete(`/api/posts/${anotherUserPost.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(403);
    });
  });
});

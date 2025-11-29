import connectionPool from "../../src/database/connection.js";

/**
 * Clear all test data from the database
 */
export const clearDatabase = async () => {
  await connectionPool.query("DELETE FROM comments");
  await connectionPool.query("DELETE FROM likes");
  await connectionPool.query("DELETE FROM posts");
  await connectionPool.query("DELETE FROM follows");
  await connectionPool.query("DELETE FROM users");
};

/**
 * Create a test user in the database
 */
export const createTestUser = async (
  email: string,
  username: string,
  password: string
) => {
  const result = await connectionPool.query(
    `INSERT INTO users (email, username, password, created_at, updated_at) 
     VALUES ($1, $2, $3, NOW(), NOW()) 
     RETURNING id, email, username`,
    [email, username, password]
  );
  return result.rows[0];
};

/**
 * Create a test post in the database
 */
export const createTestPost = async (userId: number, content: string) => {
  const result = await connectionPool.query(
    `INSERT INTO posts (user_id, content, created_at, updated_at) 
     VALUES ($1, $2, NOW(), NOW()) 
     RETURNING id, user_id, content, created_at, updated_at`,
    [userId, content]
  );
  return result.rows[0];
};

/**
 * Close database connection
 */
export const closeDatabase = async () => {
  await connectionPool.end();
};

import connectionPool from "./connection.js";
import bcrypt from "bcrypt";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const result = await connectionPool.query(
    "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return (result.rowCount ?? 0) > 0;
};

export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  const result = await connectionPool.query(
    "SELECT 1 FROM users WHERE username = $1 LIMIT 1",
    [username]
  );
  return (result.rowCount ?? 0) > 0;
};

export const insertUser = async (
  email: string,
  username: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return connectionPool.query(
    "INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username, created_at AS createdAt",
    [email, username, hashedPassword]
  );
};

export const getUserByEmail = async (email: string) => {
  const result = await connectionPool.query(
    "SELECT id, email, username, password, created_at AS createdAt FROM users WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const insertPost = async (
  userId: number,
  caption: string | undefined,
  mediaUrl: string | undefined
) => {
  return connectionPool.query(
    "INSERT INTO posts (user_id, caption, media_url, created_at) VALUES ($1, $2, $3, $4) RETURNING id, user_id AS userId, caption, media_url AS mediaUrl, created_at AS createdAt",
    [userId, caption, mediaUrl, new Date()]
  );
};

export const deletePostById = async (userId: number, postId: number) => {
  return connectionPool.query(
    "DELETE FROM posts WHERE id = $1 AND user_id = $2",
    [postId, userId]
  );
};

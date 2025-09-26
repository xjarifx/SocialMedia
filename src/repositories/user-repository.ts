import connectionPool from "../db/connection.js";
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

export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  const result = await connectionPool.query(
    "SELECT 1 FROM users WHERE phone = $1 LIMIT 1",
    [phone]
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
    "INSERT INTO users (email, username, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, created_at AS createdAt, updated_at AS updatedAt",
    [email, username, hashedPassword, new Date(), new Date()]
  );
};

export const getUserByEmail = async (email: string) => {
  const result = await connectionPool.query(
    "SELECT id, email, username, password, phone, bio, avatar_url AS avatarUrl, is_verified AS isVerified, is_private AS isPrivate, status, created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin FROM users WHERE email = $1",
    [email]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getUserById = async (userId: number) => {
  const result = await connectionPool.query(
    "SELECT id, email, username, phone, bio, avatar_url AS avatarUrl, is_verified AS isVerified, is_private AS isPrivate, status, created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin FROM users WHERE id = $1",
    [userId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getUserByIdWithPassword = async (userId: number) => {
  const result = await connectionPool.query(
    "SELECT id, email, username, password, phone, bio, avatar_url AS avatarUrl, is_verified AS isVerified, is_private AS isPrivate, status, created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin FROM users WHERE id = $1",
    [userId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateUserProfile = async (
  userId: number,
  updates: {
    username?: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    isPrivate?: boolean;
  }
) => {
  const fields: string[] = [];
  const values: (string | number | boolean | Date)[] = [];
  let paramCount = 1;

  if (updates.username !== undefined) {
    fields.push(`username = $${paramCount++}`);
    values.push(updates.username);
  }

  if (updates.phone !== undefined) {
    fields.push(`phone = $${paramCount++}`);
    values.push(updates.phone);
  }

  if (updates.bio !== undefined) {
    fields.push(`bio = $${paramCount++}`);
    values.push(updates.bio);
  }

  if (updates.avatarUrl !== undefined) {
    fields.push(`avatar_url = $${paramCount++}`);
    values.push(updates.avatarUrl);
  }

  if (updates.isPrivate !== undefined) {
    fields.push(`is_private = $${paramCount++}`);
    values.push(updates.isPrivate);
  }

  // Always update timestamp
  fields.push(`updated_at = $${paramCount++}`);
  values.push(new Date());

  // Add userId for WHERE clause
  values.push(userId);

  const query = `
    UPDATE users 
    SET ${fields.join(", ")} 
    WHERE id = $${paramCount}
    RETURNING 
      id, 
      email, 
      username, 
      phone, 
      bio, 
      avatar_url AS avatarUrl, 
      is_verified AS isVerified, 
      is_private AS isPrivate, 
      status, 
      created_at AS createdAt, 
      updated_at AS updatedAt, 
      last_login AS lastLogin
  `;

  const result = await connectionPool.query(query, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const updateUserPassword = async (
  userId: number,
  newPassword: string
) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await connectionPool.query(
    "UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING id, email, username, phone, bio, avatar_url AS avatarUrl, is_verified AS isVerified, is_private AS isPrivate, status, created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin",
    [hashedPassword, new Date(), userId]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const getUserByUsername = async (username: string) => {
  const result = await connectionPool.query(
    "SELECT id, email, username, phone, bio, avatar_url AS avatarUrl, is_verified AS isVerified, is_private AS isPrivate, status, created_at AS createdAt, updated_at AS updatedAt, last_login AS lastLogin FROM users WHERE username = $1",
    [username]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
};

export const checkIfFollowing = async (
  userId: number,
  targetUserId: number
): Promise<boolean> => {
  const result = await connectionPool.query(
    "SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2 LIMIT 1",
    [userId, targetUserId]
  );
  return (result.rowCount ?? 0) > 0;
};

export const insertFollower = async (userId: number, targetUserId: number) => {
  return connectionPool.query(
    "INSERT INTO follows (follower_id, following_id, created_at) VALUES ($1, $2, $3)",
    [userId, targetUserId, new Date()]
  );
};

export const deleteFollower = async (userId: number, targetUserId: number) => {
  return connectionPool.query(
    "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
    [userId, targetUserId]
  );
};

export const getFollowers = async (userId: number) => {
  const result = await connectionPool.query(
    `SELECT u.id, u.username, u.avatar_url AS "avatarUrl"
     FROM users u
     JOIN follows f ON u.id = f.follower_id
     WHERE f.following_id = $1`,
    [userId]
  );
  return result.rows;
};

export const getFollowing = async (userId: number) => {
  const result = await connectionPool.query(
    `SELECT u.id, u.username, u.avatar_url AS "avatarUrl"
     FROM users u
     JOIN follows f ON u.id = f.following_id
     WHERE f.follower_id = $1`,
    [userId]
  );
  return result.rows;
};

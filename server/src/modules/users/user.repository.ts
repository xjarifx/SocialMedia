import connectionPool from "../../database/connection.js";
import bcrypt from "bcrypt";

export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  const usernameCheckResult = await connectionPool.query(
    "SELECT 1 FROM users WHERE username = $1 LIMIT 1",
    [username]
  );
  return (usernameCheckResult.rowCount ?? 0) > 0;
};

export const checkPhoneExists = async (phone: string): Promise<boolean> => {
  const phoneCheckResult = await connectionPool.query(
    "SELECT 1 FROM users WHERE phone = $1 LIMIT 1",
    [phone]
  );
  return (phoneCheckResult.rowCount ?? 0) > 0;
};

export const getUserById = async (userId: number) => {
  const userByIdResult = await connectionPool.query(
    'SELECT id, email, username, phone, bio, avatar_url AS "avatarUrl", is_verified AS "isVerified", is_private AS "isPrivate", status, created_at AS "createdAt", updated_at AS "updatedAt", last_login AS "lastLogin" FROM users WHERE id = $1',
    [userId]
  );
  return userByIdResult.rows.length > 0 ? userByIdResult.rows[0] : null;
};

export const getUserByIdWithPassword = async (userId: number) => {
  const userWithPasswordResult = await connectionPool.query(
    'SELECT id, email, username, password, phone, bio, avatar_url AS "avatarUrl", is_verified AS "isVerified", is_private AS "isPrivate", status, created_at AS "createdAt", updated_at AS "updatedAt", last_login AS "lastLogin" FROM users WHERE id = $1',
    [userId]
  );
  return userWithPasswordResult.rows.length > 0
    ? userWithPasswordResult.rows[0]
    : null;
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
      avatar_url AS "avatarUrl", 
      is_verified AS "isVerified", 
      is_private AS "isPrivate", 
      status, 
      created_at AS "createdAt", 
      updated_at AS "updatedAt", 
      last_login AS "lastLogin"
  `;

  const profileUpdateResult = await connectionPool.query(query, values);
  return profileUpdateResult.rows.length > 0
    ? profileUpdateResult.rows[0]
    : null;
};

export const updateUserPassword = async (
  userId: number,
  newPassword: string
) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const passwordUpdateResult = await connectionPool.query(
    'UPDATE users SET password = $1, updated_at = $2 WHERE id = $3 RETURNING id, email, username, phone, bio, avatar_url AS "avatarUrl", is_verified AS "isVerified", is_private AS "isPrivate", status, created_at AS "createdAt", updated_at AS "updatedAt", last_login AS "lastLogin"',
    [hashedPassword, new Date(), userId]
  );
  return passwordUpdateResult.rows.length > 0
    ? passwordUpdateResult.rows[0]
    : null;
};

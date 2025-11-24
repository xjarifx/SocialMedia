import connectionPool from "../db/connection.db.js";
import bcrypt from "bcrypt";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  const emailCheckResult = await connectionPool.query(
    "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
    [email]
  );
  return (emailCheckResult.rowCount ?? 0) > 0;
};

export const checkUsernameExists = async (
  username: string
): Promise<boolean> => {
  const usernameCheckResult = await connectionPool.query(
    "SELECT 1 FROM users WHERE username = $1 LIMIT 1",
    [username]
  );
  return (usernameCheckResult.rowCount ?? 0) > 0;
};

export const insertUser = async (
  email: string,
  username: string,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return connectionPool.query(
    'INSERT INTO users (email, username, password, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, username, created_at AS "createdAt", updated_at AS "updatedAt"',
    [email, username, hashedPassword, new Date(), new Date()]
  );
};

export const getUserByEmail = async (email: string) => {
  const userQueryResult = await connectionPool.query(
    'SELECT id, email, username, password, phone, bio, avatar_url AS "avatarUrl", is_verified AS "isVerified", is_private AS "isPrivate", status, created_at AS "createdAt", updated_at AS "updatedAt", last_login AS "lastLogin" FROM users WHERE email = $1',
    [email]
  );
  return userQueryResult.rows.length > 0 ? userQueryResult.rows[0] : null;
};

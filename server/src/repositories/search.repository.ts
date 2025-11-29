import connectionPool from "../database/connection.js";

export const searchUsersByUsername = async (
  username: string,
  limit: number = 20
) => {
  const searchPattern = `${username.trim().toLowerCase()}%`;

  const query = `
    SELECT id, username, email, bio, avatar_url AS "avatarUrl", created_at AS "createdAt" 
    FROM users 
    WHERE LOWER(username) LIKE $1
    ORDER BY 
      CASE 
        WHEN LOWER(username) = $2 THEN 1
        WHEN LOWER(username) LIKE $2 || '%' THEN 2
        ELSE 3
      END,
      username
    LIMIT $3
  `;

  const result = await connectionPool.query(query, [
    searchPattern,
    username.trim().toLowerCase(),
    limit,
  ]);

  return result.rows;
};

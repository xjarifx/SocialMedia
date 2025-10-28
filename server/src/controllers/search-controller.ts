import type { Request, Response } from "express";
import connectionPool from "../db/connection.js";

export const handleSearchByUsername = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

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
    LIMIT 20
  `;

  try {
    const result = await connectionPool.query(query, [
      searchPattern,
      username.trim().toLowerCase(),
    ]);
    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error executing search query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

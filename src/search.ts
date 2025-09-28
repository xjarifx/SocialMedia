import type { Request, Response } from "express";

export const handleSearchByUsername = async (req: Request, res: Response) => {
  const username = req.query.username as string;
  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const usernameParts = username
    .toLowerCase()
    .split(" ")
    .map((part) => part.trim())
    .filter((part) => part !== "");

  if (usernameParts.length === 0) {
    return res.status(400).json({ error: "Invalid username format" });
  }

  const likeClauses = usernameParts
    .map((_, index) => `username ILIKE $${index + 1}`)
    .join(" AND ");
  const queryParams = usernameParts.map((part) => `%${part}%`);

  const query = `
    SELECT id, username, full_name AS "fullName", bio, created_at AS "createdAt" 
    FROM users 
    WHERE ${likeClauses} 
    ORDER BY LENGTH(username), username
    LIMIT 50
  `;

  try {
    const result = await req.app.locals.db.query(query, queryParams);
    return res.status(200).json({ users: result.rows });
  } catch (error) {
    console.error("Error executing search query:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

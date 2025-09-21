import connectionPool from "../db/connection.js";

export const insertPost = async (
  userId: number,
  content: string | undefined,
  mediaUrl: string | undefined
) => {
  return connectionPool.query(
    "INSERT INTO posts (user_id, content, media_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id AS userId, content, media_url AS mediaUrl, created_at AS createdAt, updated_at AS updatedAt",
    [userId, content, mediaUrl, new Date(), new Date()]
  );
};

export const deletePostById = async (userId: number, postId: number) => {
  return connectionPool.query(
    "DELETE FROM posts WHERE id = $1 AND user_id = $2",
    [postId, userId]
  );
};

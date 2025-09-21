import connectionPool from "../db/connection.js";

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

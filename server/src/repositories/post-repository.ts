import connectionPool from "../db/connection.js";

export const insertPost = async (
  userId: number,
  caption: string,
  mediaUrl: string
): Promise<{
  id: number;
  userId: number;
  caption?: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const postInsertResult = await connectionPool.query(
    "INSERT INTO posts (user_id, caption, media_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id AS userId, caption, media_url AS mediaUrl, created_at AS createdAt, updated_at AS updatedAt",
    [userId, caption, mediaUrl, new Date(), new Date()]
  );
  return postInsertResult.rows[0];
};

export const updatePostById = async (
  postId: number,
  caption: string,
  mediaUrl: string
): Promise<{
  id: number;
  userId: number;
  caption?: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const postUpdateResult = await connectionPool.query(
    "UPDATE posts SET caption = $1, media_url = $2, updated_at = $3 WHERE id = $4 RETURNING id, user_id AS userId, caption, media_url AS mediaUrl, created_at AS createdAt, updated_at AS updatedAt",
    [caption, mediaUrl, new Date(), postId]
  );
  return postUpdateResult.rows[0];
};

export const getPostById = async (
  postId: number
): Promise<{
  id: number;
  userId: number;
  caption?: string;
  mediaUrl?: string;
  createdAt: Date;
  updatedAt: Date;
} | null> => {
  const postByIdResult = await connectionPool.query(
    "SELECT id, user_id AS userId, caption, media_url AS mediaUrl, created_at AS createdAt, updated_at AS updatedAt FROM posts WHERE id = $1",
    [postId]
  );
  return postByIdResult.rows[0] || null;
};

export const deletePostById = async (postId: number) => {
  return connectionPool.query("DELETE FROM posts WHERE id = $1", [postId]);
};

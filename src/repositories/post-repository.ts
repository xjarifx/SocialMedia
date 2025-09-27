import connectionPool from "../db/connection.js";

export const createPostInDB = async (
  userId: number,
  caption: string,
  media: string
) => {
  await connectionPool.query(
    "INSERT INTO posts (user_id, caption, media) VALUES ($1, $2, $3)",
    [userId, caption, media]
  );
};

export const editPostInDB = async (
  postId: number,
  caption: string,
  media: string
) => {
  await connectionPool.query(
    "UPDATE posts SET caption = $1, media = $2 WHERE id = $3",
    [caption, media, postId]
  );
};

export const getPostById = async (postId: number) => {
  const result = await connectionPool.query(
    "SELECT * FROM posts WHERE id = $1",
    [postId]
  );
  return result.rows[0];
};

export const deletePostInDB = async (postId: number) => {
  await connectionPool.query("DELETE FROM posts WHERE id = $1", [postId]);
};

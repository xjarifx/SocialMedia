import connectionPool from "../../shared/database/connection.js";

export const insertLike = async (
  userId: number,
  postId: number
): Promise<{
  id: number;
  userId: number;
  postId: number;
  createdAt: string;
}> => {
  const likeInsertResult = await connectionPool.query(
    "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) RETURNING id, user_id AS userId, post_id AS postId, created_at AS createdAt",
    [userId, postId]
  );
  return likeInsertResult.rows[0];
};

export const deleteLike = async (
  userId: number,
  postId: number
): Promise<void> => {
  await connectionPool.query(
    "DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );
};

export const getLikeCount = async (postId: number): Promise<number> => {
  const likeCountResult = await connectionPool.query(
    "SELECT COUNT(*) FROM post_likes WHERE post_id = $1",
    [postId]
  );
  return parseInt(likeCountResult.rows[0].count, 10);
};

import connectionPool from "../db/connection.js";

export const insertComment = async (
  userId: number,
  postId: number,
  comment: string
): Promise<{
  id: number;
  userId: number;
  postId: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const commentInsertResult = await connectionPool.query(
    "INSERT INTO comments (user_id, post_id, comment, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id AS userId, post_id AS postId, comment, created_at AS createdAt, updated_at AS updatedAt",
    [userId, postId, comment, new Date(), new Date()]
  );
  return commentInsertResult.rows[0];
};

export const updateComment = async (
  commentId: number,
  comment: string
): Promise<{
  id: number;
  userId: number;
  postId: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}> => {
  const commentUpdateResult = await connectionPool.query(
    "UPDATE comments SET comment = $1, updated_at = $2 WHERE id = $3 RETURNING id, user_id AS userId, post_id AS postId, comment, created_at AS createdAt, updated_at AS updatedAt",
    [comment, new Date(), commentId]
  );
  return commentUpdateResult.rows[0];
};

export const deleteComment = async (
  commentId: number,
  userId: number
): Promise<void> => {
  await connectionPool.query(
    "DELETE FROM comments WHERE id = $1 AND user_id = $2",
    [commentId, userId]
  );
};

export const getCommentsByPostId = async (
  postId: number
): Promise<
  {
    id: number;
    userId: number;
    postId: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
  }[]
> => {
  const commentsResult = await connectionPool.query(
    "SELECT id, user_id AS userId, post_id AS postId, comment, created_at AS createdAt, updated_at AS updatedAt FROM comments WHERE post_id = $1",
    [postId]
  );
  return commentsResult.rows;
};

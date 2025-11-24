import connectionPool from "../db/connection.db.js";

export const insertComment = async (
  userId: number,
  postId: number,
  comment: string
): Promise<{
  id: number;
  userId: number;
  username: string;
  postId: number;
  comment: string;
  createdAt: Date;
}> => {
  const commentInsertResult = await connectionPool.query(
    'INSERT INTO comments (user_id, post_id, comment, created_at) VALUES ($1, $2, $3, $4) RETURNING id, user_id AS "userId", post_id AS "postId", comment, created_at AS "createdAt"',
    [userId, postId, comment, new Date()]
  );
  const newComment = commentInsertResult.rows[0];

  // Fetch username
  const userResult = await connectionPool.query(
    "SELECT username FROM users WHERE id = $1",
    [userId]
  );

  return {
    ...newComment,
    username: userResult.rows[0]?.username || "unknown",
  };
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
}> => {
  const commentUpdateResult = await connectionPool.query(
    'UPDATE comments SET comment = $1 WHERE id = $2 RETURNING id, user_id AS "userId", post_id AS "postId", comment, created_at AS "createdAt"',
    [comment, commentId]
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
    username: string;
    postId: number;
    comment: string;
    createdAt: Date;
  }[]
> => {
  const commentsResult = await connectionPool.query(
    'SELECT c.id, c.user_id AS "userId", u.username, c.post_id AS "postId", c.comment, c.created_at AS "createdAt" FROM comments c INNER JOIN users u ON u.id = c.user_id WHERE c.post_id = $1 ORDER BY c.created_at DESC',
    [postId]
  );
  return commentsResult.rows;
};

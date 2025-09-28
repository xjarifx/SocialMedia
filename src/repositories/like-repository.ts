import connectionPool from "../db/connection.js";

export const checkIfUserLikedPost = async (
  userId: number,
  postId: number
): Promise<boolean> => {
  const likeCheckResult = await connectionPool.query(
    "SELECT 1 FROM likes WHERE user_id = $1 AND post_id = $2 LIMIT 1",
    [userId, postId]
  );
  return (likeCheckResult.rowCount ?? 0) > 0;
};

export const checkIfUserLikedComment = async (
  userId: number,
  commentId: number
): Promise<boolean> => {
  const likeCheckResult = await connectionPool.query(
    "SELECT 1 FROM likes WHERE user_id = $1 AND comment_id = $2 LIMIT 1",
    [userId, commentId]
  );
  return (likeCheckResult.rowCount ?? 0) > 0;
};

export const insertPostLike = async (
  userId: number,
  postId: number
): Promise<{
  id: number;
  userId: number;
  postId: number;
  createdAt: Date;
}> => {
  const postLikeInsertResult = await connectionPool.query(
    "INSERT INTO likes (user_id, post_id, created_at) VALUES ($1, $2, $3) RETURNING id, user_id AS userId, post_id AS postId, created_at AS createdAt",
    [userId, postId, new Date()]
  );
  return postLikeInsertResult.rows[0];
};

export const insertCommentLike = async (
  userId: number,
  commentId: number
): Promise<{
  id: number;
  userId: number;
  commentId: number;
  createdAt: Date;
}> => {
  const commentLikeInsertResult = await connectionPool.query(
    "INSERT INTO likes (user_id, comment_id, created_at) VALUES ($1, $2, $3) RETURNING id, user_id AS userId, comment_id AS commentId, created_at AS createdAt",
    [userId, commentId, new Date()]
  );
  return commentLikeInsertResult.rows[0];
};

export const deletePostLike = async (
  userId: number,
  postId: number
): Promise<void> => {
  await connectionPool.query(
    "DELETE FROM likes WHERE user_id = $1 AND post_id = $2",
    [userId, postId]
  );
};

export const deleteCommentLike = async (
  userId: number,
  commentId: number
): Promise<void> => {
  await connectionPool.query(
    "DELETE FROM likes WHERE user_id = $1 AND comment_id = $2",
    [userId, commentId]
  );
};

export const getPostLikesCount = async (postId: number): Promise<number> => {
  const postLikesCountResult = await connectionPool.query(
    "SELECT COUNT(*) as count FROM likes WHERE post_id = $1",
    [postId]
  );
  return parseInt(postLikesCountResult.rows[0].count, 10);
};

export const getCommentLikesCount = async (
  commentId: number
): Promise<number> => {
  const commentLikesCountResult = await connectionPool.query(
    "SELECT COUNT(*) as count FROM likes WHERE comment_id = $1",
    [commentId]
  );
  return parseInt(commentLikesCountResult.rows[0].count, 10);
};

export const getPostLikedByUsers = async (
  postId: number
): Promise<
  {
    id: number;
    username: string;
    avatarUrl: string | null;
  }[]
> => {
  const postLikedUsersResult = await connectionPool.query(
    `SELECT u.id, u.username, u.avatar_url AS avatarUrl
     FROM users u
     JOIN likes l ON u.id = l.user_id
     WHERE l.post_id = $1
     ORDER BY l.created_at DESC`,
    [postId]
  );
  return postLikedUsersResult.rows;
};

export const getCommentLikedByUsers = async (
  commentId: number
): Promise<
  {
    id: number;
    username: string;
    avatarUrl: string | null;
  }[]
> => {
  const commentLikedUsersResult = await connectionPool.query(
    `SELECT u.id, u.username, u.avatar_url AS avatarUrl
     FROM users u
     JOIN likes l ON u.id = l.user_id
     WHERE l.comment_id = $1
     ORDER BY l.created_at DESC`,
    [commentId]
  );
  return commentLikedUsersResult.rows;
};

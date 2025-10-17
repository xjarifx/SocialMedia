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
    'INSERT INTO posts (user_id, caption, media_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, user_id AS "userId", caption, media_url AS "mediaUrl", created_at AS "createdAt", updated_at AS "updatedAt"',
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
    'UPDATE posts SET caption = $1, media_url = $2, updated_at = $3 WHERE id = $4 RETURNING id, user_id AS "userId", caption, media_url AS "mediaUrl", created_at AS "createdAt", updated_at AS "updatedAt"',
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
    'SELECT id, user_id AS "userId", caption, media_url AS "mediaUrl", created_at AS "createdAt", updated_at AS "updatedAt" FROM posts WHERE id = $1',
    [postId]
  );
  return postByIdResult.rows[0] || null;
};

export const deletePostById = async (postId: number) => {
  return connectionPool.query("DELETE FROM posts WHERE id = $1", [postId]);
};

export const getPostsByUserId = async (
  userId: number
): Promise<
  {
    id: number;
    userId: number;
    username: string;
    caption?: string;
    mediaUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    likeCount: number;
    commentCount: number;
  }[]
> => {
  const postsByUserIdResult = await connectionPool.query(
    `SELECT 
       p.id, 
       p.user_id AS "userId",
       u.username,
       p.caption, 
       p.media_url AS "mediaUrl", 
       p.created_at AS "createdAt", 
       p.updated_at AS "updatedAt",
       COALESCE(l.like_count, 0) AS "likeCount",
       COALESCE(c.comment_count, 0) AS "commentCount"
     FROM posts p
     INNER JOIN users u ON u.id = p.user_id
     LEFT JOIN (
       SELECT post_id, COUNT(*)::int AS like_count
       FROM post_likes
       GROUP BY post_id
     ) l ON l.post_id = p.id
     LEFT JOIN (
       SELECT post_id, COUNT(*)::int AS comment_count
       FROM comments
       GROUP BY post_id
     ) c ON c.post_id = p.id
     WHERE p.user_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return postsByUserIdResult.rows;
};

// people whom the user is not following -> show only unfollowed users' posts
export const getForYouPosts = async (
  userId: number
): Promise<
  {
    id: number;
    userId: number;
    username: string;
    caption?: string;
    mediaUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    likeCount: number;
    commentCount: number;
  }[]
> => {
  const forYouPostsResult = await connectionPool.query(
    `SELECT
       p.id,
       p.user_id AS "userId",
       u.username,
       p.caption,
       p.media_url AS "mediaUrl",
       p.created_at AS "createdAt",
       p.updated_at AS "updatedAt",
       COALESCE(l.like_count, 0) AS "likeCount",
       COALESCE(c.comment_count, 0) AS "commentCount"
     FROM posts p
     INNER JOIN users u ON u.id = p.user_id
     LEFT JOIN (
       SELECT post_id, COUNT(*)::int AS like_count FROM post_likes GROUP BY post_id
     ) l ON l.post_id = p.id
     LEFT JOIN (
       SELECT post_id, COUNT(*)::int AS comment_count FROM comments GROUP BY post_id
     ) c ON c.post_id = p.id
     WHERE p.user_id != $1
       AND NOT EXISTS (
         SELECT 1 FROM follows f WHERE f.follower_id = $1 AND f.following_id = p.user_id
       )
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return forYouPostsResult.rows;
};

export const getFollowingPosts = async (
  userId: number
): Promise<
  {
    id: number;
    userId: number;
    username: string;
    caption?: string;
    mediaUrl?: string;
    createdAt: Date;
    updatedAt: Date;
    likeCount: number;
    commentCount: number;
  }[]
> => {
  const result = await connectionPool.query(
    `SELECT
       p.id,
       p.user_id AS "userId",
       u.username,
       p.caption,
       p.media_url AS "mediaUrl",
       p.created_at AS "createdAt",
       p.updated_at AS "updatedAt",
       COALESCE(l.like_count, 0) AS "likeCount",
       COALESCE(c.comment_count, 0) AS "commentCount"
     FROM posts p
     INNER JOIN follows f ON f.following_id = p.user_id
     INNER JOIN users u ON u.id = p.user_id
     LEFT JOIN (
       SELECT post_id, COUNT(*)::int AS like_count FROM post_likes GROUP BY post_id
     ) l ON l.post_id = p.id
     LEFT JOIN (
       SELECT post_id, COUNT(*)::int AS comment_count FROM comments GROUP BY post_id
     ) c ON c.post_id = p.id
     WHERE f.follower_id = $1
     ORDER BY p.created_at DESC`,
    [userId]
  );
  return result.rows;
};

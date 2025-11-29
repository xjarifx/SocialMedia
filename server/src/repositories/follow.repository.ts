import connectionPool from "../database/connection.js";

export const getUserByUsername = async (username: string) => {
  const userByUsernameResult = await connectionPool.query(
    'SELECT id, email, username, phone, bio, avatar_url AS "avatarUrl", is_verified AS "isVerified", is_private AS "isPrivate", status, created_at AS "createdAt", updated_at AS "updatedAt", last_login AS "lastLogin" FROM users WHERE username = $1',
    [username]
  );
  return userByUsernameResult.rows.length > 0
    ? userByUsernameResult.rows[0]
    : null;
};

export const checkIfFollowing = async (
  userId: number,
  targetUserId: number
): Promise<boolean> => {
  const followCheckResult = await connectionPool.query(
    "SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2 LIMIT 1",
    [userId, targetUserId]
  );
  return (followCheckResult.rowCount ?? 0) > 0;
};

export const insertFollower = async (userId: number, targetUserId: number) => {
  return connectionPool.query(
    "INSERT INTO follows (follower_id, following_id, created_at) VALUES ($1, $2, $3)",
    [userId, targetUserId, new Date()]
  );
};

export const deleteFollower = async (userId: number, targetUserId: number) => {
  return connectionPool.query(
    "DELETE FROM follows WHERE follower_id = $1 AND following_id = $2",
    [userId, targetUserId]
  );
};

export const getFollowers = async (userId: number) => {
  const followersQueryResult = await connectionPool.query(
    `SELECT u.id, u.username, u.avatar_url AS "avatarUrl"
     FROM users u
     JOIN follows f ON u.id = f.follower_id
     WHERE f.following_id = $1`,
    [userId]
  );
  return followersQueryResult.rows;
};

export const getFollowing = async (userId: number) => {
  const followingQueryResult = await connectionPool.query(
    `SELECT u.id, u.username, u.avatar_url AS "avatarUrl"
     FROM users u
     JOIN follows f ON u.id = f.following_id
     WHERE f.follower_id = $1`,
    [userId]
  );
  return followingQueryResult.rows;
};

export const getFollowerCount = async (userId: number): Promise<number> => {
  const result = await connectionPool.query(
    "SELECT COUNT(*) as count FROM follows WHERE following_id = $1",
    [userId]
  );
  return parseInt(result.rows[0]?.count || "0", 10);
};

export const getFollowingCount = async (userId: number): Promise<number> => {
  const result = await connectionPool.query(
    "SELECT COUNT(*) as count FROM follows WHERE follower_id = $1",
    [userId]
  );
  return parseInt(result.rows[0]?.count || "0", 10);
};

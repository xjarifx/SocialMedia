import { prisma } from "@/lib/prisma";
import { cache, buildCacheKey } from "@/lib/cache";
import { AppError } from "@/lib/errors";
import { syncUserPlanExpiration } from "@/lib/services/billing.service";

const PROFILE_TTL_SECONDS = 120;
const TIMELINE_TTL_SECONDS = 30;

export async function getProfile(userId: string) {
  await syncUserPlanExpiration(userId);

  const cacheKey = buildCacheKey("user", "public", userId);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      plan: true,
    },
  });

  if (!user) throw new AppError("User not found", 404);

  await cache.set(cacheKey, user, PROFILE_TTL_SECONDS * 1000);
  return user;
}

export async function getCurrentProfile(userId: string) {
  await syncUserPlanExpiration(userId);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
      plan: true,
    },
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
}

export async function updateProfile(
  userId: string,
  data: { firstName?: string; lastName?: string },
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  const { firstName, lastName } = data;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
    },
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      createdAt: true,
    },
  });

  await cache.invalidatePattern(`user:${userId}*`);
  await cache.invalidatePattern(`timeline:user:${userId}*`);

  return updatedUser;
}

export async function getUserPosts(
  userId: string,
  limit: number = 10,
  offset: number = 0,
  viewerId?: string,
) {
  const cacheKey = buildCacheKey("timeline", userId, viewerId || "anon", limit, offset);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError("User not found", 404);

  if (viewerId && viewerId !== userId) {
    const blockExists = await prisma.block.findFirst({
      where: {
        OR: [
          { blockerId: viewerId, blockedId: userId },
          { blockerId: userId, blockedId: viewerId },
        ],
      },
    });

    if (blockExists) {
      return { posts: [], total: 0, limit, offset };
    }
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: userId,
      ...(viewerId && viewerId === userId ? {} : { visibility: "PUBLIC" }),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
          plan: true,
        },
      },
      likes: { select: { userId: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const total = await prisma.post.count({
    where: {
      authorId: userId,
      ...(viewerId && viewerId === userId ? {} : { visibility: "PUBLIC" }),
    },
  });

  const response = {
    posts: posts.map((p: any) => ({
      id: p.id,
      content: p.content,
      imageUrl: p.imageUrl,
      visibility: p.visibility,
      author: p.author,
      likesCount: p.likesCount,
      commentsCount: p.commentsCount,
      likes: p.likes.map((l: { userId: string }) => l.userId),
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    } as any)),
    total,
    limit,
    offset,
  };

  await cache.set(cacheKey, response, TIMELINE_TTL_SECONDS * 1000);
  return response;
}

export async function searchUsers(
  query: string,
  limit: number = 10,
  offset: number = 0,
) {
  const whereClause: any = {
    OR: [
      { firstName: { contains: query, mode: "insensitive" } },
      { lastName: { contains: query, mode: "insensitive" } },
      { username: { contains: query, mode: "insensitive" } },
    ],
    deletedAt: null,
  };

  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      username: true,
      email: true,
      firstName: true,
      lastName: true,
      plan: true,
      createdAt: true,
    },
    take: limit,
    skip: offset,
    orderBy: { createdAt: "desc" },
  });

  const total = await prisma.user.count({ where: whereClause });

  return { results: users, total, limit, offset };
}

export async function getUserFollowers(userId: string) {
  const followers = await prisma.follower.findMany({
    where: { followingId: userId },
    include: {
      follower: {
        select: { id: true, username: true, firstName: true, lastName: true },
      },
    },
  });

  return followers.map((f: any) => ({
    id: f.id,
    followedAt: f.createdAt,
    follower: f.follower,
  }));
}

export async function getUserFollowing(userId: string) {
  const following = await prisma.follower.findMany({
    where: { followerId: userId },
    include: {
      following: {
        select: { id: true, username: true, firstName: true, lastName: true },
      },
    },
  });

  return following.map((f: any) => ({
    id: f.id,
    followedAt: f.createdAt,
    user: f.following,
  }));
}

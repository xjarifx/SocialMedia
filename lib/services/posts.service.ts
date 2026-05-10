import { prisma } from "@/lib/prisma";
import { cache, buildCacheKey } from "@/lib/cache";
import { AppError } from "@/lib/errors";
import { syncUserPlanExpiration } from "@/lib/services/billing.service";

const FEED_TTL_SECONDS = 30;
const POST_TTL_SECONDS = 60;

const getPlanPostLimit = (plan: string | null | undefined): number =>
  plan === "PRO" ? 100 : 20;

function toArrayFromSet(set: Set<string>): string[] {
  return [...set] as string[];
}

function mapPost(post: any) {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    author: post.author,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    likes: post.likes.map((l: { userId: string }) => l.userId),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export async function getFeed(
  userId: string,
  query: { limit?: number; offset?: number },
) {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;
  const cacheKey = buildCacheKey("feed", userId, limit, offset);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const blockedRelationships = await prisma.block.findMany({
    where: {
      OR: [{ blockerId: userId }, { blockedId: userId }],
    },
    select: { blockerId: true, blockedId: true },
  });

  const blockedUserIds = new Set<string>();
  for (const block of blockedRelationships) {
    if (block.blockerId === userId) {
      blockedUserIds.add(block.blockedId);
    } else {
      blockedUserIds.add(block.blockerId);
    }
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        not: userId,
        notIn: toArrayFromSet(blockedUserIds),
      },
      visibility: "PUBLIC",
      author: {
        followers: {
          some: { followerId: userId },
        },
      },
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

  const response = posts.map(mapPost);
  await cache.set(cacheKey, response, FEED_TTL_SECONDS * 1000);
  return response;
}

export async function getForYouFeed(
  userId: string,
  query: { limit?: number; offset?: number },
) {
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;
  const cacheKey = buildCacheKey("for-you", userId, limit, offset);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const blockedRelationships = await prisma.block.findMany({
    where: {
      OR: [{ blockerId: userId }, { blockedId: userId }],
    },
    select: { blockerId: true, blockedId: true },
  });

  const blockedUserIds = new Set<string>();
  for (const block of blockedRelationships) {
    if (block.blockerId === userId) {
      blockedUserIds.add(block.blockedId);
    } else {
      blockedUserIds.add(block.blockerId);
    }
  }

  const directFollowing = await prisma.follower.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });

  if (directFollowing.length === 0) return [];

  const directFollowingIds = directFollowing.map((f: { followingId: string }) => f.followingId);
  const directFollowingSet = new Set(directFollowingIds);

  const secondDegree = await prisma.follower.findMany({
    where: { followerId: { in: directFollowingIds } },
    select: { followingId: true },
  });

  const secondDegreeIds = Array.from(
    new Set(secondDegree.map((f: { followingId: string }) => f.followingId)),
  ) as string[];
  const filteredSecondDegreeIds = secondDegreeIds.filter(
    (id) =>
      id !== userId &&
      !directFollowingSet.has(id) &&
      !blockedUserIds.has(id),
  );

  if (filteredSecondDegreeIds.length === 0) return [];

  const posts = await prisma.post.findMany({
    where: {
      authorId: {
        in: filteredSecondDegreeIds,
        notIn: toArrayFromSet(blockedUserIds),
      },
      visibility: "PUBLIC",
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

  const response = posts.map(mapPost);
  await cache.set(cacheKey, response, FEED_TTL_SECONDS * 1000);
  return response;
}

export async function createPost(
  userId: string,
  body: { content: string; visibility?: string },
  file?: File | null,
) {
  await syncUserPlanExpiration(userId);

  const { content, visibility } = body;
  const authorId = userId;
  const normalizedContent = (content ?? "").trim();

  if (!normalizedContent && !file) {
    throw new AppError("Post must include text or an image", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: authorId },
    select: { plan: true },
  });
  if (!user) throw new AppError("User not found", 404);

  if (normalizedContent) {
    const limit = getPlanPostLimit(user.plan);
    if (normalizedContent.length > limit) {
      const planName = user.plan === "PRO" ? "Pro" : "Free";
      throw new AppError(
        `Post content exceeds ${planName} plan limit of ${limit} characters`,
        400,
      );
    }
  }

  let imageUrl: string | null = null;
  if (file) {
    const { uploadMedia } = await import("@/lib/imagekit");
    try {
      const uploadResult = await uploadMedia(file);
      imageUrl = uploadResult.url;
    } catch {
      throw new AppError("Unable to upload media", 500);
    }
  }

  const post = await prisma.post.create({
    data: {
      content: normalizedContent,
      authorId,
      imageUrl,
      ...(visibility && { visibility: visibility as any }),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  await cache.invalidatePattern("feed:*");
  await cache.invalidatePattern("for-you:*");
  await cache.invalidatePattern(`timeline:user:${authorId}*`);

  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    author: post.author,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

export async function getPostById(
  params: { postId: string },
  userId?: string | null,
) {
  const { postId } = params;
  const requesterId = userId || "anon";
  const cacheKey = buildCacheKey("post", postId, "viewer", requesterId);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
      comments: {
        select: {
          id: true,
          content: true,
          author: {
            select: {
              id: true,
              username: true,
              firstName: true,
              lastName: true,
            },
          },
          parentId: true,
          likesCount: true,
          _count: { select: { replies: true } },
          createdAt: true,
        },
        where: { parentId: null },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      likes: { select: { userId: true } },
    },
  });

  if (!post) throw new AppError("Post not found", 404);

  if (post.visibility === "PRIVATE") {
    if (requesterId === "anon" || requesterId !== post.authorId) {
      throw new AppError("Post is private", 403);
    }
  }

  const response = {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    visibility: post.visibility,
    author: post.author,
    likesCount: post.likesCount,
    commentsCount: post.commentsCount,
    likes: post.likes.map((l: { userId: string }) => l.userId),
    comments: post.comments.map((c: any) => ({
      id: c.id,
      content: c.content,
      author: c.author,
      postId: post.id,
      parentId: c.parentId,
      likesCount: c.likesCount,
      repliesCount: c._count.replies,
      createdAt: c.createdAt,
    })),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };

  await cache.set(cacheKey, response, POST_TTL_SECONDS * 1000);
  return response;
}

export async function updatePost(
  userId: string,
  params: { postId: string },
  body: { content?: string; visibility?: string },
) {
  await syncUserPlanExpiration(userId);

  const { postId } = params;
  const { content, visibility } = body;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Cannot update other user's post", 403);

  if (content) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    });
    const limit = getPlanPostLimit(user?.plan);
    if (content.length > limit) {
      const planName = user?.plan === "PRO" ? "Pro" : "Free";
      throw new AppError(
        `Post content exceeds ${planName} plan limit of ${limit} characters`,
        400,
      );
    }
  }

  const updatedPost = await prisma.post.update({
    where: { id: postId },
    data: {
      ...(content !== undefined && { content }),
      ...(visibility !== undefined && { visibility: visibility as any }),
    },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          email: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  await cache.invalidatePattern(`post:${postId}*`);
  await cache.invalidatePattern("feed:*");
  await cache.invalidatePattern("for-you:*");
  await cache.invalidatePattern(`timeline:user:${userId}*`);

  return {
    id: updatedPost.id,
    content: updatedPost.content,
    imageUrl: updatedPost.imageUrl,
    visibility: updatedPost.visibility,
    author: updatedPost.author,
    likesCount: updatedPost.likesCount,
    commentsCount: updatedPost.commentsCount,
    createdAt: updatedPost.createdAt,
    updatedAt: updatedPost.updatedAt,
  };
}

export async function deletePost(
  userId: string,
  params: { postId: string },
) {
  const { postId } = params;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);
  if (post.authorId !== userId) throw new AppError("Cannot delete other user's post", 403);

  await prisma.post.delete({ where: { id: postId } });

  await cache.invalidatePattern(`post:${postId}*`);
  await cache.invalidatePattern(`comments:post:${postId}*`);
  await cache.invalidatePattern("feed:*");
  await cache.invalidatePattern("for-you:*");
  await cache.invalidatePattern(`timeline:user:${userId}*`);

  return { message: "Post deleted successfully" };
}

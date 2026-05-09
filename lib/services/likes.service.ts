import { prisma } from "@/lib/prisma";
import { cache } from "@/lib/cache";
import { AppError } from "@/lib/errors";

function formatUserLabel(user?: {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): string {
  if (!user) return "Someone";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.username || "Someone";
}

export async function likePost(
  userId: string,
  params: { postId: string },
) {
  const { postId } = params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    select: { id: true, authorId: true },
  });
  if (!post) throw new AppError("Post not found", 404);

  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (existingLike) throw new AppError("Post already liked", 400);

  const result = await prisma.$transaction(async (tx: any) => {
    const like = await tx.like.create({
      data: { userId, postId },
      include: {
        user: {
          select: { id: true, username: true, firstName: true, lastName: true },
        },
      },
    });

    await tx.post.update({
      where: { id: postId },
      data: { likesCount: { increment: 1 } },
    });

    if (post.authorId !== userId) {
      await tx.notification.create({
        data: {
          userId: post.authorId,
          type: "LIKE",
          relatedUserId: userId,
          relatedPostId: postId,
          message: `${formatUserLabel(like.user)} liked your post`,
        },
      });
    }

    return like;
  });

  await cache.invalidatePattern(`post:${postId}*`);
  await cache.invalidatePattern("feed:*");
  await cache.invalidatePattern("for-you:*");
  await cache.invalidatePattern(`timeline:user:${post.authorId}*`);
  await cache.invalidatePattern(`notifications:user:${post.authorId}*`);

  return {
    id: result.id,
    userId: result.userId,
    postId: result.postId,
    user: result.user,
    createdAt: result.createdAt,
    message: "Post liked successfully",
  };
}

export async function unlikePost(
  userId: string,
  params: { postId: string },
) {
  const { postId } = params;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);

  const existingLike = await prisma.like.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  if (!existingLike) throw new AppError("Like not found", 404);

  await prisma.$transaction(async (tx: any) => {
    await tx.like.delete({
      where: { userId_postId: { userId, postId } },
    });
    await tx.post.update({
      where: { id: postId },
      data: { likesCount: { decrement: 1 } },
    });
  });

  await cache.invalidatePattern(`post:${postId}*`);
  await cache.invalidatePattern("feed:*");
  await cache.invalidatePattern("for-you:*");
  await cache.invalidatePattern(`timeline:user:${post.authorId}*`);

  return { message: "Post unliked successfully" };
}

export async function getPostLikes(
  params: { postId: string },
  query: { limit?: number; offset?: number },
) {
  const { postId } = params;
  const limit = query.limit ?? 20;
  const offset = query.offset ?? 0;

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new AppError("Post not found", 404);

  const likes = await prisma.like.findMany({
    where: { postId },
    include: {
      user: {
        select: { id: true, username: true, firstName: true, lastName: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });

  const total = await prisma.like.count({ where: { postId } });

  return {
    likes: likes.map((l: any) => ({
      id: l.id,
      userId: l.userId,
      postId: l.postId,
      user: l.user,
      createdAt: l.createdAt,
    })),
    total,
    limit,
    offset,
  };
}

import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

function formatUserLabel(
  user?: {
    username?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null,
): string {
  if (!user) return "Someone";
  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
  return fullName || user.username || "Someone";
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new AppError("Cannot follow yourself", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: followingId } });
  if (!user) throw new AppError("User not found", 404);

  const blockExists = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: followerId, blockedId: followingId },
        { blockerId: followingId, blockedId: followerId },
      ],
    },
  });

  if (blockExists) {
    throw new AppError("Cannot follow this user due to block relationship", 403);
  }

  const existing = await prisma.follower.findFirst({
    where: { followerId, followingId },
  });

  if (existing) throw new AppError("Already following this user", 409);

  const follow = await prisma.follower.create({
    data: { followerId, followingId },
  });

  const follower = await prisma.user.findUnique({
    where: { id: followerId },
    select: { username: true, firstName: true, lastName: true },
  });

  await prisma.notification.create({
    data: {
      userId: followingId,
      type: "NEW_FOLLOWER",
      relatedUserId: followerId,
      message: `${formatUserLabel(follower)} started following you`,
    },
  });

  return follow;
}

export async function unfollowUser(followerId: string, followingId: string) {
  const follow = await prisma.follower.findFirst({
    where: { followerId, followingId },
  });

  if (!follow) throw new AppError("Follow relationship not found", 404);
  if (follow.followerId !== followerId) {
    throw new AppError("Not allowed to modify this follow relationship", 403);
  }

  await prisma.follower.delete({ where: { id: follow.id } });
  return { deleted: true };
}

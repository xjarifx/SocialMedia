import { prisma } from "@/lib/prisma";
import { AppError } from "@/lib/errors";

export async function blockUser(blockerId: string, username: string) {
  const userToBlock = await prisma.user.findUnique({ where: { username } });
  if (!userToBlock) throw new AppError("User not found", 404);

  if (blockerId === userToBlock.id) {
    throw new AppError("Cannot block yourself", 400);
  }

  const isBlockExist = await prisma.block.findFirst({
    where: { blockerId, blockedId: userToBlock.id },
  });

  if (isBlockExist) throw new AppError("User already blocked", 409);

  await prisma.follower.deleteMany({
    where: {
      OR: [
        { followerId: blockerId, followingId: userToBlock.id },
        { followerId: userToBlock.id, followingId: blockerId },
      ],
    },
  });

  const applyBlock = await prisma.block.create({
    data: { blockerId, blockedId: userToBlock.id },
  });

  return applyBlock;
}

export async function unblockUser(blockerId: string, username: string) {
  const userToUnblock = await prisma.user.findUnique({ where: { username } });
  if (!userToUnblock) throw new AppError("User not found", 404);

  if (blockerId === userToUnblock.id) {
    throw new AppError("Cannot unblock yourself", 400);
  }

  const isBlockExist = await prisma.block.findFirst({
    where: { blockerId, blockedId: userToUnblock.id },
  });

  if (!isBlockExist) throw new AppError("User is not blocked", 404);

  const applyUnblock = await prisma.block.delete({
    where: {
      blockerId_blockedId: {
        blockerId,
        blockedId: userToUnblock.id,
      },
    },
  });

  return applyUnblock;
}

export async function getBlockedUsers(
  userId: string,
  limit: number = 20,
  offset: number = 0,
) {
  const blockedUsers = await prisma.block.findMany({
    where: { blockerId: userId },
    include: {
      blocked: {
        select: {
          id: true,
          username: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    skip: offset,
    take: limit,
  });

  return blockedUsers.map((b: { blocked: any }) => b.blocked);
}

export async function checkBlockStatus(userId: string, targetUserId: string) {
  const block = await prisma.block.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: targetUserId },
        { blockerId: targetUserId, blockedId: userId },
      ],
    },
  });

  return {
    isBlocked: !!block,
    blockedByMe: block?.blockerId === userId || false,
    blockedByThem: block?.blockedId === userId || false,
  };
}

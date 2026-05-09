import { prisma } from "@/lib/prisma";
import { cache, buildCacheKey } from "@/lib/cache";
import { AppError } from "@/lib/errors";

const NOTIFICATIONS_TTL_SECONDS = 20;

export async function listNotifications(
  userId: string,
  limit: number = 20,
  offset: number = 0,
  read?: boolean,
) {
  const cacheKey = buildCacheKey(
    "notifications",
    userId,
    read === undefined ? "all" : read,
    limit,
    offset,
  );
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const where = {
    userId,
    ...(read !== undefined ? { read } : {}),
  } as const;

  const notifications = await prisma.notification.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
    include: {
      relatedUser: {
        select: { id: true, username: true, firstName: true, lastName: true },
      },
      relatedPost: {
        select: { id: true, content: true },
      },
    },
  });

  const total = await prisma.notification.count({ where });

  const response = {
    notifications: notifications.map((n: any) => ({
      id: n.id,
      type: n.type,
      message: n.message,
      read: n.read,
      createdAt: n.createdAt,
      relatedUser: n.relatedUser,
      relatedPost: n.relatedPost,
    })),
    total,
    limit,
    offset,
  };

  await cache.set(cacheKey, response, NOTIFICATIONS_TTL_SECONDS * 1000);
  return response;
}

export async function getNotification(notificationId: string, userId: string) {
  const cacheKey = buildCacheKey("notification", notificationId, "user", userId);
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
    include: {
      relatedUser: {
        select: { id: true, username: true, firstName: true, lastName: true },
      },
      relatedPost: {
        select: { id: true, content: true },
      },
    },
  });

  if (!notification) throw new AppError("Notification not found", 404);

  const response = {
    id: notification.id,
    type: notification.type,
    message: notification.message,
    read: notification.read,
    createdAt: notification.createdAt,
    relatedUser: notification.relatedUser,
    relatedPost: notification.relatedPost,
  };

  await cache.set(cacheKey, response, NOTIFICATIONS_TTL_SECONDS * 1000);
  return response;
}

export async function updateNotification(
  notificationId: string,
  userId: string,
  data: { read?: boolean },
) {
  const read = data.read ?? true;

  const { count } = await prisma.notification.updateMany({
    where: { id: notificationId, userId },
    data: { read },
  });

  if (count === 0) throw new AppError("Notification not found", 404);

  await cache.del(`notification:${notificationId}`);
  await cache.invalidatePattern(`notifications:user:${userId}*`);

  return getNotification(notificationId, userId);
}

export async function deleteNotification(notificationId: string, userId: string) {
  const { count } = await prisma.notification.deleteMany({
    where: { id: notificationId, userId },
  });

  if (count === 0) throw new AppError("Notification not found", 404);

  await cache.del(`notification:${notificationId}`);
  await cache.invalidatePattern(`notifications:user:${userId}*`);

  return true;
}

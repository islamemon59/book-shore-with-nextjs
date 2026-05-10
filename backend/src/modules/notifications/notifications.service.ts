import { prisma } from "../../lib/prisma.js";

export const listNotifications = async (userId: string) => {
  const [items, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 12,
    }),
    prisma.notification.count({
      where: {
        userId,
        readAt: null,
      },
    }),
  ]);

  return {
    items,
    unreadCount,
  };
};

export const markAllNotificationsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: {
      userId,
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });
};

export const getNotificationsStreamSnapshot = async (userId: string) => {
  const [latest, unreadCount] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.notification.count({
      where: { userId, readAt: null },
    }),
  ]);

  return {
    latest,
    unreadCount,
    timestamp: new Date().toISOString(),
  };
};

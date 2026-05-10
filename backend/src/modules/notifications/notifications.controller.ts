import type { Request, Response } from "express";
import { logger } from "../../lib/logger.js";
import {
  getNotificationsStreamSnapshot,
  listNotifications,
  markAllNotificationsRead,
} from "./notifications.service.js";

export const listNotificationsController = async (req: Request, res: Response) => {
  const payload = await listNotifications(req.authSession!.user.id);
  res.json({
    success: true,
    items: payload.items,
    unreadCount: payload.unreadCount,
  });
};

export const markAllNotificationsReadController = async (req: Request, res: Response) => {
  await markAllNotificationsRead(req.authSession!.user.id);
  res.json({
    success: true,
    message: "Notifications marked as read.",
  });
};

export const streamNotificationsController = async (req: Request, res: Response) => {
  const userId = req.authSession!.user.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const publishSnapshot = async () => {
    try {
      const snapshot = await getNotificationsStreamSnapshot(userId);
      res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
    } catch (error) {
      logger.error({ error, userId }, "Failed to publish notifications stream snapshot");
    }
  };

  await publishSnapshot();

  const interval = setInterval(() => {
    void publishSnapshot();
  }, 15000);

  req.on("close", () => {
    clearInterval(interval);
    res.end();
  });
};

import { Router } from "express";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  listNotificationsController,
  markAllNotificationsReadController,
  streamNotificationsController,
} from "./notifications.controller.js";
import { markAllNotificationsReadSchema } from "./notifications.validation.js";

export const notificationsRouter = Router();

notificationsRouter.use(requireSession);

notificationsRouter.get("/", listNotificationsController);

notificationsRouter.post(
  "/mark-all-read",
  validateRequest(markAllNotificationsReadSchema),
  markAllNotificationsReadController,
);

notificationsRouter.get("/stream", streamNotificationsController);

import { Router } from "express";
import { requireRole } from "../../middlewares/require-role.js";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  analyzeDashboardController,
  chatWithAssistantController,
  classifyBookController,
  generateMarketingCopyController,
  generateRecommendationsController,
} from "./ai.controller.js";
import {
  analyzeDashboardRequestSchema,
  assistantChatRequestSchema,
  classifyBookRequestSchema,
  generateCopyRequestSchema,
  recommendBooksRequestSchema,
} from "./ai.validation.js";

export const aiRouter = Router();

aiRouter.post(
  "/generate-copy",
  requireSession,
  requireRole(["ADMIN", "MANAGER"]),
  validateRequest(generateCopyRequestSchema),
  generateMarketingCopyController,
);

aiRouter.post(
  "/classify",
  requireSession,
  requireRole(["ADMIN", "MANAGER"]),
  validateRequest(classifyBookRequestSchema),
  classifyBookController,
);

aiRouter.post(
  "/recommendations",
  requireSession,
  validateRequest(recommendBooksRequestSchema),
  generateRecommendationsController,
);

aiRouter.post(
  "/analyze-dashboard",
  requireSession,
  requireRole(["ADMIN", "MANAGER"]),
  validateRequest(analyzeDashboardRequestSchema),
  analyzeDashboardController,
);

aiRouter.post(
  "/assistant",
  requireSession,
  validateRequest(assistantChatRequestSchema),
  chatWithAssistantController,
);

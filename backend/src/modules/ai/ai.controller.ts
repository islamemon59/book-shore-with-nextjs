import type { Request, Response } from "express";
import {
  analyzeDashboard,
  chatWithAssistant,
  classifyBook,
  generateMarketingCopy,
  generateRecommendations,
} from "./ai.service.js";

export const generateMarketingCopyController = async (req: Request, res: Response) => {
  const item = await generateMarketingCopy(req.body);
  res.json({ success: true, item });
};

export const classifyBookController = async (req: Request, res: Response) => {
  const item = await classifyBook(req.body);
  res.json({ success: true, item });
};

export const generateRecommendationsController = async (req: Request, res: Response) => {
  const item = await generateRecommendations(req.authSession!.user.id, req.body);
  res.json({ success: true, item });
};

export const analyzeDashboardController = async (req: Request, res: Response) => {
  const item = await analyzeDashboard(req.body.goal);
  res.json({ success: true, item });
};

export const chatWithAssistantController = async (req: Request, res: Response) => {
  const item = await chatWithAssistant(req.authSession!.user.id, req.body);
  res.json({ success: true, item });
};

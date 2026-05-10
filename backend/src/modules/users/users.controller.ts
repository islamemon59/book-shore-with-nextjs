import type { Request, Response } from "express";
import {
  getCurrentUserProfile,
  updateCurrentUserPreferences,
  updateCurrentUserProfile,
} from "./users.service.js";

export const getCurrentUserProfileController = async (req: Request, res: Response) => {
  const item = await getCurrentUserProfile(req.authSession!.user.id);
  res.json({
    success: true,
    item,
  });
};

export const updateCurrentUserProfileController = async (req: Request, res: Response) => {
  const item = await updateCurrentUserProfile(req.authSession!.user.id, req.body);
  res.json({
    success: true,
    item,
  });
};

export const updateCurrentUserPreferencesController = async (req: Request, res: Response) => {
  const item = await updateCurrentUserPreferences(req.authSession!.user.id, req.body);
  res.json({
    success: true,
    item,
  });
};

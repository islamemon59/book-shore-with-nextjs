import type { Request, Response } from "express";
import { getHomepageContent } from "./store.service.js";

export const getHomepageContentController = async (_req: Request, res: Response) => {
  const item = await getHomepageContent();
  res.json({
    success: true,
    item,
  });
};

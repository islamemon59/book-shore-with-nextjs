import type { Request, Response } from "express";
import { getHealthStatus } from "./health.service.js";

export const getHealthStatusController = (_req: Request, res: Response) => {
  res.json(getHealthStatus());
};

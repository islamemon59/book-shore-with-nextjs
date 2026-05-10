import { Router } from "express";
import { getHealthStatusController } from "./health.controller.js";

export const healthRouter = Router();

healthRouter.get("/", getHealthStatusController);

import { Router } from "express";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  getDashboardOverviewController,
  listDashboardBooksController,
  listDashboardOrdersController,
} from "./dashboard.controller.js";
import { dashboardBooksSchema, dashboardOrdersSchema } from "./dashboard.validation.js";

export const dashboardRouter = Router();

dashboardRouter.use(requireSession);

dashboardRouter.get("/overview", getDashboardOverviewController);

dashboardRouter.get("/books", validateRequest(dashboardBooksSchema), listDashboardBooksController);

dashboardRouter.get("/orders", validateRequest(dashboardOrdersSchema), listDashboardOrdersController);

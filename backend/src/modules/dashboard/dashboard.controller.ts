import type { Request, Response } from "express";
import { getDashboardOverview, listDashboardBooks, listDashboardOrders } from "./dashboard.service.js";

const getRequestRole = (req: Request) =>
  (req.authSession?.user as { role?: string } | undefined)?.role ?? "USER";

export const getDashboardOverviewController = async (req: Request, res: Response) => {
  const payload = await getDashboardOverview(req.authSession!.user.id, getRequestRole(req));
  res.json({
    success: true,
    ...payload,
  });
};

export const listDashboardBooksController = async (req: Request, res: Response) => {
  const payload = await listDashboardBooks(getRequestRole(req), req.query as never);
  res.json({
    success: true,
    items: payload.items,
    meta: payload.meta,
  });
};

export const listDashboardOrdersController = async (req: Request, res: Response) => {
  const payload = await listDashboardOrders(req.authSession!.user.id, getRequestRole(req), req.query as never);
  res.json({
    success: true,
    items: payload.items,
    meta: payload.meta,
  });
};

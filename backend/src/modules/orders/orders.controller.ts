import type { Request, Response } from "express";
import {
  checkout,
  completeCheckoutPayment,
  completeCheckoutPaymentByTransaction,
  listUserOrders,
  startCheckoutPayment,
} from "./orders.service.js";

export const listUserOrdersController = async (req: Request, res: Response) => {
  const items = await listUserOrders(req.authSession!.user.id);
  res.json({
    success: true,
    items,
  });
};

export const checkoutController = async (req: Request, res: Response) => {
  const item = await checkout(req.authSession!.user.id, req.body);
  res.status(201).json({
    success: true,
    item,
  });
};

export const startCheckoutPaymentController = async (req: Request, res: Response) => {
  const item = await startCheckoutPayment(req.authSession!.user.id, req.body);
  res.status(201).json({
    success: true,
    item,
  });
};

export const completeCheckoutPaymentController = async (req: Request, res: Response) => {
  const item = await completeCheckoutPayment(req.authSession!.user.id, req.body);
  res.json({
    success: true,
    item,
  });
};

export const sslcommerzIpnController = async (req: Request, res: Response) => {
  const tranId = typeof req.body?.tran_id === "string" ? req.body.tran_id : "";
  const valId = typeof req.body?.val_id === "string" ? req.body.val_id : "";

  if (!tranId || !valId) {
    res.status(400).json({ success: false, message: "Missing payment details." });
    return;
  }

  const item = await completeCheckoutPaymentByTransaction({ tranId, valId });
  res.json({
    success: true,
    item,
  });
};

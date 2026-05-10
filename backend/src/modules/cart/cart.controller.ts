import type { Request, Response } from "express";
import { addCartItem, getCart, removeCartItem, updateCartItemQuantity } from "./cart.service.js";

export const getCartController = async (req: Request, res: Response) => {
  const payload = await getCart(req.authSession!.user.id);
  res.json({
    success: true,
    items: payload.items,
    summary: payload.summary,
  });
};

export const addCartItemController = async (req: Request, res: Response) => {
  const item = await addCartItem(req.authSession!.user.id, req.body);
  res.status(201).json({
    success: true,
    item,
  });
};

export const updateCartItemController = async (req: Request, res: Response) => {
  const item = await updateCartItemQuantity(
    req.authSession!.user.id,
    String(req.params.itemId),
    req.body,
  );
  res.json({
    success: true,
    item,
  });
};

export const removeCartItemController = async (req: Request, res: Response) => {
  await removeCartItem(req.authSession!.user.id, String(req.params.itemId));
  res.json({
    success: true,
    message: "Item removed from cart.",
  });
};

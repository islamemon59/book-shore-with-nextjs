import { Router } from "express";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  addCartItemController,
  getCartController,
  removeCartItemController,
  updateCartItemController,
} from "./cart.controller.js";
import { addCartItemSchema, deleteCartItemSchema, updateCartItemSchema } from "./cart.validation.js";

export const cartRouter = Router();

cartRouter.use(requireSession);

cartRouter.get("/", getCartController);

cartRouter.post("/", validateRequest(addCartItemSchema), addCartItemController);

cartRouter.patch("/:itemId", validateRequest(updateCartItemSchema), updateCartItemController);

cartRouter.delete("/:itemId", validateRequest(deleteCartItemSchema), removeCartItemController);

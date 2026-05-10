import { Router } from "express";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  checkoutController,
  completeCheckoutPaymentController,
  listUserOrdersController,
  sslcommerzIpnController,
  startCheckoutPaymentController,
} from "./orders.controller.js";
import { checkoutSchema, completeCheckoutPaymentSchema } from "./orders.validation.js";

export const ordersRouter = Router();

ordersRouter.post("/checkout/ipn", sslcommerzIpnController);

ordersRouter.use(requireSession);

ordersRouter.get("/", listUserOrdersController);

ordersRouter.post("/checkout/session", validateRequest(checkoutSchema), startCheckoutPaymentController);
ordersRouter.post(
  "/checkout/complete",
  validateRequest(completeCheckoutPaymentSchema),
  completeCheckoutPaymentController,
);
ordersRouter.post("/checkout", validateRequest(checkoutSchema), checkoutController);

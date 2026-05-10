import { z } from "zod";
import type { CartItem } from "./types";

export const shippingAddressSchema = z.object({
  fullName: z.string().min(2, "Enter the full name."),
  email: z.email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  country: z.string().min(2, "Enter the country."),
  city: z.string().min(2, "Enter the city."),
  addressLine1: z.string().min(5, "Enter the street address."),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(3, "Enter the postal code."),
});

export const checkoutPayloadSchema = z.object({
  notes: z.string().max(500).optional(),
  shippingAddress: shippingAddressSchema,
});

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>;

export const calculateCartSummary = (items: Pick<CartItem, "lineTotal">[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = subtotal === 0 ? 0 : subtotal > 100 ? 0 : 9.5;

  return {
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
  };
};

import { z } from "zod";

export const checkoutSchema = z.object({
  params: z.object({}).default({}),
  query: z.object({}).default({}),
  body: z.object({
    notes: z.string().max(500).optional(),
    shippingAddress: z.object({
      fullName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().min(7),
      country: z.string().min(2),
      city: z.string().min(2),
      addressLine1: z.string().min(5),
      addressLine2: z.string().optional(),
      postalCode: z.string().min(3),
    }),
  }),
});

export const completeCheckoutPaymentSchema = z.object({
  params: z.object({}).default({}),
  query: z.object({}).default({}),
  body: z.object({
    tranId: z.string().min(3),
    valId: z.string().min(3),
  }),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>["body"];
export type CompleteCheckoutPaymentInput = z.infer<typeof completeCheckoutPaymentSchema>["body"];

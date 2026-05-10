import { z } from "zod";

export const addCartItemSchema = z.object({
  params: z.object({}).default({}),
  query: z.object({}).default({}),
  body: z.object({
    bookId: z.string().min(1),
    quantity: z.coerce.number().int().positive().max(10).default(1),
  }),
});

export const updateCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1),
  }),
  query: z.object({}).default({}),
  body: z.object({
    quantity: z.coerce.number().int().positive().max(10),
  }),
});

export const deleteCartItemSchema = z.object({
  params: z.object({
    itemId: z.string().min(1),
  }),
  query: z.object({}).default({}),
  body: z.object({}).default({}),
});

export type AddCartItemInput = z.infer<typeof addCartItemSchema>["body"];
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>["body"];

import { OrderStatus } from "@prisma/client";
import { z } from "zod";

export const dashboardBooksSchema = z.object({
  params: z.object({}).default({}),
  body: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    search: z.string().trim().default(""),
  }),
});

export const dashboardOrdersSchema = z.object({
  params: z.object({}).default({}),
  body: z.object({}).default({}),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
    search: z.string().trim().default(""),
    status: z.nativeEnum(OrderStatus).optional(),
  }),
});

export type DashboardBooksQuery = z.infer<typeof dashboardBooksSchema>["query"];
export type DashboardOrdersQuery = z.infer<typeof dashboardOrdersSchema>["query"];

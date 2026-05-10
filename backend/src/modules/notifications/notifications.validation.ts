import { z } from "zod";

export const markAllNotificationsReadSchema = z.object({
  params: z.object({}).default({}),
  query: z.object({}).default({}),
  body: z.object({}).default({}),
});

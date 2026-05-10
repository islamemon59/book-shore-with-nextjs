import { z } from "zod";

export const blogPostSlugSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({
    slug: z.string().min(1),
  }),
});

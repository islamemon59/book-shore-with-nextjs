import { z } from "zod";

export const updateProfileSchema = z.object({
  params: z.object({}).default({}),
  query: z.object({}).default({}),
  body: z.object({
    name: z.string().min(2),
    image: z.string().url().optional().or(z.literal("")),
  }),
});

export const updatePreferencesSchema = z.object({
  params: z.object({}).default({}),
  query: z.object({}).default({}),
  body: z.object({
    favoriteGenres: z.array(z.string()).default([]),
    favoriteFormats: z.array(z.string()).default([]),
    monthlyBudget: z.coerce.number().positive().optional(),
    readingGoal: z.coerce.number().int().positive().optional(),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>["body"];

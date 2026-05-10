import { z } from "zod";

export const listBooksSchema = z.object({
  body: z.object({}).default({}),
  params: z.object({}).default({}),
  query: z.object({
    search: z.string().trim().optional(),
    category: z.string().trim().optional(),
    format: z.string().trim().optional(),
    minPrice: z.coerce.number().optional(),
    maxPrice: z.coerce.number().optional(),
    minRating: z.coerce.number().min(0).max(5).optional(),
    featured: z.enum(["true", "false"]).optional(),
    sort: z
      .enum(["featured", "newest", "oldest", "priceAsc", "priceDesc", "ratingDesc"])
      .default("featured"),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(24).default(12),
  }),
});

export const bookSlugSchema = z.object({
  body: z.object({}).default({}),
  query: z.object({}).default({}),
  params: z.object({
    slug: z.string().min(1),
  }),
});

export const upsertBookSchema = z.object({
  query: z.object({}).default({}),
  params: z.object({
    id: z.string().optional(),
  }),
  body: z.object({
    title: z.string().min(3),
    author: z.string().min(3),
    publisher: z.string().min(2),
    synopsis: z.string().min(100),
    shortDescription: z.string().min(40).max(280),
    price: z.coerce.number().positive(),
    compareAtPrice: z.coerce.number().positive().optional(),
    inventory: z.coerce.number().int().nonnegative(),
    pages: z.coerce.number().int().positive(),
    format: z.string().min(2),
    language: z.string().min(2),
    isbn: z.string().min(10),
    coverImage: z.string().url(),
    gallery: z.array(z.string().url()).min(1),
    publishedAt: z.string().datetime(),
    releaseLabel: z.string().min(2),
    location: z.string().min(2),
    featured: z.boolean().default(false),
    spotlight: z.boolean().default(false),
    aiSummary: z.string().optional(),
    aiTags: z.array(z.string()).optional(),
    categorySlugs: z.array(z.string()).min(1),
  }),
});

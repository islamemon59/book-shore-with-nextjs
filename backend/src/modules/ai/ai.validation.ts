import { z } from "zod";

const emptyParamsSchema = z.object({}).default({});
const emptyQuerySchema = z.object({}).default({});

export const generateCopyInputSchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
  audience: z.string().min(3),
  themes: z.array(z.string()).min(1),
  tone: z.string().min(3),
});

export const classifyBookInputSchema = z.object({
  title: z.string().min(3),
  synopsis: z.string().min(80),
});

export const recommendBooksInputSchema = z.object({
  focusCategory: z.string().optional(),
  budget: z.coerce.number().positive().optional(),
});

export const analyzeDashboardInputSchema = z.object({
  goal: z.string().min(10),
});

export const assistantChatInputSchema = z.object({
  conversationId: z.string().optional(),
  message: z.string().min(4).max(1000),
});

export const generateCopyRequestSchema = z.object({
  params: emptyParamsSchema,
  query: emptyQuerySchema,
  body: generateCopyInputSchema,
});

export const classifyBookRequestSchema = z.object({
  params: emptyParamsSchema,
  query: emptyQuerySchema,
  body: classifyBookInputSchema,
});

export const recommendBooksRequestSchema = z.object({
  params: emptyParamsSchema,
  query: emptyQuerySchema,
  body: recommendBooksInputSchema,
});

export const analyzeDashboardRequestSchema = z.object({
  params: emptyParamsSchema,
  query: emptyQuerySchema,
  body: analyzeDashboardInputSchema,
});

export const assistantChatRequestSchema = z.object({
  params: emptyParamsSchema,
  query: emptyQuerySchema,
  body: assistantChatInputSchema,
});

export const generateCopyOutputSchema = z.object({
  shortDescription: z.string(),
  synopsis: z.string(),
  merchandisingBullets: z.array(z.string()).length(3),
});

export const classifyBookOutputSchema = z.object({
  recommendedCategories: z.array(z.string()).min(2).max(4),
  audienceTags: z.array(z.string()).min(2).max(5),
  toneTags: z.array(z.string()).min(2).max(4),
  merchandisingKeywords: z.array(z.string()).min(4).max(8),
});

export const recommendationsOutputSchema = z.object({
  summary: z.string(),
  picks: z.array(
    z.object({
      slug: z.string(),
      rationale: z.string(),
    }),
  ),
});

export const analyzerOutputSchema = z.object({
  headline: z.string(),
  insights: z.array(z.string()).min(3).max(5),
  actions: z.array(z.string()).min(3).max(5),
});

export const assistantOutputSchema = z.object({
  answer: z.string(),
  suggestions: z.array(z.string()).min(2).max(4),
  recommendedSlugs: z.array(z.string()).max(4),
});

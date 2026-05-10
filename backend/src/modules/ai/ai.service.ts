import { zodTextFormat } from "openai/helpers/zod";
import { env } from "../../config/env.js";
import { openai } from "../../lib/openai.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/http.js";
import {
  analyzerOutputSchema,
  assistantOutputSchema,
  classifyBookInputSchema,
  classifyBookOutputSchema,
  generateCopyInputSchema,
  generateCopyOutputSchema,
  recommendationsOutputSchema,
} from "./ai.validation.js";

const ensureOpenAI = () => {
  if (!openai) {
    throw new AppError(503, "OpenAI is not configured. Add OPENAI_API_KEY to enable AI features.");
  }

  return openai;
};

const readOpenAIError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return { message: "OpenAI request failed." };
  }

  const candidate = error as { status?: unknown; code?: unknown; message?: unknown };
  return {
    status: typeof candidate.status === "number" ? candidate.status : undefined,
    code: typeof candidate.code === "string" ? candidate.code : undefined,
    message: typeof candidate.message === "string" ? candidate.message : "OpenAI request failed.",
  };
};

const withOpenAIErrorMessage = async <T>(operation: () => Promise<T>) => {
  try {
    return await operation();
  } catch (error) {
    const { status, code, message } = readOpenAIError(error);

    if (status === 429 || code === "insufficient_quota" || message.toLowerCase().includes("quota")) {
      throw new AppError(
        503,
        "OpenAI quota or billing is not available for this API key. Check the OpenAI project billing, credits, and monthly budget.",
      );
    }

    if (status === 401) {
      throw new AppError(503, "OpenAI rejected the configured API key. Check OPENAI_API_KEY.");
    }

    if (status === 404 || message.toLowerCase().includes("model")) {
      throw new AppError(503, `OpenAI model '${env.OPENAI_MODEL}' is not available for this API key.`);
    }

    throw new AppError(502, "OpenAI request failed. Please try again shortly.");
  }
};

const getCatalogSnapshot = async () => {
  const books = await prisma.book.findMany({
    take: 12,
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  return books
    .map(
      (book) =>
        `${book.slug} | ${book.title} by ${book.author} | ${book.format} | $${Number(book.price).toFixed(2)} | ${book.categories
          .map(({ category }) => category.name)
          .join(", ")}`,
    )
    .join("\n");
};

export const generateMarketingCopy = async (input: unknown) => {
  const client = ensureOpenAI();
  const data = generateCopyInputSchema.parse(input);

  const response = await withOpenAIErrorMessage(() => client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You write polished ecommerce copy for a premium online bookstore. Keep the language commercial, concise, and credible.",
      },
      {
        role: "user",
        content: `Create catalog copy for the following book concept.\nTitle: ${data.title}\nAuthor: ${data.author}\nAudience: ${data.audience}\nThemes: ${data.themes.join(", ")}\nTone: ${data.tone}`,
      },
    ],
    text: {
      format: zodTextFormat(generateCopyOutputSchema, "book_marketing_copy"),
    },
  }));

  return response.output_parsed;
};

export const classifyBook = async (input: unknown) => {
  const client = ensureOpenAI();
  const data = classifyBookInputSchema.parse(input);

  const response = await withOpenAIErrorMessage(() => client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You classify books for a production ecommerce catalog. Return commercially useful tags that improve browsing and merchandising.",
      },
      {
        role: "user",
        content: `Classify this book.\nTitle: ${data.title}\nSynopsis: ${data.synopsis}`,
      },
    ],
    text: {
      format: zodTextFormat(classifyBookOutputSchema, "book_classification"),
    },
  }));

  return response.output_parsed;
};

export const generateRecommendations = async (userId: string, input: { focusCategory?: string; budget?: number }) => {
  const client = ensureOpenAI();
  const [preferences, cartItems, catalogSnapshot] = await Promise.all([
    prisma.userPreference.findUnique({ where: { userId } }),
    prisma.cartItem.findMany({
      where: { userId },
      include: { book: true },
    }),
    getCatalogSnapshot(),
  ]);

  const response = await withOpenAIErrorMessage(() => client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You are BookShore's recommendation engine. Only recommend slugs that exist in the supplied catalog snapshot.",
      },
      {
        role: "user",
        content: `Recommend books for this reader.\nFavorite genres: ${JSON.stringify(
          preferences?.favoriteGenres ?? [],
        )}\nFavorite formats: ${JSON.stringify(
          preferences?.favoriteFormats ?? [],
        )}\nMonthly budget: ${preferences?.monthlyBudget ? Number(preferences.monthlyBudget) : "unknown"}\nCurrent cart: ${cartItems
          .map((item) => item.book.title)
          .join(", ")}\nRequested focus category: ${input.focusCategory ?? "none"}\nRequested budget: ${
          input.budget ?? "not provided"
        }\nCatalog snapshot:\n${catalogSnapshot}`,
      },
    ],
    text: {
      format: zodTextFormat(recommendationsOutputSchema, "book_recommendations"),
    },
  }));

  return response.output_parsed;
};

export const analyzeDashboard = async (goal: string) => {
  const client = ensureOpenAI();
  const [orders, books, users] = await Promise.all([
    prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
    prisma.book.findMany({
      orderBy: { inventory: "asc" },
      take: 20,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const response = await withOpenAIErrorMessage(() => client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You are an ecommerce analyst. Use the supplied bookstore data to produce practical, operator-focused insights.",
      },
      {
        role: "user",
        content: `Goal: ${goal}\nRecent orders: ${JSON.stringify(
          orders.map((order) => ({
            orderNumber: order.orderNumber,
            total: Number(order.total),
            status: order.status,
            createdAt: order.createdAt,
            itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
          })),
        )}\nBooks: ${JSON.stringify(
          books.map((book) => ({
            title: book.title,
            inventory: book.inventory,
            featured: book.featured,
            rating: Number(book.rating),
          })),
        )}\nNew users: ${JSON.stringify(
          users.map((user) => ({
            name: user.name,
            role: user.role,
            joinedAt: user.createdAt,
          })),
        )}`,
      },
    ],
    text: {
      format: zodTextFormat(analyzerOutputSchema, "dashboard_analysis"),
    },
  }));

  return response.output_parsed;
};

export const chatWithAssistant = async (userId: string, input: { conversationId?: string; message: string }) => {
  const client = ensureOpenAI();
  const catalogSnapshot = await getCatalogSnapshot();

  const conversation =
    input.conversationId
      ? await prisma.aIConversation.findUnique({
          where: { id: input.conversationId },
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              take: 10,
            },
          },
        })
      : null;

  const response = await withOpenAIErrorMessage(() => client.responses.parse({
    model: env.OPENAI_MODEL,
    input: [
      {
        role: "system",
        content:
          "You are a context-aware shopping assistant for BookShore. Answer clearly, help users compare books, and only mention titles from the provided catalog snapshot.",
      },
      {
        role: "user",
        content: `Catalog snapshot:\n${catalogSnapshot}\nConversation history:\n${JSON.stringify(
          conversation?.messages ?? [],
        )}\nNew message: ${input.message}`,
      },
    ],
    text: {
      format: zodTextFormat(assistantOutputSchema, "shopping_assistant"),
    },
  }));

  const nextConversation =
    conversation ??
    (await prisma.aIConversation.create({
      data: {
        userId,
        title: input.message.slice(0, 60),
      },
    }));

  await prisma.aIMessage.createMany({
    data: [
      {
        conversationId: nextConversation.id,
        role: "user",
        content: input.message,
      },
      {
        conversationId: nextConversation.id,
        role: "assistant",
        content: response.output_parsed.answer,
      },
    ],
  });

  return {
    conversationId: nextConversation.id,
    ...response.output_parsed,
  };
};

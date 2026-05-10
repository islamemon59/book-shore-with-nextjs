import { zodTextFormat } from "openai/helpers/zod";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
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

const shouldUseFallback = ({
  status,
  code,
  message,
}: {
  status?: number;
  code?: string;
  message: string;
}) => {
  const normalizedMessage = message.toLowerCase();

  return (
    status === 401 ||
    status === 404 ||
    status === 429 ||
    code === "insufficient_quota" ||
    normalizedMessage.includes("quota") ||
    normalizedMessage.includes("billing") ||
    normalizedMessage.includes("model") ||
    normalizedMessage.includes("api key") ||
    normalizedMessage.includes("authentication")
  );
};

const logFallback = (
  feature: string,
  reason: {
    status?: number;
    code?: string;
    message: string;
  },
) => {
  logger.warn(
    {
      feature,
      model: env.OPENAI_MODEL,
      openaiStatus: reason.status,
      openaiCode: reason.code,
      openaiMessage: reason.message,
    },
    "OpenAI unavailable, using local fallback.",
  );
};

const runStructuredAI = async <T>(
  feature: string,
  operation: (client: NonNullable<typeof openai>) => Promise<{ output_parsed: T | null }>,
  fallback: () => Promise<T> | T,
) => {
  if (!openai) {
    logFallback(feature, {
      message: "OpenAI is not configured. Add OPENAI_API_KEY to enable AI features.",
    });
    return await fallback();
  }

  try {
    const response = await operation(openai);

    if (response.output_parsed) {
      return response.output_parsed;
    }

    logFallback(feature, {
      message: "OpenAI returned no parsed output.",
    });
    return await fallback();
  } catch (error) {
    const { status, code, message } = readOpenAIError(error);

    if (shouldUseFallback({ status, code, message })) {
      logFallback(feature, { status, code, message });
      return await fallback();
    }

    throw new AppError(502, "OpenAI request failed. Please try again shortly.");
  }
};

const getCatalogBooks = () =>
  prisma.book.findMany({
    take: 18,
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

type CatalogBook = Awaited<ReturnType<typeof getCatalogBooks>>[number];

const getBookCategoryNames = (book: CatalogBook) => book.categories.map(({ category }) => category.name);

const formatCatalogSnapshot = (books: CatalogBook[]) =>
  books
    .map(
      (book) =>
        `${book.slug} | ${book.title} by ${book.author} | ${book.format} | $${Number(book.price).toFixed(2)} | ${getBookCategoryNames(
          book,
        ).join(", ")}`,
    )
    .join("\n");

const unique = (values: string[]) => [...new Set(values.map((value) => value.trim()).filter(Boolean))];

const fillList = (values: string[], minimum: number, maximum: number, defaults: string[]) =>
  unique([...values, ...defaults]).slice(0, Math.max(minimum, maximum)).slice(0, maximum);

const extractTerms = (value: string) =>
  unique(
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((term) => term.length > 2),
  );

const toStringArray = (value: unknown) =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const pickCategoryNames = (source: string) => {
  const normalized = source.toLowerCase();
  const matches: string[] = [];

  if (/(novel|fiction|story|family|memory|character|narrative)/.test(normalized)) {
    matches.push("Literary Fiction");
  }

  if (/(business|leader|leadership|strategy|team|company|product|operator)/.test(normalized)) {
    matches.push("Business & Strategy");
  }

  if (/(design|creative|creativity|brand|visual|maker|craft)/.test(normalized)) {
    matches.push("Design & Creativity");
  }

  if (/(technology|software|code|developer|engineering|systems|ai|digital)/.test(normalized)) {
    matches.push("Technology");
  }

  if (/(habit|focus|growth|self|discipline|energy|mindset|improve)/.test(normalized)) {
    matches.push("Self-Development");
  }

  if (/(travel|culture|city|place|journey|history|language|world)/.test(normalized)) {
    matches.push("Travel & Culture");
  }

  return fillList(matches, 2, 4, ["Literary Fiction", "Self-Development", "Technology"]);
};

const generateMarketingCopyFallback = (data: Awaited<ReturnType<typeof generateCopyInputSchema.parse>>) => {
  const themes = data.themes.join(", ");

  return {
    shortDescription: `${data.title} is a ${data.tone.toLowerCase()} ${data.audience.toLowerCase()} pick from ${data.author} that blends ${themes.toLowerCase()} into a polished bookstore-ready package.`,
    synopsis: `${data.title} invites ${data.audience.toLowerCase()} into a story shaped by ${themes.toLowerCase()}. Written in a ${data.tone.toLowerCase()} voice, it gives booksellers a credible, easy-to-merchandise angle for readers looking for a memorable new release from ${data.author}.`,
    merchandisingBullets: [
      `Strong fit for readers interested in ${data.themes[0].toLowerCase()} and character-driven discovery.`,
      `Written in a ${data.tone.toLowerCase()} register that supports premium merchandising copy.`,
      `Easy to position for ${data.audience.toLowerCase()} across homepage, category, and campaign placements.`,
    ],
  };
};

const classifyBookFallback = (data: Awaited<ReturnType<typeof classifyBookInputSchema.parse>>) => {
  const source = `${data.title} ${data.synopsis}`;
  const titleTerms = extractTerms(data.title);

  const audienceTags = fillList(
    [
      /(leader|manager|business|team|operator)/i.test(source) ? "Operators" : "",
      /(designer|creative|artist|maker)/i.test(source) ? "Creative professionals" : "",
      /(developer|engineer|software|ai|technology)/i.test(source) ? "Technology readers" : "",
      /(travel|culture|history|city|place)/i.test(source) ? "Culture readers" : "",
      /(novel|story|family|love|memory)/i.test(source) ? "General adult readers" : "",
    ],
    2,
    5,
    ["Book club readers", "Curious general readers", "Gift buyers"],
  );

  const toneTags = fillList(
    [
      /(warm|lyrical|elegant|quiet|luminous)/i.test(source) ? "Warm" : "",
      /(practical|clear|actionable|guide)/i.test(source) ? "Practical" : "",
      /(thoughtful|reflective|meditative)/i.test(source) ? "Reflective" : "",
      /(urgent|sharp|fast|bold)/i.test(source) ? "Energetic" : "",
    ],
    2,
    4,
    ["Accessible", "Thoughtful", "Commercially clear"],
  );

  const merchandisingKeywords = fillList(
    [
      ...titleTerms.map((term) => term.replace(/\b\w/g, (letter) => letter.toUpperCase())),
      ...pickCategoryNames(source),
      ...toneTags,
    ],
    4,
    8,
    ["Book club pick", "Staff recommendation", "New release", "Reader favorite"],
  );

  return {
    recommendedCategories: pickCategoryNames(source),
    audienceTags,
    toneTags,
    merchandisingKeywords,
  };
};

const buildRecommendationFallback = (
  books: CatalogBook[],
  cartItems: Awaited<ReturnType<typeof prisma.cartItem.findMany>>,
  preferences: Awaited<ReturnType<typeof prisma.userPreference.findUnique>>,
  input: { focusCategory?: string; budget?: number },
) => {
  const favoriteGenres = toStringArray(preferences?.favoriteGenres);
  const favoriteFormats = toStringArray(preferences?.favoriteFormats);
  const cartBookIds = new Set(cartItems.map((item) => item.bookId));
  const preferredBudget = input.budget ?? (preferences?.monthlyBudget ? Number(preferences.monthlyBudget) : undefined);

  const scoredBooks = books
    .filter((book) => !cartBookIds.has(book.id) && book.inventory > 0)
    .map((book) => {
      const categoryNames = getBookCategoryNames(book);
      let score = Number(book.rating) + (book.featured ? 2.5 : 0);

      if (
        input.focusCategory &&
        categoryNames.some((category) => category.toLowerCase().includes(input.focusCategory!.toLowerCase()))
      ) {
        score += 4;
      }

      if (favoriteGenres.length > 0) {
        score += categoryNames.filter((category) => favoriteGenres.some((genre) => category.toLowerCase().includes(genre.toLowerCase()))).length * 2;
      }

      if (favoriteFormats.length > 0 && favoriteFormats.some((format) => format.toLowerCase() === book.format.toLowerCase())) {
        score += 1.5;
      }

      if (preferredBudget !== undefined && Number(book.price) <= preferredBudget) {
        score += 1;
      }

      return { book, categoryNames, score };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  return {
    summary:
      scoredBooks.length > 0
        ? `These picks are based on your saved preferences, current cart, and the strongest matches in BookShore's catalog.`
        : "No strong personalized matches were available, so these are high-confidence bookstore picks from the current catalog.",
    picks: scoredBooks.map(({ book, categoryNames }) => ({
      slug: book.slug,
      rationale: `A strong match for ${categoryNames.join(", ")} readers with its ${book.format.toLowerCase()} format, ${Number(book.rating).toFixed(1)} rating, and ${book.featured ? "featured-store" : "catalog"} visibility.`,
    })),
  };
};

const buildDashboardFallback = (
  goal: string,
  orders: Awaited<ReturnType<typeof prisma.order.findMany>>,
  books: Awaited<ReturnType<typeof prisma.book.findMany>>,
  users: Awaited<ReturnType<typeof prisma.user.findMany>>,
) => {
  const deliveredOrders = orders.filter((order) => order.status === "DELIVERED");
  const pendingOrders = orders.filter((order) => order.status === "PENDING");
  const recentRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const lowInventoryBooks = books.filter((book) => book.inventory <= 10).slice(0, 3);
  const adminAndManagerCount = users.filter((user) => user.role === "ADMIN" || user.role === "MANAGER").length;

  return {
    headline: `Local insight for: ${goal}`,
    insights: [
      `Recent orders generated $${recentRevenue.toFixed(2)} in tracked revenue across ${orders.length} orders.`,
      `${deliveredOrders.length} orders are already delivered while ${pendingOrders.length} still need follow-through.`,
      lowInventoryBooks.length > 0
        ? `Inventory pressure is building on ${lowInventoryBooks.map((book) => book.title).join(", ")}.`
        : "No immediate low-inventory risk stands out in the current dashboard snapshot.",
      `The latest user sample includes ${users.length} accounts, with ${adminAndManagerCount} operator-level users.`,
    ].slice(0, 4),
    actions: fillList(
      [
        pendingOrders.length > 0 ? "Review pending orders and confirm payment or fulfillment bottlenecks." : "",
        lowInventoryBooks.length > 0 ? `Restock or feature-substitute ${lowInventoryBooks[0]!.title} before availability drops further.` : "",
        "Use the current best-rated featured books in the next storefront or email campaign.",
        "Compare new-user signups with order conversion to spot onboarding drop-off.",
      ],
      3,
      5,
      ["Audit top sellers against inventory depth this week.", "Track operator workflows around pending orders."],
    ),
  };
};

const buildAssistantFallback = (
  message: string,
  books: CatalogBook[],
  conversationMessages: Array<{ content: string }> = [],
) => {
  const messageTerms = extractTerms(message);
  const scoredBooks = books
    .map((book) => {
      const searchable = `${book.title} ${book.author} ${book.synopsis} ${getBookCategoryNames(book).join(" ")}`.toLowerCase();
      const termMatches = messageTerms.filter((term) => searchable.includes(term)).length;

      return {
        book,
        score: termMatches * 3 + Number(book.rating) + (book.featured ? 2 : 0),
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  const recommendedSlugs = scoredBooks.map(({ book }) => book.slug);
  const leadBook = scoredBooks[0]?.book;
  const previousContext = conversationMessages.length > 0 ? " I also used your recent conversation context to keep the answer consistent." : "";

  return {
    answer: leadBook
      ? `Based on your question, I'd start with ${leadBook.title} by ${leadBook.author}.${previousContext} It aligns well with the themes in your request and is one of the strongest matches in the current BookShore catalog.`
      : `I couldn't find a tight keyword match in the current catalog, so I leaned on BookShore's highest-signal featured titles instead.${previousContext}`,
    suggestions: fillList(
      [
        leadBook ? `Compare ${leadBook.title} with another title` : "",
        "Ask for a reading path by mood or topic",
        "Request gift ideas under a budget",
        "Ask for the best starting point in a category",
      ],
      2,
      4,
      ["Ask for beginner-friendly picks", "Build a three-book shortlist"],
    ),
    recommendedSlugs,
  };
};

export const generateMarketingCopy = async (input: unknown) => {
  const data = generateCopyInputSchema.parse(input);

  return runStructuredAI(
    "generate-copy",
    (client) =>
      client.responses.parse({
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
      }),
    () => generateMarketingCopyFallback(data),
  );
};

export const classifyBook = async (input: unknown) => {
  const data = classifyBookInputSchema.parse(input);

  return runStructuredAI(
    "classify-book",
    (client) =>
      client.responses.parse({
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
      }),
    () => classifyBookFallback(data),
  );
};

export const generateRecommendations = async (userId: string, input: { focusCategory?: string; budget?: number }) => {
  const [preferences, cartItems, catalogBooks] = await Promise.all([
    prisma.userPreference.findUnique({ where: { userId } }),
    prisma.cartItem.findMany({
      where: { userId },
      include: { book: true },
    }),
    getCatalogBooks(),
  ]);
  const catalogSnapshot = formatCatalogSnapshot(catalogBooks);

  return runStructuredAI(
    "recommendations",
    (client) =>
      client.responses.parse({
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
      }),
    () => buildRecommendationFallback(catalogBooks, cartItems, preferences, input),
  );
};

export const analyzeDashboard = async (goal: string) => {
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

  return runStructuredAI(
    "analyze-dashboard",
    (client) =>
      client.responses.parse({
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
      }),
    () => buildDashboardFallback(goal, orders, books, users),
  );
};

export const chatWithAssistant = async (userId: string, input: { conversationId?: string; message: string }) => {
  const [catalogBooks, conversation] = await Promise.all([
    getCatalogBooks(),
    input.conversationId
      ? prisma.aIConversation.findUnique({
          where: { id: input.conversationId },
          include: {
            messages: {
              orderBy: { createdAt: "asc" },
              take: 10,
            },
          },
        })
      : Promise.resolve(null),
  ]);
  const catalogSnapshot = formatCatalogSnapshot(catalogBooks);

  const response = await runStructuredAI(
    "assistant",
    (client) =>
      client.responses.parse({
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
      }),
    () => buildAssistantFallback(input.message, catalogBooks, conversation?.messages ?? []),
  );

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
        content: response.answer,
      },
    ],
  });

  return {
    conversationId: nextConversation.id,
    ...response,
  };
};

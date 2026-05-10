import { Prisma } from "@prisma/client";
import slugify from "slugify";
import { appCache, cacheKeys } from "../../lib/cache.js";
import { prisma } from "../../lib/prisma.js";
import { AppError, buildPageMeta } from "../../utils/http.js";

type ListBooksInput = {
  search?: string;
  category?: string;
  format?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  featured?: string;
  sort: "featured" | "newest" | "oldest" | "priceAsc" | "priceDesc" | "ratingDesc";
  page: number;
  limit: number;
};

const mapBook = (book: any) => ({
  id: book.id,
  slug: book.slug,
  title: book.title,
  author: book.author,
  publisher: book.publisher,
  synopsis: book.synopsis,
  shortDescription: book.shortDescription,
  price: Number(book.price),
  compareAtPrice: book.compareAtPrice ? Number(book.compareAtPrice) : null,
  rating: Number(book.rating),
  reviewCount: book.reviewCount,
  inventory: book.inventory,
  pages: book.pages,
  format: book.format,
  language: book.language,
  isbn: book.isbn,
  coverImage: book.coverImage,
  gallery: Array.isArray(book.gallery) ? book.gallery : [],
  publishedAt: book.publishedAt,
  releaseLabel: book.releaseLabel,
  location: book.location,
  featured: book.featured,
  spotlight: book.spotlight,
  aiSummary: book.aiSummary,
  aiTags: Array.isArray(book.aiTags) ? book.aiTags : [],
  categories:
    book.categories?.map(({ category }) => ({
      name: category.name,
      slug: category.slug,
    })) ?? [],
  reviews:
    book.reviews?.map((review) => ({
      ...review,
      createdAt: review.createdAt,
    })) ?? [],
});

export const listBooks = async (filters: ListBooksInput) => {
  const queryKey = JSON.stringify(filters);
  const cached = appCache.get<unknown>(cacheKeys.books(queryKey));

  if (cached) {
    return cached;
  }

  const where: any = {
    ...(filters.search
      ? {
          OR: [
            { title: { contains: filters.search, mode: "insensitive" } },
            { author: { contains: filters.search, mode: "insensitive" } },
            { publisher: { contains: filters.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters.category
      ? {
          categories: {
            some: {
              category: {
                slug: filters.category,
              },
            },
          },
        }
      : {}),
    ...(filters.format ? { format: { equals: filters.format, mode: "insensitive" } } : {}),
    ...(filters.minPrice || filters.maxPrice
      ? {
          price: {
            gte: filters.minPrice,
            lte: filters.maxPrice,
          },
        }
      : {}),
    ...(filters.minRating ? { rating: { gte: filters.minRating } } : {}),
    ...(filters.featured ? { featured: filters.featured === "true" } : {}),
  };

  const orderBy: any =
    {
      newest: [{ publishedAt: "desc" }],
      oldest: [{ publishedAt: "asc" }],
      priceAsc: [{ price: "asc" }],
      priceDesc: [{ price: "desc" }],
      ratingDesc: [{ rating: "desc" }],
      featured: [{ spotlight: "desc" }, { featured: "desc" }, { publishedAt: "desc" }],
    }[filters.sort] ?? [{ publishedAt: "desc" }];

  const [items, total] = await prisma.$transaction([
    prisma.book.findMany({
      where,
      orderBy,
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  const payload = {
    items: items.map(mapBook),
    meta: buildPageMeta(filters.page, filters.limit, total),
  };

  appCache.set(cacheKeys.books(queryKey), payload);
  return payload;
};

export const getBookBySlug = async (slug: string) => {
  const cached = appCache.get<unknown>(cacheKeys.book(slug));

  if (cached) {
    return cached;
  }

  const book = await prisma.book.findUnique({
    where: { slug },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      reviews: {
        orderBy: {
          createdAt: "desc",
        },
        take: 6,
      },
    },
  });

  if (!book) {
    return null;
  }

  const categorySlugs = book.categories.map(({ category }) => category.slug);

  const related = await prisma.book.findMany({
    where: {
      id: { not: book.id },
      categories: {
        some: {
          category: {
            slug: {
              in: categorySlugs,
            },
          },
        },
      },
    },
    take: 4,
    orderBy: [{ rating: "desc" }, { publishedAt: "desc" }],
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  const payload = {
    book: mapBook(book),
    related: related.map(mapBook),
  };

  appCache.set(cacheKeys.book(slug), payload);
  return payload;
};

export const getFeaturedBooks = async () => {
  const cached = appCache.get<unknown>(cacheKeys.featured);

  if (cached) {
    return cached;
  }

  const books = await prisma.book.findMany({
    where: { featured: true },
    take: 8,
    orderBy: [{ spotlight: "desc" }, { publishedAt: "desc" }],
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
  });

  const payload = books.map(mapBook);
  appCache.set(cacheKeys.featured, payload);
  return payload;
};

export const listCategories = async () => {
  const cached = appCache.get<unknown>(cacheKeys.categories);

  if (cached) {
    return cached;
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          books: true,
        },
      },
    },
  });

  const payload = categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    heroImage: category.heroImage,
    bookCount: category._count.books,
  }));

  appCache.set(cacheKeys.categories, payload);
  return payload;
};

export const upsertBook = async (
  input: {
    title: string;
    author: string;
    publisher: string;
    synopsis: string;
    shortDescription: string;
    price: number;
    compareAtPrice?: number;
    inventory: number;
    pages: number;
    format: string;
    language: string;
    isbn: string;
    coverImage: string;
    gallery: string[];
    publishedAt: string;
    releaseLabel: string;
    location: string;
    featured: boolean;
    spotlight: boolean;
    aiSummary?: string;
    aiTags?: string[];
    categorySlugs: string[];
  },
  bookId?: string,
) => {
  const categorySlugs = [...new Set(input.categorySlugs)];
  const categories = await prisma.category.findMany({
    where: {
      slug: {
        in: categorySlugs,
      },
    },
  });

  if (categories.length !== categorySlugs.length) {
    throw new AppError(400, "Select valid categories before publishing this book.");
  }

  const slug = slugify(`${input.title}-${input.author}`, {
    lower: true,
    strict: true,
    trim: true,
  });

  const data = {
    slug,
    title: input.title,
    author: input.author,
    publisher: input.publisher,
    synopsis: input.synopsis,
    shortDescription: input.shortDescription,
    price: input.price,
    compareAtPrice: input.compareAtPrice ?? null,
    inventory: input.inventory,
    pages: input.pages,
    format: input.format,
    language: input.language,
    isbn: input.isbn,
    coverImage: input.coverImage,
    gallery: input.gallery,
    publishedAt: new Date(input.publishedAt),
    releaseLabel: input.releaseLabel,
    location: input.location,
    featured: input.featured,
    spotlight: input.spotlight,
    aiSummary: input.aiSummary,
    aiTags: input.aiTags ?? [],
  };

  let savedBook;

  try {
    savedBook = await prisma.$transaction(async (tx) => {
      const book = bookId
        ? await tx.book.update({
            where: { id: bookId },
            data,
          })
        : await tx.book.create({ data });

      await tx.bookCategory.deleteMany({
        where: { bookId: book.id },
      });

      await tx.bookCategory.createMany({
        data: categories.map((category) => ({
          bookId: book.id,
          categoryId: category.id,
        })),
      });

      return tx.book.findUniqueOrThrow({
        where: { id: book.id },
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      });
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        const target =
          Array.isArray(error.meta?.target) && error.meta.target.length > 0
            ? error.meta.target.join(", ")
            : "title, author, or ISBN";
        throw new AppError(409, `A book with the same ${target} already exists.`);
      }

      if (error.code === "P2025") {
        throw new AppError(404, "Book not found.");
      }
    }

    throw error;
  }

  appCache.flushAll();
  return mapBook(savedBook);
};

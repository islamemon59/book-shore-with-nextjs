import { appCache, cacheKeys } from "../../lib/cache.js";
import { prisma } from "../../lib/prisma.js";

export const getHomepageContent = async () => {
  const cached = appCache.get<unknown>(cacheKeys.homepage);

  if (cached) {
    return cached;
  }

  const [featuredBooks, spotlightBooks, categoryCount, reviewCount, blogPosts] = await prisma.$transaction([
    prisma.book.findMany({
      where: { featured: true },
      take: 8,
      orderBy: [{ spotlight: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.book.findMany({
      where: { spotlight: true },
      take: 4,
      orderBy: [{ rating: "desc" }, { publishedAt: "desc" }],
    }),
    prisma.category.count(),
    prisma.review.count(),
    prisma.blogPost.findMany({
      take: 3,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    }),
  ]);

  const payload = {
    stats: {
      featuredBooks: featuredBooks.length,
      categoryCount,
      reviewCount,
      averageRating:
        featuredBooks.length > 0
          ? Number(
              (
                featuredBooks.reduce((sum, book) => sum + Number(book.rating), 0) / featuredBooks.length
              ).toFixed(1),
            )
          : 0,
    },
    spotlight: spotlightBooks.map((book) => ({
      id: book.id,
      slug: book.slug,
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      price: Number(book.price),
      rating: Number(book.rating),
      releaseLabel: book.releaseLabel,
    })),
    journal: blogPosts,
  };

  appCache.set(cacheKeys.homepage, payload);
  return payload;
};

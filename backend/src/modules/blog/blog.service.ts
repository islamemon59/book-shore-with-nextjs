import { prisma } from "../../lib/prisma.js";

export const listBlogPosts = () =>
  prisma.blogPost.findMany({
    orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    take: 6,
  });

export const getBlogPostBySlug = (slug: string) =>
  prisma.blogPost.findUnique({
    where: {
      slug,
    },
  });

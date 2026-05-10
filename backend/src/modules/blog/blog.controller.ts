import type { Request, Response } from "express";
import { AppError } from "../../utils/http.js";
import { getBlogPostBySlug, listBlogPosts } from "./blog.service.js";

export const listBlogPostsController = async (_req: Request, res: Response) => {
  const items = await listBlogPosts();
  res.json({
    success: true,
    items,
  });
};

export const getBlogPostBySlugController = async (req: Request, res: Response) => {
  const item = await getBlogPostBySlug(String(req.params.slug));

  if (!item) {
    throw new AppError(404, "Article not found.");
  }

  res.json({
    success: true,
    item,
  });
};

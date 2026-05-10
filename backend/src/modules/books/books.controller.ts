import type { Request, Response } from "express";
import { AppError } from "../../utils/http.js";
import {
  getBookBySlug,
  getFeaturedBooks,
  listBooks,
  listCategories,
  upsertBook,
} from "./books.service.js";

export const listBooksController = async (req: Request, res: Response) => {
  const payload = (await listBooks(req.query as never)) as {
    items: unknown[];
    meta: unknown;
  };
  res.json({
    success: true,
    items: payload.items,
    meta: payload.meta,
  });
};

export const getFeaturedBooksController = async (_req: Request, res: Response) => {
  const items = await getFeaturedBooks();
  res.json({
    success: true,
    items,
  });
};

export const listCategoriesController = async (_req: Request, res: Response) => {
  const items = await listCategories();
  res.json({
    success: true,
    items,
  });
};

export const getBookBySlugController = async (req: Request, res: Response) => {
  const payload = (await getBookBySlug(String(req.params.slug))) as
    | {
        book: unknown;
        related: unknown[];
      }
    | null;

  if (!payload) {
    throw new AppError(404, "Book not found.");
  }

  res.json({
    success: true,
    book: payload.book,
    related: payload.related,
  });
};

export const createBookController = async (req: Request, res: Response) => {
  const item = await upsertBook(req.body);
  res.status(201).json({
    success: true,
    item,
  });
};

export const updateBookController = async (req: Request, res: Response) => {
  const item = await upsertBook(req.body, String(req.params.id));
  res.json({
    success: true,
    item,
  });
};

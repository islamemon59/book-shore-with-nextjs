import { Router } from "express";
import { requireRole } from "../../middlewares/require-role.js";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  createBookController,
  getBookBySlugController,
  getFeaturedBooksController,
  listBooksController,
  listCategoriesController,
  updateBookController,
} from "./books.controller.js";
import { bookSlugSchema, listBooksSchema, upsertBookSchema } from "./books.validation.js";

export const booksRouter = Router();

booksRouter.get("/", validateRequest(listBooksSchema), listBooksController);

booksRouter.get("/featured", getFeaturedBooksController);

booksRouter.get("/categories", listCategoriesController);

booksRouter.get("/:slug", validateRequest(bookSlugSchema), getBookBySlugController);

booksRouter.post(
  "/",
  requireSession,
  requireRole(["ADMIN", "MANAGER"]),
  validateRequest(upsertBookSchema),
  createBookController,
);

booksRouter.patch(
  "/:id",
  requireSession,
  requireRole(["ADMIN", "MANAGER"]),
  validateRequest(upsertBookSchema),
  updateBookController,
);

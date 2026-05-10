import { Router } from "express";
import { validateRequest } from "../../middlewares/validate-request.js";
import { getBlogPostBySlugController, listBlogPostsController } from "./blog.controller.js";
import { blogPostSlugSchema } from "./blog.validation.js";

export const blogRouter = Router();

blogRouter.get("/", listBlogPostsController);

blogRouter.get("/:slug", validateRequest(blogPostSlugSchema), getBlogPostBySlugController);

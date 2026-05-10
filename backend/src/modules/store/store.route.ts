import { Router } from "express";
import { getHomepageContentController } from "./store.controller.js";

export const storeRouter = Router();

storeRouter.get("/home", getHomepageContentController);

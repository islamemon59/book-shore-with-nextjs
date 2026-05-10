import type { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js";
import { AppError } from "../utils/http.js";

export const attachSession = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    req.authSession = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    next();
  } catch (error) {
    next(error);
  }
};

export const requireSession = async (req: Request, res: Response, next: NextFunction) => {
  await attachSession(req, res, async (error?: unknown) => {
    if (error) {
      next(error);
      return;
    }

    if (!req.authSession?.user) {
      next(new AppError(401, "Authentication is required for this action."));
      return;
    }

    next();
  });
};

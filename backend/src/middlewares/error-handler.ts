import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger.js";
import { AppError } from "../utils/http.js";

export const notFoundHandler = (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "The requested resource was not found.",
  });
};

export const errorHandler = (error: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      details: error.details,
    });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation error",
      details: error.flatten(),
    });
    return;
  }

  logger.error({ error, path: req.path }, "Unhandled API error");

  res.status(500).json({
    success: false,
    message: "Something went wrong on the server.",
  });
};

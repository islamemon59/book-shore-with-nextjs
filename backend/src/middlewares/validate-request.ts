import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../utils/http.js";

export const validateRequest =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      return next(new AppError(400, "Request validation failed", result.error.flatten()));
    }

    const data = result.data as {
      body: Request["body"];
      query: Request["query"];
      params: Request["params"];
    };

    req.body = data.body;
    Object.defineProperty(req, "query", {
      value: data.query,
      configurable: true,
      writable: true,
      enumerable: true,
    });
    Object.defineProperty(req, "params", {
      value: data.params,
      configurable: true,
      writable: true,
      enumerable: true,
    });
    next();
  };

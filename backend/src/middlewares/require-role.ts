import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/http.js";

export const requireRole =
  (roles: string[]) => (req: Request, _res: Response, next: NextFunction) => {
    const userRole = (req.authSession?.user as { role?: string } | undefined)?.role;

    if (!userRole || !roles.includes(userRole)) {
      return next(new AppError(403, "You do not have permission to access this resource."));
    }

    next();
  };

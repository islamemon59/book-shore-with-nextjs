import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createRequire } from "node:module";
import { toNodeHandler } from "better-auth/node";
import type { RequestHandler } from "express";
import type { Options as RateLimitOptions, RateLimitRequestHandler } from "express-rate-limit";
import type { HelmetOptions } from "helmet";
import { env } from "./config/env.js";
import { auth } from "./lib/auth.js";
import { logger } from "./lib/logger.js";
import { errorHandler, notFoundHandler } from "./middlewares/error-handler.js";
import { aiRouter } from "./modules/ai/ai.route.js";
import { blogRouter } from "./modules/blog/blog.route.js";
import { booksRouter } from "./modules/books/books.route.js";
import { cartRouter } from "./modules/cart/cart.route.js";
import { dashboardRouter } from "./modules/dashboard/dashboard.route.js";
import { healthRouter } from "./modules/health/health.route.js";
import { notificationsRouter } from "./modules/notifications/notifications.route.js";
import { ordersRouter } from "./modules/orders/orders.route.js";
import { storeRouter } from "./modules/store/store.route.js";
import { usersRouter } from "./modules/users/users.route.js";

const require = createRequire(import.meta.url);
const helmet = require("helmet") as (options?: Readonly<HelmetOptions>) => RequestHandler;
const rateLimit = require("express-rate-limit") as (options?: Partial<RateLimitOptions>) => RateLimitRequestHandler;

export const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

app.use(compression());
app.use(cookieParser());
app.use((req, res, next) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt,
      },
      "Handled HTTP request",
    );
  });

  next();
});

// Better Auth must be mounted before express.json().
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: "draft-8",
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    service: "bookshore-backend",
    health: "/api/health",
  });
});

app.use("/api/health", healthRouter);
app.use("/api/store", storeRouter);
app.use("/api/books", booksRouter);
app.use("/api/blog", blogRouter);
app.use("/api/users", usersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/ai", aiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;

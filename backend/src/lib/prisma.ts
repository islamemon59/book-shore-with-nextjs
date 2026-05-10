import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

declare global {
  // Reuse Prisma during hot reload in development.
  // eslint-disable-next-line no-var
  var __bookshorePrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__bookshorePrisma__ ??
  new PrismaClient({
    log: ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__bookshorePrisma__ = prisma;
}

prisma.$on("error", (event: unknown) => {
  logger.error({ event }, "Prisma emitted a runtime error");
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectPrismaWithRetry = async (maxAttempts = 6) => {
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await prisma.$connect();

      if (attempt > 1) {
        logger.info({ attempt }, "Connected to Prisma after retry");
      }

      return;
    } catch (error) {
      lastError = error;
      const delayMs = Math.min(1000 * 2 ** (attempt - 1), 8000);

      logger.warn(
        {
          attempt,
          maxAttempts,
          delayMs,
          error,
        },
        "Prisma connection attempt failed",
      );

      if (attempt < maxAttempts) {
        await sleep(delayMs);
      }
    }
  }

  throw lastError;
};

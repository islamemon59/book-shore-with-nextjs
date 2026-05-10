import type { IncomingMessage, ServerResponse } from "node:http";
import { app } from "../src/app.js";
import { ensureAdminUser } from "../src/lib/bootstrap-admin.js";
import { logger } from "../src/lib/logger.js";
import { connectPrismaWithRetry } from "../src/lib/prisma.js";

let bootstrapPromise: Promise<void> | null = null;

const bootstrap = async () => {
  await connectPrismaWithRetry();
  await ensureAdminUser();
};

const getBootstrapPromise = () => {
  if (!bootstrapPromise) {
    bootstrapPromise = bootstrap().catch((error) => {
      bootstrapPromise = null;
      throw error;
    });
  }

  return bootstrapPromise;
};

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    await getBootstrapPromise();
    app(req, res);
  } catch (error) {
    logger.error({ error }, "Failed to initialize Vercel function");

    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
    }

    res.end(JSON.stringify({ message: "Failed to initialize application." }));
  }
};

export default handler;

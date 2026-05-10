import { env } from "./config/env.js";
import { app } from "./app.js";
import { ensureAdminUser } from "./lib/bootstrap-admin.js";
import { logger } from "./lib/logger.js";
import { connectPrismaWithRetry, prisma } from "./lib/prisma.js";
import { startQueueWorkers } from "./lib/queue.js";

const bootstrap = async () => {
  await connectPrismaWithRetry();
  await ensureAdminUser();

  const worker = startQueueWorkers();
  const server = app.listen(env.PORT, () => {
    logger.info(`BookShore backend listening on http://localhost:${env.PORT}`);
  });

  const shutdown = async () => {
    logger.info("Shutting down backend...");
    await worker?.close();
    await prisma.$disconnect();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

bootstrap().catch(async (error) => {
  logger.error({ error }, "Failed to start backend");
  await prisma.$disconnect();
  process.exit(1);
});

import { Queue, Worker, type JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

type QueuePayload = {
  orderId: string;
  userId: string;
  orderNumber: string;
};

type OrderEventQueue = {
  add: (name: "order-confirmation", payload: QueuePayload, options?: JobsOptions) => Promise<unknown>;
  close?: () => Promise<void>;
};

const processOrderEvent = async (payload: QueuePayload, jobId?: string) => {
  logger.info({ jobId, orderNumber: payload.orderNumber }, "Processed order queue job");
};

const createInMemoryOrderQueue = (): OrderEventQueue => {
  let isClosed = false;
  let jobCounter = 0;

  return {
    async add(_name, payload) {
      if (isClosed) {
        throw new Error("In-memory order queue is closed.");
      }

      const jobId = `local-${++jobCounter}`;
      queueMicrotask(() => {
        void processOrderEvent(payload, jobId);
      });

      return { id: jobId };
    },
    async close() {
      isClosed = true;
    },
  };
};

const redisConnection = env.REDIS_URL
  ? new (IORedis as any)(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
      enableOfflineQueue: false,
      retryStrategy: () => null,
    })
  : null;

redisConnection?.on("error", (error: Error) => {
  logger.warn(
    { error: error.message, redisUrl: env.REDIS_URL },
    "Redis connection failed. Queue features are unavailable.",
  );
});

export const orderQueue = redisConnection
  ? new Queue<QueuePayload>("order-events", { connection: redisConnection })
  : createInMemoryOrderQueue();

export const enqueueOrderEvent = async (payload: QueuePayload) => {
  try {
    await orderQueue.add("order-confirmation", payload, {
      attempts: 3,
      removeOnComplete: 100,
      removeOnFail: 100,
    });
  } catch (error) {
    logger.warn({ error, payload }, "Failed to enqueue order event. Continuing without queue processing.");
    return { queued: false };
  }

  return { queued: true };
};

export const startQueueWorkers = () => {
  if (!redisConnection) {
    logger.info("Using in-memory order event queue. Redis is not required for local development.");
    return orderQueue.close ? { close: orderQueue.close } : null;
  }

  const worker = new Worker<QueuePayload>(
    "order-events",
    async (job) => processOrderEvent(job.data, job.id),
    { connection: redisConnection },
  );

  worker.on("error", (error) => {
    logger.warn({ error }, "BullMQ worker could not connect to Redis.");
  });

  return worker;
};

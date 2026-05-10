import pino from "pino";
import { isProduction } from "../config/env.js";

// Use pretty logs locally and structured JSON in production.
export const logger = pino(
  isProduction
    ? { level: "info" }
    : {
        level: "debug",
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      },
);

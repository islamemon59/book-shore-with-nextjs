import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { env } from "../config/env.js";
import { logger } from "./logger.js";
import { prisma } from "./prisma.js";

const googleProvider =
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

const facebookProvider =
  env.FACEBOOK_CLIENT_ID && env.FACEBOOK_CLIENT_SECRET
    ? {
        facebook: {
          clientId: env.FACEBOOK_CLIENT_ID,
          clientSecret: env.FACEBOOK_CLIENT_SECRET,
        },
      }
    : {};

// Better Auth powers credentials and social login from the standalone backend.
export const auth = betterAuth({
  appName: "BookShore",
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: [env.FRONTEND_URL, env.BETTER_AUTH_URL],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      logger.info({ email: user.email, resetUrl: url }, "Password reset requested");
    },
  },
  socialProviders: {
    ...googleProvider,
    ...facebookProvider,
  } as never,
  user: {
    additionalFields: {
      role: {
        type: ["USER", "ADMIN", "MANAGER"],
        defaultValue: "USER",
        input: false,
      },
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "facebook", "credential"],
    },
  },
  rateLimit: {
    enabled: true,
    window: 10,
    max: 100,
    storage: "memory",
  },
  logger: {
    level: "warn",
    log: (level, message, ...args) => {
      logger[level === "error" ? "error" : "warn"]({ args }, message);
    },
  },
  onAPIError: {
    onError: (error) => {
      logger.error({ error }, "Better Auth request failed");
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;

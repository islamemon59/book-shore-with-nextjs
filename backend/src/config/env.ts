import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env", quiet: true });
dotenv.config({ path: ".env.local", override: true, quiet: true });

const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined))
  .pipe(z.string().url().optional());

const optionalBooleanSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value === undefined || value.length === 0 ? undefined : value === "true"));

// Centralized env parsing keeps runtime failures obvious and early.
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  DATABASE_URL: z.string().min(1),
  DIRECT_URL: optionalUrlSchema,
  FRONTEND_URL: z.string().url(),
  BETTER_AUTH_URL: z.string().url(),
  BETTER_AUTH_SECRET: z.string().min(16),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_CLIENT_ID: z.string().optional(),
  FACEBOOK_CLIENT_SECRET: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5.2"),
  REDIS_URL: optionalUrlSchema,
  SSLCOMMERZ_STORE_ID: z.string().trim().optional(),
  SSLCOMMERZ_STORE_PASSWORD: z.string().trim().optional(),
  SSLCOMMERZ_SANDBOX: optionalBooleanSchema.default(true),
  SSLCOMMERZ_CURRENCY: z.string().trim().min(3).max(3).default("BDT"),
  ADMIN_NAME: z.string().trim().min(1).default("Ava Bennett"),
  ADMIN_EMAIL: z.string().trim().email().default("admin@bookshore.dev"),
  ADMIN_PASSWORD: z.string().min(8).default("Admin123!"),
  ADMIN_IMAGE: optionalUrlSchema.default(
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`);
}

export const env = parsedEnv.data;
export const isProduction = env.NODE_ENV === "production";

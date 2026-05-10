import type { AuthSession } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      authSession?: AuthSession | null;
    }
  }
}

export {};

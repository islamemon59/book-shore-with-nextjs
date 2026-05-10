"use client";

import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { appConfig } from "./config";

const authBaseUrl =
  typeof window === "undefined" ? appConfig.authBaseUrl : new URL("/api/auth", window.location.origin).toString();

export const authClient = createAuthClient({
  baseURL: authBaseUrl,
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: "string",
          required: false,
        },
      },
    }),
  ],
});

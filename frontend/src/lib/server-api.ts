import { cookies } from "next/headers";
import { appConfig } from "./config";

type FetchOptions = {
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

export const serverFetch = async <T>(path: string, options: FetchOptions = {}) => {
  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    cache: options.cache,
    next: options.next,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || `Failed to fetch ${path}`);
  }

  return (await response.json()) as T;
};

export const authFetch = async <T>(path: string, init?: RequestInit) => {
  const cookieStore = await cookies();

  const response = await fetch(`${appConfig.apiBaseUrl}${path}`, {
    ...init,
    headers: {
      cookie: cookieStore.toString(),
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.message || `Failed to fetch ${path}`);
  }

  return (await response.json()) as T;
};

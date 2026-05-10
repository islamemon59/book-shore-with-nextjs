import { appConfig } from "./config";

type RequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  target?: "backend" | "same-origin";
};

export const clientFetch = async <T>(path: string, options: RequestOptions = {}) => {
  const { body, target, ...init } = options;
  const baseUrl = target === "backend" ? appConfig.publicApiBaseUrl : "/api/proxy";

  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed.");
  }

  return payload as T;
};

import { redirect } from "next/navigation";
import type { AppSession } from "./types";
import { authFetch } from "./server-api";

export const getServerSession = async () => {
  try {
    return await authFetch<AppSession>("/api/auth/get-session");
  } catch {
    return null;
  }
};

export const requireServerSession = async () => {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
};

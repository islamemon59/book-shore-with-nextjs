import { redirect } from "next/navigation";
import { BookPublishForm } from "@/components/dashboard/book-publish-form";
import { getServerSession } from "@/lib/auth";
import { serverFetch } from "@/lib/server-api";
import type { Category } from "@/lib/types";

export default async function DashboardCatalogPublishPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === "USER") {
    redirect("/dashboard");
  }

  const response = await serverFetch<{ items: Category[] }>("/api/books/categories", {
    cache: "no-store",
  });

  return <BookPublishForm categories={response.items} />;
}

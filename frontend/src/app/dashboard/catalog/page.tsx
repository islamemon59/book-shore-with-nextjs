import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogAiTools } from "@/components/dashboard/catalog-ai-tools";
import { CatalogTable } from "@/components/dashboard/catalog-table";
import { Button } from "@/components/ui/button";
import { getServerSession } from "@/lib/auth";

export default async function DashboardCatalogPage() {
  const session = await getServerSession();

  if (session?.user?.role === "USER") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div className="card-surface soft-panel flex flex-wrap items-start justify-between gap-4 p-6">
        <div>
          <div className="eyebrow">Catalog workspace</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Manage and publish books</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
            Review the current catalog, use AI helpers for merchandising, and publish brand-new titles from the
            dashboard.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/catalog/new">Publish new book</Link>
        </Button>
      </div>
      <CatalogAiTools />
      <CatalogTable />
    </div>
  );
}

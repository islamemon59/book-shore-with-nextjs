import Link from "next/link";
import { WandSparkles } from "lucide-react";
import { serverFetch } from "@/lib/server-api";
import type { Category } from "@/lib/types";

export async function FeaturedShelvesStrip() {
  let categoryResponse: { items: Category[] } = { items: [] };

  try {
    categoryResponse = await serverFetch<{ items: Category[] }>("/api/books/categories", {
      next: { revalidate: 3600, tags: ["categories"] },
    });
  } catch {
    categoryResponse = { items: [] };
  }

  const featuredCategories = categoryResponse.items.slice(0, 6);

  if (featuredCategories.length === 0) {
    return null;
  }

  return (
    <section className="border-b border-white/40 bg-[color:color-mix(in_srgb,var(--background)_82%,white_18%)]">
      <div className="section-shell py-4">
        <div className="scrollbar-none flex items-center gap-2 overflow-x-auto whitespace-nowrap">
          <div className="inline-flex shrink-0 items-center gap-2 rounded-full border bg-white/55 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--foreground)]">
            <WandSparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Featured shelves
          </div>
          {featuredCategories.map((category) => (
            <Link
              key={category.id}
              href={`/explore?category=${category.slug}`}
              className="shrink-0 rounded-full border bg-white/45 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--primary)]"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

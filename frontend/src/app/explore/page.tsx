import Link from "next/link";
import { ArrowRight, BookOpenText, Sparkles } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { BookCard } from "@/components/books/book-card";
import { ExploreFilters } from "@/components/explore/explore-filters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { serverFetch } from "@/lib/server-api";
import type { Book, Category, PaginationMeta } from "@/lib/types";

type ExplorePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamic = "force-dynamic";

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      query.set(key, value);
    }
  });

  if (!query.get("limit")) {
    query.set("limit", "12");
  }

  const [bookResponse, categoryResponse] = await Promise.all([
    serverFetch<{ items: Book[]; meta: PaginationMeta }>(`/api/books?${query.toString()}`, {
      cache: "no-store",
    }),
    serverFetch<{ items: Category[] }>("/api/books/categories", {
      next: { revalidate: 3600, tags: ["categories"] },
    }),
  ]);

  const currentPage = Number(query.get("page") ?? "1");
  const nextPage = currentPage < bookResponse.meta.totalPages ? currentPage + 1 : null;

  const pageHref = (page: number) => {
    const nextQuery = new URLSearchParams(query.toString());
    nextQuery.set("page", String(page));
    return `/explore?${nextQuery.toString()}`;
  };

  return (
    <SiteShell>
      <section className="section-shell py-12">
        <div className="card-surface hero-panel mb-8 overflow-hidden p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr,0.7fr] lg:items-end">
            <div>
              <div className="eyebrow">Explore the catalog</div>
              <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold text-balance">
                Browse like you are moving through an elegant indie shop, not an endless generic grid.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-8 text-[var(--muted-foreground)]">
                Search across books, authors, and topics. Refine by format, rating, category, and price range. Then use cleaner merchandising cues to compare titles with less friction.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                "Large cover-first browsing",
                "Premium filters with active pills",
                "AI-ready discovery cues",
              ].map((item) => (
                <div key={item} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/68 px-4 py-3 text-sm text-[var(--foreground)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <ExploreFilters categories={categoryResponse.items} />

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">
              Showing {bookResponse.items.length} of {bookResponse.meta.total}
            </Badge>
            <Badge>Page {bookResponse.meta.page}</Badge>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Sparkles className="h-4 w-4 text-[var(--accent)]" />
            Better-rated and more giftable books tend to surface with a 4-star floor.
          </div>
        </div>

        {bookResponse.items.length === 0 ? (
          <div className="card-surface mt-8 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
              <BookOpenText className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold">No books matched this shelf view.</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Try clearing one or two filters, widening your price range, or searching a broader theme.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/explore">Reset the catalog view</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {bookResponse.items.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                Showing {bookResponse.items.length} of {bookResponse.meta.total} curated titles so far.
              </p>
              {nextPage ? (
                <Button asChild size="lg" className="rounded-full">
                  <Link href={pageHref(nextPage)}>
                    Load more books
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="rounded-full border bg-white/60 px-5 py-3 text-sm text-[var(--muted-foreground)]">
                  You&apos;ve reached the end of this shelf.
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </SiteShell>
  );
}

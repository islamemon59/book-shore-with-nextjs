"use client";

import { Search, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import type { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RatingStars } from "@/components/ui/rating-stars";

const sortOptions = [
  { value: "featured", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "priceAsc", label: "Price: low to high" },
  { value: "priceDesc", label: "Price: high to low" },
  { value: "ratingDesc", label: "Best-rated" },
];

const formatOptions = ["Hardcover", "Paperback"];
const ratingOptions = [5, 4, 3];

export function ExploreFilters({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (deferredSearch) {
      params.set("search", deferredSearch);
    } else {
      params.delete("search");
    }

    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [deferredSearch, pathname, router, searchParams]);

  const updateParam = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const applyPriceRange = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }
    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const activeFilters = useMemo(
    () =>
      [
        { key: "category", value: searchParams.get("category") },
        { key: "format", value: searchParams.get("format") },
        { key: "minRating", value: searchParams.get("minRating") ? `${searchParams.get("minRating")}+ stars` : null },
        [
          {
            key: "price",
            value:
              searchParams.get("minPrice") || searchParams.get("maxPrice")
                ? `$${searchParams.get("minPrice") ?? "0"} - $${searchParams.get("maxPrice") ?? "Any"}`
                : null,
          },
        ],
      ].flat().filter((item) => Boolean(item.value)),
    [searchParams],
  );

  const clearFilter = (key: string) => {
    if (key === "price") {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("minPrice");
      params.delete("maxPrice");
      params.set("page", "1");
      setMinPrice("");
      setMaxPrice("");
      router.replace(`${pathname}?${params.toString()}`);
      return;
    }

    updateParam(key, undefined);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[18.5rem,1fr]">
      <aside className="card-surface soft-panel h-fit p-5 lg:sticky lg:top-32">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)]">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div>
            <div className="eyebrow">Refine the shelf</div>
            <div className="font-serif text-2xl font-semibold">Advanced Filters</div>
          </div>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Category
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => updateParam("category", undefined)}
                className={`rounded-full border px-3 py-2 text-sm ${
                  !searchParams.get("category")
                    ? "border-[var(--accent)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-white/50 text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--primary)]"
                }`}
              >
                All categories
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => updateParam("category", category.slug)}
                  className={`rounded-full border px-3 py-2 text-left text-sm ${
                    searchParams.get("category") === category.slug
                      ? "border-[var(--accent)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "bg-white/50 text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--primary)]"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Price range
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input value={minPrice} onChange={(event) => setMinPrice(event.target.value)} placeholder="Min" inputMode="numeric" />
              <Input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max" inputMode="numeric" />
            </div>
            <Button type="button" variant="outline" className="mt-3 w-full" onClick={applyPriceRange}>
              Apply price
            </Button>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Format
            </div>
            <div className="grid gap-2">
              {formatOptions.map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => updateParam("format", searchParams.get("format") === format ? undefined : format)}
                  className={`flex items-center justify-between rounded-[calc(var(--radius)-0.35rem)] border px-4 py-3 text-sm ${
                    searchParams.get("format") === format
                      ? "border-[var(--accent)] bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                      : "bg-white/50 text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--primary)]"
                  }`}
                >
                  <span>{format}</span>
                  <span className="text-xs uppercase tracking-[0.18em]">Edition</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Rating
            </div>
            <div className="grid gap-2">
              {ratingOptions.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() =>
                    updateParam("minRating", searchParams.get("minRating") === String(value) ? undefined : String(value))
                  }
                  className={`flex items-center justify-between rounded-[calc(var(--radius)-0.35rem)] border px-4 py-3 ${
                    searchParams.get("minRating") === String(value)
                      ? "border-[var(--accent)] bg-[var(--secondary)]"
                      : "bg-white/50 hover:border-[var(--accent)]"
                  }`}
                >
                  <RatingStars rating={value} showValue={false} />
                  <span className="text-sm text-[var(--muted-foreground)]">& up</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <div>
        <div className="card-surface soft-panel p-5">
          <div className="grid gap-4 xl:grid-cols-[1.3fr,0.7fr]">
            <div className="space-y-4">
              <label className="relative block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--accent)]" />
                <Input
                  className="h-[52px] rounded-full bg-white/78 pl-11 pr-12"
                  placeholder="Search books, authors, topics..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : null}
              </label>

              <div className="flex flex-wrap gap-2">
                {activeFilters.length > 0 ? (
                  activeFilters.map((filter) => (
                    <button
                      key={filter.key}
                      type="button"
                      onClick={() => clearFilter(filter.key)}
                      className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]"
                    >
                      {filter.value}
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ))
                ) : (
                  <div className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
                    <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                    No active filters. Start with a mood, author, or price range.
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  Sort by
                </div>
                <select
                  className="h-11 w-full rounded-[calc(var(--radius)-0.28rem)] border bg-white/72 px-4 text-sm shadow-[var(--shadow-sm)]"
                  defaultValue={searchParams.get("sort") ?? "featured"}
                  onChange={(event) => updateParam("sort", event.target.value)}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/58 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  Shelf note
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                  Try combining a premium format with a 4-star filter to surface stronger gift picks quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

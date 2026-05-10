"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/ui/rating-stars";
import type { Review } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const filterOptions = ["All", "5", "4", "3"];
const sortOptions = [
  { label: "Helpful", value: "helpful" },
  { label: "Recent", value: "recent" },
  { label: "Highest Rated", value: "rated" },
];

export function ReviewsPanel({ reviews = [] }: { reviews?: Review[] }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("recent");

  const items = useMemo(() => {
    const next = reviews.filter((review) => (filter === "All" ? true : review.rating === Number(filter)));

    if (sort === "rated") {
      return [...next].sort((a, b) => b.rating - a.rating);
    }

    return [...next].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }, [filter, reviews, sort]);

  return (
    <div className="card-surface soft-panel p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="eyebrow">Reader reviews</div>
          <h2 className="mt-3 font-serif text-3xl font-semibold">What readers are saying</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((option) => (
            <Button
              key={option}
              type="button"
              variant={filter === option ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(option)}
            >
              {option === "All" ? "All" : `${option} star`}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p className="text-sm text-[var(--muted-foreground)]">{items.length} reviews in this view</p>
        <select
          className="h-11 rounded-[calc(var(--radius)-0.28rem)] border bg-white/72 px-4 text-sm shadow-[var(--shadow-sm)]"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-5">
        {items.map((review) => (
          <div key={review.id} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/60 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="font-semibold">{review.userName}</div>
                  {review.verifiedPurchase ? <Badge variant="secondary">Verified purchase</Badge> : null}
                </div>
                <div className="mt-1 text-sm text-[var(--muted-foreground)]">{review.userTitle}</div>
              </div>
              <div className="text-sm text-[var(--muted-foreground)]">{formatDate(review.createdAt)}</div>
            </div>
            <RatingStars rating={review.rating} className="mt-4" />
            <div className="mt-4 font-semibold">{review.title}</div>
            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{review.body}</p>
            <div className="mt-4 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              15 readers found this helpful
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

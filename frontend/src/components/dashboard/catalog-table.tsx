"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type CatalogRow = {
  id: string;
  title: string;
  author: string;
  inventory: number;
  price: number;
  rating: number;
  featured: boolean;
  updatedAt: string;
};

type ResponsePayload = {
  items: CatalogRow[];
  meta: {
    page: number;
    totalPages: number;
  };
};

export function CatalogTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["dashboard-catalog", page, search],
    queryFn: () => clientFetch<ResponsePayload>(`/api/dashboard/books?page=${page}&limit=10&search=${encodeURIComponent(search)}`),
  });

  return (
    <div className="card-surface soft-panel p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-3xl font-semibold">Catalog titles</h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">Search the live inventory and jump into publishing when a new release is ready.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/catalog/new">Publish new book</Link>
        </Button>
      </div>
      <div className="mb-4 grid gap-3 lg:grid-cols-[1fr,16rem]">
        <Input placeholder="Search by title, author, or ISBN" value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="rounded-[calc(var(--radius)-0.3rem)] border bg-white/60 px-4 py-3 text-sm text-[var(--muted-foreground)] dark:bg-[rgba(255,255,255,0.06)]">
          Catalog search keeps the overview fast and skim-friendly.
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b">
            <tr className="text-left text-[var(--muted-foreground)]">
              <th className="pb-3">Title</th>
              <th className="pb-3">Author</th>
              <th className="pb-3">Inventory</th>
              <th className="pb-3">Price</th>
              <th className="pb-3">Rating</th>
              <th className="pb-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {query.isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                  Loading catalog books...
                </td>
              </tr>
            ) : null}
            {query.isError ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-[var(--danger)]">
                  Unable to load catalog data right now.
                </td>
              </tr>
            ) : null}
            {!query.isLoading && !query.isError && query.data?.items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-[var(--muted-foreground)]">
                  No books matched this search yet.
                </td>
              </tr>
            ) : null}
            {query.data?.items.map((item) => (
              <tr key={item.id} className="border-t border-white/40">
                <td className="py-4 font-semibold">{item.title}</td>
                <td className="py-4">{item.author}</td>
                <td className="py-4">
                  <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] dark:bg-[rgba(255,255,255,0.08)]">
                    {item.inventory} in stock
                  </span>
                </td>
                <td className="py-4">{formatCurrency(item.price)}</td>
                <td className="py-4">{item.rating.toFixed(1)}</td>
                <td className="py-4">{formatDate(item.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= (query.data?.meta.totalPages ?? 1)}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

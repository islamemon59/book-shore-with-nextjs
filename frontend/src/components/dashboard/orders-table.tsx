"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { clientFetch } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/utils";

type OrderRow = {
  id: string;
  orderNumber: string;
  customer: string;
  status: string;
  paymentStatus: string;
  itemCount: number;
  total: number;
  createdAt: string;
};

type ResponsePayload = {
  items: OrderRow[];
  meta: {
    page: number;
    totalPages: number;
  };
};

export function OrdersTable({ dashboardView = false }: { dashboardView?: boolean }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const query = useQuery({
    queryKey: ["dashboard-orders", page, search, status],
    queryFn: () =>
      clientFetch<ResponsePayload>(
        `/api/dashboard/orders?page=${page}&limit=${dashboardView ? 5 : 10}&search=${encodeURIComponent(search)}&status=${status}`,
      ),
  });

  return (
    <div className="card-surface soft-panel p-6">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row">
        <Input placeholder="Search by order number" value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="h-11 rounded-[calc(var(--radius)-0.28rem)] border bg-white/72 px-4 text-sm text-[var(--foreground)] dark:bg-[rgba(255,255,255,0.08)]"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Any status</option>
            <option value="PROCESSING">Pending</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
          </select>
          <div className="rounded-[calc(var(--radius)-0.3rem)] border bg-white/62 px-4 py-3 text-sm text-[var(--muted-foreground)] dark:bg-[rgba(255,255,255,0.06)]">
            Filter by lifecycle stage and search by order number.
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="border-b">
            <tr className="text-left text-[var(--muted-foreground)]">
              <th className="pb-3">Order</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Items</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {query.data?.items.map((item) => (
              <tr key={item.id} className="border-t border-white/40">
                <td className="py-4 font-semibold">{item.orderNumber}</td>
                <td className="py-4">{item.customer}</td>
                <td className="py-4">
                  <span className="rounded-full border bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] dark:bg-[rgba(255,255,255,0.08)]">
                    {item.status}
                  </span>
                </td>
                <td className="py-4">{item.itemCount}</td>
                <td className="py-4">{formatCurrency(item.total)}</td>
                <td className="py-4">{formatDate(item.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-[var(--muted-foreground)]">Filterable, paginated order history</p>
        <div className="flex gap-2">
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
    </div>
  );
}

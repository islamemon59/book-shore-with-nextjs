"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { clientFetch } from "@/lib/client-api";
import type { CheckoutOrder } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

type State =
  | { status: "loading" }
  | { status: "success"; order: CheckoutOrder }
  | { status: "error"; message: string };

export function CheckoutSuccessPanel({ tranId, valId }: { tranId: string; valId: string }) {
  const [state, setState] = useState<State>(
    tranId && valId ? { status: "loading" } : { status: "error", message: "Missing SSLCommerz payment details." },
  );

  useEffect(() => {
    if (!tranId || !valId) {
      return;
    }

    let active = true;

    clientFetch<{ item: CheckoutOrder }>("/api/checkout/complete", {
      method: "POST",
      body: { tranId, valId },
      target: "same-origin",
    })
      .then((response) => {
        if (active) {
          setState({
            status: "success",
            order: response.item,
          });
        }
      })
      .catch((error) => {
        if (active) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to complete your order.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [tranId, valId]);

  if (state.status === "loading") {
    return (
      <div className="card-surface soft-panel flex min-h-80 flex-col items-center justify-center gap-4 p-10 text-center">
        <LoaderCircle className="h-8 w-8 animate-spin text-[var(--primary)]" />
        <div>
          <h1 className="font-serif text-4xl font-semibold">Finalizing your order</h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            Your payment is confirmed. We are creating the order in BookShore now.
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="card-surface soft-panel p-10 text-center">
        <h1 className="font-serif text-4xl font-semibold">We could not finalize the order yet.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
          {state.message}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/cart">Back to cart</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/support">Contact support</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface soft-panel p-10 text-center">
      <div className="eyebrow">Order confirmed</div>
      <h1 className="mt-3 font-serif text-5xl font-semibold">Payment received and order created.</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
        Your order <strong>{state.order.orderNumber}</strong> is now in processing and available inside your dashboard.
      </p>

      <div className="mx-auto mt-8 grid max-w-2xl gap-4 rounded-[calc(var(--radius)-0.25rem)] border bg-white/75 p-6 sm:grid-cols-3">
        <div>
          <div className="text-[10px] uppercase tracking-normal text-[var(--muted-foreground)]">Order number</div>
          <div className="mt-2 font-semibold">{state.order.orderNumber}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-normal text-[var(--muted-foreground)]">Status</div>
          <div className="mt-2 font-semibold">{state.order.status}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-normal text-[var(--muted-foreground)]">Placed</div>
          <div className="mt-2 font-semibold">{formatDate(state.order.createdAt)}</div>
        </div>
      </div>

      <div className="mt-5 text-lg font-semibold">{formatCurrency(state.order.total)}</div>

      <div className="mt-8 flex justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/orders">Track order</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/explore">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

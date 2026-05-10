"use client";

import Image from "next/image";
import Link from "next/link";
import { Bookmark, Minus, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { calculateCartSummary } from "@/lib/checkout";
import { clientFetch } from "@/lib/client-api";
import type { CartResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { formatCurrency } from "@/lib/utils";

export function CartLineItems({ initialCart }: { initialCart: CartResponse }) {
  const router = useRouter();
  const summary = calculateCartSummary(initialCart.items);

  const refreshCart = () => {
    router.refresh();
  };

  const updateMutation = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      clientFetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        body: { quantity },
      }),
    onSuccess: refreshCart,
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to update quantity.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (itemId: string) =>
      clientFetch(`/api/cart/${itemId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      toast.success("Item removed from cart.");
      refreshCart();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to remove item.");
    },
  });

  if (initialCart.items.length === 0) {
    return (
      <div className="space-y-8">
        <div className="card-surface soft-panel p-10 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
            <Bookmark className="h-8 w-8" />
          </div>
          <h2 className="mt-5 font-serif text-3xl font-semibold">Your cart is empty</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
            The shelf is waiting. Add a few books to unlock your order summary, secure checkout, and AI-guided recommendations.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link href="/explore">Explore books</Link>
          </Button>
        </div>

        <div className="card-surface soft-panel p-6">
          <div className="eyebrow">Recommended for you</div>
          <h3 className="mt-3 font-serif text-3xl font-semibold">Start with the featured shelves.</h3>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/explore?sort=featured">Featured arrivals</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/explore?minRating=4">Top-rated books</Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/explore?format=Hardcover">Giftable hardcovers</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr,0.65fr]">
      <div className="space-y-4">
        {initialCart.items.map((item) => {
          const isUpdating = updateMutation.isPending || removeMutation.isPending;

          return (
            <div
              key={item.id}
              className="card-surface soft-panel grid grid-cols-[76px,minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[84px,minmax(0,1fr),auto] sm:gap-5 sm:p-5"
            >
              <div className="relative h-[104px] w-[76px] overflow-hidden rounded-[calc(var(--radius)-0.25rem)] sm:h-28 sm:w-[84px]">
                <Image src={item.book.coverImage} alt={item.book.title} fill className="object-cover" sizes="84px" />
              </div>

              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{item.book.format}</div>
                <Link
                  href={`/books/${item.book.slug}`}
                  className="mt-2 block font-serif text-2xl font-semibold leading-tight hover:text-[var(--primary)] sm:text-3xl"
                >
                  {item.book.title}
                </Link>
                <p className="text-sm text-[var(--muted-foreground)]">by {item.book.author}</p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="inline-flex items-center rounded-full border bg-white/80">
                    <button
                      type="button"
                      className="px-3 py-2"
                      onClick={() =>
                        item.quantity === 1
                          ? removeMutation.mutate(item.id)
                          : updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })
                      }
                      disabled={isUpdating}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      type="button"
                      className="px-3 py-2"
                      onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                      disabled={isUpdating || item.quantity >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)]"
                    onClick={() => removeMutation.mutate(item.id)}
                    disabled={isUpdating}
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="col-span-2 border-t pt-4 sm:col-span-1 sm:border-t-0 sm:pt-0 sm:text-right">
                <div className="text-sm text-[var(--muted-foreground)]">Price per item</div>
                <div className="mt-2 font-semibold">{formatCurrency(item.book.price)}</div>
                <div className="mt-5 text-sm text-[var(--muted-foreground)]">Line total</div>
                <div className="mt-2 text-2xl font-semibold">{formatCurrency(item.lineTotal)}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-surface soft-panel h-fit p-6 lg:sticky lg:top-32">
        <div className="eyebrow">Order summary</div>
        <h2 className="mt-3 font-serif text-3xl font-semibold">Ready for checkout</h2>
        <div className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Subtotal</span>
            <span className="font-semibold">{formatCurrency(summary.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Shipping</span>
            <span className="font-semibold">
              {summary.shippingFee === 0 ? "FREE" : formatCurrency(summary.shippingFee)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--muted-foreground)]">Discount</span>
            <span className="font-semibold">{summary.subtotal >= 100 ? "- Free shipping unlocked" : "-"}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-4 text-base">
            <span className="font-semibold">Total</span>
            <PriceDisplay price={summary.total} size="sm" />
          </div>
        </div>

        <Button asChild className="mt-6 w-full rounded-full">
          <Link href="/checkout">Proceed to checkout</Link>
        </Button>
        <Button asChild variant="outline" className="mt-3 w-full rounded-full">
          <Link href="/explore">Continue shopping</Link>
        </Button>

        <div className="mt-6 space-y-3 rounded-[calc(var(--radius)-0.25rem)] border bg-white/62 p-4 text-sm text-[var(--muted-foreground)]">
          <div className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
            Secure checkout
          </div>
          <div className="inline-flex items-center gap-2">
            <Truck className="h-4 w-4 text-[var(--primary)]" />
            Free returns on damaged copies
          </div>
        </div>
      </div>
    </div>
  );
}

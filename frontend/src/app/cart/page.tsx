import Link from "next/link";
import { Bookmark, ShoppingBag, Sparkles } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import { calculateCartSummary } from "@/lib/checkout";
import { authFetch } from "@/lib/server-api";
import type { CartResponse } from "@/lib/types";
import { CartLineItems } from "@/components/cart/cart-line-items";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const emptyCart: CartResponse = {
  items: [],
  summary: {
    subtotal: 0,
    shippingFee: 0,
    total: 0,
  },
};

export default async function CartPage() {
  const session = await getServerSession();
  let cart = emptyCart;

  if (session?.user) {
    try {
      const response = await authFetch<CartResponse>("/api/cart");
      cart = {
        items: response.items,
        summary: calculateCartSummary(response.items),
      };
    } catch {
      cart = emptyCart;
    }
  }

  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="card-surface hero-panel mb-8 flex flex-wrap items-end justify-between gap-6 p-8">
          <div>
            <div className="eyebrow">Shopping cart</div>
            <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold text-balance">
              Review your shelf before you move into secure checkout.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
              Update quantities, save titles for later, confirm shipping thresholds, and head into a more polished order flow with confidence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/78 px-5 py-4 text-sm">
              <div className="text-[10px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                Estimated total
              </div>
              <div className="mt-2 text-3xl font-semibold">{formatCurrency(cart.summary.total)}</div>
            </div>
            <div className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/78 px-5 py-4 text-sm">
              <div className="inline-flex items-center gap-2 text-[var(--muted-foreground)]">
                <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                Free shipping at $100
              </div>
              <div className="mt-2 font-semibold">{cart.summary.subtotal >= 100 ? "Unlocked" : "Still available"}</div>
            </div>
          </div>
        </div>

        {!session?.user ? (
          <div className="card-surface soft-panel p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[calc(var(--radius)-0.2rem)] bg-[var(--secondary)] text-[var(--primary)]">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h2 className="mt-5 font-serif text-3xl font-semibold">Sign in to access your cart</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              Cart, checkout, and order tracking are tied to your BookShore account so your order data stays synced.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/register">Create account</Link>
              </Button>
            </div>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-white/68 px-4 py-2 text-sm text-[var(--muted-foreground)]">
              <Bookmark className="h-4 w-4 text-[var(--accent)]" />
              Account-linked carts keep orders and recommendations in sync.
            </div>
          </div>
        ) : (
          <CartLineItems initialCart={cart} />
        )}
      </section>
    </SiteShell>
  );
}

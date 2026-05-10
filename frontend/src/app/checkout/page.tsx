import Link from "next/link";
import { CreditCard, ShieldCheck } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import { calculateCartSummary } from "@/lib/checkout";
import { authFetch } from "@/lib/server-api";
import type { CartResponse } from "@/lib/types";
import { CheckoutForm } from "@/components/checkout/checkout-form";
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

export default async function CheckoutPage() {
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

  if (!session?.user) {
    return (
      <SiteShell>
        <section className="section-shell py-14">
          <div className="card-surface soft-panel p-10 text-center">
            <h1 className="font-serif text-4xl font-semibold">Login before checkout</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              Orders, payment confirmation, and delivery tracking are tied to your BookShore account.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/cart">Back to cart</Link>
              </Button>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

  if (cart.items.length === 0) {
    return (
      <SiteShell>
      <section className="section-shell py-14">
        <div className="card-surface soft-panel p-10 text-center">
          <h1 className="font-serif text-4xl font-semibold">Your cart is empty</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              Add books to your cart before entering shipping and payment details.
            </p>
            <Button asChild className="mt-6">
              <Link href="/explore">Shop books</Link>
            </Button>
          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="card-surface hero-panel mb-8 flex flex-wrap items-end justify-between gap-6 p-8">
          <div>
            <div className="eyebrow">Checkout</div>
            <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold text-balance">
              Secure shipping and payment for a more confident order flow.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
              Confirm your address, review the order, choose delivery speed, and continue into a secure payment session with clearer cues and cleaner validation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/78 px-5 py-4 text-sm">
              <div className="inline-flex items-center gap-2 text-[var(--muted-foreground)]">
                <CreditCard className="h-4 w-4 text-[var(--primary)]" />
                Payment total
              </div>
              <div className="mt-2 text-3xl font-semibold">{formatCurrency(cart.summary.total)}</div>
            </div>
            <div className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/78 px-5 py-4 text-sm">
              <div className="inline-flex items-center gap-2 text-[var(--muted-foreground)]">
                <ShieldCheck className="h-4 w-4 text-[var(--success)]" />
                Trust signal
              </div>
              <div className="mt-2 font-semibold">SSLCommerz hosted payment</div>
            </div>
          </div>
        </div>

        <CheckoutForm
          cart={cart}
          paymentEnabled={process.env.NEXT_PUBLIC_SSLCOMMERZ_ENABLED !== "false"}
          user={{
            name: session.user.name,
            email: session.user.email,
          }}
        />
      </section>
    </SiteShell>
  );
}

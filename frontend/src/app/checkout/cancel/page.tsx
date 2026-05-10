import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Button } from "@/components/ui/button";

export default function CheckoutCancelPage() {
  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="card-surface soft-panel p-10 text-center">
          <div className="eyebrow">Checkout canceled</div>
          <h1 className="mt-3 font-serif text-5xl font-semibold">Your cart is still waiting for you.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
            No order was placed. You can go back to the cart, update quantities, and restart secure payment whenever you are ready.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button asChild>
              <Link href="/cart">Return to cart</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/explore">Keep shopping</Link>
            </Button>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

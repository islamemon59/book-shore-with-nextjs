import Link from "next/link";
import { BookOpenText, Menu, Search, ShieldCheck, ShoppingBag, Sparkles } from "lucide-react";
import { getServerSession } from "@/lib/auth";
import { authFetch } from "@/lib/server-api";
import type { CartResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { LiveNotificationBell } from "./live-notification-bell";
import { UserMenu } from "./user-menu";

export async function SiteHeader() {
  const session = await getServerSession();
  let cartCount = 0;

  if (session?.user) {
    try {
      const cartResponse = await authFetch<CartResponse>("/api/cart");
      cartCount = cartResponse.items.reduce((sum, item) => sum + item.quantity, 0);
    } catch {
      cartCount = 0;
    }
  }

  const routes = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore" },
    { href: "/blog", label: "Journal" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/40 bg-[color:color-mix(in_srgb,var(--background)_72%,transparent)] backdrop-blur-2xl">
      <div className="border-b border-white/40 bg-[var(--primary)] text-[var(--primary-foreground)]">
        <div className="section-shell flex min-h-11 flex-wrap items-center justify-between gap-3 py-2 text-xs font-medium">
          <div className="inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Curated indie-bookshop atmosphere with AI-guided discovery
          </div>
          <div className="inline-flex items-center gap-2 text-[var(--primary-foreground)]/80">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
            Secure checkout, tracked delivery, and thoughtful support
          </div>
        </div>
      </div>

      <div className="section-shell flex min-h-24 items-center justify-between gap-4 py-4">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)] shadow-[0_18px_40px_-22px_rgba(30,58,95,0.85)]">
            <BookOpenText className="h-6 w-6" />
          </div>
          <div>
            <div className="font-serif text-3xl font-semibold">BookShore</div>
            <div className="text-xs uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
              Curated stories. Intelligent guidance.
            </div>
          </div>
        </Link>

        <form action="/explore" method="get" className="hidden min-w-0 flex-1 items-center justify-center xl:flex">
          <div className="flex w-full max-w-[38rem] items-center gap-3 rounded-[2rem] border border-white/70 bg-white/88 p-2.5 shadow-[0_18px_42px_-28px_rgba(21,38,58,0.28)] ring-1 ring-white/60 backdrop-blur">
            <div className="pointer-events-none flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/22 bg-[var(--secondary)]/72 text-[var(--accent)]">
              <Search className="h-4 w-4" />
            </div>
            <Input
              type="search"
              name="search"
              placeholder="Search books, authors, and reading moods"
              className="h-10 flex-1 border-0 bg-transparent px-0 text-sm shadow-none placeholder:text-[var(--muted-foreground)] focus-visible:ring-0"
            />
            <Button type="submit" size="sm" variant="secondary" className="min-w-[7.75rem] rounded-full px-5 shadow-[0_12px_28px_-18px_rgba(212,175,55,0.95)]">
              Open catalog
            </Button>
          </div>
        </form>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          {session?.user ? <LiveNotificationBell /> : null}
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link href="/cart" className="relative">
              <ShoppingBag className="h-4 w-4" />
              Cart
              {cartCount > 0 ? (
                <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] text-[var(--accent-foreground)]">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>
          {session?.user ? (
            <UserMenu session={session} />
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="outline" size="icon" className="rounded-full lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {routes.map((route) => (
              <DropdownMenuItem key={route.href} asChild>
                <Link href={route.href}>{route.label}</Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuItem asChild>
              <Link href="/cart">Cart</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/login">Sign in</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="section-shell hidden justify-center pb-4 lg:flex">
        <nav className="scrollbar-none flex items-center justify-center gap-5 overflow-x-auto whitespace-nowrap pb-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]"
            >
              {route.label}
            </Link>
          ))}
          {session?.user ? (
            <Link href="/dashboard" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)]">
              Dashboard
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}

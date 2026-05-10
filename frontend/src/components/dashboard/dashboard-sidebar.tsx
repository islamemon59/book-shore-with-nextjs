"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpenText,
  BookCopy,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Package,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import type { AppSession } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function DashboardSidebar({ session }: { session: AppSession }) {
  const pathname = usePathname();
  const role = session?.user?.role ?? "USER";

  const items = [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard, visible: true },
    { href: "/dashboard/orders", label: "Orders", icon: Package, visible: true },
    { href: "/dashboard/catalog", label: "Catalog", icon: BookCopy, visible: role !== "USER" },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound, visible: true },
    { href: "/dashboard/insights", label: "Insights", icon: BarChart3, visible: role !== "USER" },
    { href: "/dashboard/concierge", label: "Concierge", icon: MessageSquareText, visible: true },
  ].filter((item) => item.visible);

  return (
    <aside className="card-surface soft-panel h-fit p-5 lg:sticky lg:top-28">
      <Link
        href="/"
        aria-label="Go to BookShore home page"
        className="flex items-center gap-3 rounded-[calc(var(--radius)-0.25rem)] border bg-white/70 p-3 transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:bg-white hover:shadow-[var(--shadow-sm)] dark:bg-[rgba(255,255,255,0.06)] dark:hover:bg-[rgba(255,255,255,0.1)]"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)]">
          <BookOpenText className="h-5 w-5" />
        </span>
        <span>
          <span className="block font-serif text-xl font-semibold text-[var(--foreground)]">BookShore</span>
          <span className="block text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Go home</span>
        </span>
      </Link>
      <div className="mt-6 eyebrow">Reader workspace</div>
      <div className="mt-3 font-serif text-3xl font-semibold">Dashboard</div>
      <div className="mt-4 rounded-[calc(var(--radius)-0.25rem)] border bg-white/60 p-4 dark:bg-[rgba(255,255,255,0.06)]">
        <div className="font-semibold">{session?.user?.name}</div>
        <div className="mt-1 text-sm text-[var(--muted-foreground)]">{session?.user?.email}</div>
        <div className="mt-3 inline-flex rounded-full bg-[var(--primary)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--primary-foreground)]">
          {role}
        </div>
      </div>
      <nav className="mt-6 space-y-2">
        {items.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[calc(var(--radius)-0.25rem)] px-4 py-3 text-sm font-medium ${
                isActive
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)]"
                  : "text-[var(--muted-foreground)] hover:bg-white/70 hover:text-[var(--primary)] dark:hover:bg-[rgba(255,255,255,0.08)]"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Button
        type="button"
        variant="outline"
        className="mt-6 w-full justify-start"
        onClick={async () => {
          await authClient.signOut();
          window.location.href = "/";
        }}
      >
        <LogOut className="h-4 w-4" />
        Logout
      </Button>
    </aside>
  );
}

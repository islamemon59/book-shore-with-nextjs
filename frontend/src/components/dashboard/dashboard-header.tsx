import { ChevronRight } from "lucide-react";
import { LiveNotificationBell } from "@/components/layout/live-notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import type { AppSession } from "@/lib/types";

export function DashboardHeader({ session }: { session: AppSession }) {
  return (
    <div className="card-surface soft-panel flex flex-wrap items-center justify-between gap-4 p-4">
      <div>
        <div className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
          Dashboard
          <ChevronRight className="h-3.5 w-3.5" />
          Workspace
        </div>
        <div className="mt-2 font-serif text-3xl font-semibold">Welcome back, {session?.user?.name?.split(" ")[0]}</div>
        <div className="mt-1 text-sm text-[var(--muted-foreground)]">
          Review orders, reading preferences, and AI-powered store tools from one place.
        </div>
      </div>
      <div className="flex items-center gap-2">
        <LiveNotificationBell />
        <ThemeToggle />
        <UserMenu session={session} />
      </div>
    </div>
  );
}

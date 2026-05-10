import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, ChartNoAxesCombined, Package, Wallet } from "lucide-react";
import { AssistantChat } from "@/components/dashboard/assistant-chat";
import { Button } from "@/components/ui/button";
import { DashboardKpiCard } from "@/components/dashboard/dashboard-kpi-card";
import { OrdersTable } from "@/components/dashboard/orders-table";
import { OverviewCharts } from "@/components/dashboard/overview-charts";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";
import { authFetch } from "@/lib/server-api";
import { getServerSession } from "@/lib/auth";

export default async function DashboardOverviewPage() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  const overview = await authFetch<{
    cards: { books: number; readers: number; orders: number; revenue: number };
    charts: {
      revenueByMonth: Array<{ label: string; revenue: number; orders: number }>;
      formatMix: Array<{ name: string; value: number }>;
    };
    tables: {
      lowStock: Array<{ id: string; title: string; inventory: number; format: string }>;
      newReaders: Array<{ id: string; name: string; email: string; role: string; joinedAt: string }>;
    };
  }>("/api/dashboard/overview");

  const role = session.user.role ?? "USER";
  const isReader = role === "USER";
  const quickActions = isReader
    ? [
        { href: "/explore", label: "Browse new releases" },
        { href: "/dashboard/concierge", label: "Refresh AI picks" },
        { href: "/dashboard/orders", label: "Review your orders" },
      ]
    : [
        { href: "/dashboard/catalog/new", label: "Add new book" },
        { href: "/dashboard/catalog", label: "Review catalog" },
        { href: "/dashboard/insights", label: "Run dashboard analyzer" },
      ];

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isReader ? (
          <>
            <DashboardKpiCard
              label="Orders this year"
              value={overview.cards.orders}
              detail="Everything you have purchased and can track from the dashboard."
              icon={Package}
            />
            <DashboardKpiCard
              label="Total spent"
              value={`$${overview.cards.revenue.toFixed(0)}`}
              detail="A clearer look at your reading investment over time."
              icon={Wallet}
              tone="accent"
            />
            <DashboardKpiCard
              label="Favorite shelf"
              value={overview.charts.formatMix[0]?.name ?? "Mixed"}
              detail="The format or reading style you have leaned into most."
              icon={BookOpen}
            />
            <DashboardKpiCard
              label="Reading streak"
              value={`${Math.max(7, overview.cards.orders)} days`}
              detail="A lightweight signal that keeps your reading momentum visible."
              icon={ChartNoAxesCombined}
            />
          </>
        ) : (
          <>
            <DashboardKpiCard
              label="Revenue this month"
              value={`$${overview.cards.revenue.toFixed(0)}`}
              detail="Performance snapshot across catalog sales and current order flow."
              icon={Wallet}
              tone="accent"
            />
            <DashboardKpiCard
              label="Orders this month"
              value={overview.cards.orders}
              detail="Operational throughput from the current selling period."
              icon={Package}
            />
            <DashboardKpiCard
              label="Books in catalog"
              value={overview.cards.books}
              detail="Titles currently shaping the storefront and dashboard workflow."
              icon={BookOpen}
            />
            <DashboardKpiCard
              label="Active readers"
              value={overview.cards.readers}
              detail="Users engaging with the bookstore experience and purchase journey."
              icon={ChartNoAxesCombined}
            />
          </>
        )}
      </div>

      <OverviewCharts revenueByMonth={overview.charts.revenueByMonth} formatMix={overview.charts.formatMix} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecommendationsPanel />
        <AssistantChat />
      </div>

      <div className="card-surface soft-panel p-6">
        <div className="eyebrow">Quick actions</div>
        <div className="mt-3 flex flex-wrap gap-3">
          {quickActions.map((item) => (
            <Button key={item.href} asChild variant="outline">
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </div>
      </div>

      {role !== "USER" ? <OrdersTable dashboardView /> : null}
    </>
  );
}

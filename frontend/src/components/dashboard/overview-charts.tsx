"use client";

import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

type OverviewChartsProps = {
  revenueByMonth: Array<{ label: string; revenue: number; orders: number }>;
  formatMix: Array<{ name: string; value: number }>;
};

export function OverviewCharts({ revenueByMonth, formatMix }: OverviewChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="soft-panel p-6">
        <CardContent className="p-0">
          <div className="eyebrow">Six-month trend</div>
          <h3 className="mt-3 font-serif text-3xl font-semibold">Revenue trend</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueByMonth}>
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="var(--primary)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="soft-panel p-6">
        <CardContent className="p-0">
          <div className="eyebrow">Format mix</div>
          <h3 className="mt-3 font-serif text-3xl font-semibold">Catalog distribution</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={formatMix} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} fill="var(--accent)" />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="soft-panel p-6 lg:col-span-2">
        <CardContent className="p-0">
          <div className="eyebrow">Order velocity</div>
          <h3 className="mt-3 font-serif text-3xl font-semibold">Order volume</h3>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <XAxis dataKey="label" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip />
                <Bar dataKey="orders" fill="var(--accent)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

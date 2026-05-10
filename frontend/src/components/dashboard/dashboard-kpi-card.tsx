import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardKpiCardProps = {
  label: string;
  value: string | number;
  detail: string;
  icon: LucideIcon;
  tone?: "default" | "accent";
};

export function DashboardKpiCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "default",
}: DashboardKpiCardProps) {
  return (
    <div
      className={cn(
        "card-surface overflow-hidden p-6",
        tone === "accent" && "bg-[linear-gradient(140deg,rgba(30,58,95,0.98),rgba(17,36,59,0.92))] text-[var(--primary-foreground)]",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className={cn("eyebrow", tone === "accent" && "text-[var(--accent)]")}>{label}</div>
          <div className="mt-4 text-4xl font-semibold">{value}</div>
          <p className={cn("mt-3 text-sm leading-7", tone === "accent" ? "text-white/72" : "text-[var(--muted-foreground)]")}>
            {detail}
          </p>
        </div>
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full",
            tone === "accent" ? "bg-white/10 text-[var(--accent)]" : "bg-[var(--secondary)] text-[var(--primary)]",
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

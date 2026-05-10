import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = {
  label: string;
  description: string;
  state: "complete" | "current" | "upcoming";
};

export function ProgressStepper({ steps }: { steps: Step[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={cn(
            "rounded-[calc(var(--radius)-0.25rem)] border p-4",
            step.state === "current" && "bg-[var(--primary)] text-[var(--primary-foreground)]",
            step.state === "complete" && "bg-[var(--secondary)] text-[var(--secondary-foreground)]",
            step.state === "upcoming" && "bg-white/70 text-[var(--foreground)]",
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                step.state === "current" &&
                  "border-white/20 bg-white/12 text-[var(--primary-foreground)]",
                step.state === "complete" && "border-transparent bg-[var(--accent)] text-[var(--accent-foreground)]",
                step.state === "upcoming" && "border-[var(--border)] bg-white text-[var(--foreground)]",
              )}
            >
              {step.state === "complete" ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.22em] opacity-80">{step.label}</div>
              <div className="mt-1 text-sm opacity-85">{step.description}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

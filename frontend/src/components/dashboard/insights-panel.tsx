"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";

const insightsSchema = z.object({
  goal: z.string().min(10, "Describe the business question you want to answer."),
});

type InsightsInput = z.infer<typeof insightsSchema>;

type InsightsResponse = {
  item: {
    headline: string;
    insights: string[];
    actions: string[];
  };
};

export function InsightsPanel() {
  const form = useForm<InsightsInput>({
    resolver: zodResolver(insightsSchema),
    defaultValues: {
      goal: "Highlight the most important operational signals from recent orders and inventory.",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: InsightsInput) =>
      clientFetch<InsightsResponse>("/api/ai/analyze-dashboard", {
        method: "POST",
        body: values,
      }),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to generate insights.");
    },
  });

  return (
    <div className="card-surface soft-panel p-6">
      <div className="eyebrow">AI analysis</div>
      <h2 className="mt-3 font-serif text-3xl font-semibold">Ask for operational insight in plain English.</h2>
      <form className="mt-5 flex gap-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <Input {...form.register("goal")} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Analyzing..." : "Analyze"}
        </Button>
      </form>
      {mutation.data ? (
        <div className="mt-6 space-y-5">
          <div className="font-semibold">{mutation.data.item.headline}</div>
          <div>
            <div className="mb-2 text-sm font-semibold">Insights</div>
            <ul className="space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              {mutation.data.item.insights.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-2 text-sm font-semibold">Recommended actions</div>
            <ul className="space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              {mutation.data.item.actions.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}

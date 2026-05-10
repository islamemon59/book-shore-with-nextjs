"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { clientFetch } from "@/lib/client-api";

type RecommendationResponse = {
  item: {
    summary: string;
    picks: Array<{ slug: string; rationale: string }>;
  };
};

export function RecommendationsPanel() {
  const mutation = useMutation({
    mutationFn: () => clientFetch<RecommendationResponse>("/api/ai/recommendations", { method: "POST", body: {} }),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to generate recommendations.");
    },
  });

  return (
    <div className="card-surface soft-panel p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="eyebrow">AI recommendations</div>
          <h2 className="font-serif text-3xl font-semibold">Personal picks for your next checkout</h2>
        </div>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          {mutation.isPending ? "Thinking..." : "Refresh picks"}
        </Button>
      </div>
      {mutation.data ? (
        <div className="mt-5 space-y-4">
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">{mutation.data.item.summary}</p>
          {mutation.data.item.picks.map((pick) => (
            <div key={pick.slug} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/60 p-4 dark:bg-[rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between gap-4">
                <Link href={`/books/${pick.slug}`} className="font-semibold capitalize hover:text-[var(--primary)]">
                  {pick.slug.replaceAll("-", " ")}
                </Link>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/books/${pick.slug}`}>Open</Link>
                </Button>
              </div>
              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{pick.rationale}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
          Use your saved preferences and shopping behavior to ask BookShore for tailored book recommendations.
        </p>
      )}
    </div>
  );
}

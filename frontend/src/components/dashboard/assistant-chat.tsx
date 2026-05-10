"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clientFetch } from "@/lib/client-api";

const assistantSchema = z.object({
  message: z.string().min(4, "Ask a fuller question."),
});

type AssistantInput = z.infer<typeof assistantSchema>;

type AssistantResponse = {
  item: {
    conversationId: string;
    answer: string;
    suggestions: string[];
    recommendedSlugs: string[];
  };
};

export function AssistantChat() {
  const form = useForm<AssistantInput>({
    resolver: zodResolver(assistantSchema),
    defaultValues: {
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: AssistantInput) =>
      clientFetch<AssistantResponse>("/api/ai/assistant", {
        method: "POST",
        body: values,
      }),
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to reach the assistant.");
    },
  });

  return (
    <div className="card-surface soft-panel p-6">
      <div className="eyebrow">Context-aware chat</div>
      <h2 className="mt-3 font-serif text-3xl font-semibold">Ask the store assistant anything.</h2>
      <form className="mt-5 flex gap-3" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
        <Input placeholder="Compare two books, ask for a gift idea, or build a reading path" {...form.register("message")} />
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Replying..." : "Ask"}
        </Button>
      </form>
      {mutation.data ? (
        <div className="mt-6 space-y-4">
          <p className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/60 p-4 text-sm leading-7 dark:bg-[rgba(255,255,255,0.06)]">
            {mutation.data.item.answer}
          </p>
          <div className="flex flex-wrap gap-2">
            {mutation.data.item.suggestions.map((suggestion) => (
              <span key={suggestion} className="rounded-full border bg-white/60 px-3 py-1 text-xs text-[var(--muted-foreground)] dark:bg-[rgba(255,255,255,0.06)]">
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

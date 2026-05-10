"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clientFetch } from "@/lib/client-api";

const copySchema = z.object({
  title: z.string().min(3),
  author: z.string().min(3),
  audience: z.string().min(3),
  themes: z.string().min(3),
  tone: z.string().min(3),
});

const classifySchema = z.object({
  title: z.string().min(3),
  synopsis: z.string().min(80),
});

export function CatalogAiTools() {
  const copyForm = useForm<z.infer<typeof copySchema>>({
    resolver: zodResolver(copySchema),
    defaultValues: {
      title: "",
      author: "",
      audience: "Thoughtful fiction readers",
      themes: "",
      tone: "Warm, literary, and commercially clear",
    },
  });

  const classifyForm = useForm<z.infer<typeof classifySchema>>({
    resolver: zodResolver(classifySchema),
    defaultValues: {
      title: "",
      synopsis: "",
    },
  });

  const copyMutation = useMutation({
    mutationFn: (values: z.infer<typeof copySchema>) =>
      clientFetch<{ item: { shortDescription: string; synopsis: string; merchandisingBullets: string[] } }>(
        "/api/ai/generate-copy",
        {
          method: "POST",
          body: {
            ...values,
            themes: values.themes.split(",").map((item) => item.trim()).filter(Boolean),
          },
        },
      ),
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to generate copy."),
  });

  const classifyMutation = useMutation({
    mutationFn: (values: z.infer<typeof classifySchema>) =>
      clientFetch<{ item: { recommendedCategories: string[]; audienceTags: string[]; toneTags: string[]; merchandisingKeywords: string[] } }>(
        "/api/ai/classify",
        {
          method: "POST",
          body: values,
        },
      ),
    onError: (error) => toast.error(error instanceof Error ? error.message : "Unable to classify the book."),
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form className="card-surface p-6" onSubmit={copyForm.handleSubmit((values) => copyMutation.mutate(values))}>
        <h2 className="font-serif text-3xl font-semibold">AI copy generator</h2>
        <div className="mt-5 space-y-4">
          <Input placeholder="Title" {...copyForm.register("title")} />
          <Input placeholder="Author" {...copyForm.register("author")} />
          <Input placeholder="Audience" {...copyForm.register("audience")} />
          <Input placeholder="Themes, comma separated" {...copyForm.register("themes")} />
          <Input placeholder="Tone" {...copyForm.register("tone")} />
          <Button type="submit" disabled={copyMutation.isPending}>
            {copyMutation.isPending ? "Generating..." : "Generate copy"}
          </Button>
        </div>
        {copyMutation.data ? (
          <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>{copyMutation.data.item.shortDescription}</p>
            <p>{copyMutation.data.item.synopsis}</p>
          </div>
        ) : null}
      </form>

      <form className="card-surface p-6" onSubmit={classifyForm.handleSubmit((values) => classifyMutation.mutate(values))}>
        <h2 className="font-serif text-3xl font-semibold">AI classification</h2>
        <div className="mt-5 space-y-4">
          <Input placeholder="Title" {...classifyForm.register("title")} />
          <Textarea placeholder="Synopsis" {...classifyForm.register("synopsis")} />
          <Button type="submit" disabled={classifyMutation.isPending}>
            {classifyMutation.isPending ? "Classifying..." : "Classify book"}
          </Button>
        </div>
        {classifyMutation.data ? (
          <div className="mt-6 space-y-3 text-sm leading-7 text-[var(--muted-foreground)]">
            <p>Categories: {classifyMutation.data.item.recommendedCategories.join(", ")}</p>
            <p>Audience: {classifyMutation.data.item.audienceTags.join(", ")}</p>
            <p>Tone: {classifyMutation.data.item.toneTags.join(", ")}</p>
            <p>Keywords: {classifyMutation.data.item.merchandisingKeywords.join(", ")}</p>
          </div>
        ) : null}
      </form>
    </div>
  );
}

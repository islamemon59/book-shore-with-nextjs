"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { clientFetch } from "@/lib/client-api";
import type { Book, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const positiveNumberString = (label: string) =>
  z.string().trim().min(1, `${label} is required.`).refine((value) => Number(value) > 0, `${label} must be greater than 0.`);

const nonNegativeIntegerString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => Number.isInteger(Number(value)) && Number(value) >= 0, `${label} must be a whole number.`);

const positiveIntegerString = (label: string) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required.`)
    .refine((value) => Number.isInteger(Number(value)) && Number(value) > 0, `${label} must be a whole number.`);

const bookPublishSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters."),
  author: z.string().trim().min(3, "Author must be at least 3 characters."),
  publisher: z.string().trim().min(2, "Publisher is required."),
  synopsis: z.string().trim().min(100, "Synopsis must be at least 100 characters."),
  shortDescription: z.string().trim().min(40, "Short description must be at least 40 characters.").max(280),
  price: positiveNumberString("Price"),
  compareAtPrice: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || Number(value) > 0, "Compare-at price must be greater than 0."),
  inventory: nonNegativeIntegerString("Inventory"),
  pages: positiveIntegerString("Pages"),
  format: z.string().trim().min(2, "Format is required."),
  language: z.string().trim().min(2, "Language is required."),
  isbn: z.string().trim().min(10, "ISBN must be at least 10 characters."),
  coverImage: z.string().trim().url("Cover image must be a valid URL."),
  gallery: z.string().trim().min(5, "Add at least one gallery image URL."),
  publishedAt: z.string().trim().min(1, "Publish date is required."),
  releaseLabel: z.string().trim().min(2, "Release label is required."),
  location: z.string().trim().min(2, "Location is required."),
  featured: z.boolean().default(false),
  spotlight: z.boolean().default(false),
  aiSummary: z.string().trim().optional(),
  aiTags: z.string().trim().optional(),
  categorySlugs: z.array(z.string()).min(1, "Choose at least one category."),
});

type BookPublishValues = z.input<typeof bookPublishSchema>;

const parseDelimitedText = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

export function BookPublishForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const form = useForm<BookPublishValues>({
    resolver: zodResolver(bookPublishSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      author: "",
      publisher: "",
      synopsis: "",
      shortDescription: "",
      price: "",
      compareAtPrice: "",
      inventory: "0",
      pages: "",
      format: "Paperback",
      language: "English",
      isbn: "",
      coverImage: "",
      gallery: "",
      publishedAt: new Date().toISOString().slice(0, 10),
      releaseLabel: "New release",
      location: "Online + flagship shelf",
      featured: false,
      spotlight: false,
      aiSummary: "",
      aiTags: "",
      categorySlugs: [],
    },
  });

  const selectedCategories =
    useWatch({
      control: form.control,
      name: "categorySlugs",
    }) ?? [];

  const publishMutation = useMutation({
    mutationFn: (values: BookPublishValues) =>
      clientFetch<{ item: Book }>("/api/books", {
        method: "POST",
        body: {
          title: values.title,
          author: values.author,
          publisher: values.publisher,
          synopsis: values.synopsis,
          shortDescription: values.shortDescription,
          price: Number(values.price),
          compareAtPrice: values.compareAtPrice ? Number(values.compareAtPrice) : undefined,
          inventory: Number(values.inventory),
          pages: Number(values.pages),
          format: values.format,
          language: values.language,
          isbn: values.isbn,
          coverImage: values.coverImage,
          gallery: parseDelimitedText(values.gallery),
          publishedAt: new Date(values.publishedAt).toISOString(),
          releaseLabel: values.releaseLabel,
          location: values.location,
          featured: values.featured,
          spotlight: values.spotlight,
          aiSummary: values.aiSummary || undefined,
          aiTags: values.aiTags ? parseDelimitedText(values.aiTags) : undefined,
          categorySlugs: values.categorySlugs,
        },
      }),
    onSuccess: ({ item }) => {
      toast.success(`Published "${item.title}" successfully.`);
      router.push("/dashboard/catalog");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to publish the book.");
    },
  });

  const toggleCategory = (slug: string) => {
    const current = form.getValues("categorySlugs");
    const next = current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug];
    form.setValue("categorySlugs", next, { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (values: BookPublishValues) => {
    publishMutation.mutate(values);
  };

  return (
    <form className="card-surface soft-panel p-6" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow">Catalog publishing</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold">Publish a new book</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
            Managers and admins can create live catalog entries here. Add the product metadata, choose categories,
            and publish the title directly to the storefront.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/catalog">Back to catalog</Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <section className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/65 p-5">
            <h2 className="font-serif text-2xl font-semibold">Core details</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Title" error={form.formState.errors.title?.message}>
                <Input {...form.register("title")} placeholder="The Quiet Shelf" />
              </Field>
              <Field label="Author" error={form.formState.errors.author?.message}>
                <Input {...form.register("author")} placeholder="Amina Solberg" />
              </Field>
              <Field label="Publisher" error={form.formState.errors.publisher?.message}>
                <Input {...form.register("publisher")} placeholder="Northbound Press" />
              </Field>
              <Field label="ISBN" error={form.formState.errors.isbn?.message}>
                <Input {...form.register("isbn")} placeholder="9780000000000" />
              </Field>
              <Field label="Format" error={form.formState.errors.format?.message}>
                <Input {...form.register("format")} placeholder="Paperback" />
              </Field>
              <Field label="Language" error={form.formState.errors.language?.message}>
                <Input {...form.register("language")} placeholder="English" />
              </Field>
              <Field label="Price" error={form.formState.errors.price?.message}>
                <Input {...form.register("price")} type="number" min="0" step="0.01" placeholder="24.99" />
              </Field>
              <Field label="Compare-at price" error={form.formState.errors.compareAtPrice?.message}>
                <Input {...form.register("compareAtPrice")} type="number" min="0" step="0.01" placeholder="29.99" />
              </Field>
              <Field label="Inventory" error={form.formState.errors.inventory?.message}>
                <Input {...form.register("inventory")} type="number" min="0" step="1" placeholder="40" />
              </Field>
              <Field label="Pages" error={form.formState.errors.pages?.message}>
                <Input {...form.register("pages")} type="number" min="1" step="1" placeholder="320" />
              </Field>
              <Field label="Publish date" error={form.formState.errors.publishedAt?.message}>
                <Input {...form.register("publishedAt")} type="date" />
              </Field>
              <Field label="Release label" error={form.formState.errors.releaseLabel?.message}>
                <Input {...form.register("releaseLabel")} placeholder="Spring release" />
              </Field>
              <Field label="Location" error={form.formState.errors.location?.message}>
                <Input {...form.register("location")} placeholder="Dhaka warehouse + online" />
              </Field>
              <Field label="Cover image URL" error={form.formState.errors.coverImage?.message} className="md:col-span-2">
                <Input {...form.register("coverImage")} placeholder="https://images.unsplash.com/..." />
              </Field>
            </div>
          </section>

          <section className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/65 p-5">
            <h2 className="font-serif text-2xl font-semibold">Merchandising copy</h2>
            <div className="mt-5 space-y-4">
              <Field label="Short description" error={form.formState.errors.shortDescription?.message}>
                <Textarea {...form.register("shortDescription")} className="min-h-24" placeholder="A sharp, commercial hook for grid cards and quick previews." />
              </Field>
              <Field label="Synopsis" error={form.formState.errors.synopsis?.message}>
                <Textarea {...form.register("synopsis")} className="min-h-40" placeholder="Full product synopsis for the book page and discovery flows." />
              </Field>
              <Field label="AI summary" error={form.formState.errors.aiSummary?.message}>
                <Textarea {...form.register("aiSummary")} className="min-h-28" placeholder="Optional AI-assisted summary shown internally or on product detail surfaces." />
              </Field>
              <Field label="AI tags" error={form.formState.errors.aiTags?.message}>
                <Input {...form.register("aiTags")} placeholder="literary fiction, family, grief, identity" />
              </Field>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/65 p-5">
            <h2 className="font-serif text-2xl font-semibold">Media and categorization</h2>
            <div className="mt-5 space-y-4">
              <Field label="Gallery image URLs" error={form.formState.errors.gallery?.message}>
                <Textarea
                  {...form.register("gallery")}
                  className="min-h-32"
                  placeholder="Add one URL per line or separate them with commas."
                />
              </Field>
              <Field label="Categories" error={form.formState.errors.categorySlugs?.message}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => {
                    const checked = selectedCategories.includes(category.slug);

                    return (
                      <label
                        key={category.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-[calc(var(--radius)-0.3rem)] border px-4 py-3 ${
                          checked ? "border-[var(--accent)] bg-[var(--secondary)]" : "bg-white/70"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(category.slug)}
                          className="mt-1"
                        />
                        <span>
                          <span className="block font-semibold">{category.name}</span>
                          <span className="block text-xs text-[var(--muted-foreground)]">{category.bookCount} books</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </Field>
            </div>
          </section>

          <section className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/65 p-5">
            <h2 className="font-serif text-2xl font-semibold">Storefront visibility</h2>
            <div className="mt-5 space-y-3">
              <label className="flex items-center justify-between rounded-[calc(var(--radius)-0.3rem)] border bg-white/70 px-4 py-3">
                <span>
                  <span className="block font-semibold">Featured</span>
                  <span className="block text-sm text-[var(--muted-foreground)]">Show this book in highlighted storefront collections.</span>
                </span>
                <input type="checkbox" {...form.register("featured")} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between rounded-[calc(var(--radius)-0.3rem)] border bg-white/70 px-4 py-3">
                <span>
                  <span className="block font-semibold">Spotlight</span>
                  <span className="block text-sm text-[var(--muted-foreground)]">Boost this title in hero-style placements and top-level merchandising.</span>
                </span>
                <input type="checkbox" {...form.register("spotlight")} className="h-4 w-4" />
              </label>
            </div>
          </section>

          <section className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/65 p-5">
            <h2 className="font-serif text-2xl font-semibold">Publish</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              Publishing creates the book immediately in the backend catalog using your current admin or manager
              session.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="submit" disabled={publishMutation.isPending}>
                {publishMutation.isPending ? "Publishing..." : "Publish book"}
              </Button>
              <Button asChild type="button" variant="outline">
                <Link href="/dashboard/catalog">Cancel</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  className,
  children,
}: {
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="mt-2 text-xs text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpenText, ShieldCheck, Sparkles, WandSparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { Book } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingStars } from "@/components/ui/rating-stars";

export function HeroSpotlight({ books }: { books: Book[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (books.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % books.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [books.length]);

  if (books.length === 0) {
    return null;
  }

  const activeBook = books[activeIndex];
  const deck = [0, 1, 2]
    .map((offset) => books[(activeIndex + offset) % books.length])
    .filter(Boolean);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
      <div className="space-y-8">
        <div className="space-y-5">
          <Badge variant="secondary">Spring Curator&apos;s Edit</Badge>
          <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] font-semibold text-balance sm:text-6xl lg:text-7xl">
            Discover Stories That Transform You
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
            A premium bookstore experience with layered curation, thoughtful design, and AI that helps each reader find the next book that genuinely matters.
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/explore">
              Explore the shelves
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href={`/books/${activeBook.slug}`}>Meet the featured title</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Sparkles, label: "AI-tuned discovery", value: "Taste-aware recommendations" },
            { icon: ShieldCheck, label: "Trust-first buying", value: "Clean checkout and support" },
            { icon: BookOpenText, label: "Curated shelves", value: "Editorially selected arrivals" },
          ].map((item) => (
            <div key={item.label} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/70 p-4 shadow-[var(--shadow-sm)]">
              <item.icon className="h-5 w-5 text-[var(--primary)]" />
              <div className="mt-4 font-semibold">{item.value}</div>
              <div className="mt-1 text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {books.map((book, index) => (
            <button
              key={book.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                index === activeIndex
                  ? "border-[var(--accent)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-md)]"
                  : "bg-white/55 text-[var(--muted-foreground)] hover:border-[var(--accent)] hover:text-[var(--primary)]"
              }`}
            >
              {book.title}
            </button>
          ))}
        </div>
      </div>

      <div className="relative min-h-[34rem] [perspective:1600px]">
        <div className="absolute inset-0 rounded-[1.6rem] bg-[radial-gradient(circle_at_center,rgba(30,58,95,0.18),transparent_55%)]" />
        {deck.map((book, index) => {
          const positions = [
            "left-0 top-10 z-10 w-[56%] -rotate-[11deg] opacity-70",
            "left-[20%] top-0 z-30 w-[60%] rotate-0",
            "right-0 top-12 z-20 w-[56%] rotate-[11deg] opacity-82",
          ];

          return (
            <div
              key={`${book.id}-${index}`}
              className={`book-glow absolute overflow-hidden rounded-[1.4rem] border border-white/40 bg-white/90 p-3 transition duration-500 ${positions[index]}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[1rem]">
                <Image src={book.coverImage} alt={book.title} fill className="object-cover" sizes="(max-width: 1024px) 80vw, 25vw" priority={index === 1} />
              </div>
            </div>
          );
        })}

        <div className="absolute inset-x-6 bottom-0 z-40 rounded-[1.3rem] border bg-[rgba(255,251,245,0.92)] p-6 backdrop-blur-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                <WandSparkles className="h-3.5 w-3.5" />
                Featured spotlight
              </div>
              <h2 className="mt-3 font-serif text-3xl font-semibold">{activeBook.title}</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">{activeBook.author}</p>
            </div>
            <PriceDisplay price={activeBook.price} compareAtPrice={activeBook.compareAtPrice} freeShipping size="sm" />
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            {activeBook.aiSummary || activeBook.shortDescription}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <RatingStars rating={activeBook.rating} count={activeBook.reviewCount} />
            <Button asChild variant="ghost" className="px-0 hover:bg-transparent hover:text-[var(--primary)]">
              <Link href={`/books/${activeBook.slug}`}>
                Open details
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import type { Book } from "@/lib/types";

export function RelatedBooksCarousel({ books }: { books: Book[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(books.length > 1);

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const syncScrollState = () => {
      const maxScrollLeft = track.scrollWidth - track.clientWidth;

      setCanScrollLeft(track.scrollLeft > 8);
      setCanScrollRight(track.scrollLeft < maxScrollLeft - 8);
    };

    syncScrollState();
    track.addEventListener("scroll", syncScrollState, { passive: true });
    window.addEventListener("resize", syncScrollState);

    return () => {
      track.removeEventListener("scroll", syncScrollState);
      window.removeEventListener("resize", syncScrollState);
    };
  }, [books.length]);

  const scrollByCardGroup = (direction: "prev" | "next") => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    const firstCard = track.querySelector<HTMLElement>("[data-related-card]");
    const gap = 20;
    const cardWidth = firstCard?.offsetWidth ?? track.clientWidth;
    const amount = cardWidth + gap;

    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => scrollByCardGroup("prev")}
          disabled={!canScrollLeft}
          aria-label="Show previous related books"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => scrollByCardGroup("next")}
          disabled={!canScrollRight}
          aria-label="Show more related books"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {books.map((book) => (
            <div
              key={book.id}
              data-related-card
              className="w-[18.5rem] shrink-0 snap-start sm:w-[20rem] lg:w-[21rem] xl:w-[22rem]"
            >
              <BookCard book={book} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

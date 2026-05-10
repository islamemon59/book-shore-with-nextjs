import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart } from "lucide-react";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingStars } from "@/components/ui/rating-stars";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  const primaryCategory = book.categories[0];

  return (
    <Card className="group flex h-full flex-col overflow-hidden border-[var(--border)] bg-white/88 shadow-[0_14px_42px_rgba(21,38,58,0.1)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_56px_rgba(21,38,58,0.16)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-2 p-3">
          <div className="flex flex-wrap gap-1.5">
            <Badge className="bg-white/90 px-2.5 py-0.5 text-[10px] text-[var(--primary)]">{book.format}</Badge>
            {book.featured ? (
              <Badge variant="secondary" className="px-2.5 py-0.5 text-[10px]">
                Featured
              </Badge>
            ) : null}
          </div>
          <div className="rounded-full bg-[var(--primary)]/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--primary-foreground)]">
            {new Date(book.publishedAt).getFullYear()}
          </div>
        </div>

        <div className="relative aspect-[5/4] overflow-hidden bg-[var(--secondary)]">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.06]"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(9,18,30,0.78)] via-transparent to-transparent opacity-70" />
          <div className="absolute inset-x-0 bottom-0 translate-y-4 p-3 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="rounded-[calc(var(--radius)-0.45rem)] border border-white/12 bg-[rgba(12,24,38,0.9)] p-2.5 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <AddToCartButton bookId={book.id} className="flex-1">
                  Quick add
                </AddToCartButton>
                <Button type="button" size="icon" variant="outline" className="border-white/20 bg-white/10 text-white hover:bg-white/18">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              <Button asChild variant="ghost" className="mt-1.5 h-8 w-full justify-between text-white hover:bg-white/10 hover:text-white">
                <Link href={`/books/${book.slug}`}>
                  View details
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="space-y-1.5">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            {primaryCategory?.name ?? "Curated shelf"}
          </div>
          <Link href={`/books/${book.slug}`} className="block">
            <h3 className="line-clamp-2 font-serif text-[1.3rem] leading-[1.08] font-semibold group-hover:text-[var(--primary)]">
              {book.title}
            </h3>
          </Link>
          <p className="line-clamp-1 text-xs text-[var(--muted-foreground)]">by {book.author}</p>
        </div>

        <p className="line-clamp-2 text-xs leading-5 text-[var(--muted-foreground)]">{book.shortDescription}</p>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <RatingStars rating={book.rating} count={book.reviewCount} />
            <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{book.releaseLabel}</span>
          </div>
          <PriceDisplay
            price={book.price}
            compareAtPrice={book.compareAtPrice}
            freeShipping={book.price >= 35}
            size="sm"
            className="gap-2 [&_[class*='text-lg']]:text-base [&_[class*='pb-1']]:pb-0 [&_[class*='rounded-full']]:px-2.5 [&_[class*='rounded-full']]:py-0.5 [&_[class*='rounded-full']]:text-[10px]"
          />
        </div>

        <div className="mt-auto border-t pt-2.5">
          <Button asChild variant="ghost" className="h-8 w-full justify-between px-0 text-[var(--primary)] hover:bg-transparent hover:text-[var(--primary)]">
            <Link href={`/books/${book.slug}`}>
              View details
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

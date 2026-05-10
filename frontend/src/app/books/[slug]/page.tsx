import Image from "next/image";
import Link from "next/link";
import { CreditCard, HeartHandshake, ShieldCheck, Truck } from "lucide-react";
import { notFound } from "next/navigation";
import { BookDetailActions } from "@/components/books/book-detail-actions";
import { RelatedBooksCarousel } from "@/components/books/related-books-carousel";
import { ReviewsPanel } from "@/components/books/reviews-panel";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { RatingStars } from "@/components/ui/rating-stars";
import { serverFetch } from "@/lib/server-api";
import type { Book } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type BookDetailsResponse = {
  book: Book;
  related: Book[];
};

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 1800;

export async function generateMetadata({ params }: BookPageProps) {
  const { slug } = await params;

  try {
    const response = await serverFetch<BookDetailsResponse>(`/api/books/${slug}`, {
      next: { revalidate: 1800, tags: [`book-${slug}`] },
    });

    return {
      title: response.book.title,
      description: response.book.shortDescription,
    };
  } catch {
    return {
      title: "Book not found",
    };
  }
}

export default async function BookDetailsPage({ params }: BookPageProps) {
  const { slug } = await params;

  let response: BookDetailsResponse;

  try {
    response = await serverFetch<BookDetailsResponse>(`/api/books/${slug}`, {
      next: { revalidate: 1800, tags: [`book-${slug}`] },
    });
  } catch {
    notFound();
  }

  const { book, related } = response!;
  const authorInitials = book.author
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const authorBio = `${book.author} writes at the intersection of ${book.categories
    .slice(0, 2)
    .map((category) => category.name.toLowerCase())
    .join(" and ")}, with a voice that feels especially suited to thoughtful readers and book-club discussion.`;

  return (
    <SiteShell>
      <section className="section-shell py-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(14rem,0.3fr),1fr] lg:items-start">
          <div className="card-surface soft-panel mx-auto w-full max-w-[19rem] overflow-hidden p-3 lg:sticky lg:top-32">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius)-0.35rem)] bg-[var(--secondary)]">
              <Image
                src={book.gallery[0]}
                alt={book.title}
                fill
                className="object-cover transition duration-500 hover:scale-[1.03]"
                sizes="(max-width: 1024px) 19rem, 19rem"
                priority
              />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {book.gallery.slice(1, 4).map((image, index) => (
                <div key={image + index} className="relative aspect-square overflow-hidden rounded-[0.8rem] border bg-white/66">
                  <Image
                    src={image}
                    alt={`${book.title} preview ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="7rem"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="card-surface hero-panel p-6 sm:p-7">
              <div className="flex flex-wrap gap-2">
                {book.categories.map((category) => (
                  <Link key={category.slug} href={`/explore?category=${category.slug}`}>
                    <Badge>{category.name}</Badge>
                  </Link>
                ))}
                <Badge variant="outline">{new Date(book.publishedAt).getFullYear()}</Badge>
              </div>

              <div className="mt-5">
                <Link href={`/explore?search=${encodeURIComponent(book.author)}`} className="text-sm font-medium text-[var(--primary)]">
                  {book.author}
                </Link>
                <h1 className="mt-2 max-w-4xl font-serif text-4xl font-semibold leading-tight text-balance sm:text-5xl">
                  {book.title}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-[var(--muted-foreground)]">{book.shortDescription}</p>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1fr,0.82fr]">
              <div className="card-surface soft-panel p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <PriceDisplay
                      price={book.price}
                      compareAtPrice={book.compareAtPrice}
                      freeShipping={book.price >= 35}
                      size="lg"
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Badge variant="secondary">{book.inventory > 0 ? "In stock" : "Sold out"}</Badge>
                      <span className="text-sm text-[var(--muted-foreground)]">
                        {book.inventory > 0 ? `${book.inventory} copies ready to ship` : "Restock timing coming soon"}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-32 text-sm">
                    <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">Published</div>
                    <div className="mt-2 font-semibold">{formatDate(book.publishedAt)}</div>
                  </div>
                </div>
                <div className="mt-5">
                  <BookDetailActions bookId={book.id} slug={book.slug} />
                </div>
              </div>

              <div className="card-surface soft-panel p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                      Reader rating
                    </div>
                    <RatingStars rating={book.rating} count={book.reviewCount} size="lg" className="mt-3" />
                  </div>
                  <Button asChild variant="ghost" className="px-0 hover:bg-transparent hover:text-[var(--primary)]">
                    <Link href="#reviews">See all reviews</Link>
                  </Button>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                  <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${Math.min(book.rating / 5, 1) * 100}%` }} />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { icon: Truck, title: "Fast shipping", body: "Dispatch within 24 hours." },
                { icon: ShieldCheck, title: "Secure purchase", body: "Protected checkout." },
                { icon: CreditCard, title: "Clear pricing", body: "No hidden fees." },
              ].map((item) => (
                <div key={item.title} className="card-surface soft-panel p-4">
                  <item.icon className="h-5 w-5 text-[var(--primary)]" />
                  <div className="mt-3 font-semibold">{item.title}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.64fr,0.36fr]">
          <div className="space-y-8">
            <div className="card-surface soft-panel p-6 sm:p-8">
              <div className="eyebrow">Story overview</div>
              <h2 className="mt-3 font-serif text-3xl font-semibold">Why this book belongs on a thoughtful shelf</h2>
              <p className="mt-4 text-sm leading-8 text-[var(--muted-foreground)]">{book.synopsis}</p>
            </div>

            <div className="card-surface soft-panel p-6 sm:p-8">
              <div className="eyebrow">BookShore AI Summary</div>
              <h2 className="mt-3 font-serif text-3xl font-semibold">A clearer read on the book&apos;s essence</h2>
              <p className="mt-4 text-sm leading-8 text-[var(--foreground)]">
                {book.aiSummary ||
                  `${book.title} pairs ${book.categories[0]?.name.toLowerCase() ?? "literary"} energy with a voice that feels immediate, reflective, and worth discussing after the final page.`}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {book.aiTags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div id="reviews">
              <ReviewsPanel reviews={book.reviews} />
            </div>
          </div>

          <div className="space-y-8">
            <div className="card-surface soft-panel p-8">
              <div className="eyebrow">Book details</div>
              <h2 className="mt-3 font-serif text-3xl font-semibold">Metadata at a glance</h2>
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">Pages</span>
                  <span className="font-semibold">{book.pages}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">Language</span>
                  <span className="font-semibold">{book.language}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">ISBN</span>
                  <span className="font-semibold">{book.isbn}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">Publisher</span>
                  <span className="font-semibold">{book.publisher}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-[var(--muted-foreground)]">Format</span>
                  <span className="font-semibold">{book.format}</span>
                </div>
              </div>
            </div>

            <div className="card-surface soft-panel p-8">
              <div className="eyebrow">About the author</div>
              <div className="mt-4 flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)]">
                  {authorInitials}
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold">{book.author}</div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{authorBio}</p>
                  <Button asChild variant="ghost" className="mt-3 px-0 hover:bg-transparent hover:text-[var(--primary)]">
                    <Link href={`/explore?search=${encodeURIComponent(book.author)}`}>More books by this author</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="card-surface soft-panel p-8">
              <div className="eyebrow">Purchase support</div>
              <h2 className="mt-3 font-serif text-3xl font-semibold">Confidence cues before checkout</h2>
              <div className="mt-5 space-y-4">
                {[
                  "Gift notes can be added during checkout.",
                  "Free shipping unlocks automatically above $100 total.",
                  "Order tracking and status updates live inside your dashboard.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-[calc(var(--radius)-0.3rem)] border bg-white/60 p-4">
                    <HeartHandshake className="mt-0.5 h-4 w-4 text-[var(--accent)]" />
                    <span className="text-sm leading-7 text-[var(--muted-foreground)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <section className="mt-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <div className="eyebrow">People also explored</div>
              <h2 className="font-serif text-4xl font-semibold">Related books with a similar draw.</h2>
            </div>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/explore">Back to catalog</Link>
            </Button>
          </div>
          <RelatedBooksCarousel books={related} />
        </section>
      </section>
    </SiteShell>
  );
}

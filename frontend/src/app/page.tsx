import Link from "next/link";
import {
  ArrowRight,
  BookMarked,
  BookOpenText,
  BrainCircuit,
  CircleHelp,
  Compass,
  Info,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
  Truck,
} from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { HeroSpotlight } from "@/components/home/hero-spotlight";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { faqs, testimonials } from "@/lib/site-content";
import { serverFetch } from "@/lib/server-api";
import type { BlogPost, Book, Category } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

const faqIcons = [CircleHelp, Info, TriangleAlert];
const categoryIcons = [Compass, BookMarked, Sparkles, BrainCircuit, BookOpenText];

export default async function Home() {
  const [homeResponse, featuredResponse, categoriesResponse] = await Promise.all([
    serverFetch<{
      item: {
        stats: {
          featuredBooks: number;
          categoryCount: number;
          reviewCount: number;
          averageRating: number;
        };
        spotlight: Book[];
        journal: BlogPost[];
      };
    }>("/api/store/home", {
      next: { revalidate: 3600, tags: ["home"] },
    }),
    serverFetch<{ items: Book[] }>("/api/books/featured", {
      next: { revalidate: 3600, tags: ["featured-books"] },
    }),
    serverFetch<{ items: Category[] }>("/api/books/categories", {
      next: { revalidate: 3600, tags: ["categories"] },
    }),
  ]);

  const featuredBooks = featuredResponse.items.slice(0, 8);

  return (
    <SiteShell>
      <section className="section-shell py-8 sm:py-10">
        <div className="card-surface hero-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <HeroSpotlight books={homeResponse.item.spotlight} />
        </div>
      </section>

      <section className="section-shell py-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="card-surface soft-panel p-6">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <div className="eyebrow">Live bookstore signals</div>
                <h2 className="mt-3 font-serif text-4xl font-semibold">A calmer, more premium way to browse what is moving.</h2>
              </div>
              <Badge variant="outline">Updated hourly</Badge>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                {
                  label: "Books in stock",
                  value: homeResponse.item.stats.featuredBooks,
                  suffix: "",
                  bar: "w-[88%]",
                },
                {
                  label: "Happy readers",
                  value: homeResponse.item.stats.reviewCount,
                  suffix: "+",
                  bar: "w-[74%]",
                },
                {
                  label: "Categories",
                  value: homeResponse.item.stats.categoryCount,
                  suffix: "",
                  bar: "w-[58%]",
                },
                {
                  label: "Average rating",
                  value: Math.round(homeResponse.item.stats.averageRating * 10),
                  prefix: "",
                  suffix: "/10",
                  bar: "w-[92%]",
                },
              ].map((item, index) => (
                <div key={item.label} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/68 p-4">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                    {item.label}
                  </div>
                  <div className="mt-4 text-4xl font-semibold">
                    <AnimatedCounter value={item.value} prefix={item.prefix} suffix={item.suffix} />
                  </div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                    <div
                      className={`h-full rounded-full ${
                        index % 2 === 0 ? "bg-[var(--primary)]" : "bg-[var(--accent)]"
                      } ${item.bar}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface soft-panel grid gap-4 p-6 sm:grid-cols-3 lg:grid-cols-1">
            {[
              {
                icon: ShieldCheck,
                title: "Trusted payments",
                body: "Secure checkout with a cleaner card flow and stronger purchase confidence cues.",
              },
              {
                icon: Truck,
                title: "Reliable delivery",
                body: "Free shipping thresholds, tracked orders, and clear arrival expectations.",
              },
              {
                icon: MessageCircleMore,
                title: "AI personalization",
                body: "Compare titles, ask for gift picks, and uncover reading paths faster.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/68 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold">{item.title}</div>
                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Featured shelf</div>
            <h2 className="font-serif text-4xl font-semibold">Current arrivals with stronger merchandising cues.</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/explore">
              View full catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredBooks.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Browse collections</div>
            <h2 className="font-serif text-4xl font-semibold">Shop by category, with previews that feel like real shelves.</h2>
          </div>
          <Button asChild variant="ghost" className="px-0 hover:bg-transparent hover:text-[var(--primary)]">
            <Link href="/explore">
              Explore all shelves
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[var(--background)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[var(--background)] to-transparent" />
          <div className="scrollbar-none flex gap-5 overflow-x-auto pb-2">
            {categoriesResponse.items.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];
              const previewBooks = featuredResponse.items
                .filter((book) => book.categories.some((bookCategory) => bookCategory.slug === category.slug))
                .slice(0, 3);

              return (
                <Link
                  key={category.id}
                  href={`/explore?category=${category.slug}`}
                  className="card-surface soft-panel min-w-[20rem] flex-1 p-5 sm:min-w-[24rem]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="mt-4 font-serif text-3xl font-semibold">{category.name}</div>
                    </div>
                    <Badge>{category.bookCount} books</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">{category.description}</p>
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {previewBooks.map((book) => (
                      <div key={book.id} className="overflow-hidden rounded-[calc(var(--radius)-0.35rem)] border bg-white/60 p-2">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-[calc(var(--radius)-0.45rem)]">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)]">
                    Explore all
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="grid gap-5 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="card-surface p-8 text-[var(--primary-foreground)] [background:linear-gradient(145deg,rgba(30,58,95,0.98),rgba(17,36,59,0.92))]">
            <div className="eyebrow text-[var(--accent)]">Built for growth</div>
            <h2 className="mt-3 font-serif text-4xl font-semibold">
              The storefront now feels closer to a premium bookstore, not a generic catalog.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/72">
              Stronger hierarchy, richer merchandising, clearer purchase cues, and a more literary visual language improve trust from first impression to final checkout.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: BrainCircuit,
                title: "AI copy generator",
                description: "Generate polished book copy and merchandising bullets for catalog managers.",
              },
              {
                icon: MessageCircleMore,
                title: "Shopping assistant",
                description: "Ask for comparisons, gift picks, or reading paths right inside the store.",
              },
              {
                icon: ShieldCheck,
                title: "Smart classification",
                description: "Tag books by audience, tone, and discovery-friendly themes.",
              },
              {
                icon: Compass,
                title: "Business analysis",
                description: "Turn orders, inventory, and reader data into practical store decisions.",
              },
            ].map((feature) => (
              <Card key={feature.title} className="soft-panel p-6">
                <CardContent className="space-y-4 p-0">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold">{feature.title}</div>
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="mb-8">
          <div className="eyebrow">Reader voices</div>
          <h2 className="font-serif text-4xl font-semibold">What keeps readers returning to BookShore.</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={testimonial.name} className="soft-panel p-6">
              <CardContent className="flex h-full flex-col justify-between gap-5 p-0">
                <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Reader note {index + 1}
                </div>
                <p className="text-base leading-8">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">{testimonial.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow">Store journal</div>
            <h2 className="font-serif text-4xl font-semibold">Editorial notes that reinforce the brand.</h2>
          </div>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/blog">Read all articles</Link>
          </Button>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {homeResponse.item.journal.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-surface soft-panel overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-white/86">
                    {post.category}
                  </Badge>
                  {post.featured ? <Badge variant="secondary">Trending</Badge> : null}
                </div>
              </div>
              <div className="p-6">
                <div className="text-xs uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {post.authorName} • {post.readTime} min read
                </div>
                <div className="mt-4 font-serif text-3xl font-semibold">{post.title}</div>
                <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--muted-foreground)]">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{post.category}</Badge>
                    <Badge variant="outline">{formatDate(post.publishedAt)}</Badge>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[var(--primary)]" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-shell py-14">
        <div className="grid gap-10 lg:grid-cols-[0.82fr,1.18fr]">
          <div>
            <div className="eyebrow">Common questions</div>
            <h2 className="font-serif text-4xl font-semibold">
              Answers before someone drops out of checkout or discovery.
            </h2>
          </div>
          <div className="card-surface soft-panel px-6">
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => {
                const Icon = faqIcons[index % faqIcons.length];

                return (
                  <AccordionItem key={faq.question} value={`faq-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

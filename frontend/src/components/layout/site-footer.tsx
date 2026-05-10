import Link from "next/link";
import { ArrowRight, BookOpenText, Mail, MapPin, Phone, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { supportLinks } from "@/lib/site-content";

const shopLinks = [
  { href: "/explore", label: "Browse books" },
  { href: "/cart", label: "View cart" },
  { href: "/checkout", label: "Checkout" },
];

const serviceItems = [
  "Delivery in 2-5 business days",
  "Gift notes and thoughtful packaging",
  "SSLCommerz-secured payments",
  "Live order tracking",
];

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#09121e] text-[var(--primary-foreground)]">
      <div className="section-shell py-10 sm:py-12">
        <div className="grid gap-6 border-b border-white/10 pb-10 lg:grid-cols-[0.95fr,1.05fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
              Stay on the shelf list
            </div>
            <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
              New arrivals, staff picks, and reading paths without the noise.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/62">
              A concise bookstore note with launches, giftable recommendations, and editorial picks from BookShore.
            </p>
          </div>
          <div className="rounded-[calc(var(--radius)-0.35rem)] border border-white/10 bg-white/[0.04] p-3 sm:p-4">
            <NewsletterForm />
          </div>
        </div>

        <div className="grid gap-10 py-10 md:grid-cols-[1.25fr_0.75fr] xl:grid-cols-[1.35fr_0.7fr_0.7fr_0.85fr]">
          <div className="max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-[var(--accent)]">
                <BookOpenText className="h-5 w-5" />
              </div>
              <div>
                <div className="font-serif text-3xl font-semibold leading-none text-white">BookShore</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/48">
                  Premium discovery for serious readers
                </div>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/64">
              BookShore blends indie-bookshop warmth, cleaner ecommerce flow, and AI-powered personalization into a reading experience that feels distinctly curated.
            </p>
            <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
              {[
                { icon: Truck, label: "Tracked delivery" },
                { icon: ShieldCheck, label: "Secure checkout" },
                { icon: Sparkles, label: "Curated picks" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-white/76">
                  <item.icon className="h-3.5 w-3.5 text-[var(--accent)]" />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-white/58">
              <div className="inline-flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[var(--accent)]" />
                hello@bookshore.dev
              </div>
              <div className="inline-flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[var(--accent)]" />
                +1 (202) 555-0198
              </div>
              <div className="inline-flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[var(--accent)]" />
                19 Harbor Street, Seattle, WA
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Shop
            </div>
            <div className="space-y-3 text-sm text-white/62">
              {shopLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block hover:text-white">
                  {link.label}
                </Link>
              ))}
              <Link href="/dashboard" className="inline-flex items-center gap-2 hover:text-white">
                Reader dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Company
            </div>
            <div className="space-y-3 text-sm text-white/62">
              {supportLinks.map((link) => (
                <Link key={link.href} href={link.href} className="block hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              Service
            </div>
            <ul className="space-y-3 text-sm text-white/62">
              {serviceItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>BookShore creates a more thoughtful online bookstore experience for readers who want guidance, not noise.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/support" className="hover:text-white">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

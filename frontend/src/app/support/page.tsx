import { SiteShell } from "@/components/layout/site-shell";

export default function SupportPage() {
  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="mx-auto max-w-4xl card-surface p-10">
          <div className="eyebrow">Help and support</div>
          <h1 className="mt-4 font-serif text-5xl font-semibold">Support that matches the pace of a real bookstore.</h1>
          <div className="mt-6 space-y-5 text-sm leading-8 text-[var(--muted-foreground)]">
            <p>For order questions, delivery updates, or catalog issues, email hello@bookshore.dev.</p>
            <p>For dashboard or AI feature questions, include your account email and a quick note about what you were trying to do.</p>
            <p>We reply to most support requests within one business day and prioritize account access issues immediately.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

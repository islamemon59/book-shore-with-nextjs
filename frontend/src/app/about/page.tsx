import { SiteShell } from "@/components/layout/site-shell";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.85fr,1.15fr]">
          <div className="space-y-3">
            <div className="eyebrow">About BookShore</div>
            <h1 className="font-serif text-5xl font-semibold">A bookstore for readers who want context, not clutter.</h1>
          </div>
          <div className="card-surface p-8 text-sm leading-8 text-[var(--muted-foreground)]">
            BookShore started as a simple catalog experiment and grew into a modern bookstore experience focused on
            thoughtful curation, strong UX, and practical AI. We stock books that help teams build better products,
            help readers return to attention, and help curious people move between work, culture, and fiction without
            flattening those worlds into the same shelf.
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

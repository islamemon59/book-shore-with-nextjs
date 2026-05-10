import { ContactForm } from "@/components/forms/contact-form";
import { SiteShell } from "@/components/layout/site-shell";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[0.75fr,1.25fr]">
          <div className="space-y-4">
            <div className="eyebrow">Contact us</div>
            <h1 className="font-serif text-5xl font-semibold">Need help with an order, team list, or recommendation?</h1>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              Tell us what you need and we&apos;ll respond with the right person, not a canned reply.
            </p>
          </div>
          <div className="card-surface p-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

import { SiteShell } from "@/components/layout/site-shell";

export default function PrivacyPage() {
  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="mx-auto max-w-4xl card-surface p-10">
          <div className="eyebrow">Privacy</div>
          <h1 className="mt-4 font-serif text-5xl font-semibold">We keep data collection narrow and useful.</h1>
          <div className="mt-6 space-y-5 text-sm leading-8 text-[var(--muted-foreground)]">
            <p>BookShore stores account details, order records, reading preferences, and AI conversation history to improve your experience in the app.</p>
            <p>We use session cookies for authentication, and we only send the catalog and relevant user context to our AI provider when you trigger an AI feature.</p>
            <p>You can request account deletion or support assistance at hello@bookshore.dev.</p>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

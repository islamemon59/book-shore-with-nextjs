import { redirect } from "next/navigation";
import { BookOpenText, ShieldCheck, Sparkles, Star } from "lucide-react";
import { RegisterForm } from "@/components/auth/register-form";
import { SiteShell } from "@/components/layout/site-shell";
import { getServerSession } from "@/lib/auth";

export default async function RegisterPage() {
  const session = await getServerSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card-surface hero-panel flex min-h-[42rem] flex-col justify-between p-8 lg:p-10">
            <div>
              <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--accent)]">
                <BookOpenText className="h-6 w-6" />
              </div>
              <div className="mt-8 eyebrow">Join the bookstore</div>
              <h1 className="mt-3 font-serif text-5xl font-semibold text-balance">
                Create a reader account that feels curated from the start.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-8 text-[var(--muted-foreground)]">
                Save preferences, unlock AI-guided discovery, follow orders, and shape a more personal relationship with the catalog over time.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Sparkles, label: "Personal shelves" },
                { icon: Star, label: "Saved preferences" },
                { icon: ShieldCheck, label: "Secure account" },
              ].map((item) => (
                <div key={item.label} className="rounded-[calc(var(--radius)-0.25rem)] border bg-white/68 p-4">
                  <item.icon className="h-5 w-5 text-[var(--primary)]" />
                  <div className="mt-3 text-sm font-semibold">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-xl items-center">
            <RegisterForm />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

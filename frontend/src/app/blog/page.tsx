import Link from "next/link";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { serverFetch } from "@/lib/server-api";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const response = await serverFetch<{ items: BlogPost[] }>("/api/blog", {
    next: { revalidate: 3600, tags: ["blog"] },
  });

  return (
    <SiteShell>
      <section className="section-shell py-14">
        <div className="mb-10 space-y-3">
          <div className="eyebrow">BookShore journal</div>
          <h1 className="font-serif text-5xl font-semibold">Reading notes, curation stories, and practical guides.</h1>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {response.items.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="card-surface p-7">
              <Badge variant="outline">{post.category}</Badge>
              <h2 className="mt-5 font-serif text-4xl font-semibold">{post.title}</h2>
              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">{post.excerpt}</p>
              <div className="mt-6 text-xs uppercase tracking-normal text-[var(--muted-foreground)]">
                {formatDate(post.publishedAt)} • {post.readTime} min read
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

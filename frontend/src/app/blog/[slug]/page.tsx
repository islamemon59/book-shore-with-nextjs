import { notFound } from "next/navigation";
import { SiteShell } from "@/components/layout/site-shell";
import { Badge } from "@/components/ui/badge";
import { serverFetch } from "@/lib/server-api";
import type { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  let response: { item: BlogPost };

  try {
    response = await serverFetch<{ item: BlogPost }>(`/api/blog/${slug}`, {
      next: { revalidate: 3600, tags: [`blog-${slug}`] },
    });
  } catch {
    notFound();
  }

  const { item } = response!;

  return (
    <SiteShell>
      <article className="section-shell py-14">
        <div className="mx-auto max-w-4xl">
          <Badge variant="outline">{item.category}</Badge>
          <h1 className="mt-6 font-serif text-6xl font-semibold">{item.title}</h1>
          <div className="mt-5 text-sm text-[var(--muted-foreground)]">
            {item.authorName} • {item.authorRole} • {formatDate(item.publishedAt)}
          </div>
          <div className="card-surface mt-10 p-10">
            <p className="text-base leading-8">{item.content}</p>
          </div>
        </div>
      </article>
    </SiteShell>
  );
}

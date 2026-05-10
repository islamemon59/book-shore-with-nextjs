import { FeaturedShelvesStrip } from "./featured-shelves-strip";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <FeaturedShelvesStrip />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

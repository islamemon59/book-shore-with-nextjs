import { BookGridSkeleton } from "@/components/books/book-grid-skeleton";

export default function GlobalLoading() {
  return (
    <div className="section-shell py-16">
      <BookGridSkeleton count={8} />
    </div>
  );
}

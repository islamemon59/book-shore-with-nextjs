"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ pagination }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!pagination || pagination.totalPages <= 1) return null;

  const currentPage = pagination.page;
  const totalPages = pagination.totalPages;

  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-10">
      {/* Prev */}
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-neutral text-base-100 disabled:opacity-50"
      >
        Prev
      </button>

      {/* Page numbers */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 rounded-lg ${
            page === currentPage
              ? "bg-primary text-white"
              : "bg-base-100 border border-gray-300"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-neutral text-base-100 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
}

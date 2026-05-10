"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { AddToCartButton } from "@/components/cart/add-to-cart-button";
import { Button } from "@/components/ui/button";

export function BookDetailActions({ bookId, slug }: { bookId: string; slug: string }) {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/books/${slug}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "BookShore book recommendation",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      toast.success("Book link copied.");
    } catch {
      toast.error("Unable to share this book right now.");
    }
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AddToCartButton bookId={bookId} className="w-full">
        Add to cart
      </AddToCartButton>
      <Button type="button" variant="outline" className="w-full" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
    </div>
  );
}

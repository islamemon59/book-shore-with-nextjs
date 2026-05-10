"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { clientFetch } from "@/lib/client-api";
import { useAppDispatch, useAppSelector } from "@/lib/store";
import { setCartCount } from "@/lib/store/ui-slice";

type AddToCartButtonProps = ButtonProps & {
  bookId: string;
};

export function AddToCartButton({ bookId, children, ...props }: AddToCartButtonProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartCount = useAppSelector((state) => state.ui.cartCount);

  const mutation = useMutation({
    mutationFn: async () =>
      clientFetch("/api/cart", {
        method: "POST",
        body: {
          bookId,
          quantity: 1,
        },
      }),
    onMutate: () => {
      dispatch(setCartCount(cartCount + 1));
    },
    onSuccess: () => {
      toast.success("Added to cart.");
      router.refresh();
    },
    onError: (error) => {
      dispatch(setCartCount(Math.max(0, cartCount - 1)));
      toast.error(error instanceof Error ? error.message : "Unable to add to cart.");
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} disabled={mutation.isPending} {...props}>
      {mutation.isPending ? "Adding..." : children ?? "Add to cart"}
    </Button>
  );
}

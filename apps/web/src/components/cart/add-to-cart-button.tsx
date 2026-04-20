"use client";

import { useEffect, useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useCart } from "./cart-provider";

interface AddToCartButtonProps {
  productId: string;
  inStock: boolean;
  stock: number;
}

export function AddToCartButton({
  productId,
  inStock,
  stock,
}: AddToCartButtonProps) {
  const { addToCart, isPending, error, clearError } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(clearError, 5000);
    return () => clearTimeout(timer);
  }, [error, clearError]);

  if (!inStock) {
    return (
      <button
        disabled
        className="mt-2 w-full rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-surface opacity-50 cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-lg border border-border">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1 || isPending}
            className="inline-flex size-10 items-center justify-center rounded-l-lg text-foreground hover:bg-zinc-soft disabled:opacity-40"
            aria-label="Decrease quantity"
          >
            <MinusIcon className="size-4" />
          </button>
          <span className="min-w-[2.5rem] text-center text-sm font-medium tabular-nums text-foreground">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock || isPending}
            className="inline-flex size-10 items-center justify-center rounded-r-lg text-foreground hover:bg-zinc-soft disabled:opacity-40"
            aria-label="Increase quantity"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>

        <button
          onClick={() => addToCart(productId, quantity)}
          disabled={isPending}
          className="flex-1 rounded-lg bg-foreground px-6 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add to Cart"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

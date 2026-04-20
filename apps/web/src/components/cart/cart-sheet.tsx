"use client";

import Image from "next/image";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@repo/ui/sheet";
import { useCart } from "./cart-provider";
import { useEffect, useState } from "react";
import type { CartItemWithProduct } from "../../lib/integrations/swag-store-api";

function useSheetSide(): "right" | "bottom" {
  const [side, setSide] = useState<"right" | "bottom">("right");

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 1023px)");
    const update = () => setSide(mql.matches ? "bottom" : "right");
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return side;
}

function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

function CartItem({ item }: { item: CartItemWithProduct }) {
  const { updateItemQty, removeItem, isPending } = useCart();
  const { product, quantity, lineTotal } = item;
  const imageUrl = product.images[0] ?? "/placeholder.png";

  return (
    <div className="flex gap-3 py-3">
      <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-zinc-soft">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground">
            {product.name}
          </p>
          <button
            onClick={() => removeItem(item.productId)}
            disabled={isPending}
            className="shrink-0 rounded p-0.5 text-muted hover:text-foreground disabled:opacity-50"
            aria-label={`Remove ${product.name}`}
          >
            <TrashIcon className="size-3.5" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => updateItemQty(item.productId, quantity - 1)}
              disabled={isPending || quantity <= 1}
              className="inline-flex size-6 items-center justify-center rounded border border-border text-foreground hover:bg-zinc-soft disabled:opacity-40"
              aria-label="Decrease quantity"
            >
              <MinusIcon className="size-3" />
            </button>
            <span className="min-w-[1.5rem] text-center text-sm tabular-nums">
              {quantity}
            </span>
            <button
              onClick={() => updateItemQty(item.productId, quantity + 1)}
              disabled={isPending}
              className="inline-flex size-6 items-center justify-center rounded border border-border text-foreground hover:bg-zinc-soft disabled:opacity-40"
              aria-label="Increase quantity"
            >
              <PlusIcon className="size-3" />
            </button>
          </div>
          <p className="text-sm font-medium tabular-nums text-foreground">
            {formatCurrency(lineTotal, product.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
      <p className="text-sm text-muted">Your cart is empty</p>
    </div>
  );
}

export function CartSheet() {
  const { cart, isOpen, closeCart } = useCart();
  const side = useSheetSide();
  const items = cart?.items ?? [];
  const hasItems = items.length > 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side={side}
        className={
          side === "bottom"
            ? "min-h-[40dvh] max-h-[85dvh] rounded-t-xl"
            : undefined
        }
      >
        <SheetHeader>
          <SheetTitle>
            Cart{hasItems ? ` (${cart!.totalItems})` : ""}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your shopping cart
          </SheetDescription>
        </SheetHeader>

        {hasItems ? (
          <div className="flex-1 overflow-y-auto px-4">
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}

        {hasItems && (
          <SheetFooter>
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-sm font-medium text-foreground">
                Subtotal
              </span>
              <span className="text-base font-semibold tabular-nums text-foreground">
                {formatCurrency(cart!.subtotal, cart!.currency)}
              </span>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

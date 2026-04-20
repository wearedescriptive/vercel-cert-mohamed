"use client";

import { CartIcon } from "../icons";
import { useCart } from "./cart-provider";

export function CartBadge() {
  const { cart, openCart } = useCart();
  const count = cart?.totalItems ?? 0;

  return (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center rounded-md p-1.5 text-foreground hover:bg-zinc-soft"
      aria-label={`Cart${count > 0 ? `, ${count} item${count === 1 ? "" : "s"}` : ""}`}
    >
      <CartIcon size={22} />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-foreground text-[0.625rem] font-semibold leading-none text-surface">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}

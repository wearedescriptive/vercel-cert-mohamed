import Link from "next/link";
import { VercelLogo } from "@repo/ui/vercel-logo";
import { CartBadge } from "../cart/cart-badge";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-[3.75rem] border-b border-border bg-surface">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex items-center gap-2 text-[1.05rem] font-semibold tracking-tight text-foreground"
        >
          <VercelLogo width={24} height={24} />
          <span>Swag Store</span>
        </Link>
        <nav className="ml-auto mr-4 flex items-center gap-6" aria-label="Main">
          <Link
            href="/"
            className="text-[0.9375rem] text-muted hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/search"
            className="text-[0.9375rem] text-muted hover:text-foreground"
          >
            Search
          </Link>
        </nav>
        <CartBadge />
      </div>
    </header>
  );
}

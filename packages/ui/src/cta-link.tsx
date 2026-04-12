import Link from "next/link";
import type { ReactNode } from "react";

const defaultClassName =
  "inline-flex w-fit items-center gap-1.5 rounded-md bg-hero-fg px-5 py-3 text-[0.9375rem] font-semibold text-hero-bg transition-opacity hover:opacity-[0.92]";

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function CtaLink({ href, children, className }: CtaLinkProps) {
  return (
    <Link href={href} className={className ?? defaultClassName}>
      {children}
    </Link>
  );
}

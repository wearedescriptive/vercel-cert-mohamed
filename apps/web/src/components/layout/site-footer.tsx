"use client";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border bg-surface px-5 py-6">
      <p className="mx-auto max-w-6xl text-center text-[0.8125rem] text-muted">
        © {year} Vercel Swag Store. All rights reserved.
      </p>
    </footer>
  );
}

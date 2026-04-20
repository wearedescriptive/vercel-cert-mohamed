"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled error:", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-5 py-16">
      <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="mb-4 text-sm text-muted">
          We&apos;re sorry — an unexpected error occurred. Please try again, or
          head back to the home page.
        </p>
        {error.digest && (
          <p className="mb-6 font-mono text-xs text-muted">
            Reference: {error.digest}
          </p>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-soft"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

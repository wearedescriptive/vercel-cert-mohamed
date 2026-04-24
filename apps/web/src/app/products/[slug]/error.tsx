"use client";

import { useEffect } from "react";
import { ErrorCode } from "../../../components/error/error-code";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page error:", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-5 py-16">
      <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          We couldn&apos;t load this product
        </h2>
        <p className="mb-4 text-sm text-muted">
          The product may be unavailable or there was a temporary issue. Please
          try again, or browse our catalog.
        </p>
        {error.digest && (
          <>
            <p className="mb-3 text-sm text-muted">
              If this keeps happening, please share the error code below with
              our support team so we can trace it.
            </p>
            <ErrorCode digest={error.digest} />
          </>
        )}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-90"
          >
            Try Again
          </button>
          <a
            href="/search"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-zinc-soft"
          >
            Browse Products
          </a>
        </div>
      </div>
    </div>
  );
}

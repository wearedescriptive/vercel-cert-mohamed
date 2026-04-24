"use client";

import { useEffect, useRef, useState } from "react";

export function ErrorCode({ digest }: { digest?: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!digest) return null;

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(digest ?? "");
      setCopied(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API can reject in non-secure contexts; leave the pill visible so the user can select manually.
    }
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
      <span className="text-xs text-muted">Error code:</span>
      <code className="rounded-md border border-border bg-zinc-soft px-2 py-1 font-mono text-xs text-foreground">
        {digest}
      </code>
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy error code"
        className="rounded-md border border-border px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-zinc-soft"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

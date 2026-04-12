import Link from "next/link";

export type PaginationBarProps = {
  /** Current page (1-based). */
  page: number;
  /** Total pages (>= 1). */
  totalPages: number;
  /** Href for a given 1-based page number. */
  buildHref: (page: number) => string;
  className?: string;
  "aria-label"?: string;
};

function ChevronLeftIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="currentColor"
      className="shrink-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 20 20"
      fill="currentColor"
      className="shrink-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const controlBase =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border text-foreground transition-colors";
const controlEnabled =
  "border-border bg-surface hover:bg-zinc-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground/30";
const controlDisabled =
  "cursor-not-allowed border-border bg-zinc-soft text-muted opacity-50";

/**
 * Compact pagination: previous chevron, `< page >`, next chevron.
 * Chevrons are links when enabled, inert spans when disabled (first / last page).
 */
export function PaginationBar({
  page,
  totalPages,
  buildHref,
  className = "",
  "aria-label": ariaLabel = "Pagination",
}: PaginationBarProps) {
  const total = Math.max(1, totalPages);
  const current = Math.min(Math.max(1, page), total);
  const canPrev = current > 1;
  const canNext = current < total;

  return (
    <nav
      className={`flex items-center justify-center gap-3 ${className}`}
      aria-label={ariaLabel}
    >
      {canPrev ? (
        <Link
          href={buildHref(current - 1)}
          className={`${controlBase} ${controlEnabled}`}
          aria-label="Previous page"
        >
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span
          className={`${controlBase} ${controlDisabled}`}
          aria-label="Previous page"
          aria-disabled="true"
        >
          <ChevronLeftIcon />
        </span>
      )}

      <span
        className="min-w-[5.5rem] select-none text-center text-sm font-medium tabular-nums text-foreground"
        aria-current="page"
      >
        {` ${current} `}
      </span>

      {canNext ? (
        <Link
          href={buildHref(current + 1)}
          className={`${controlBase} ${controlEnabled}`}
          aria-label="Next page"
        >
          <ChevronRightIcon />
        </Link>
      ) : (
        <span
          className={`${controlBase} ${controlDisabled}`}
          aria-label="Next page"
          aria-disabled="true"
        >
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  );
}

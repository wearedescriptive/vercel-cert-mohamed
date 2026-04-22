"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { getSearchUrl } from "../../lib/search-url";
import { SearchFormPendingArea } from "./search-form-pending-area";
import { SearchSubmitButton } from "./search-submit-button";

const DEBOUNCE_MS = 1000;

export type SearchPageFormProps = {
  categoryOptions: { slug: string; name: string }[];
  initialQ: string;
  initialCategorySlug: string;
  children: ReactNode;
};

export function SearchPageForm({
  categoryOptions,
  initialQ,
  initialCategorySlug,
  children,
}: SearchPageFormProps) {
  const router = useRouter();
  const [isNavPending, startNavTransition] = useTransition();

  const [draft, setDraft] = useState(initialQ);
  const [category, setCategory] = useState(initialCategorySlug);

  useEffect(() => {
    setDraft(initialQ);
    setCategory(initialCategorySlug);
  }, [initialQ, initialCategorySlug]);

  function commitViaRouter(q: string, cat: string, page: number) {
    const url = getSearchUrl(q, cat, page);
    startNavTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  const debouncedSubmit = useDebouncedCallback((nextQ: string) => {
    const t = nextQ.trim();
    if (t.length > 0 && t.length < 3) return;
    commitViaRouter(t, category, 1);
  }, DEBOUNCE_MS);

  function onDraftChange(value: string) {
    setDraft(value);
    debouncedSubmit(value);
  }

  function onCategoryChange(next: string) {
    debouncedSubmit.cancel();
    setCategory(next);
    commitViaRouter(draft.trim(), next, 1);
  }

  return (
    <form
      className="flex min-w-0 w-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        debouncedSubmit.cancel();
        commitViaRouter(draft.trim(), category, 1);
      }}
    >
      <div className="mb-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
        <label className="min-w-0 flex-1">
          <span className="sr-only">Search</span>
          <input
            name="q"
            type="search"
            autoComplete="off"
            placeholder="Search products…"
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            className="h-11 w-full min-w-0 rounded-md border border-border bg-surface px-3 text-base text-foreground placeholder:text-muted sm:text-sm"
          />
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <SearchSubmitButton pending={isNavPending} />
          <label className="min-w-0 sm:max-w-[14rem] sm:shrink-0">
            <span className="mb-1 block text-xs font-medium text-muted sm:sr-only">
              Category
            </span>
            <div className="overflow-hidden rounded-md border border-border bg-surface pl-3 pr-2.5 focus-within:ring-2 focus-within:ring-foreground/15">
              <select
                name="category"
                value={category}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="h-11 w-full min-w-0 max-w-full cursor-pointer truncate border-0 bg-transparent py-0 pl-0 pr-7 text-base text-foreground outline-none focus:outline-none sm:text-sm"
              >
                <option value="">All categories</option>
                {categoryOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </label>
        </div>
      </div>

      <SearchFormPendingArea pending={isNavPending}>
        {children}
      </SearchFormPendingArea>
    </form>
  );
}

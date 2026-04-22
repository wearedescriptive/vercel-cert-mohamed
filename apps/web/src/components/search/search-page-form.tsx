"use client";

import type { ReactNode } from "react";
import { startTransition, useActionState, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { ProductCard } from "../product-card";
import { SearchPagination } from "./search-pagination";
import { runSearch, type SearchActionState } from "../../app/search/actions";
import { formatUsdFromCents } from "../../lib/format-price";
import { getSearchUrl } from "../../lib/search-url";
import { SearchFormPendingArea } from "./search-form-pending-area";
import { SearchSubmitButton } from "./search-submit-button";

const DEBOUNCE_MS = 1000;
const PLACEHOLDER_IMAGE = "/logo-vercel.svg";

function replaceSearchUrl(q: string, categorySlug: string, page: number) {
  if (typeof window === "undefined") return;
  if (window.location.pathname !== "/search") return;
  const url = getSearchUrl(q, categorySlug, page);
  // `{}` triggers Next's patched replaceState to sync canonicalUrl (passing
  // `window.history.state` skips router sync when state has __NA / _N).
  window.history.replaceState({}, "", url);
}

export type SearchPageFormProps = {
  categoryOptions: { slug: string; name: string }[];
  initialQ: string;
  initialCategorySlug: string;
  initialPage: number;
  children: ReactNode;
};

export function SearchPageForm({
  categoryOptions,
  initialQ,
  initialCategorySlug,
  initialPage,
  children,
}: SearchPageFormProps) {
  const initialSearchState: SearchActionState = {
    q: initialQ,
    categorySlug: initialCategorySlug,
    page: initialPage,
    products: [],
    pagination: null,
  };

  const [searchState, formAction, isPending] = useActionState(
    runSearch,
    initialSearchState,
  );

  const [draft, setDraft] = useState(initialQ);
  const [category, setCategory] = useState(initialCategorySlug);
  const [hasSearched, setHasSearched] = useState(false);

  // A real navigation changes the server-provided params. When that happens,
  // drop any stale client action state so the server-streamed `children`
  // becomes the source of truth again.
  useEffect(() => {
    setHasSearched(false);
    setDraft(initialQ);
    setCategory(initialCategorySlug);
  }, [initialQ, initialCategorySlug, initialPage]);

  useEffect(() => {
    setDraft(searchState.q);
    setCategory(searchState.categorySlug);
  }, [searchState.q, searchState.categorySlug]);

  useEffect(() => {
    if (!hasSearched) return;
    if (typeof window === "undefined") return;
    const desired = getSearchUrl(
      searchState.q,
      searchState.categorySlug,
      searchState.page,
    );
    const current = window.location.pathname + window.location.search;
    if (desired === current) return;
    window.history.replaceState({}, "", desired);
  }, [hasSearched, searchState.q, searchState.categorySlug, searchState.page]);

  function submitSearch(q: string, cat: string, page: number) {
    setHasSearched(true);
    replaceSearchUrl(q, cat, page);
    const fd = new FormData();
    fd.set("q", q);
    fd.set("category", cat);
    fd.set("page", String(page));
    startTransition(() => {
      formAction(fd);
    });
  }

  // Reset client-only state without relying on Next.js navigation. Using a
  // `<Link href="/search">` here would desync the router from our client-side
  // URL updates (`window.history.replaceState`) and the first click would be a
  // no-op navigation, leaving the empty state visible until a second click.
  function clearFilters() {
    debouncedSubmit.cancel();
    setDraft("");
    setCategory("");
    setHasSearched(false);
    replaceSearchUrl("", "", 1);
    const fd = new FormData();
    fd.set("q", "");
    fd.set("category", "");
    fd.set("page", "1");
    startTransition(() => {
      formAction(fd);
    });
  }

  const debouncedSubmit = useDebouncedCallback((nextQ: string) => {
    const t = nextQ.trim();
    if (t.length > 0 && t.length < 3) return;
    submitSearch(t, category, 1);
  }, DEBOUNCE_MS);

  function onDraftChange(value: string) {
    setDraft(value);
    debouncedSubmit(value);
  }

  function onCategoryChange(next: string) {
    debouncedSubmit.cancel();
    setCategory(next);
    submitSearch(draft.trim(), next, 1);
  }

  const isSearchMode =
    searchState.q.length > 0 || searchState.categorySlug.length > 0;
  const showEmpty = isSearchMode && searchState.products.length === 0;

  const clientResults = showEmpty ? (
    <div className="rounded-lg border border-border bg-surface px-4 py-8 text-center">
      <p className="text-sm font-medium text-foreground">
        No products match your filters.
      </p>
      <p className="mt-2 text-sm text-muted">
        Try different keywords or{" "}
        <button
          type="button"
          onClick={clearFilters}
          className="cursor-pointer text-foreground underline underline-offset-2"
        >
          clear filters
        </button>
        .
      </p>
    </div>
  ) : searchState.products.length === 0 ? (
    <p className="text-sm text-muted">No products found.</p>
  ) : (
    <>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-6">
        {searchState.products.map((product) => {
          const imageUrl = product.images?.[0] ?? PLACEHOLDER_IMAGE;
          const href = `/products/${encodeURIComponent(product.slug)}`;
          return (
            <ProductCard
              key={product.id}
              href={href}
              name={product.name}
              imageUrl={imageUrl}
              priceLabel={formatUsdFromCents(product.price)}
              prefetch={false}
            />
          );
        })}
      </div>
      {searchState.pagination ? (
        <SearchPagination
          pagination={searchState.pagination}
          q={searchState.q}
          categorySlug={searchState.categorySlug}
        />
      ) : null}
    </>
  );

  return (
    <form
      className="flex min-w-0 w-full flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        debouncedSubmit.cancel();
        submitSearch(draft.trim(), category, searchState.page);
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
          <SearchSubmitButton pending={isPending} />
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

      <SearchFormPendingArea pending={isPending}>
        {hasSearched ? clientResults : children}
      </SearchFormPendingArea>
    </form>
  );
}

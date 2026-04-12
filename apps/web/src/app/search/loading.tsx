import { SearchResultsSkeleton } from "../../components/search/search-results-skeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10">
      <div className="mb-2 h-8 w-40 animate-pulse rounded-md bg-skeleton" />
      <div className="mb-8 h-4 w-full max-w-md animate-pulse rounded-md bg-skeleton" />
      <div className="mb-8 flex min-w-0 flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
        <div className="h-11 flex-1 animate-pulse rounded-md bg-skeleton" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-3">
          <div className="h-11 w-full animate-pulse rounded-md bg-skeleton sm:w-24" />
          <div className="h-11 w-full animate-pulse rounded-md bg-skeleton sm:w-56" />
        </div>
      </div>
      <p className="sr-only" role="status">
        Loading search…
      </p>
      <SearchResultsSkeleton />
    </div>
  );
}

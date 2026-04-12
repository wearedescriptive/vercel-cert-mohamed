/** Product grid placeholder for loading / pending search. */
export function SearchResultsSkeleton() {
  return (
    <div
      className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-6"
      aria-busy="true"
      aria-label="Loading results"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-lg bg-skeleton"
        />
      ))}
    </div>
  );
}

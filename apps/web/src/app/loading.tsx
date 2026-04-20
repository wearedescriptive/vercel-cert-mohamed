export default function RootLoading() {
  console.log("RootLoading");
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-16">
      <div className="mb-6 h-8 w-48 animate-pulse rounded-md bg-skeleton" />
      <div className="mb-4 h-4 w-full max-w-md animate-pulse rounded-md bg-skeleton" />
      <div className="mb-10 h-4 w-64 animate-pulse rounded-md bg-skeleton" />

      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-lg border border-border"
          >
            <div className="aspect-square animate-pulse bg-skeleton" />
            <div className="px-4 pb-4 pt-3.5">
              <div className="mb-2 h-4 w-3/4 animate-pulse rounded bg-skeleton" />
              <div className="h-3 w-16 animate-pulse rounded bg-skeleton" />
            </div>
          </div>
        ))}
      </div>

      <p className="sr-only" role="status">
        Loading…
      </p>
    </div>
  );
}

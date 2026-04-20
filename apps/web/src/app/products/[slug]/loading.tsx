export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-12">
        <div className="aspect-square animate-pulse rounded-xl bg-skeleton" />

        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 h-5 w-20 animate-pulse rounded-full bg-skeleton" />
            <div className="h-8 w-3/4 animate-pulse rounded-md bg-skeleton" />
          </div>

          <div className="h-8 w-28 animate-pulse rounded-md bg-skeleton" />

          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-skeleton" />
            <div className="h-4 w-full animate-pulse rounded-md bg-skeleton" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-skeleton" />
          </div>

          <div className="h-4 w-24 animate-pulse rounded-md bg-skeleton" />

          <div className="flex items-center gap-3">
            <div className="h-10 w-28 animate-pulse rounded-lg bg-skeleton" />
            <div className="h-12 flex-1 animate-pulse rounded-lg bg-skeleton" />
          </div>
        </div>
      </div>

      <p className="sr-only" role="status">
        Loading product…
      </p>
    </div>
  );
}

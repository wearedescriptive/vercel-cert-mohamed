export function PromoBannerSkeleton() {
  return (
    <div
      className="h-12 w-full animate-promo-shimmer bg-[linear-gradient(90deg,#27272a_25%,#3f3f46_50%,#27272a_75%)] bg-[length:200%_100%]"
      aria-hidden
    />
  );
}

export function FeaturedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:gap-6" aria-hidden>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="aspect-square animate-pulse rounded-lg bg-skeleton"
        />
      ))}
    </div>
  );
}

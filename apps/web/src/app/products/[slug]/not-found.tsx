export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center px-5 py-16">
      <div className="w-full rounded-lg border border-border bg-surface p-8 text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          Product not found
        </h2>
        <p className="mb-6 text-sm text-muted">
          The product you&apos;re looking for doesn&apos;t exist or may have
          been removed. Try searching our catalog instead.
        </p>
        <a
          href="/search"
          className="inline-block rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-surface transition-opacity hover:opacity-90"
        >
          Browse Products
        </a>
      </div>
    </div>
  );
}

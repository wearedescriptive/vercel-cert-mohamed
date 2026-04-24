import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { FeaturedProducts } from "../components/home/featured-products";
import { HeroSection } from "../components/home/hero-section";
import {
  FeaturedProductsSkeleton,
  PromoBannerSkeleton,
} from "../components/home/home-skeletons";
import { PromoBanner } from "../components/home/promo-banner";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Featured Vercel merchandise, current promotions, and a curated selection for developers.",
  openGraph: {
    title: "Vercel Swag Store",
    description:
      "Featured Vercel merchandise, current promotions, and a curated selection for developers.",
    url: "/",
  },
};

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<PromoBannerSkeleton />}>
        <PromoBanner />
      </Suspense>
      <HeroSection />
      <section
        className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10"
        aria-labelledby="featured-heading"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
          <h2
            className="text-xl font-semibold tracking-[-0.02em] text-foreground"
            id="featured-heading"
          >
            Featured Products
          </h2>
          <Link
            href="/search"
            className="text-sm text-muted underline decoration-current underline-offset-[3px] hover:text-foreground"
          >
            View all
          </Link>
        </div>

        <FeaturedProducts />
      </section>
    </>
  );
}

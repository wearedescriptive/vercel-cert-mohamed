import { CtaLink } from "@repo/ui/cta-link";
import { HeroWithArtDirection } from "@repo/ui/hero-with-art-direction";

export function HeroSection() {
  return (
    <section className="bg-hero-bg text-hero-fg" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-8 px-5 pb-12 pt-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:pb-16 lg:pt-14">
        <div>
          <h1
            id="hero-heading"
            className="mb-4 text-[clamp(2rem,5vw,3rem)] font-bold leading-none tracking-[-0.03em]"
          >
            Wear the framework you ship with.
          </h1>
          <p className="mb-7 max-w-lg text-[1.0625rem] leading-[1.55] text-hero-subtle">
            Premium swag for developers who build with Vercel. From tees to tech gear, represent the
            tools you love.
          </p>
          <CtaLink href="/search">Browse All Products →</CtaLink>
        </div>
        <div className="relative min-w-0 aspect-[750/900] overflow-hidden rounded-lg sm:aspect-[960/720] lg:aspect-[1440/600]">
          <HeroWithArtDirection src="/hero-swag-store-vercel-dark.png" />
        </div>
      </div>
    </section>
  );
}

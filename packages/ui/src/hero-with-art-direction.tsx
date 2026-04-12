import { getImageProps } from "next/image";
import type { CSSProperties } from "react";

const DEFAULT_ALT =
  "Vercel Swag Store — premium developer merchandise flat lay";

export type HeroWithArtDirectionProps = {
  src: string;
  alt?: string;
};

function mergeImgStyle(base: CSSProperties | undefined): CSSProperties {
  const fromProps =
    base && typeof base === "object" && !Array.isArray(base) ? base : {};
  return {
    ...fromProps,
    width: "100%",
    height: "100%",
    display: "block",
  };
}

export function HeroWithArtDirection({
  src,
  alt = DEFAULT_ALT,
}: HeroWithArtDirectionProps) {
  const common = {
    alt,
    sizes: "(min-width: 1024px) 52vw, (min-width: 640px) 60vw, 100vw" as const,
    src,
  };

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    width: 1440,
    height: 600,
    quality: 85,
  });

  const {
    props: { srcSet: tabletSrcSet },
  } = getImageProps({
    ...common,
    width: 960,
    height: 720,
    quality: 78,
  });

  const {
    props: { style: mobileStyle, ...imgAttrs },
  } = getImageProps({
    ...common,
    width: 750,
    height: 900,
    quality: 75,
  });

  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source media="(min-width: 1024px)" srcSet={desktopSrcSet} />
      <source media="(min-width: 640px)" srcSet={tabletSrcSet} />
      <img
        {...imgAttrs}
        style={mergeImgStyle(mobileStyle)}
        fetchPriority="high"
        decoding="async"
        className="h-full w-full rounded-lg object-cover object-center"
      />
    </picture>
  );
}

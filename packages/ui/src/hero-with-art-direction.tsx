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

const DESKTOP_SIZES = "min(52vw, 510px)";
const TABLET_SIZES = "calc(100vw - 40px)";
const MOBILE_SIZES = "100vw";

export function HeroWithArtDirection({
  src,
  alt = DEFAULT_ALT,
}: HeroWithArtDirectionProps) {
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    src,
    alt,
    width: 1440,
    height: 600,
    quality: 85,
    sizes: DESKTOP_SIZES,
  });

  const {
    props: { srcSet: tabletSrcSet },
  } = getImageProps({
    src,
    alt,
    width: 960,
    height: 720,
    quality: 85,
    sizes: TABLET_SIZES,
  });

  const {
    props: { style: mobileStyle, ...imgAttrs },
  } = getImageProps({
    src,
    alt,
    width: 750,
    height: 900,
    quality: 75,
    sizes: MOBILE_SIZES,
  });

  return (
    <picture className="absolute inset-0 block h-full w-full">
      <source
        media="(min-width: 1024px)"
        srcSet={desktopSrcSet}
        sizes={DESKTOP_SIZES}
      />
      <source
        media="(min-width: 640px)"
        srcSet={tabletSrcSet}
        sizes={TABLET_SIZES}
      />
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

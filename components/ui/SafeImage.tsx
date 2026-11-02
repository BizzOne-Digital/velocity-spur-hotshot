"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { PLACEHOLDER_IMAGE, resolveImageSrc, shouldSkipOptimization } from "@/lib/imageFallback";

type Props = Omit<ImageProps, "src"> & { src?: string | null };

/**
 * next/image wrapper that never breaks the layout: empty values, legacy
 * /uploads/ paths and load errors all fall back to the placeholder.
 */
export default function SafeImage({ src, alt, unoptimized, ...rest }: Props) {
  const initial = resolveImageSrc(src);
  const [current, setCurrent] = useState(initial);
  const [lastSrc, setLastSrc] = useState(initial);

  // Reset when the parent passes a new src (e.g. admin preview after upload).
  if (initial !== lastSrc) {
    setLastSrc(initial);
    setCurrent(initial);
  }

  return (
    <Image
      {...rest}
      src={current}
      alt={alt}
      unoptimized={unoptimized ?? shouldSkipOptimization(current)}
      onError={() => {
        if (current !== PLACEHOLDER_IMAGE) setCurrent(PLACEHOLDER_IMAGE);
      }}
    />
  );
}

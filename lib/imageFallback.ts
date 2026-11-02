export const PLACEHOLDER_IMAGE = "/images/placeholder.webp";

/**
 * Normalises any stored image URL into something safe to render.
 * - Empty values and legacy `/uploads/...` paths (from an old filesystem
 *   storage approach that no longer exists on Vercel) fall back to the placeholder.
 * - Everything else is returned unchanged.
 */
export function resolveImageSrc(src?: string | null): string {
  if (!src || !src.trim()) return PLACEHOLDER_IMAGE;
  if (src.startsWith("/uploads/")) return PLACEHOLDER_IMAGE;
  return src;
}

/**
 * Uploads from /api/uploads are served straight from MongoDB with immutable
 * caching; the Next.js optimizer cannot fetch route-handler responses, so they
 * render unoptimized. GIFs and SVGs also skip optimisation.
 */
export function shouldSkipOptimization(src: string): boolean {
  return src.startsWith("/api/uploads/") || src.endsWith(".gif") || src.endsWith(".svg");
}

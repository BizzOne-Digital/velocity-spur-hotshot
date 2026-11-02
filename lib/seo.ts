import type { Metadata } from "next";
import { SITE_URL } from "./constants";

type PageMeta = { title: string; description: string; path: string; image?: string };

/** Consistent per-page metadata: canonical, Open Graph and Twitter card. */
export function pageMetadata({ title, description, path, image }: PageMeta): Metadata {
  const ogImage = image?.startsWith("https://") ? image : image?.startsWith("/") ? `${SITE_URL}${image}` : undefined;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      locale: "en_CA",
      siteName: "Velocity Spur Hotshot Ltd.",
      ...(ogImage ? { images: [{ url: ogImage, width: 1600, height: 900, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

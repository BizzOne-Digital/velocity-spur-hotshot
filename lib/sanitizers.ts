import { ICON_KEYS } from "./icons";
import { bool, imageUrl, num, str, strList } from "./validation";

const icon = (v: unknown, fallback: string) => {
  const s = str(v, 40);
  return ICON_KEYS.includes(s) ? s : fallback;
};

export function sanitizeService(b: Record<string, unknown>) {
  const title = str(b.title, 160);
  if (!title) return { data: {}, error: "Title is required" };
  return {
    data: {
      title,
      slug: str(b.slug, 80),
      shortDescription: str(b.shortDescription, 400),
      description: str(b.description, 4000),
      image: imageUrl(b.image),
      icon: icon(b.icon, "truck"),
      features: strList(b.features),
      disclaimer: str(b.disclaimer, 600),
      order: num(b.order),
      active: bool(b.active),
    },
  };
}

export function sanitizePackage(b: Record<string, unknown>) {
  const title = str(b.title, 160);
  if (!title) return { data: {}, error: "Title is required" };
  return {
    data: {
      title,
      slug: str(b.slug, 80),
      description: str(b.description, 2000),
      features: strList(b.features),
      image: imageUrl(b.image),
      icon: icon(b.icon, "handshake"),
      ctaLabel: str(b.ctaLabel, 80) || "Discuss Requirements",
      order: num(b.order),
      active: bool(b.active),
    },
  };
}

export function sanitizeGallery(b: Record<string, unknown>) {
  const title = str(b.title, 160);
  const image = imageUrl(b.image);
  if (!title) return { data: {}, error: "Title is required" };
  if (!image) return { data: {}, error: "An image is required" };
  return {
    data: {
      title,
      description: str(b.description, 1000),
      image,
      category: str(b.category, 80) || "General",
      order: num(b.order),
      active: bool(b.active),
    },
  };
}

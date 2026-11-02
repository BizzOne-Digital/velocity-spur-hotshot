import { createHandler } from "@/lib/adminCrud";
import { sanitizeGallery } from "@/lib/sanitizers";
import GalleryItem from "@/models/GalleryItem";

export const runtime = "nodejs";

export const POST = createHandler({ model: GalleryItem, sanitize: sanitizeGallery, imageField: "image" });

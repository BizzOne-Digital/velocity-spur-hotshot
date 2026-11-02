import { itemHandlers } from "@/lib/adminCrud";
import { sanitizeGallery } from "@/lib/sanitizers";
import GalleryItem from "@/models/GalleryItem";

export const runtime = "nodejs";

const handlers = itemHandlers({ model: GalleryItem, sanitize: sanitizeGallery, imageField: "image" });

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

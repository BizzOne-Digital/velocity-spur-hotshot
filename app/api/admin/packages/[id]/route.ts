import { itemHandlers } from "@/lib/adminCrud";
import { sanitizePackage } from "@/lib/sanitizers";
import TransportationPackage from "@/models/TransportationPackage";

export const runtime = "nodejs";

const handlers = itemHandlers({
  model: TransportationPackage,
  sanitize: sanitizePackage,
  slug: true,
  imageField: "image",
});

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

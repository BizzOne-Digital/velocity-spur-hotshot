import { createHandler } from "@/lib/adminCrud";
import { sanitizePackage } from "@/lib/sanitizers";
import TransportationPackage from "@/models/TransportationPackage";

export const runtime = "nodejs";

export const POST = createHandler({
  model: TransportationPackage,
  sanitize: sanitizePackage,
  slug: true,
  imageField: "image",
});

import { itemHandlers } from "@/lib/adminCrud";
import { sanitizeService } from "@/lib/sanitizers";
import Service from "@/models/Service";

export const runtime = "nodejs";

const handlers = itemHandlers({ model: Service, sanitize: sanitizeService, slug: true, imageField: "image" });

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;

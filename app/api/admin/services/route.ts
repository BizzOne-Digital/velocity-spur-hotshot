import { createHandler } from "@/lib/adminCrud";
import { sanitizeService } from "@/lib/sanitizers";
import Service from "@/models/Service";

export const runtime = "nodejs";

export const POST = createHandler({ model: Service, sanitize: sanitizeService, slug: true, imageField: "image" });

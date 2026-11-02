import "server-only";
import type { Model } from "mongoose";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";
import { connectDB } from "./mongodb";
import { deleteIfReplaced, deleteStoredUpload } from "./deleteStoredUpload";
import { slugify } from "./validation";

type Sanitizer = (body: Record<string, unknown>) => { data: Record<string, unknown>; error?: string };

type CrudConfig = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>;
  sanitize: Sanitizer;
  /** Generate a unique slug from `title` when the model has a slug field. */
  slug?: boolean;
  /** Field holding an /api/uploads URL to clean up on replace/delete. */
  imageField?: string;
};

export function revalidateSite() {
  revalidatePath("/", "layout");
}

async function uniqueSlug(model: CrudConfig["model"], base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "item";
  let candidate = root;
  for (let i = 2; i < 100; i++) {
    const clash = await model.exists(excludeId ? { slug: candidate, _id: { $ne: excludeId } } : { slug: candidate });
    if (!clash) return candidate;
    candidate = `${root}-${i}`;
  }
  return `${root}-${Date.now()}`;
}

function serialise(doc: { toObject(): Record<string, unknown> }) {
  const obj = doc.toObject();
  return { ...obj, id: String(obj._id) };
}

/** Builds POST (create) for a collection route. */
export function createHandler(cfg: CrudConfig) {
  return async function POST(req: Request) {
    const { error } = await requireAdmin();
    if (error) return error;

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const { data, error: invalid } = cfg.sanitize(body);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 422 });

    try {
      await connectDB();
      if (cfg.slug) data.slug = await uniqueSlug(cfg.model, String(data.slug || data.title));
      const doc = await cfg.model.create(data);
      revalidateSite();
      return NextResponse.json({ success: true, item: serialise(doc) }, { status: 201 });
    } catch (err) {
      console.error("Create failed", err);
      return NextResponse.json({ error: "Could not create item" }, { status: 500 });
    }
  };
}

/** Builds PUT (update) and DELETE for an item route. */
export function itemHandlers(cfg: CrudConfig) {
  type Ctx = { params: Promise<{ id: string }> };

  async function PUT(req: Request, { params }: Ctx) {
    const { error } = await requireAdmin();
    if (error) return error;
    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const { data, error: invalid } = cfg.sanitize(body);
    if (invalid) return NextResponse.json({ error: invalid }, { status: 422 });

    try {
      await connectDB();
      const existing = await cfg.model.findById(id);
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

      if (cfg.slug) data.slug = await uniqueSlug(cfg.model, String(data.slug || data.title), id);
      const previousImage = cfg.imageField ? (existing.get(cfg.imageField) as string | undefined) : undefined;

      existing.set(data);
      await existing.save();

      // Replacement workflow: new URL is saved first, then the old upload is removed.
      if (cfg.imageField) await deleteIfReplaced(previousImage, data[cfg.imageField] as string);

      revalidateSite();
      return NextResponse.json({ success: true, item: serialise(existing) });
    } catch (err) {
      console.error("Update failed", err);
      return NextResponse.json({ error: "Could not update item" }, { status: 500 });
    }
  }

  async function DELETE(_req: Request, { params }: Ctx) {
    const { error } = await requireAdmin();
    if (error) return error;
    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    try {
      await connectDB();
      const doc = await cfg.model.findByIdAndDelete(id);
      if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
      if (cfg.imageField) await deleteStoredUpload(doc.get(cfg.imageField) as string);
      revalidateSite();
      return NextResponse.json({ success: true });
    } catch (err) {
      console.error("Delete failed", err);
      return NextResponse.json({ error: "Could not delete item" }, { status: 500 });
    }
  }

  return { PUT, DELETE };
}

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { revalidateSite } from "@/lib/adminCrud";
import { DEFAULT_PAGES } from "@/lib/defaults";
import { deleteIfReplaced } from "@/lib/deleteStoredUpload";
import { imageUrl, linkUrl, str } from "@/lib/validation";
import type { SectionContent } from "@/lib/types";
import PageContent, { PAGE_KEYS, type PageKey } from "@/models/PageContent";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ pageKey: string }> };

/** Keeps additionalData JSON-safe and bounded; image-like keys are validated. */
function cleanData(value: unknown, depth = 0): unknown {
  if (depth > 4) return null;
  if (typeof value === "string") return value.slice(0, 2000);
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((v) => cleanData(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value).slice(0, 40)) {
      if (!/^[A-Za-z][A-Za-z0-9_]{0,40}$/.test(k)) continue;
      out[k] = /image$/i.test(k) ? imageUrl(v) : cleanData(v, depth + 1);
    }
    return out;
  }
  return null;
}

export async function PUT(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { pageKey: rawKey } = await params;
  const pageKey = rawKey as PageKey;
  if (!PAGE_KEYS.includes(pageKey)) {
    return NextResponse.json({ error: "Unknown page" }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as { sections?: Partial<SectionContent>[] };
  const allowedKeys = new Set((DEFAULT_PAGES[pageKey] ?? []).map((s) => s.sectionKey));
  const sections = (body.sections ?? [])
    .filter((s) => s && allowedKeys.has(String(s.sectionKey)))
    .map((s) => ({
      sectionKey: String(s.sectionKey),
      heading: str(s.heading, 300),
      subheading: str(s.subheading, 600),
      description: str(s.description, 5000),
      image: imageUrl(s.image),
      ctaLabel: str(s.ctaLabel, 80),
      ctaUrl: linkUrl(s.ctaUrl),
      additionalData: (cleanData(s.additionalData ?? {}) as Record<string, unknown>) ?? {},
    }));

  try {
    await connectDB();
    const previous = await PageContent.findOne({ pageKey }).lean<{ sections?: SectionContent[] }>();
    await PageContent.updateOne({ pageKey }, { $set: { sections } }, { upsert: true });

    // Remove uploads that were replaced or cleared in this save.
    for (const old of previous?.sections ?? []) {
      const next = sections.find((s) => s.sectionKey === old.sectionKey);
      await deleteIfReplaced(old.image, next?.image);
      const oldBg = (old.additionalData as Record<string, unknown> | undefined)?.backgroundImage;
      const newBg = next?.additionalData?.backgroundImage;
      if (typeof oldBg === "string") await deleteIfReplaced(oldBg, typeof newBg === "string" ? newBg : "");
    }

    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Page save failed", err);
    return NextResponse.json({ error: "Could not save page content" }, { status: 500 });
  }
}

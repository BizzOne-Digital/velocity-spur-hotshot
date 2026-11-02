import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { revalidateSite } from "@/lib/adminCrud";
import { deleteIfReplaced } from "@/lib/deleteStoredUpload";
import { imageUrl, isEmail, str, strList } from "@/lib/validation";
import type { SiteSettings } from "@/lib/types";
import SiteSetting from "@/models/SiteSetting";

export const runtime = "nodejs";

const social = (v: unknown) => {
  const s = str(v, 300);
  return s.startsWith("https://") ? s : "";
};

export async function PUT(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const b = (await req.json().catch(() => ({}))) as Partial<SiteSettings> & { socials?: Record<string, unknown> };
  const email = str(b.email, 200);
  if (email && !isEmail(email)) return NextResponse.json({ error: "Invalid email address" }, { status: 422 });

  const value: SiteSettings = {
    companyName: str(b.companyName, 160) || "Velocity Spur Hotshot Ltd.",
    tagline: str(b.tagline, 160),
    secondaryTagline: str(b.secondaryTagline, 300),
    phone: str(b.phone, 40),
    email,
    location: str(b.location, 160),
    logoUrl: imageUrl(b.logoUrl),
    primaryServiceArea: str(b.primaryServiceArea, 80) || "Alberta",
    serviceCommunities: strList(b.serviceCommunities, 30, 60),
    plannedExpansion: strList(b.plannedExpansion, 10, 60),
    socials: {
      facebook: social(b.socials?.facebook),
      instagram: social(b.socials?.instagram),
      linkedin: social(b.socials?.linkedin),
      youtube: social(b.socials?.youtube),
    },
  };

  try {
    await connectDB();
    const prev = await SiteSetting.findOne({ key: "site" }).lean<{ value?: Partial<SiteSettings> }>();
    await SiteSetting.updateOne({ key: "site" }, { $set: { value } }, { upsert: true });
    await deleteIfReplaced(prev?.value?.logoUrl, value.logoUrl);
    revalidateSite();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Settings save failed", err);
    return NextResponse.json({ error: "Could not save settings" }, { status: 500 });
  }
}

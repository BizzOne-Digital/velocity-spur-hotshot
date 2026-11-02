import crypto from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { deleteStoredUpload } from "@/lib/deleteStoredUpload";
import { ALLOWED_FOLDERS, ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES, isAllowedFolder } from "@/lib/uploads";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = form.get("file");
  const folder = String(form.get("folder") ?? "");

  if (!isAllowedFolder(folder)) {
    return NextResponse.json({ error: `Folder must be one of: ${ALLOWED_FOLDERS.join(", ")}` }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const ext = ALLOWED_IMAGE_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Only PNG, JPEG, WEBP and GIF images are allowed" }, { status: 415 });
  }
  if (file.size === 0 || file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: "Image must be between 1 byte and 8 MB" }, { status: 413 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;

  try {
    await connectDB();
    await StoredUpload.create({ folder, filename, mimeType: file.type, size: buffer.length, data: buffer });
  } catch (err) {
    console.error("Upload failed", err);
    return NextResponse.json({ error: "Could not store the image. Please try again." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    url: `/api/uploads/${folder}/${filename}`,
    filename,
    size: buffer.length,
    folder,
  });
}

/**
 * Removes an upload that was never saved to a content document
 * (e.g. the admin replaced an image twice before saving).
 */
export async function DELETE(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const url = new URL(req.url).searchParams.get("url") ?? "";
  if (!url.startsWith("/api/uploads/")) {
    return NextResponse.json({ error: "Invalid upload URL" }, { status: 400 });
  }
  const deleted = await deleteStoredUpload(url);
  return NextResponse.json({ success: true, deleted });
}

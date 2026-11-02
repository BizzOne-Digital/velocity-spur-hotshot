import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { isSafeFilename, QUOTE_ATTACHMENT_FOLDER } from "@/lib/uploads";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

type Params = { params: Promise<{ filename: string }> };

/** Serves private quote attachments to authenticated admins only. */
export async function GET(_req: Request, { params }: Params) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { filename } = await params;
  if (!isSafeFilename(filename)) return new Response("Not found", { status: 404 });

  await connectDB();
  const upload = await StoredUpload.findOne({ folder: QUOTE_ATTACHMENT_FOLDER, filename }).lean();
  if (!upload) return new Response("Not found", { status: 404 });

  const data = upload.data as unknown as { buffer: ArrayBuffer } | Buffer;
  const body = Buffer.isBuffer(data) ? data : Buffer.from((data as { buffer: ArrayBuffer }).buffer);

  return new Response(new Uint8Array(body), {
    headers: {
      "Content-Type": upload.mimeType,
      "Content-Length": String(upload.size),
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

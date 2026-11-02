import { connectDB } from "@/lib/mongodb";
import { isAllowedFolder, isSafeFilename } from "@/lib/uploads";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

type Params = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_req: Request, { params }: Params) {
  const { folder, filename } = await params;

  if (!isAllowedFolder(folder) || !isSafeFilename(filename)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    await connectDB();
    const upload = await StoredUpload.findOne({ folder, filename }).lean();
    if (!upload) return new Response("Not found", { status: 404 });

    const data = upload.data as unknown as { buffer: ArrayBuffer } | Buffer;
    const body = Buffer.isBuffer(data) ? data : Buffer.from((data as { buffer: ArrayBuffer }).buffer);

    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": upload.mimeType,
        "Content-Length": String(upload.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("Serve upload failed", err);
    return new Response("Server error", { status: 500 });
  }
}

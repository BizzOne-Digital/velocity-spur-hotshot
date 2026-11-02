import "server-only";
import { connectDB } from "./mongodb";
import { isAllowedFolder, isSafeFilename, QUOTE_ATTACHMENT_FOLDER } from "./uploads";
import StoredUpload from "@/models/StoredUpload";

const PUBLIC_PREFIX = "/api/uploads/";
const ATTACHMENT_PREFIX = "/api/admin/attachments/";

/**
 * Deletes the StoredUpload document behind an `/api/uploads/{folder}/{filename}`
 * URL. Any other URL (Unsplash, /images, legacy /uploads) is ignored.
 * Returns true when a document was removed.
 */
export async function deleteStoredUpload(url: string | null | undefined): Promise<boolean> {
  if (!url) return false;

  let folder: string;
  let filename: string;

  if (url.startsWith(PUBLIC_PREFIX)) {
    const parts = url.slice(PUBLIC_PREFIX.length).split("?")[0].split("/");
    if (parts.length !== 2) return false;
    [folder, filename] = parts.map((p) => decodeURIComponent(p));
    if (!isAllowedFolder(folder)) return false;
  } else if (url.startsWith(ATTACHMENT_PREFIX)) {
    const parts = url.slice(ATTACHMENT_PREFIX.length).split("?")[0].split("/");
    if (parts.length !== 1) return false;
    folder = QUOTE_ATTACHMENT_FOLDER;
    filename = decodeURIComponent(parts[0]);
  } else {
    return false;
  }

  if (!isSafeFilename(filename)) return false;

  try {
    await connectDB();
    const res = await StoredUpload.deleteOne({ folder, filename });
    return res.deletedCount > 0;
  } catch (err) {
    console.error("deleteStoredUpload failed", err);
    return false;
  }
}

/** Deletes the previous upload only when it has actually been replaced. */
export async function deleteIfReplaced(previous?: string | null, next?: string | null): Promise<void> {
  if (previous && previous !== next) await deleteStoredUpload(previous);
}

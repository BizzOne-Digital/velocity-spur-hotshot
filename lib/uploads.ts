export const ALLOWED_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof ALLOWED_FOLDERS)[number];

/** Private folder for customer quote attachments (never served publicly). */
export const QUOTE_ATTACHMENT_FOLDER = "quotes";

export const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const ATTACHMENT_TYPES: Record<string, string> = {
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf": "pdf",
};

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const FILENAME_RE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,120}$/;

export function isAllowedFolder(folder: string): folder is UploadFolder {
  return (ALLOWED_FOLDERS as readonly string[]).includes(folder);
}

export function isSafeFilename(filename: string): boolean {
  return (
    FILENAME_RE.test(filename) &&
    !filename.includes("..") &&
    !filename.includes("/") &&
    !filename.includes("\\")
  );
}

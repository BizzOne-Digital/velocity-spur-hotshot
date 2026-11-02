"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import SafeImage from "@/components/ui/SafeImage";

export type UploadFolder = "products" | "gallery" | "pages" | "misc";

type Props = {
  value?: string;
  folder: UploadFolder;
  onChange: (url: string) => void;
  label?: string;
  hint?: string;
};

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_BYTES = 8 * 1024 * 1024;

/**
 * Uploads an image to /api/upload (stored in MongoDB) and reports only the
 * resulting URL. The parent persists that URL when it saves; the server then
 * removes the previously saved upload. Uploads made in this session that get
 * replaced again before saving are cleaned up here so they never orphan.
 */
export default function LocalImageField({ value = "", folder, onChange, label = "Image", hint }: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const sessionUploads = useRef<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);

  async function discardIfUnsaved(url: string) {
    if (!url || !sessionUploads.current.has(url)) return;
    sessionUploads.current.delete(url);
    await fetch(`/api/upload?url=${encodeURIComponent(url)}`, { method: "DELETE" }).catch(() => undefined);
  }

  async function upload(file: File) {
    if (!ACCEPTED.includes(file.type)) {
      toast.error("Use a PNG, JPEG, WEBP or GIF image.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("Image must be 8 MB or smaller.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    setUploading(true);
    try {
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Upload failed");

      const previous = value;
      sessionUploads.current.add(data.url);
      onChange(data.url);
      await discardIfUnsaved(previous);
      toast.success("Image uploaded. Remember to save your changes.");
    } catch (err) {
      toast.error((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function remove() {
    const previous = value;
    onChange("");
    await discardIfUnsaved(previous);
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="overflow-hidden rounded-lg border border-white/15 bg-ink/50">
        {value ? (
          <div className="relative aspect-video w-full">
            <SafeImage src={value} alt={`${label} preview`} fill sizes="400px" className="object-cover" unoptimized />
            {uploading && (
              <div className="absolute inset-0 grid place-items-center bg-ink/70">
                <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Uploading" />
              </div>
            )}
          </div>
        ) : (
          <label
            htmlFor={inputId}
            className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-transparent p-4 text-center transition hover:border-brand/50 hover:bg-brand/5"
          >
            {uploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-brand" aria-label="Uploading" />
            ) : (
              <ImagePlus className="h-8 w-8 text-brand" aria-hidden />
            )}
            <span className="text-sm text-white/80">{uploading ? "Uploading…" : "Click to upload an image"}</span>
            <span className="text-xs text-white/45">PNG, JPEG, WEBP or GIF · max 8 MB</span>
          </label>
        )}

        <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-2">
          <input
            ref={fileRef}
            id={inputId}
            type="file"
            accept={ACCEPTED.join(",")}
            className="sr-only"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {value ? <RefreshCw className="h-3.5 w-3.5" aria-hidden /> : <ImagePlus className="h-3.5 w-3.5" aria-hidden />}
            {value ? "Replace" : "Select file"}
          </button>
          {value && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => void remove()}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden /> Remove
            </button>
          )}
          {value && <span className="ml-auto max-w-[50%] truncate text-[11px] text-white/40" title={value}>{value}</span>}
        </div>
      </div>
      {hint && <p className="mt-1.5 text-xs text-white/45">{hint}</p>}
    </div>
  );
}

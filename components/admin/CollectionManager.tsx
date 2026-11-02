"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Eye, EyeOff, Loader2, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import SafeImage from "@/components/ui/SafeImage";
import { getIcon, ICON_KEYS } from "@/lib/icons";
import ConfirmDialog from "./ConfirmDialog";
import LocalImageField, { type UploadFolder } from "./LocalImageField";
import { StringListEditor } from "./ListEditors";

export type FieldDef = {
  key: string;
  label: string;
  type: "text" | "textarea" | "list" | "image" | "icon" | "number" | "checkbox";
  required?: boolean;
  hint?: string;
  wide?: boolean;
};

type Item = { id: string } & Record<string, unknown>;

type Props = {
  title: string;
  singular: string;
  endpoint: string;
  folder: UploadFolder;
  fields: FieldDef[];
  initialItems: Item[];
  blank: Record<string, unknown>;
  subtitleKey?: string;
};

export default function CollectionManager({ title, singular, endpoint, folder, fields, initialItems, blank, subtitleKey }: Props) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const originalImages = useRef<Record<string, string>>({});

  const imageKeys = fields.filter((f) => f.type === "image").map((f) => f.key);

  function openEditor(item: Record<string, unknown>) {
    originalImages.current = Object.fromEntries(imageKeys.map((k) => [k, String(item[k] ?? "")]));
    setEditing(item);
  }

  /** Discards uploads made in an editor session that is closed without saving. */
  function cancelEdit() {
    if (editing) {
      for (const k of imageKeys) {
        const v = String(editing[k] ?? "");
        if (v.startsWith("/api/uploads/") && v !== originalImages.current[k]) {
          void fetch(`/api/upload?url=${encodeURIComponent(v)}`, { method: "DELETE" }).catch(() => undefined);
        }
      }
    }
    setEditing(null);
  }

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (editing && !d.open) d.showModal();
    if (!editing && d.open) d.close();
  }, [editing]);

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...items]
      .filter((i) => !q || String(i.title ?? "").toLowerCase().includes(q))
      .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));
  }, [items, query]);

  const nextOrder = items.reduce((m, i) => Math.max(m, Number(i.order ?? 0)), 0) + 1;

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!editing) return;
    for (const f of fields) {
      if (f.required && !String(editing[f.key] ?? "").trim()) {
        toast.error(`${f.label} is required`);
        return;
      }
    }
    setSaving(true);
    const isNew = !editing.id;
    try {
      const res = await fetch(isNew ? endpoint : `${endpoint}/${editing.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = (await res.json().catch(() => ({}))) as { item?: Item; error?: string };
      if (!res.ok || !data.item) throw new Error(data.error || "Save failed");
      const saved = data.item;
      setItems((prev) => (isNew ? [...prev, saved] : prev.map((i) => (i.id === saved.id ? saved : i))));
      toast.success(`${singular} ${isNew ? "created" : "updated"}`);
      setEditing(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(item: Item) {
    const next = { ...item, active: !item.active };
    setItems((prev) => prev.map((i) => (i.id === item.id ? next : i)));
    const res = await fetch(`${endpoint}/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }).catch(() => null);
    if (!res?.ok) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      toast.error("Could not update visibility");
    } else {
      toast.success(next.active ? "Now visible on the website" : "Hidden from the website");
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`${endpoint}/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error || "Delete failed");
      setItems((prev) => prev.filter((i) => i.id !== toDelete.id));
      toast.success(`${singular} deleted`);
      setToDelete(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleting(false);
    }
  }

  const set = (key: string, value: unknown) => setEditing((prev) => (prev ? { ...prev, [key]: value } : prev));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-white/55">
            {items.length} {items.length === 1 ? "entry" : "entries"} · changes publish to the website immediately after saving
          </p>
        </div>
        <div className="flex gap-2">
          <label className="relative">
            <span className="sr-only">Search</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
            <input className="input-field !py-2 pl-9" placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <button
            type="button"
            onClick={() => openEditor({ ...blank, order: nextOrder })}
            className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-black hover:brightness-110"
          >
            <Plus className="h-4 w-4" aria-hidden /> New {singular}
          </button>
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-white/15 p-12 text-center">
          <p className="text-white/70">{query ? "No entries match your search." : `No ${title.toLowerCase()} yet.`}</p>
          {!query && (
            <button
              type="button"
              onClick={() => openEditor({ ...blank, order: nextOrder })}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand"
            >
              <Plus className="h-4 w-4" aria-hidden /> Create the first {singular.toLowerCase()}
            </button>
          )}
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sorted.map((item) => {
            const Icon = typeof item.icon === "string" ? getIcon(item.icon) : null;
            return (
              <li key={item.id} className={`overflow-hidden rounded-xl border bg-[#16181d] ${item.active ? "border-white/10" : "border-white/5 opacity-60"}`}>
                <div className="relative aspect-[16/8] bg-ink">
                  <SafeImage src={String(item.image ?? "")} alt="" fill sizes="400px" className="object-cover" unoptimized />
                  <span className="absolute left-3 top-3 rounded bg-ink/80 px-2 py-0.5 text-xs font-semibold text-white/80">
                    #{String(item.order ?? 0)}
                  </span>
                  {!item.active && (
                    <span className="absolute right-3 top-3 rounded bg-red-600/80 px-2 py-0.5 text-xs font-semibold">Hidden</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-2">
                    {Icon && <Icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />}
                    <h2 className="font-semibold text-white">{String(item.title ?? "")}</h2>
                  </div>
                  {subtitleKey && <p className="mt-1 line-clamp-2 text-sm text-white/55">{String(item[subtitleKey] ?? "")}</p>}
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => openEditor({ ...item })}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void toggleActive(item)}
                      className="inline-flex items-center gap-1.5 rounded-md border border-white/15 px-3 py-1.5 text-xs font-semibold hover:border-brand hover:text-brand"
                    >
                      {item.active ? <EyeOff className="h-3.5 w-3.5" aria-hidden /> : <Eye className="h-3.5 w-3.5" aria-hidden />}
                      {item.active ? "Hide" : "Show"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(item)}
                      className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden /> Delete
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        onCancel={(e) => {
          e.preventDefault();
          if (!saving) cancelEdit();
        }}
        className="m-auto max-h-[92vh] w-[calc(100%-1.5rem)] max-w-3xl rounded-xl border border-white/10 bg-[#16181d] p-0 text-white backdrop:bg-black/70"
        aria-labelledby="editor-title"
      >
        {editing && (
          <form onSubmit={save}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#16181d] px-6 py-4">
              <h2 id="editor-title" className="text-lg font-semibold">
                {editing.id ? `Edit ${singular}` : `New ${singular}`}
              </h2>
              <button type="button" onClick={cancelEdit} disabled={saving} className="rounded p-1 hover:bg-white/10" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid gap-5 p-6 md:grid-cols-2">
              {fields.map((f) => {
                const id = `field-${f.key}`;
                const v = editing[f.key];
                const wide = f.wide || ["textarea", "list", "image"].includes(f.type);
                return (
                  <div key={f.key} className={wide ? "md:col-span-2" : ""}>
                    {f.type === "image" ? (
                      <LocalImageField label={f.label} folder={folder} value={String(v ?? "")} onChange={(url) => set(f.key, url)} hint={f.hint} />
                    ) : f.type === "list" ? (
                      <StringListEditor label={f.label} value={Array.isArray(v) ? (v as string[]) : []} onChange={(list) => set(f.key, list)} />
                    ) : f.type === "checkbox" ? (
                      <label className="flex items-center gap-3 pt-6 text-sm">
                        <input type="checkbox" checked={Boolean(v)} onChange={(e) => set(f.key, e.target.checked)} className="h-5 w-5 accent-[#ff7900]" />
                        {f.label}
                      </label>
                    ) : (
                      <>
                        <label htmlFor={id} className="label">
                          {f.label}
                          {f.required && <span className="ml-1 text-brand">*</span>}
                        </label>
                        {f.type === "textarea" ? (
                          <textarea id={id} className="input-field" rows={4} value={String(v ?? "")} onChange={(e) => set(f.key, e.target.value)} />
                        ) : f.type === "icon" ? (
                          <div className="flex items-center gap-3">
                            <select id={id} className="input-field" value={String(v ?? "truck")} onChange={(e) => set(f.key, e.target.value)}>
                              {ICON_KEYS.map((k) => (
                                <option key={k} value={k}>
                                  {k}
                                </option>
                              ))}
                            </select>
                            {(() => {
                              const I = getIcon(String(v ?? ""));
                              return <I className="h-7 w-7 shrink-0 text-brand" aria-hidden />;
                            })()}
                          </div>
                        ) : (
                          <input
                            id={id}
                            type={f.type === "number" ? "number" : "text"}
                            className="input-field"
                            value={String(v ?? "")}
                            required={f.required}
                            onChange={(e) => set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
                          />
                        )}
                        {f.hint && <p className="mt-1.5 text-xs text-white/45">{f.hint}</p>}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="sticky bottom-0 flex justify-end gap-3 border-t border-white/10 bg-[#16181d] px-6 py-4">
              <button type="button" onClick={cancelEdit} disabled={saving} className="rounded-md border border-white/15 px-4 py-2 text-sm hover:bg-white/5">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60">
                {saving && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                {saving ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        )}
      </dialog>

      <ConfirmDialog
        open={Boolean(toDelete)}
        title={`Delete ${singular.toLowerCase()}?`}
        message={`“${String(toDelete?.title ?? "")}” and its uploaded image will be permanently removed. This cannot be undone.`}
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

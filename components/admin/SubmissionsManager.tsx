"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Mail, Paperclip, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import ConfirmDialog from "./ConfirmDialog";
import StatusBadge from "./StatusBadge";

export type Submission = {
  id: string;
  status: string;
  createdAt: string;
  title: string; // primary label (contact / name)
  subtitle: string; // company, type, route
  email: string;
  phone: string;
  attachmentUrl?: string;
  details: { label: string; value: string }[];
};

type Props = {
  title: string;
  endpoint: string; // e.g. /api/admin/quotes
  statuses: readonly string[];
  initial: Submission[];
  emptyText: string;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-CA", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Edmonton" });

/** Shared list view for quote requests and inquiries: filter, expand, status update, delete. */
export default function SubmissionsManager({ title, endpoint, statuses, initial, emptyText }: Props) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toDelete, setToDelete] = useState<Submission | null>(null);
  const [deleting, setDeleting] = useState(false);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: items.length };
    for (const s of statuses) c[s] = items.filter((i) => i.status === s).length;
    return c;
  }, [items, statuses]);

  const visible = items.filter((i) => {
    if (filter !== "All" && i.status !== filter) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [i.title, i.subtitle, i.email, i.phone].some((v) => v.toLowerCase().includes(q));
  });

  async function updateStatus(item: Submission, status: string) {
    const prev = item.status;
    setItems((list) => list.map((i) => (i.id === item.id ? { ...i, status } : i)));
    const res = await fetch(`${endpoint}/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    if (!res?.ok) {
      setItems((list) => list.map((i) => (i.id === item.id ? { ...i, status: prev } : i)));
      toast.error("Could not update status");
    } else {
      toast.success(`Status changed to ${status}`);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const res = await fetch(`${endpoint}/${toDelete.id}`, { method: "DELETE" }).catch(() => null);
    setDeleting(false);
    if (!res?.ok) return toast.error("Could not delete");
    setItems((list) => list.filter((i) => i.id !== toDelete.id));
    setToDelete(null);
    toast.success("Deleted");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <label className="relative sm:w-72">
          <span className="sr-only">Search</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" aria-hidden />
          <input className="input-field !py-2 pl-9" placeholder="Search name, company, email…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
      </div>

      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto" role="group" aria-label="Filter by status">
        {["All", ...statuses].map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={filter === s}
            onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${
              filter === s ? "border-brand bg-brand/15 text-white" : "border-white/15 text-white/60 hover:text-white"
            }`}
          >
            {s} <span className="text-white/40">({counts[s] ?? 0})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-white/15 p-12 text-center text-white/60">
          {items.length === 0 ? emptyText : "No entries match the current filter."}
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((item) => {
            const open = expanded === item.id;
            return (
              <li key={item.id} className={`rounded-xl border bg-[#16181d] ${item.status === "New" ? "border-brand/40" : "border-white/10"}`}>
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : item.id)}
                    aria-expanded={open}
                    className="flex min-w-0 flex-1 items-start gap-3 text-left"
                  >
                    <ChevronDown className={`mt-1 h-4 w-4 shrink-0 text-white/40 transition ${open ? "rotate-180" : ""}`} aria-hidden />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white">{item.title}</span>
                        <StatusBadge status={item.status} />
                        {item.attachmentUrl && <Paperclip className="h-3.5 w-3.5 text-white/50" aria-label="Has attachment" />}
                      </div>
                      <p className="truncate text-sm text-white/55">{item.subtitle}</p>
                      <p className="text-xs text-white/40">{fmt(item.createdAt)}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 pl-7 sm:pl-0">
                    <label className="sr-only" htmlFor={`status-${item.id}`}>
                      Status
                    </label>
                    <select
                      id={`status-${item.id}`}
                      className="input-field !w-auto !py-1.5 text-sm"
                      value={item.status}
                      onChange={(e) => void updateStatus(item, e.target.value)}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setToDelete(item)}
                      className="rounded-md border border-red-500/30 p-2 text-red-300 hover:bg-red-500/10"
                      aria-label={`Delete entry from ${item.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="border-t border-white/10 p-4 sm:pl-11">
                    <div className="flex flex-wrap gap-3">
                      <a href={`mailto:${item.email}`} className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm hover:text-brand">
                        <Mail className="h-4 w-4" aria-hidden /> {item.email}
                      </a>
                      {item.phone && (
                        <a href={`tel:${item.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 rounded-md bg-white/5 px-3 py-1.5 text-sm hover:text-brand">
                          <Phone className="h-4 w-4" aria-hidden /> {item.phone}
                        </a>
                      )}
                      {item.attachmentUrl && (
                        <a href={item.attachmentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-brand/15 px-3 py-1.5 text-sm text-brand hover:bg-brand/25">
                          <Paperclip className="h-4 w-4" aria-hidden /> View attachment
                        </a>
                      )}
                    </div>
                    <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                      {item.details
                        .filter((d) => d.value)
                        .map((d) => (
                          <div key={d.label} className={d.value.length > 80 ? "sm:col-span-2 lg:col-span-3" : ""}>
                            <dt className="text-xs font-semibold uppercase tracking-wider text-white/40">{d.label}</dt>
                            <dd className="mt-0.5 whitespace-pre-wrap text-sm text-white/85">{d.value}</dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Delete this entry?"
        message="The submission and any attachment will be permanently removed."
        busy={deleting}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}

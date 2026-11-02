"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { ICON_KEYS } from "@/lib/icons";

const btn =
  "grid h-8 w-8 place-items-center rounded border border-white/10 text-white/60 transition hover:border-brand hover:text-brand disabled:opacity-30";

function move<T>(arr: T[], i: number, dir: -1 | 1): T[] {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const next = [...arr];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}

/** Editable list of plain strings (features, communities, bullet points). */
export function StringListEditor({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex gap-2">
            <input
              className="input-field"
              value={item}
              aria-label={`${label} ${i + 1}`}
              placeholder={placeholder}
              onChange={(e) => onChange(value.map((v, k) => (k === i ? e.target.value : v)))}
            />
            <button type="button" className={btn} onClick={() => onChange(move(value, i, -1))} disabled={i === 0} aria-label="Move up">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              className={btn}
              onClick={() => onChange(move(value, i, 1))}
              disabled={i === value.length - 1}
              aria-label="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" className={btn} onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove item">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-white"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add item
      </button>
    </fieldset>
  );
}

export type ObjectItem = { icon?: string; title: string; description?: string };

/** Editable list of {icon, title, description} rows (value columns, process steps). */
export function ObjectListEditor({
  label,
  value,
  onChange,
  withIcon = true,
  withDescription = true,
}: {
  label: string;
  value: ObjectItem[];
  onChange: (v: ObjectItem[]) => void;
  withIcon?: boolean;
  withDescription?: boolean;
}) {
  const patch = (i: number, p: Partial<ObjectItem>) => onChange(value.map((v, k) => (k === i ? { ...v, ...p } : v)));
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <ul className="space-y-3">
        {value.map((item, i) => (
          <li key={i} className="rounded-lg border border-white/10 bg-ink/40 p-3">
            <div className="flex flex-wrap gap-2">
              {withIcon && (
                <select
                  className="input-field !w-auto"
                  value={item.icon ?? ""}
                  aria-label="Icon"
                  onChange={(e) => patch(i, { icon: e.target.value })}
                >
                  {ICON_KEYS.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              )}
              <input
                className="input-field min-w-0 flex-1"
                value={item.title}
                placeholder="Title"
                aria-label={`${label} ${i + 1} title`}
                onChange={(e) => patch(i, { title: e.target.value })}
              />
              <div className="flex gap-1">
                <button type="button" className={btn} onClick={() => onChange(move(value, i, -1))} disabled={i === 0} aria-label="Move up">
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={btn}
                  onClick={() => onChange(move(value, i, 1))}
                  disabled={i === value.length - 1}
                  aria-label="Move down"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
                <button type="button" className={btn} onClick={() => onChange(value.filter((_, k) => k !== i))} aria-label="Remove item">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {withDescription && (
              <textarea
                className="input-field mt-2"
                rows={2}
                value={item.description ?? ""}
                placeholder="Description"
                aria-label={`${label} ${i + 1} description`}
                onChange={(e) => patch(i, { description: e.target.value })}
              />
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChange([...value, { icon: withIcon ? "truck" : undefined, title: "", description: "" }])}
        className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:text-white"
      >
        <Plus className="h-4 w-4" aria-hidden /> Add item
      </button>
    </fieldset>
  );
}

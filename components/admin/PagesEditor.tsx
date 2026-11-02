"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { SectionContent } from "@/lib/types";
import LocalImageField from "./LocalImageField";
import { ObjectListEditor, StringListEditor, type ObjectItem } from "./ListEditors";

type Pages = Record<string, SectionContent[]>;

const PAGE_LABELS: Record<string, { label: string; path: string }> = {
  home: { label: "Home", path: "/" },
  about: { label: "About Us", path: "/about" },
  services: { label: "Services", path: "/services" },
  packages: { label: "Packages", path: "/packages" },
  quote: { label: "Request a Quote", path: "/request-quote" },
  contact: { label: "Contact", path: "/contact" },
};

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  services: "Services Overview",
  why: "Why Choose Us",
  industries: "Industries We Support",
  serviceArea: "Service Area",
  packages: "Packages Preview",
  partnership: "Business Partnership",
  quoteCta: "Request Quote CTA",
  company: "Our Company",
  mission: "Our Mission",
  values: "Values",
  cta: "Closing CTA",
  benefits: "Package Benefits",
  sidebar: "Quote Sidebar (Process Steps)",
  info: "Contact Info",
};

const DATA_LABELS: Record<string, string> = {
  items: "Items",
  points: "Bullet Points",
  supports: "Industries Supported",
  indicators: "Hero Indicators",
  secondaryCtaLabel: "Secondary Button Label",
  secondaryCtaUrl: "Secondary Button Link",
  backgroundImage: "Background Image",
};

const humanize = (k: string) => DATA_LABELS[k] ?? k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());

export default function PagesEditor({ initialPages }: { initialPages: Pages }) {
  const [pages, setPages] = useState<Pages>(initialPages);
  const [active, setActive] = useState<string>("home");
  const [dirty, setDirty] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const anyDirty = Object.values(dirty).some(Boolean);
  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (anyDirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [anyDirty]);

  function patch(sectionKey: string, p: Partial<SectionContent>) {
    setPages((prev) => ({
      ...prev,
      [active]: prev[active].map((s) => (s.sectionKey === sectionKey ? { ...s, ...p } : s)),
    }));
    setDirty((d) => ({ ...d, [active]: true }));
  }

  function patchData(section: SectionContent, key: string, value: unknown) {
    patch(section.sectionKey, { additionalData: { ...section.additionalData, [key]: value } });
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/pages/${active}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sections: pages[active] }),
      });
      if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error || "Save failed");
      setDirty((d) => ({ ...d, [active]: false }));
      toast.success(`${PAGE_LABELS[active].label} page saved and published`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const sections = pages[active] ?? [];

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Page Content</h1>
          <p className="mt-1 text-sm text-white/55">
            Headings: put a word in <code className="text-brand">*asterisks*</code> to highlight it orange, and use a new line
            to break the heading. Empty fields fall back to the default copy.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={PAGE_LABELS[active].path}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm hover:border-brand hover:text-brand"
          >
            <ExternalLink className="h-4 w-4" aria-hidden /> Preview
          </a>
          <button
            type="button"
            onClick={() => void save()}
            disabled={saving || !dirty[active]}
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
            Save {PAGE_LABELS[active].label}
          </button>
        </div>
      </div>

      <div role="tablist" aria-label="Pages" className="no-scrollbar mt-6 flex gap-1 overflow-x-auto border-b border-white/10">
        {Object.keys(PAGE_LABELS).map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            onClick={() => setActive(key)}
            className={`relative shrink-0 px-4 py-2.5 text-sm font-medium transition ${
              active === key ? "text-white" : "text-white/55 hover:text-white"
            }`}
          >
            {PAGE_LABELS[key].label}
            {dirty[key] && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-brand" aria-label="unsaved changes" />}
            {active === key && <span className="absolute inset-x-2 -bottom-px h-0.5 bg-brand" />}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-6 space-y-6">
        {sections.map((s) => (
          <section key={s.sectionKey} className="rounded-xl border border-white/10 bg-[#16181d] p-5 sm:p-6" aria-labelledby={`sec-${s.sectionKey}`}>
            <h2 id={`sec-${s.sectionKey}`} className="text-lg font-semibold text-white">
              {SECTION_LABELS[s.sectionKey] ?? s.sectionKey}
            </h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                <div>
                  <label className="label" htmlFor={`${s.sectionKey}-heading`}>Heading</label>
                  <textarea id={`${s.sectionKey}-heading`} rows={2} className="input-field font-semibold" value={s.heading} onChange={(e) => patch(s.sectionKey, { heading: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor={`${s.sectionKey}-sub`}>Subheading</label>
                  <input id={`${s.sectionKey}-sub`} className="input-field" value={s.subheading} onChange={(e) => patch(s.sectionKey, { subheading: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor={`${s.sectionKey}-desc`}>Description</label>
                  <textarea id={`${s.sectionKey}-desc`} rows={4} className="input-field" value={s.description} onChange={(e) => patch(s.sectionKey, { description: e.target.value })} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor={`${s.sectionKey}-cta`}>Button Label</label>
                    <input id={`${s.sectionKey}-cta`} className="input-field" value={s.ctaLabel} onChange={(e) => patch(s.sectionKey, { ctaLabel: e.target.value })} />
                  </div>
                  <div>
                    <label className="label" htmlFor={`${s.sectionKey}-url`}>Button Link</label>
                    <input id={`${s.sectionKey}-url`} className="input-field" placeholder="/request-quote" value={s.ctaUrl} onChange={(e) => patch(s.sectionKey, { ctaUrl: e.target.value })} />
                  </div>
                </div>

                {Object.entries(s.additionalData).map(([key, value]) => {
                  if (/image$/i.test(key)) return null;
                  if (typeof value === "string") {
                    return (
                      <div key={key}>
                        <label className="label" htmlFor={`${s.sectionKey}-${key}`}>{humanize(key)}</label>
                        <input id={`${s.sectionKey}-${key}`} className="input-field" value={value} onChange={(e) => patchData(s, key, e.target.value)} />
                      </div>
                    );
                  }
                  if (Array.isArray(value) && value.every((v) => typeof v === "string")) {
                    return <StringListEditor key={key} label={humanize(key)} value={value as string[]} onChange={(v) => patchData(s, key, v)} />;
                  }
                  if (Array.isArray(value)) {
                    const list = value as ObjectItem[];
                    return (
                      <ObjectListEditor
                        key={key}
                        label={humanize(key)}
                        value={list}
                        withIcon={list.length === 0 || list.some((i) => typeof i.icon === "string")}
                        withDescription={list.length === 0 || list.some((i) => "description" in i)}
                        onChange={(v) => patchData(s, key, v)}
                      />
                    );
                  }
                  return null;
                })}
              </div>

              <div className="space-y-4">
                <LocalImageField label="Section Image" folder="pages" value={s.image} onChange={(url) => patch(s.sectionKey, { image: url })} />
                {Object.entries(s.additionalData)
                  .filter(([key, v]) => /image$/i.test(key) && typeof v === "string")
                  .map(([key, v]) => (
                    <LocalImageField key={key} label={humanize(key)} folder="pages" value={v as string} onChange={(url) => patchData(s, key, url)} />
                  ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

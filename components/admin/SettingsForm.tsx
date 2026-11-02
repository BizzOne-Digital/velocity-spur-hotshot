"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import type { SiteSettings } from "@/lib/types";
import LocalImageField from "./LocalImageField";
import { StringListEditor } from "./ListEditors";

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [s, setS] = useState<SiteSettings>(initial);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }));
  const setSocial = (k: keyof SiteSettings["socials"], v: string) => setS((p) => ({ ...p, socials: { ...p.socials, [k]: v } }));

  async function save(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(s),
      });
      if (!res.ok) throw new Error(((await res.json().catch(() => ({}))) as { error?: string }).error || "Save failed");
      toast.success("Settings saved and published");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  const text = (k: keyof SiteSettings, label: string, type = "text") => (
    <div>
      <label className="label" htmlFor={`set-${k}`}>{label}</label>
      <input id={`set-${k}`} type={type} className="input-field" value={String(s[k] ?? "")} onChange={(e) => set(k, e.target.value as never)} />
    </div>
  );

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2 text-sm font-semibold text-black hover:brightness-110 disabled:opacity-60">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Save className="h-4 w-4" aria-hidden />}
          Save Settings
        </button>
      </div>

      <section className="rounded-xl border border-white/10 bg-[#16181d] p-6">
        <h2 className="text-lg font-semibold">Company & Contact Details</h2>
        <p className="text-sm text-white/50">Shown in the header, footer, contact page and structured data. Do not add a residential street address.</p>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          {text("companyName", "Company Name")}
          {text("location", "General Location")}
          {text("phone", "Phone", "tel")}
          {text("email", "Email", "email")}
          {text("tagline", "Primary Tagline")}
          {text("secondaryTagline", "Secondary Tagline")}
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#16181d] p-6">
        <h2 className="text-lg font-semibold">Service Area</h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div className="space-y-5">
            {text("primaryServiceArea", "Primary Service Area")}
            <StringListEditor label="Primary Communities" value={s.serviceCommunities} onChange={(v) => set("serviceCommunities", v)} />
          </div>
          <div>
            <StringListEditor label="Planned Expansion (shown as future / not active)" value={s.plannedExpansion} onChange={(v) => set("plannedExpansion", v)} />
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-[#16181d] p-6">
          <h2 className="text-lg font-semibold">Logo</h2>
          <p className="mb-4 text-sm text-white/50">Leave empty to use the default logo. Transparent PNG or WEBP recommended.</p>
          <LocalImageField label="Logo" folder="misc" value={s.logoUrl} onChange={(url) => set("logoUrl", url)} />
        </div>
        <div className="rounded-xl border border-white/10 bg-[#16181d] p-6">
          <h2 className="text-lg font-semibold">Social Links</h2>
          <p className="mb-4 text-sm text-white/50">Full https:// URLs. Icons only show for filled-in profiles.</p>
          <div className="space-y-4">
            {(["facebook", "instagram", "linkedin", "youtube"] as const).map((k) => (
              <div key={k}>
                <label className="label" htmlFor={`soc-${k}`}>{k}</label>
                <input id={`soc-${k}`} type="url" className="input-field" placeholder="https://" value={s.socials[k]} onChange={(e) => setSocial(k, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </form>
  );
}

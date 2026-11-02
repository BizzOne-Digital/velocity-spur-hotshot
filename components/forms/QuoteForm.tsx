"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, FileUp, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { FREIGHT_TYPES, URGENCY_LEVELS } from "@/lib/constants";
import { buttonClass } from "@/components/ui/Button";
import Field, { describedBy } from "./Field";

const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf";

type Errors = Record<string, string>;

export default function QuoteForm({ defaultFreight = "" }: { defaultFreight?: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [urgency, setUrgency] = useState<string>("Standard");

  const today = new Date().toISOString().slice(0, 10);

  function onFile(f: File | null) {
    if (!f) return setFile(null);
    if (!ACCEPT.split(",").includes(f.type)) {
      setErrors((e) => ({ ...e, attachment: "Upload an image (PNG, JPEG, WEBP, GIF) or PDF" }));
      return;
    }
    if (f.size > MAX_BYTES) {
      setErrors((e) => ({ ...e, attachment: "File must be 8 MB or smaller" }));
      return;
    }
    setErrors(({ attachment: _omit, ...rest }) => rest);
    setFile(f);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const fd = new FormData(form);
    fd.delete("attachment");
    if (file) fd.set("attachment", file);
    fd.set("urgency", urgency);

    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/quotes", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Errors };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }
      setDone(true);
      toast.success("Quote request received. We will be in touch shortly.");
      form.reset();
      setFile(null);
      window.scrollTo({ top: (formRef.current?.offsetTop ?? 0) - 120, behavior: "smooth" });
    } catch {
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card-glow p-8 text-center sm:p-12" role="status">
        <CheckCircle2 className="mx-auto h-16 w-16 text-brand" aria-hidden />
        <h2 className="heading-display mt-5 text-4xl text-metal">Request Received</h2>
        <p className="mx-auto mt-4 max-w-md text-white/75">
          Thank you. Your transportation quote request has been submitted. We will review the details and contact you
          using the information provided.
        </p>
        <button type="button" onClick={() => setDone(false)} className={buttonClass("outline", "md", "mt-8")}>
          Submit Another Request
        </button>
      </div>
    );
  }

  const input = (id: string, extra: Record<string, unknown> = {}) => ({
    id,
    name: id,
    className: "input-field",
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": describedBy(id, errors[id]),
    ...extra,
  });

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate={false} className="card-glow space-y-10 p-6 sm:p-10" aria-label="Request a transportation quote">
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl font-bold italic uppercase tracking-wide text-white">
          <span className="text-brand">01 /</span> Contact Details
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="companyName" label="Company Name" error={errors.companyName}>
            <input {...input("companyName", { autoComplete: "organization", maxLength: 200 })} />
          </Field>
          <Field id="contactName" label="Contact Name" required error={errors.contactName}>
            <input {...input("contactName", { autoComplete: "name", required: true, maxLength: 200 })} />
          </Field>
          <Field id="email" label="Email" required error={errors.email}>
            <input {...input("email", { type: "email", autoComplete: "email", required: true, maxLength: 200 })} />
          </Field>
          <Field id="phone" label="Phone" required error={errors.phone}>
            <input {...input("phone", { type: "tel", autoComplete: "tel", required: true, maxLength: 50 })} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl font-bold italic uppercase tracking-wide text-white">
          <span className="text-brand">02 /</span> Route & Timing
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="pickupLocation" label="Pickup Location" required error={errors.pickupLocation}>
            <input {...input("pickupLocation", { required: true, placeholder: "City / site / yard", maxLength: 300 })} />
          </Field>
          <Field id="deliveryLocation" label="Delivery Location" required error={errors.deliveryLocation}>
            <input {...input("deliveryLocation", { required: true, placeholder: "City / site / yard", maxLength: 300 })} />
          </Field>
          <Field id="requestedPickupDate" label="Requested Pickup Date" error={errors.requestedPickupDate}>
            <input {...input("requestedPickupDate", { type: "date", min: today })} />
          </Field>
          <div>
            <span className="label" id="urgency-label">
              Urgency
            </span>
            <div role="radiogroup" aria-labelledby="urgency-label" className="grid grid-cols-3 gap-2">
              {URGENCY_LEVELS.map((u) => (
                <button
                  key={u}
                  type="button"
                  role="radio"
                  aria-checked={urgency === u}
                  onClick={() => setUrgency(u)}
                  className={`rounded-lg border px-2 py-3 text-xs font-bold uppercase tracking-wide transition sm:text-sm ${
                    urgency === u
                      ? "border-brand bg-brand/15 text-white shadow-[0_0_14px_rgba(255,121,0,.35)]"
                      : "border-white/15 text-white/70 hover:border-brand/50"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-5 font-display text-2xl font-bold italic uppercase tracking-wide text-white">
          <span className="text-brand">03 /</span> Freight Details
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="freightType" label="Freight Type" required error={errors.freightType}>
            <select {...input("freightType", { required: true, defaultValue: defaultFreight })}>
              <option value="" disabled>
                Select freight type
              </option>
              {FREIGHT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field id="trailerRequirement" label="Trailer Requirement">
            <input {...input("trailerRequirement", { placeholder: "e.g. flatdeck, gooseneck, not sure", maxLength: 200 })} />
          </Field>
          <Field id="estimatedWeight" label="Estimated Weight">
            <input {...input("estimatedWeight", { placeholder: "e.g. 8,500 lbs", maxLength: 100 })} />
          </Field>
          <Field id="dimensions" label="Dimensions (L × W × H)">
            <input {...input("dimensions", { placeholder: "e.g. 12' × 6' × 7'", maxLength: 200 })} />
          </Field>
          <Field id="description" label="Load Description" className="sm:col-span-2">
            <textarea
              {...input("description", {
                rows: 4,
                maxLength: 4000,
                placeholder: "What is being moved? Make/model for equipment, number of pallets, loading method, etc.",
              })}
            />
          </Field>

          <div className="sm:col-span-2">
            <span className="label">Upload Reference Image / Document</span>
            {file ? (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-brand/40 bg-brand/5 px-4 py-3">
                <span className="truncate text-sm text-white">
                  {file.name} <span className="text-white/50">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                </span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded text-white/70 hover:bg-white/10 hover:text-white"
                  aria-label="Remove attachment"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>
            ) : (
              <label
                htmlFor="attachment"
                className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/15 bg-ink/40 px-4 py-8 text-center transition hover:border-brand/60 focus-within:border-brand"
              >
                <FileUp className="h-8 w-8 text-brand" aria-hidden />
                <span className="text-sm text-white/80">Click to upload a photo, drawing or spec sheet</span>
                <span className="text-xs text-white/50">PNG, JPEG, WEBP, GIF or PDF · up to 8 MB</span>
                <input
                  id="attachment"
                  name="attachment"
                  type="file"
                  accept={ACCEPT}
                  className="sr-only"
                  aria-describedby={errors.attachment ? "attachment-error" : undefined}
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
              </label>
            )}
            {errors.attachment && (
              <p id="attachment-error" role="alert" className="mt-1.5 text-xs font-medium text-red-400">
                {errors.attachment}
              </p>
            )}
          </div>

          <Field id="notes" label="Additional Notes" className="sm:col-span-2">
            <textarea
              {...input("notes", {
                rows: 3,
                maxLength: 4000,
                placeholder: "Site access, loading equipment on site, delivery windows, contacts…",
              })}
            />
          </Field>
        </div>
      </fieldset>

      <div className="flex flex-col items-start gap-4 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-white/50">
          Fields marked <span className="text-brand">*</span> are required. Your information is used only to respond to
          this request.
        </p>
        <button type="submit" disabled={submitting} className={buttonClass("primary", "lg", "w-full sm:w-auto")}>
          {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
          {submitting ? "Submitting…" : "Request Transportation Quote"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { INQUIRY_TYPES } from "@/lib/constants";
import { buttonClass } from "@/components/ui/Button";
import Field, { describedBy } from "./Field";

type Errors = Record<string, string>;

export default function InquiryForm({ defaultType = "General", idPrefix = "inq" }: { defaultType?: string; idPrefix?: string }) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;

    const payload = Object.fromEntries(new FormData(form).entries());
    setSubmitting(true);
    setErrors({});
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Errors };
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        toast.error(data.error || "Something went wrong. Please try again.");
        return;
      }
      form.reset();
      setDone(true);
      toast.success("Message sent. We will get back to you shortly.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="card-glow p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto h-14 w-14 text-brand" aria-hidden />
        <h3 className="heading-display mt-4 text-3xl text-metal">Message Sent</h3>
        <p className="mt-3 text-white/75">Thank you for reaching out. We will respond as soon as possible.</p>
        <button type="button" onClick={() => setDone(false)} className={buttonClass("outline", "sm", "mt-6")}>
          Send Another Message
        </button>
      </div>
    );
  }

  const input = (id: string, extra: Record<string, unknown> = {}) => ({
    id: `${idPrefix}-${id}`,
    name: id,
    className: "input-field",
    "aria-invalid": errors[id] ? true : undefined,
    "aria-describedby": describedBy(`${idPrefix}-${id}`, errors[id]),
    ...extra,
  });

  return (
    <form onSubmit={onSubmit} className="card-glow space-y-5 p-6 sm:p-8" aria-label="Contact form">
      <div className="hidden" aria-hidden>
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id={`${idPrefix}-name`} label="Name" required error={errors.name}>
          <input {...input("name", { required: true, autoComplete: "name", maxLength: 200 })} />
        </Field>
        <Field id={`${idPrefix}-company`} label="Company">
          <input {...input("company", { autoComplete: "organization", maxLength: 200 })} />
        </Field>
        <Field id={`${idPrefix}-email`} label="Email" required error={errors.email}>
          <input {...input("email", { type: "email", required: true, autoComplete: "email", maxLength: 200 })} />
        </Field>
        <Field id={`${idPrefix}-phone`} label="Phone">
          <input {...input("phone", { type: "tel", autoComplete: "tel", maxLength: 50 })} />
        </Field>
        <Field id={`${idPrefix}-type`} label="Inquiry Type" className="sm:col-span-2">
          <select {...input("type", { defaultValue: defaultType })}>
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${idPrefix}-message`} label="Message" required error={errors.message} className="sm:col-span-2">
          <textarea {...input("message", { rows: 5, required: true, minLength: 10, maxLength: 5000 })} />
        </Field>
      </div>
      <button type="submit" disabled={submitting} className={buttonClass("primary", "md", "w-full sm:w-auto")}>
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Send className="h-5 w-5" aria-hidden />}
        {submitting ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

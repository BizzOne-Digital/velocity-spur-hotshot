import "server-only";
import nodemailer from "nodemailer";
import { getSettings } from "./data";
import { SITE_URL } from "./constants";

/**
 * New-lead notifications for quote requests and inquiries.
 * Email goes to Settings > email via SMTP (SMTP_USER / SMTP_PASS, Gmail app password by default).
 * SMS goes to Settings > phone via Twilio (TWILIO_* vars). Each channel is skipped when not configured,
 * and a failed notification never fails the submission: the lead is already saved in the admin panel.
 */

type Lead = {
  kind: "Quote Request" | "Inquiry";
  name: string;
  email: string;
  phone: string;
  summary: string;
  rows: [string, string][];
  adminPath: string;
  attachment?: { filename: string; contentType: string; content: Buffer };
};

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return phone.startsWith("+") ? `+${digits}` : "";
}

async function sendEmail(to: string, lead: Lead) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass || !to) return;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 465),
    secure: Number(process.env.SMTP_PORT || 465) === 465,
    auth: { user, pass },
  });

  const rows = lead.rows.filter(([, v]) => v);
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:620px">
      <h2 style="margin:0 0 4px;color:#ff7900">New ${lead.kind}</h2>
      <p style="margin:0 0 16px;color:#555">${esc(lead.summary)}</p>
      <table style="border-collapse:collapse;width:100%">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:8px;border:1px solid #ddd;background:#f6f6f6;font-weight:bold;width:180px;vertical-align:top">${esc(k)}</td><td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${esc(v)}</td></tr>`
          )
          .join("")}
      </table>
      <p style="margin-top:16px"><a href="${SITE_URL}${lead.adminPath}">Open in admin panel</a></p>
    </div>`;

  await transport.sendMail({
    from: `"Velocity Spur Website" <${user}>`,
    to,
    replyTo: lead.email,
    subject: `New ${lead.kind}: ${lead.name}`,
    text: `${lead.summary}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${SITE_URL}${lead.adminPath}`,
    html,
    attachments: lead.attachment ? [lead.attachment] : undefined,
  });
}

async function sendSms(to: string, lead: Lead) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  const dest = toE164(to);
  if (!sid || !token || !from || !dest) return;

  const body = `New ${lead.kind} - ${lead.name}, ${lead.phone}. ${lead.summary}`.slice(0, 300);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: dest, From: from, Body: body }),
  });
  if (!res.ok) throw new Error(`Twilio ${res.status}: ${await res.text()}`);
}

export async function notifyNewLead(lead: Lead): Promise<void> {
  const settings = await getSettings();
  const results = await Promise.allSettled([sendEmail(settings.email, lead), sendSms(settings.phone, lead)]);
  for (const r of results) {
    if (r.status === "rejected") console.error("[notify] lead notification failed:", (r.reason as Error).message);
  }
}

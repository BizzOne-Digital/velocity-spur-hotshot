import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { INQUIRY_TYPES } from "@/lib/constants";
import { clientIp, isEmail, oneOf, rateLimit, str } from "@/lib/validation";
import Inquiry from "@/models/Inquiry";
import { notifyNewLead } from "@/lib/notify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`inquiry:${clientIp(req)}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please call or email us instead." }, { status: 429 });
  }

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (str(body.website)) return NextResponse.json({ success: true });

  const data = {
    name: str(body.name, 200),
    company: str(body.company, 200),
    email: str(body.email, 200).toLowerCase(),
    phone: str(body.phone, 50),
    type: oneOf(body.type, INQUIRY_TYPES, "General"),
    message: str(body.message, 5000),
  };

  const errors: Record<string, string> = {};
  if (!data.name) errors.name = "Name is required";
  if (!isEmail(data.email)) errors.email = "A valid email is required";
  if (data.message.length < 10) errors.message = "Please include a short message (10+ characters)";
  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please correct the highlighted fields", errors }, { status: 422 });
  }

  try {
    await connectDB();
    await Inquiry.create({ ...data, status: "New" });
    await notifyNewLead({
      kind: "Inquiry",
      name: data.name,
      email: data.email,
      phone: data.phone,
      summary: `${data.type} inquiry${data.company ? ` from ${data.company}` : ""}`,
      rows: [
        ["Name", data.name],
        ["Company", data.company],
        ["Email", data.email],
        ["Phone", data.phone],
        ["Inquiry type", data.type],
        ["Message", data.message],
      ],
      adminPath: "/admin/inquiries",
    });
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Inquiry submission failed", err);
    return NextResponse.json(
      { error: "We could not send your message right now. Please call or email us directly." },
      { status: 500 }
    );
  }
}

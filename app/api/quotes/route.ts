import crypto from "crypto";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { FREIGHT_TYPES, URGENCY_LEVELS, type FreightType } from "@/lib/constants";
import { ATTACHMENT_TYPES, MAX_UPLOAD_BYTES, QUOTE_ATTACHMENT_FOLDER } from "@/lib/uploads";
import { clientIp, isEmail, isPhone, oneOf, rateLimit, str } from "@/lib/validation";
import QuoteRequest from "@/models/QuoteRequest";
import StoredUpload from "@/models/StoredUpload";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!rateLimit(`quote:${clientIp(req)}`, 8, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please call or email us instead." }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (str(form.get("website"))) return NextResponse.json({ success: true });

  const data = {
    companyName: str(form.get("companyName"), 200),
    contactName: str(form.get("contactName"), 200),
    email: str(form.get("email"), 200).toLowerCase(),
    phone: str(form.get("phone"), 50),
    pickupLocation: str(form.get("pickupLocation"), 300),
    deliveryLocation: str(form.get("deliveryLocation"), 300),
    requestedPickupDate: str(form.get("requestedPickupDate"), 20),
    freightType: str(form.get("freightType"), 60),
    estimatedWeight: str(form.get("estimatedWeight"), 100),
    dimensions: str(form.get("dimensions"), 200),
    trailerRequirement: str(form.get("trailerRequirement"), 200),
    description: str(form.get("description"), 4000),
    urgency: oneOf(form.get("urgency"), URGENCY_LEVELS, "Standard"),
    notes: str(form.get("notes"), 4000),
  };

  const errors: Record<string, string> = {};
  if (!data.contactName) errors.contactName = "Contact name is required";
  if (!isEmail(data.email)) errors.email = "A valid email is required";
  if (!isPhone(data.phone)) errors.phone = "A valid phone number is required";
  if (!data.pickupLocation) errors.pickupLocation = "Pickup location is required";
  if (!data.deliveryLocation) errors.deliveryLocation = "Delivery location is required";
  if (!FREIGHT_TYPES.includes(data.freightType as (typeof FREIGHT_TYPES)[number])) {
    errors.freightType = "Select a freight type";
  }
  const pickupDate = data.requestedPickupDate ? new Date(data.requestedPickupDate) : undefined;
  if (pickupDate && Number.isNaN(pickupDate.getTime())) errors.requestedPickupDate = "Invalid date";

  const file = form.get("attachment");
  const hasFile = file instanceof File && file.size > 0;
  let ext = "";
  if (hasFile) {
    ext = ATTACHMENT_TYPES[file.type] ?? "";
    if (!ext) errors.attachment = "Attachment must be an image (PNG, JPEG, WEBP, GIF) or PDF";
    else if (file.size > MAX_UPLOAD_BYTES) errors.attachment = "Attachment must be 8 MB or smaller";
  }

  if (Object.keys(errors).length) {
    return NextResponse.json({ error: "Please correct the highlighted fields", errors }, { status: 422 });
  }

  try {
    await connectDB();

    let attachmentUrl = "";
    if (hasFile && ext) {
      const buffer = Buffer.from(await (file as File).arrayBuffer());
      const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
      await StoredUpload.create({
        folder: QUOTE_ATTACHMENT_FOLDER,
        filename,
        mimeType: (file as File).type,
        size: buffer.length,
        data: buffer,
      });
      attachmentUrl = `/api/admin/attachments/${filename}`;
    }

    await QuoteRequest.create({
      ...data,
      freightType: data.freightType as FreightType,
      requestedPickupDate: pickupDate,
      attachmentUrl,
      status: "New",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Quote submission failed", err);
    return NextResponse.json(
      { error: "We could not submit your request right now. Please call or email us directly." },
      { status: 500 }
    );
  }
}

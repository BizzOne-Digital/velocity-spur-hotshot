import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { QUOTE_STATUSES } from "@/lib/constants";
import { deleteStoredUpload } from "@/lib/deleteStoredUpload";
import QuoteRequest from "@/models/QuoteRequest";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { status?: string };
  if (!QUOTE_STATUSES.includes(body.status as (typeof QUOTE_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  await connectDB();
  const doc = await QuoteRequest.findByIdAndUpdate(id, { status: body.status }, { new: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, status: doc.status });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  const doc = await QuoteRequest.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await deleteStoredUpload(doc.attachmentUrl);
  return NextResponse.json({ success: true });
}

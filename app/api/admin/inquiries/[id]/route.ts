import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { INQUIRY_STATUSES } from "@/lib/constants";
import Inquiry from "@/models/Inquiry";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const body = (await req.json().catch(() => ({}))) as { status?: string };
  if (!INQUIRY_STATUSES.includes(body.status as (typeof INQUIRY_STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 422 });
  }

  await connectDB();
  const doc = await Inquiry.findByIdAndUpdate(id, { status: body.status }, { new: true });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, status: doc.status });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await params;
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  await connectDB();
  const doc = await Inquiry.findByIdAndDelete(id);
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

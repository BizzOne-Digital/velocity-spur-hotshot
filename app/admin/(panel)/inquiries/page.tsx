import SubmissionsManager, { type Submission } from "@/components/admin/SubmissionsManager";
import { connectDB } from "@/lib/mongodb";
import { INQUIRY_STATUSES } from "@/lib/constants";
import Inquiry, { type InquiryDoc } from "@/models/Inquiry";

export const metadata = { title: "Inquiries" };

type Doc = InquiryDoc & { _id: { toString(): string }; createdAt: Date };

export default async function InquiriesPage() {
  await connectDB();
  const docs = await Inquiry.find().sort({ createdAt: -1 }).limit(500).lean<Doc[]>();

  const items: Submission[] = docs.map((d) => ({
    id: d._id.toString(),
    status: d.status,
    createdAt: new Date(d.createdAt).toISOString(),
    title: d.name,
    subtitle: [d.type, d.company].filter(Boolean).join(" · "),
    email: d.email,
    phone: d.phone ?? "",
    details: [
      { label: "Inquiry Type", value: d.type ?? "" },
      { label: "Company", value: d.company ?? "" },
      { label: "Message", value: d.message },
    ],
  }));

  return (
    <SubmissionsManager
      title="Inquiries"
      endpoint="/api/admin/inquiries"
      statuses={INQUIRY_STATUSES}
      initial={items}
      emptyText="No inquiries yet. Messages from the Contact page will appear here."
    />
  );
}

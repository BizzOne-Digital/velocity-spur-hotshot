import SubmissionsManager, { type Submission } from "@/components/admin/SubmissionsManager";
import { connectDB } from "@/lib/mongodb";
import { QUOTE_STATUSES } from "@/lib/constants";
import QuoteRequest, { type QuoteRequestDoc } from "@/models/QuoteRequest";

export const metadata = { title: "Quote Requests" };

type Doc = QuoteRequestDoc & { _id: { toString(): string }; createdAt: Date };

export default async function QuotesPage() {
  await connectDB();
  const docs = await QuoteRequest.find().sort({ createdAt: -1 }).limit(500).lean<Doc[]>();

  const items: Submission[] = docs.map((q) => ({
    id: q._id.toString(),
    status: q.status,
    createdAt: new Date(q.createdAt).toISOString(),
    title: q.contactName,
    subtitle: [q.companyName, `${q.pickupLocation} → ${q.deliveryLocation}`, q.freightType, q.urgency].filter(Boolean).join(" · "),
    email: q.email,
    phone: q.phone,
    attachmentUrl: q.attachmentUrl || undefined,
    details: [
      { label: "Company", value: q.companyName ?? "" },
      { label: "Pickup", value: q.pickupLocation },
      { label: "Delivery", value: q.deliveryLocation },
      {
        label: "Requested Pickup Date",
        value: q.requestedPickupDate ? new Date(q.requestedPickupDate).toLocaleDateString("en-CA", { timeZone: "UTC" }) : "",
      },
      { label: "Freight Type", value: q.freightType },
      { label: "Urgency", value: q.urgency ?? "" },
      { label: "Estimated Weight", value: q.estimatedWeight ?? "" },
      { label: "Dimensions", value: q.dimensions ?? "" },
      { label: "Trailer Requirement", value: q.trailerRequirement ?? "" },
      { label: "Load Description", value: q.description ?? "" },
      { label: "Additional Notes", value: q.notes ?? "" },
    ],
  }));

  return (
    <SubmissionsManager
      title="Quote Requests"
      endpoint="/api/admin/quotes"
      statuses={QUOTE_STATUSES}
      initial={items}
      emptyText="No quote requests yet. Submissions from the Request a Quote page will appear here."
    />
  );
}

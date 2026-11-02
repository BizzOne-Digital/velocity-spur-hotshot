import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { FREIGHT_TYPES, QUOTE_STATUSES, URGENCY_LEVELS } from "@/lib/constants";

const QuoteRequestSchema = new Schema(
  {
    companyName: { type: String, default: "", trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    pickupLocation: { type: String, required: true, trim: true },
    deliveryLocation: { type: String, required: true, trim: true },
    requestedPickupDate: { type: Date },
    freightType: { type: String, enum: FREIGHT_TYPES, required: true },
    estimatedWeight: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    trailerRequirement: { type: String, default: "" },
    description: { type: String, default: "" },
    attachmentUrl: { type: String, default: "" },
    urgency: { type: String, enum: URGENCY_LEVELS, default: "Standard" },
    notes: { type: String, default: "" },
    status: { type: String, enum: QUOTE_STATUSES, default: "New", index: true },
  },
  { timestamps: true }
);

export type QuoteRequestDoc = InferSchemaType<typeof QuoteRequestSchema>;
const QuoteRequest: Model<QuoteRequestDoc> =
  models.QuoteRequest || model<QuoteRequestDoc>("QuoteRequest", QuoteRequestSchema);
export default QuoteRequest;

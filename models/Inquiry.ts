import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { INQUIRY_STATUSES, INQUIRY_TYPES } from "@/lib/constants";

const InquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: "", trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "", trim: true },
    type: { type: String, enum: INQUIRY_TYPES, default: "General" },
    message: { type: String, required: true },
    status: { type: String, enum: INQUIRY_STATUSES, default: "New", index: true },
  },
  { timestamps: true }
);

export type InquiryDoc = InferSchemaType<typeof InquirySchema>;
const Inquiry: Model<InquiryDoc> = models.Inquiry || model<InquiryDoc>("Inquiry", InquirySchema);
export default Inquiry;

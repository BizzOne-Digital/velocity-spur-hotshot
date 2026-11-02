import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    icon: { type: String, default: "truck" },
    features: { type: [String], default: [] },
    disclaimer: { type: String, default: "" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type ServiceDoc = InferSchemaType<typeof ServiceSchema>;
const Service: Model<ServiceDoc> = models.Service || model<ServiceDoc>("Service", ServiceSchema);
export default Service;

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const TransportationPackageSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    features: { type: [String], default: [] },
    image: { type: String, default: "" },
    icon: { type: String, default: "handshake" },
    ctaLabel: { type: String, default: "Discuss Requirements" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type TransportationPackageDoc = InferSchemaType<typeof TransportationPackageSchema>;
const TransportationPackage: Model<TransportationPackageDoc> =
  models.TransportationPackage ||
  model<TransportationPackageDoc>("TransportationPackage", TransportationPackageSchema);
export default TransportationPackage;

import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const GalleryItemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    category: { type: String, default: "General", trim: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export type GalleryItemDoc = InferSchemaType<typeof GalleryItemSchema>;
const GalleryItem: Model<GalleryItemDoc> =
  models.GalleryItem || model<GalleryItemDoc>("GalleryItem", GalleryItemSchema);
export default GalleryItem;

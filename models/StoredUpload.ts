import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const StoredUploadSchema = new Schema(
  {
    folder: { type: String, required: true },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

StoredUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type StoredUploadDoc = InferSchemaType<typeof StoredUploadSchema>;
const StoredUpload: Model<StoredUploadDoc> =
  models.StoredUpload || model<StoredUploadDoc>("StoredUpload", StoredUploadSchema);
export default StoredUpload;

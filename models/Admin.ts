import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const AdminSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "editor"], default: "admin" },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof AdminSchema>;
const Admin: Model<AdminDoc> = models.Admin || model<AdminDoc>("Admin", AdminSchema);
export default Admin;

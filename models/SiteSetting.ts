import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

// Key/value store. The "site" key holds the editable SiteSettings object;
// "seed:v1" marks that default content has been inserted.
const SiteSettingSchema = new Schema(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

export type SiteSettingDoc = InferSchemaType<typeof SiteSettingSchema>;
const SiteSetting: Model<SiteSettingDoc> =
  models.SiteSetting || model<SiteSettingDoc>("SiteSetting", SiteSettingSchema);
export default SiteSetting;

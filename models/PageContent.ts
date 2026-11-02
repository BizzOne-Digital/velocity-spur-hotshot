import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

export const PAGE_KEYS = ["home", "about", "services", "packages", "quote", "contact"] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

const SectionSchema = new Schema(
  {
    sectionKey: { type: String, required: true },
    heading: { type: String, default: "" },
    subheading: { type: String, default: "" },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    ctaLabel: { type: String, default: "" },
    ctaUrl: { type: String, default: "" },
    additionalData: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false, minimize: false }
);

const PageContentSchema = new Schema(
  {
    pageKey: { type: String, required: true, unique: true, enum: PAGE_KEYS },
    sections: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

export type PageContentDoc = InferSchemaType<typeof PageContentSchema>;
const PageContent: Model<PageContentDoc> =
  models.PageContent || model<PageContentDoc>("PageContent", PageContentSchema);
export default PageContent;

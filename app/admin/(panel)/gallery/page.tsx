import CollectionManager, { type FieldDef } from "@/components/admin/CollectionManager";
import { getGallery } from "@/lib/data";

export const metadata = { title: "Gallery & Media" };

const FIELDS: FieldDef[] = [
  { key: "title", label: "Title / Alt Text", type: "text", required: true },
  { key: "category", label: "Category", type: "text", hint: "e.g. Fleet, Equipment, Jobsite" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "image", label: "Image", type: "image", hint: "Required. Use real photos of your own trucks, trailers and loads." },
  { key: "order", label: "Display Order", type: "number" },
  { key: "active", label: "Visible on website", type: "checkbox" },
];

export default async function AdminGalleryPage() {
  const items = await getGallery(true);
  return (
    <CollectionManager
      title="Gallery & Media"
      singular="Image"
      endpoint="/api/admin/gallery"
      folder="gallery"
      fields={FIELDS}
      initialItems={items}
      subtitleKey="category"
      blank={{ title: "", description: "", category: "General", image: "", active: true }}
    />
  );
}

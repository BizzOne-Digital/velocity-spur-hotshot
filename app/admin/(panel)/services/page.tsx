import CollectionManager, { type FieldDef } from "@/components/admin/CollectionManager";
import { getServices } from "@/lib/data";

export const metadata = { title: "Services" };

const FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "icon", label: "Icon", type: "icon" },
  { key: "shortDescription", label: "Short Description (cards)", type: "textarea" },
  { key: "description", label: "Full Description (services page)", type: "textarea" },
  { key: "features", label: "Capabilities / Freight Examples", type: "list" },
  { key: "disclaimer", label: "Disclaimer (optional)", type: "textarea" },
  { key: "image", label: "Service Image", type: "image" },
  { key: "slug", label: "URL Anchor (auto from title if empty)", type: "text" },
  { key: "order", label: "Display Order", type: "number" },
  { key: "active", label: "Visible on website", type: "checkbox" },
];

export default async function AdminServicesPage() {
  const services = await getServices(true);
  return (
    <CollectionManager
      title="Services"
      singular="Service"
      endpoint="/api/admin/services"
      folder="products"
      fields={FIELDS}
      initialItems={services}
      subtitleKey="shortDescription"
      blank={{ title: "", slug: "", icon: "truck", shortDescription: "", description: "", features: [], disclaimer: "", image: "", active: true }}
    />
  );
}

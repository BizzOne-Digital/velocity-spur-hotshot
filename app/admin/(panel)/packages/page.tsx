import CollectionManager, { type FieldDef } from "@/components/admin/CollectionManager";
import { getPackages } from "@/lib/data";

export const metadata = { title: "Packages" };

const FIELDS: FieldDef[] = [
  { key: "title", label: "Title", type: "text", required: true },
  { key: "icon", label: "Icon", type: "icon" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "features", label: "Included Features", type: "list" },
  { key: "image", label: "Package Image", type: "image" },
  { key: "ctaLabel", label: "Button Label", type: "text" },
  { key: "slug", label: "URL Anchor (auto from title if empty)", type: "text" },
  { key: "order", label: "Display Order", type: "number" },
  { key: "active", label: "Visible on website", type: "checkbox" },
];

export default async function AdminPackagesPage() {
  const packages = await getPackages(true);
  return (
    <CollectionManager
      title="Transportation Packages"
      singular="Package"
      endpoint="/api/admin/packages"
      folder="products"
      fields={FIELDS}
      initialItems={packages}
      subtitleKey="description"
      blank={{ title: "", slug: "", icon: "handshake", description: "", features: [], image: "", ctaLabel: "Discuss Requirements", active: true }}
    />
  );
}

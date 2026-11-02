import PagesEditor from "@/components/admin/PagesEditor";
import { getPageSectionsList } from "@/lib/data";
import { PAGE_KEYS } from "@/models/PageContent";

export const metadata = { title: "Page Content" };

export default async function AdminPagesPage() {
  const entries = await Promise.all(PAGE_KEYS.map(async (k) => [k, await getPageSectionsList(k)] as const));
  return <PagesEditor initialPages={Object.fromEntries(entries)} />;
}

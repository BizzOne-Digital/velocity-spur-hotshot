import SettingsForm from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}

import { loadLegacyMain } from "../lib/loadLegacy";
import LegacySection from "../components/LegacySection";

export const metadata = { title: "Services | Servicios El Paisano" };

export default async function ServicesPage() {
  const html = await loadLegacyMain("services.html");
  return <LegacySection html={html} />;
}

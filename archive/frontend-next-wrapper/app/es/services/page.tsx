import { loadLegacyMain } from "../../lib/loadLegacy";
import LegacySection from "../../components/LegacySection";

export const metadata = { title: "Servicios | Servicios El Paisano" };

export default async function EsServices() {
  const html = await loadLegacyMain("servicios.html");
  return <LegacySection html={html} />;
}

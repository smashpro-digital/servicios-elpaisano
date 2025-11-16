import { loadLegacyMain } from "../../lib/loadLegacy";
import LegacySection from "../../components/LegacySection";

export const metadata = { title: "Acerca | Servicios El Paisano" };

export default async function EsAbout() {
  const html = await loadLegacyMain("acerca.html");
  return <LegacySection html={html} />;
}

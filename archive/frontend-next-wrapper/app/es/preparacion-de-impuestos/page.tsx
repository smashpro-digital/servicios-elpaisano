import { loadLegacyMain } from "../../lib/loadLegacy";
import LegacySection from "../../components/LegacySection";

export const metadata = { title: "Preparación de Impuestos | Servicios El Paisano" };

export default async function EsTax() {
  const html = await loadLegacyMain("preparacion-de-impuestos.html");
  return <LegacySection html={html} />;
}

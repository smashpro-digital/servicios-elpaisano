import { loadLegacyMain } from "../lib/loadLegacy";
import LegacySection from "../components/LegacySection";

export const metadata = { title: "Servicios El Paisano — Español" };

export default async function EsHome() {
  const html = await loadLegacyMain("espanol.html");
  return <LegacySection html={html} />;
}

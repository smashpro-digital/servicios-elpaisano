import { loadLegacyMain } from "../lib/loadLegacy";
import LegacySection from "../components/LegacySection";

export const metadata = { title: "Tax Preparation & Filing | Servicios El Paisano" };

export default async function TaxPage() {
  const html = await loadLegacyMain("tax-preparation-filing.html");
  return <LegacySection html={html} />;
}


import { loadLegacyMain } from "../lib/loadLegacy";
import LegacySection from "../components/LegacySection";

export const metadata = { title: "About | Servicios El Paisano" };

export default async function AboutPage() {
  const html = await loadLegacyMain("about.html");
  return <LegacySection html={html} />;
}

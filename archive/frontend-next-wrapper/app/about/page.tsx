import { loadLegacyMain } from "../lib/loadLegacy";
import AboutContent from "../components/AboutContent";
import { parseAbout } from "../lib/parseAbout";

export const metadata = { title: "About | Servicios El Paisano" };

export default async function AboutPage() {
  const html = await loadLegacyMain("about.html");
  const content = parseAbout(html);

  return <AboutContent {...content} />;
}
import { loadLegacyMain, stripLegacyBanner  } from "../lib/loadLegacy";
import LegacySection from "../components/LegacySection";
import Banner from "../components/Banner";

function stripLegacyBanner(html: string) {
  // remove <div id="banner">...</div> (non-greedy, handles newlines)
  return html.replace(/<div[^>]*id=["']banner["'][^>]*>[\s\S]*?<\/div>/i, "");
}

// export const metadata = { title: "Servicios El Paisano — Español" };

// export default async function EsHome() {
//   const html = await loadLegacyMain("espanol.html");
//   return <LegacySection html={html} />;
// }




export const metadata = { title: "Servicios El Paisano" };

export default async function Page() {
  let html = await loadLegacyMain("index.html");
  html = stripLegacyBanner(html);

  // Point to the same images the legacy site uses
  const slides = [
    "/images/slide00.webp",
    "/images/slide01.webp",
    "/images/slide02.webp",
    "/images/slide03.webp",
    "/images/slide04.webp",
    "/images/slide05.webp",
  ];

  return (
    <>
      <Banner images={slides} />
      <LegacySection html={html} />
    </>
  );
}

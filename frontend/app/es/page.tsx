import { loadLegacyMain, stripLegacyBanner } from "../lib/loadLegacy";
import LegacySection from "../components/LegacySection";
import Banner from "../components/Banner"; // keep if you want the slider on ES too

export const metadata = { title: "Servicios El Paisano — Español" };

export default async function Page() {
  let html = await loadLegacyMain("espanol.html");
  html = stripLegacyBanner(html); // remove legacy #banner

  // Use same slides (or a Spanish set if you prefer)
  const slides = [
    "/images/slide00.webp",
    "/images/slide01.webp",
    "/images/slide02.webp",
    "/images/slide03.webp",
    "/images/slide04.webp",
    "/images/slide05.webp",
  ];

  return (
    // <>
    //   <Banner images={slides} height={460} />
    //   <LegacySection html={html} />
    // </>
    <Banner
  images={slides}
  height={460}
  heading="FILE YOUR 2025 INCOME TAX"
/>

  );
}

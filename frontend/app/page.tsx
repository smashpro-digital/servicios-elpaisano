// app/page.tsx
//export default function HomePage() {
  //return (
    //<section className="page-section">
    //  <h2>Welcome to Servicios El Paisano</h2>
    //  <p>
    //    Connecting communities with trusted services. The English version of the website is coming soon.
   //   </p>
  //  </section>
 // );
//}

import { loadLegacyMain, stripLegacyBanner } from "./lib/loadLegacy";
import LegacySection from "./components/LegacySection";
import Banner from "./components/Banner";

export const metadata = { title: "Servicios El Paisano" };

export default async function Page() {
  let html = await loadLegacyMain("index.html");
  html = stripLegacyBanner(html); // remove legacy #banner

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
  // heading="FILE YOUR 2025 INCOME TAX"
/>

  );
}


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


import { loadLegacyMain } from "./lib/loadLegacy";
import LegacySection from "./components/LegacySection";
import Banner from "./components/Banner";

export const metadata = { title: "Servicios El Paisano" };

export default async function Page() {
  const html = await loadLegacyMain("index.html");
  return <LegacySection html={html} />;
}


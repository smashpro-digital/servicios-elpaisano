import fs from "node:fs/promises";
import path from "node:path";
import cheerio from "cheerio";

const BASE_URL = "https://servicioselpaisano.com";

function cleanText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteUrl(input) {
  if (!input) return undefined;
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  if (input.startsWith("/")) return `${BASE_URL}${input}`;
  return `${BASE_URL}/${input.replace(/^\.?\//, "")}`;
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "text/html,application/xhtml+xml",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${url}: ${res.status}`);
  }

  return await res.text();
}

async function main() {
  const html = await fetchHtml(BASE_URL);
  const $ = cheerio.load(html);

  const images = $("img")
    .map((_, el) => ({
      src: absoluteUrl($(el).attr("src")),
      alt: cleanText($(el).attr("alt") || ""),
    }))
    .get()
    .filter((img) => img.src);

  const slides = images.slice(0, 4).map((img, index) => ({
    id: `slide-${index + 1}`,
    eyebrow: index === 0 ? "SERVICIOS EL PAISANO" : "FEATURED",
    title: img.alt || "Servicios El Paisano",
    subtitle: img.alt || "Community services in Chattanooga.",
    imageSrc: img.src,
  }));

  const output = {
    slides,
    quickActions: [
      "Taxes",
      "Translation",
      "Money Transfer",
      "Notary",
      "Phones",
      "Tags & Titles"
    ],
    services: [
      { title: "Taxes", subtitle: "Tax preparation, filing, and general support." },
      { title: "Translation", subtitle: "English and Spanish document translation services." },
      { title: "Money Transfer", subtitle: "Send or receive money quickly and securely." },
      { title: "Notary", subtitle: "Document notarization and form support." },
      { title: "Phones", subtitle: "Phone plans, SIM cards, and mobile help." },
      { title: "Tags & Titles", subtitle: "Vehicle registration, titles, and plates assistance." }
    ],
    office: {
      hours: [
        "Monday-Friday: 9:00 AM - 6:00 PM",
        "Saturday: 9:00 AM - 3:00 PM",
        "Sunday: Closed"
      ],
      address: "2740 Dodds Ave, Chattanooga, TN",
      phone: "423-265-2528",
      email: "servicioselpaisano@gmail.com"
    }
  };

  const outPath = path.resolve("data/site-content.json");
  await fs.writeFile(outPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
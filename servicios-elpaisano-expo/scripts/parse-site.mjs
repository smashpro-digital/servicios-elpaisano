import fs from "node:fs/promises";
import path from "node:path";
import * as cheerio from "cheerio";

const BASE_URL =
  process.env.SERVICIOS_SITE_URL || "https://servicioselpaisano.com";
const DEFAULT_LOCAL_OUT = path.resolve("data/site-content.json");
const DEFAULT_SERVER_OUT = path.resolve("app-content.json");

const args = new Map(
  process.argv.slice(2).flatMap((arg, index, all) => {
    if (!arg.startsWith("--")) return [];
    const [key, inlineValue] = arg.slice(2).split("=");
    return [[key, inlineValue ?? all[index + 1]]];
  })
);

function cleanText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteUrl(input) {
  if (!input) return undefined;
  if (input.startsWith("http://") || input.startsWith("https://")) return input;
  if (input.startsWith("/")) return `${BASE_URL}${input}`;
  return `${BASE_URL}/${input.replace(/^\.?\//, "")}`;
}

function localized(en, es = en) {
  return { en, es };
}

async function fetchHtml(pathname = "/") {
  const url = new URL(pathname, BASE_URL).toString();
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

function imageInventory($) {
  return $("img")
    .map((_, el) => ({
      src: absoluteUrl($(el).attr("src")),
      alt: cleanText($(el).attr("alt") || ""),
    }))
    .get()
    .filter((img) => img.src);
}

function findYouTubeUrl(...documents) {
  for (const $ of documents) {
    const href = $("a[href*='youtu']")
      .map((_, el) => $(el).attr("href"))
      .get()
      .find(Boolean);

    if (href) return href;
  }

  return "https://youtu.be/OgTlSTC77Kg";
}

function buildSlides(images) {
  const fallbacks = [
    {
      eyebrow: localized("SERVICIOS EL PAISANO"),
      title: localized("Welcome to Our Website", "Bienvenido a Nuestro Sitio Web"),
      subtitle: localized(
        "We hope to see you in person in our office.",
        "Esperamos verte en persona en nuestra oficina."
      ),
    },
    {
      eyebrow: localized("CUSTOMER SERVICE", "SERVICIO AL CLIENTE"),
      title: localized(
        "9am-6pm Mon-Fri & 9am-3pm Sat",
        "9am-6pm Lunes a Viernes y 9am-3pm Sabado"
      ),
      subtitle: localized(
        "No appointment needed for consultation.",
        "No se necesita cita para una consulta."
      ),
    },
    {
      eyebrow: localized("MONEY TRANSFERS", "TRANSFERENCIAS"),
      title: localized("Convenient Money Transfers", "Transferencias de Dinero"),
      subtitle: localized(
        "Send and receive money in the United States and internationally.",
        "Envia y recibe dinero dentro de Estados Unidos e internacionalmente."
      ),
    },
    {
      eyebrow: localized("MOBILE PHONE CENTER", "CENTRO DE TELEFONIA MOVIL"),
      title: localized(
        "Phones, SIM Cards & Accessories",
        "Telefonos, SIM y Accesorios"
      ),
      subtitle: localized(
        "Pre-paid and post-paid services, SIM cards, accessories, and smartphone help.",
        "Servicios prepago y pospago, tarjetas SIM, accesorios y ayuda con telefonos inteligentes."
      ),
    },
    {
      eyebrow: localized("TAX FILING", "IMPUESTOS"),
      title: localized("File Your Income Tax", "Presente sus Impuestos"),
      subtitle: localized(
        "Tax preparation, e-filing, and previous-year tax filing support.",
        "Preparacion de impuestos, e-file y ayuda con anos anteriores."
      ),
    },
  ];

  return fallbacks.map((slide, index) => ({
    id: `home-${index + 1}`,
    ...slide,
    imageSrc:
      images[index]?.src ||
      `${BASE_URL}/images/${
        ["slide01.webp", "slide-anniversary.webp", "slide02.webp", "slide04.webp", "slide11.webp"][
          index
        ]
      }`,
  }));
}

async function main() {
  const [homeHtml, aboutHtml] = await Promise.all([
    fetchHtml("/"),
    fetchHtml("/about.html").catch(() => ""),
  ]);
  const $home = cheerio.load(homeHtml);
  const $about = cheerio.load(aboutHtml || homeHtml);
  const $services = cheerio.load(await fetchHtml("/services.html").catch(() => ""));
  const $spanish = cheerio.load(await fetchHtml("/espanol.html").catch(() => ""));
  const images = imageInventory($home);
  const aboutText = cleanText($about("main, body").text());
  const youtubeVideoUrl = findYouTubeUrl($home, $about, $services, $spanish);

  const content = {
    version: "1",
    updatedAt: new Date().toISOString(),
    home: {
      slides: buildSlides(images),
      promo: {
        badge: localized("20 YEAR", "20 ANOS"),
        title: localized("Celebrating 20 Years", "Celebrando 20 Anos"),
        subtitle: localized(
          "Download coupon to save on services today!",
          "Descarga el cupon para ahorrar en servicios hoy."
        ),
        buttonLabel: localized("Get Coupon", "Obtener Cupon"),
      },
    },
    quickActions: [
      { label: localized("About", "Acerca"), route: "/about" },
      { label: localized("Taxes", "Impuestos"), route: "/services" },
      { label: localized("Translation", "Traduccion"), route: "/services" },
      { label: localized("Money Transfer", "Transferencias"), route: "/services" },
      { label: localized("Notary", "Notaria"), route: "/services" },
      { label: localized("Passports", "Pasaportes"), route: "/services" },
      { label: localized("Bill Pay", "Pago de Facturas"), route: "/services" },
    ],
    office: {
      title: localized("Office Information", "Informacion de la Oficina"),
      hoursTitle: localized("Office Hours", "Horario de Oficina"),
      addressTitle: localized("Office Location", "Ubicacion"),
      hours: {
        en: [
          "Monday-Friday: 9:00 AM - 6:00 PM",
          "Saturday: 9:00 AM - 3:00 PM",
          "Sunday: Closed",
        ],
        es: [
          "Lunes-Viernes: 9:00 AM - 6:00 PM",
          "Sabado: 9:00 AM - 3:00 PM",
          "Domingo: Cerrado",
        ],
      },
      address: localized("3501 Rossville Blvd, Chattanooga, TN 37407"),
      phone: "423-265-2528",
      fax: "423-521-4609",
      email: "servicioselpaisano@gmail.com",
      directionsLabel: localized("GET DIRECTIONS", "COMO LLEGAR"),
      mapsUrl: "https://goo.gl/maps/6T6h7qCY9URgwKxn7",
    },
    about: {
      title: localized("About Servicios El Paisano", "Acerca de Servicios El Paisano"),
      body: localized(
        aboutText || "Servicios El Paisano has served Chattanooga since 2005.",
        aboutText || "Servicios El Paisano ha servido a Chattanooga desde 2005."
      ),
      founders: [
        {
          name: "Santos Chavez",
          imageSrc: `${BASE_URL}/images/Santos-Chavez.jpg`,
        },
        {
          name: "Carmen Hernandez",
          imageSrc: `${BASE_URL}/images/Carmen-Hernandez.jpg`,
        },
      ],
    },
    links: {
      couponUrl: `${BASE_URL}/coupon-d'anniversaire.docx`,
      privacyUrl: `${BASE_URL}/privacy.html`,
      youtubeVideoUrl,
      social: [
        { label: "Twitter/X @servcselpaisano", url: "https://twitter.com/servcselpaisano" },
        { label: "Facebook @s.elpaisano", url: "https://www.facebook.com/s.elpaisano/" },
      ],
      consulates: [
        { label: "El Salvador", url: "http://www.elsalvadorga.org/" },
        {
          label: "Guatemala",
          url: "http://consatlanta.blogspot.com/p/pasaportes-y-id-consular.html",
        },
        { label: "Honduras", url: "http://www.consuladohnatl.com/" },
        { label: "Mexico", url: "https://consulmex.sre.gob.mx/atlanta/" },
      ],
    },
  };

  const outputTargets = [
    args.get("local-out") || DEFAULT_LOCAL_OUT,
    args.get("server-out") || DEFAULT_SERVER_OUT,
  ];

  for (const target of outputTargets) {
    const outPath = path.resolve(target);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
    console.log(`Wrote ${outPath}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

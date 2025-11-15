import fs from "node:fs/promises";
import path from "node:path";

const ORIGIN = "https://www.servicioselpaisano.com";     // client site
// ✅ All bilingual pages to sync from client site
const PAGES = [
  // English site
  ["/index.html", "index.html"],                           // Home
  ["/about.html", "about.html"],                           // About Us
  ["/services.html", "services.html"],                     // Services overview
  ["/tax-preparation-filing.html", "tax-preparation-filing.html"], // Tax prep subpage

  // Spanish site
  ["/espanol.html", "espanol.html"],                       // Spanish home
  ["/acerca.html", "acerca.html"],                         // Acerca de Nosotros
  ["/servicios.html", "servicios.html"],                   // Servicios overview
  ["/preparacion-de-impuestos.html", "preparacion-de-impuestos.html"], // Subpage

  // Optional extras (uncomment if these exist on the client site)
  // ["/contact.html", "contact.html"],
  // ["/contactenos.html", "contactenos.html"],
];

const LEGACY_DIR = path.join(process.cwd(), "frontend", "public", "legacy");
const IMG_DIR = path.join(process.cwd(), "frontend", "public", "images");

async function fetchText(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch ${url} -> ${res.status}`);
  return res.text();
}

async function fetchBin(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Fetch ${url} -> ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// very simple rewrite: make /images/... absolute to our /images/,
// and ./images/... or images/... also point to /images/...
function rewriteAssets(html) {
  return html
    .replace(/(src|href)="\/(images\/[^"]+)"/gi, '$1="/$2"')
    .replace(/(src|href)="\.\/(images\/[^"]+)"/gi, '$1="/$2"')
    .replace(/(src|href)="(images\/[^"]+)"/gi, '$1="/$2"');
}

async function ensureDirs() {
  await fs.mkdir(LEGACY_DIR, { recursive: true });
  await fs.mkdir(IMG_DIR, { recursive: true });
}

// naive image scraper: find /images/... patterns and download once
async function downloadImagesFrom(html) {
  // /images/... -> public/images/...
  const imgMatches = [...html.matchAll(/["']\/?(images\/[^"']+)["']/gi)];
  const underImages = [...new Set(imgMatches.map(m => m[1]))];

  // root images like /logo.png, /Santos-Chavez.jpg
  const rootMatches = [
    ...html.matchAll(/["']\/((?!images\/)[\w.\-]+\.(?:png|jpe?g|gif|webp|svg))["']/gi),
  ];
  const rootFiles = [...new Set(rootMatches.map(m => m[1]))];

  for (const rel of underImages) {
    const url = `${ORIGIN}/${rel.replace(/^\/?/, "")}`;
    const outPath = path.join(IMG_DIR, rel.replace(/^images\//, ""));
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    try { await fs.writeFile(outPath, await fetchBin(url)); console.log("✓ image", rel); }
    catch (e) { console.warn("⚠ image failed", rel, e.message); }
  }

  for (const fname of rootFiles) {
    const url = `${ORIGIN}/${fname}`;
    const outPath = path.join(process.cwd(), "frontend", "public", fname);
    try { await fs.writeFile(outPath, await fetchBin(url)); console.log("✓ root image", fname); }
    catch (e) { console.warn("⚠ root image failed", fname, e.message); }
  }
}

async function downloadAssetsFrom(html) {
  // CSS/JS under /assets/...
  const assetMatches = [
    ...html.matchAll(/href=["']\/?(assets\/[^"']+)["']/gi),
    ...html.matchAll(/src=["']\/?(assets\/[^"']+)["']/gi),
  ];
  const assets = [...new Set(assetMatches.map(m => m[1]))];

  for (const rel of assets) {
    const url = `${ORIGIN}/${rel.replace(/^\/?/, "")}`;
    const outPath = path.join(process.cwd(), "frontend", "public", rel);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    try { await fs.writeFile(outPath, await fetchBin(url)); console.log("✓ asset", rel); }
    catch (e) { console.warn("⚠ asset failed", rel, e.message); }
  }
}
async function run() {
  await ensureDirs();
  for (const [remote, localName] of PAGES) {
    const url = `${ORIGIN}${remote}`;
    const html = await fetchText(url);
    await downloadImagesFrom(html);
    await downloadAssetsFrom(html);    const rewritten = rewriteAssets(html);
    await fs.writeFile(path.join(LEGACY_DIR, localName), rewritten, "utf8");
    console.log("✓ page", remote);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

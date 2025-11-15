import { promises as fs } from "fs";
import path from "path";

/**
 * Prefix for public assets when deployed to GitHub Pages vs localhost.
 * In dev:   ""  -> /images/foo.jpg
 * In prod:  "/servicios-elpaisano" -> /servicios-elpaisano/images/foo.jpg
 */
const basePrefix =
  process.env.NODE_ENV === "production" ? "/servicios-elpaisano" : "";

/**
 * Rewrites legacy HTML asset URLs so they load from Next's public/ folder.
 * - Root-leading paths:  /logo.png, /images/foo.jpg, /assets/css/main.css
 * - Relative paths:      ./images/foo.jpg, images/foo.jpg, assets/js/app.js
 * (Ignores http(s), mailto:, tel:, #anchors, data:)
 */
function rewriteAssetUrls(html: string): string {
  // /something (but not //, http, mailto, tel, data)
  html = html.replace(
    /(src|href)=["']\/(?!\/)(?!https?:)(?!mailto:)(?!tel:)(?!data:)([^"']+)["']/gi,
    (_m, attr, rest) => `${attr}="${basePrefix}/${rest}"`
  );

  // ./images/... or ./assets/...
  html = html.replace(
    /(src|href)=["']\.\/(images\/[^"']+|assets\/[^"']+)["']/gi,
    (_m, attr, rel) => `${attr}="${basePrefix}/${rel}"`
  );

  // images/... or assets/...
  html = html.replace(
    /(src|href)=["'](images\/[^"']+|assets\/[^"']+)["']/gi,
    (_m, attr, rel) => `${attr}="${basePrefix}/${rel}"`
  );

  return html;
}

/**
 * Loads a legacy HTML file from /public/legacy and returns the "main" content,
 * with asset URLs rewritten to work under Next.js + GitHub Pages.
 */
export async function loadLegacyMain(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "legacy", filename);
  const raw = await fs.readFile(filePath, "utf8");

  // Prefer between <!-- Main --> and <!-- Footer -->
  const startIdx = raw.indexOf("<!-- Main -->");
  const endIdx = raw.indexOf("<!-- Footer -->");

  let section = raw;
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    section = raw.slice(startIdx, endIdx);
  } else {
    // Fallback: try an element with id="main"
    const idMain = /<[^>]*id=["']main["'][^>]*>/i.exec(raw);
    if (idMain) {
      const openTagIdx = idMain.index!;
      // naive close search (good enough for these static pages)
      const closeIdx = raw.indexOf("</", openTagIdx);
      if (closeIdx !== -1) {
        section = raw.slice(openTagIdx, closeIdx + 2);
      }
    }
  }

  return rewriteAssetUrls(section);
}

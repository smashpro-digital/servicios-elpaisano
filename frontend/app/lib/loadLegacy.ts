import { promises as fs } from "fs";
import path from "path";

const basePrefix =
  process.env.NODE_ENV === "production" ? "/servicios-elpaisano" : "";

/** Remove any <script>…</script> or self-closing <script …/> blocks */
function stripScripts(html: string): string {
  // Remove normal <script> … </script>
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  // Remove self-closing <script ... />
  html = html.replace(/<script\b[^>]*\/>/gi, "");
  return html;
}

/** Rewrite asset URLs so they work from Next public/ and GitHub Pages basePath */
function rewriteAssetUrls(html: string): string {
  // Root-leading (but not //, http(s), mailto, tel, data)
  html = html.replace(
    /(src|href)=["']\/(?!\/)(?!https?:)(?!mailto:)(?!tel:)(?!data:)([^"']+)["']/gi,
    (_m, attr, rest) => `${attr}="${basePrefix}/${rest}"`
  );
  // ./images or ./assets
  html = html.replace(
    /(src|href)=["']\.\/(images\/[^"']+|assets\/[^"']+)["']/gi,
    (_m, attr, rel) => `${attr}="${basePrefix}/${rel}"`
  );
  // images or assets (relative)
  html = html.replace(
    /(src|href)=["'](images\/[^"']+|assets\/[^"']+)["']/gi,
    (_m, attr, rel) => `${attr}="${basePrefix}/${rel}"`
  );
  return html;
}

/**
 * Load legacy HTML from /public/legacy/<filename>,
 * slice the "main" section, strip legacy scripts, and rewrite asset URLs.
 */
export async function loadLegacyMain(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "legacy", filename);
  let raw = await fs.readFile(filePath, "utf8");

  // Prefer content between <!-- Main --> and <!-- Footer -->
  const startIdx = raw.indexOf("<!-- Main -->");
  const endIdx = raw.indexOf("<!-- Footer -->");

  let section = raw;
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    section = raw.slice(startIdx, endIdx);
  } else {
    // Fallback: element with id="main"
    const match = /<[^>]*id=["']main["'][^>]*>/i.exec(raw);
    if (match) {
      const open = match.index!;
      const close = raw.indexOf("</", open);
      if (close !== -1) section = raw.slice(open, close + 2);
    }
  }

  // 1) Remove legacy <script> tags to avoid 404s & hydration mismatches
  section = stripScripts(section);

  // 2) Rewrite /images, /assets, images/, assets/ to include base path
  section = rewriteAssetUrls(section);

  return section;
}

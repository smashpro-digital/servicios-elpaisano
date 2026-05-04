import { promises as fs } from "fs";
import path from "path";

const basePrefix =
  process.env.NODE_ENV === "production" ? "/servicios-elpaisano" : "";

/** Remove any <script>…</script> or self-closing <script …/> blocks */
function stripScripts(html: string): string {
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<script\b[^>]*\/>/gi, "");
  return html;
}

/** Remove legacy CSS links under /assets (font-awesome, theme CSS) to avoid 404s */
function stripLegacyLinks(html: string): string {
  return html.replace(
    /<link\b[^>]*href=["']\/?assets\/[^"']+["'][^>]*>/gi,
    ""
  );
}
/** Remove legacy <div id="banner">…</div> completely */
export function stripLegacyBanner(html: string): string {
  return html.replace(
    /<div[^>]*id=["']banner["'][^>]*>[\s\S]*?<\/div>/i,
    ""
  );
}
/** Remove the legacy header block (<header id="header">…</header>) */
function stripLegacyHeader(html: string): string {
  return html.replace(
    /<header[^>]*id=["']header["'][^>]*>[\s\S]*?<\/header>/i,
    ""
  );
}

/** Remove the legacy preload class toggled by old JS */
function stripPreloadClass(html: string): string {
  return html.replace(
    /\sclass=["']([^"']*\s)?is-preload(\s[^"']*)?["']/gi,
    (_m, pre = "", post = "") => {
      const cleaned = `${(pre || "").trim()} ${(post || "").trim()}`.trim();
      return cleaned ? ` class="${cleaned}"` : "";
    }
  );
}

/** Rewrite asset URLs in src/href attributes */
function rewriteAttrUrls(html: string): string {
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

/** Rewrite URLs inside inline styles: background-image:url("images/...") etc. */
function rewriteStyleUrls(html: string): string {
  return html.replace(
    /url\((['"]?)(\/?(images|assets)\/[^'")]+)\1\)/gi,
    (_m, q, rel) => `url(${q}${basePrefix}/${rel.replace(/^\//, "")}${q})`
  );
}

/**
 * Load legacy HTML from /public/legacy/<filename>,
 * slice the "main" section, strip legacy header/scripts/links, and rewrite URLs.
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

  // Strip legacy stuff that collides with React/static hosting
  section = stripLegacyHeader(section);
  section = stripLegacyLinks(section);
  section = stripScripts(section);
  section = stripPreloadClass(section);

  // Rewrite asset urls in attributes and inline styles
  section = rewriteAttrUrls(section);
  section = rewriteStyleUrls(section);

  return section;
}

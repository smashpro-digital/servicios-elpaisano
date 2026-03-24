export type AboutContent = {
  title: string;
  subtitle?: string;
  paragraphs: string[];
};

function stripTags(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function getMatch(html: string, regex: RegExp): string | undefined {
  const match = html.match(regex);
  if (!match?.[1]) return undefined;
  const value = stripTags(match[1]).trim();
  return value || undefined;
}

function getAllParagraphs(html: string): string[] {
  const matches = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)];

  return matches
    .map((m) => stripTags(m[1]))
    .map((text) => text.trim())
    .filter(Boolean)
    .filter((text) => text.length > 25);
}

function dedupeParagraphs(paragraphs: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const p of paragraphs) {
    const key = p.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(p);
  }

  return result;
}

export function parseAbout(html: string): AboutContent {
  const title =
    getMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i) ||
    getMatch(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/i) ||
    "About Us";

  const subtitle =
    getMatch(
      html,
      /<p\b[^>]*class=["'][^"']*(?:subtitle|subheading|tagline)[^"']*["'][^>]*>([\s\S]*?)<\/p>/i
    ) ||
    getMatch(
      html,
      /<div\b[^>]*class=["'][^"']*(?:subtitle|subheading|tagline)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i
    );

  let paragraphs = getAllParagraphs(html);

  if (paragraphs.length === 0) {
    const mainMatch =
      html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) ||
      html.match(/<section\b[^>]*>([\s\S]*?)<\/section>/i) ||
      html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i);

    if (mainMatch?.[1]) {
      const blocks = stripTags(mainMatch[1])
        .split(/\n{2,}/)
        .map((text) => text.trim())
        .filter((text) => text.length > 25);

      paragraphs = blocks;
    }
  }

  paragraphs = dedupeParagraphs(paragraphs);

  return {
    title,
    subtitle,
    paragraphs,
  };
}
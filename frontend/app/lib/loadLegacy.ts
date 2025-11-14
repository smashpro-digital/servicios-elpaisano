import { promises as fs } from "fs";
import path from "path";

/**
 * Loads a legacy HTML file from /public/legacy and returns only the "main" content.
 * It tries to slice everything between <!-- Main --> and <!-- Footer --> first;
 * if not found, returns the whole file body.
 */
export async function loadLegacyMain(filename: string): Promise<string> {
  const filePath = path.join(process.cwd(), "public", "legacy", filename);
  const raw = await fs.readFile(filePath, "utf8");

  // Try to carve out the main area by comments present in the provided files
  const startIdx = raw.indexOf("<!-- Main -->");
  const endIdx = raw.indexOf("<!-- Footer -->");

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    return raw.slice(startIdx, endIdx);
  }

  // Fallback: try <div id="main">…</div>
  const mainStart = raw.indexOf('id="main"');
  if (mainStart !== -1) {
    // crude wrap to the next closing </div> of the wrapper (keeps simple)
    const wrapperStart = raw.lastIndexOf("<div", mainStart);
    const wrapperEnd = raw.indexOf("</div>", mainStart);
    if (wrapperStart !== -1 && wrapperEnd !== -1) {
      return raw.slice(wrapperStart, wrapperEnd + 6);
    }
  }

  // Worst case: give the full HTML (will still render inside our layout)
  return raw;
}

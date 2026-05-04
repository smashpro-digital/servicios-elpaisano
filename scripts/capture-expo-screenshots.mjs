import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const root = process.cwd();
const distDir = path.join(root, "servicios-elpaisano-expo", "dist");
const outDir = path.join(root, "docs", "screenshots");
const port = Number(process.env.SCREENSHOT_PORT || 4177);

const routes = [
  { path: "/", file: "home.png" },
  { path: "/services", file: "services.png" },
  { path: "/request", file: "request.png" },
  { path: "/contact", file: "contact.png" },
  { path: "/video", file: "video.png" },
];

const mimeTypes = new Map([
  [".css", "text/css"],
  [".html", "text/html"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript"],
  [".json", "application/json"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
]);

function resolveRequestPath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const directPath = path.join(distDir, cleanPath);

  if (path.extname(cleanPath)) return directPath;
  if (cleanPath === "/") return path.join(distDir, "index.html");
  return path.join(distDir, `${cleanPath.replace(/^\//, "")}.html`);
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function startServer() {
  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400).end();
      return;
    }

    let filePath = resolveRequestPath(req.url);
    if (!(await fileExists(filePath))) {
      filePath = path.join(distDir, "index.html");
    }

    try {
      const content = await fs.readFile(filePath);
      const contentType = mimeTypes.get(path.extname(filePath)) || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    } catch {
      res.writeHead(404).end();
    }
  });

  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return server;
}

async function main() {
  if (!(await fileExists(path.join(distDir, "index.html")))) {
    throw new Error("Expo web export not found. Run `npm run export:web` first.");
  }

  await fs.mkdir(outDir, { recursive: true });
  const server = await startServer();
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });

    for (const route of routes) {
      await page.goto(`http://127.0.0.1:${port}${route.path}`, {
        waitUntil: "networkidle",
      });
      await page.waitForTimeout(1200);
      await page.screenshot({
        path: path.join(outDir, route.file),
        fullPage: false,
      });
      console.log(`Captured docs/screenshots/${route.file}`);
    }
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

#!/usr/bin/env bun
// Headless drawio -> PNG renderer (user-space, no xvfb / no root).
// Uses the drawio GraphViewer library inside headless Chromium.
// XML is injected via JS setAttribute (not an HTML attribute) so the drawio's
// own &lt;/&quot; entities are not double-decoded by the HTML parser.
// Usage: bun render.ts <input.drawio> <output.png> [scale]
import puppeteer from "puppeteer";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const here = dirname(fileURLToPath(import.meta.url));
const [input, output, scaleArg] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: bun render.ts <input.drawio> <output.png> [scale]");
  process.exit(1);
}
const scale = Number(scaleArg) || 2;

const xml = readFileSync(input, "utf8");
const viewerJs = readFileSync(join(here, "viewer-static.min.js"), "utf8");
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;background:#ffffff"><div class="mxgraph" id="g"></div>
<script>${viewerJs}</script></body></html>`;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--force-color-profile=srgb", "--hide-scrollbars"],
});
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));
  await page.setViewport({ width: 1400, height: 2400, deviceScaleFactor: scale });
  await page.setContent(html, { waitUntil: "load" });
  await page.evaluate((xmlStr) => {
    const cfg = JSON.stringify({ xml: xmlStr, border: 24, nav: false, toolbar: null, lightbox: false });
    const el = document.getElementById("g")!;
    el.setAttribute("data-mxgraph", cfg); // literal — no HTML entity decoding
    // @ts-ignore
    GraphViewer.processElements();
  }, xml);
  await page.waitForSelector(".mxgraph svg", { timeout: 20000 });
  await new Promise((r) => setTimeout(r, 500)); // settle layout/fonts
  const el = await page.$(".mxgraph");
  if (!el) throw new Error("diagram element not found after render");
  await el.screenshot({ path: output });
  console.log("wrote", output);
} finally {
  await browser.close();
}

// render.ts — produce a standalone HTML that renders a .docx visually via
// docx-preview (reads styles/numbering/theme/fonts), with the libraries and the
// document inlined as base64 so there are zero external requests (works over
// file://). Open the HTML in Chrome and screenshot to judge appearance.
//
// Usage: bun src/render.ts <file.docx> <out.html> [title]

import { readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

const docxPath = process.argv[2];
const outPath = process.argv[3];
const title = process.argv[4] ?? docxPath;
if (!docxPath || !outPath) {
  console.error("usage: bun src/render.ts <file.docx> <out.html> [title]");
  process.exit(1);
}

const jszip = readFileSync(resolve(ROOT, "node_modules/jszip/dist/jszip.min.js"), "utf8");
const preview = readFileSync(
  resolve(ROOT, "node_modules/docx-preview/dist/docx-preview.min.js"),
  "utf8"
);
const b64 = readFileSync(resolve(docxPath)).toString("base64");

const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body { margin:0; background:#888; font-family:sans-serif; }
  .label { background:#222; color:#fff; padding:6px 12px; font-size:13px; }
  .docx-wrapper { background:#888 !important; padding:24px !important; }
  .docx-wrapper > section.docx { box-shadow:0 0 12px rgba(0,0,0,.4); margin-bottom:24px; }
</style></head>
<body>
<div class="label">${title}</div>
<div id="container"></div>
<script>${jszip}</script>
<script>${preview}</script>
<script>
  const b64 = "${b64}";
  const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
  const blob = new Blob([bytes], {type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  docx.renderAsync(blob, document.getElementById("container"), null, {
    className:"docx", inWrapper:true, ignoreWidth:false, ignoreHeight:false,
    breakPages:true, experimental:true, useBase64URL:true
  }).then(()=>{ document.title="RENDERED:"+${JSON.stringify(title)}; window.__rendered=true; })
   .catch(e=>{ document.body.insertAdjacentHTML("beforeend","<pre style='color:red'>"+e+"</pre>"); window.__rendered="error"; });
</script>
</body></html>`;

writeFileSync(resolve(outPath), html);
console.log(`✓ ${outPath}`);

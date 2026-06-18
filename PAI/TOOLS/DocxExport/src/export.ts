// export.ts — CLI entry. Template-surgery md -> docx exporter.
//
// Usage:
//   bun src/export.ts coverletter <input.md> <output.docx> [--template <docx>]
//   bun src/export.ts resume      <input.md> <output.docx> [--template <docx>]
//
// The output reuses the template's styles, theme, fonts, settings (ligatures),
// numbering, headers/footers and page setup byte-for-byte; only the document
// body is regenerated from the markdown.

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readDocx, writeDocx } from "./ooxml.ts";
import { exportCoverLetter } from "./coverletter.ts";
import { exportResume } from "./resume.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const type = process.argv[2];
const input = process.argv[3];
const output = process.argv[4];

if (!type || !input || !output || !["coverletter", "resume"].includes(type)) {
  console.error(
    "usage: bun src/export.ts <coverletter|resume> <input.md> <output.docx> [--template <docx>]"
  );
  process.exit(1);
}

const template =
  arg("--template") ?? resolve(ROOT, "profiles", `${type}.template.docx`);

const md = require("fs").readFileSync(resolve(input), "utf8");
const entries = readDocx(template);

const result =
  type === "coverletter"
    ? exportCoverLetter(entries, md)
    : exportResume(entries, md);

writeDocx(resolve(output), result);
console.log(`✓ wrote ${output} (from ${type} template: ${template})`);

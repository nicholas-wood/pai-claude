// inspect.ts — dump the exact style skeleton of a .docx, plus the
// global formatting facts that drive visual fidelity (page setup, default
// font, ligature setting). Used as ground truth for the exporter and as the
// verifier's parser.
//
// Usage: bun src/inspect.ts <file.docx> [--json]

import {
  readDocx,
  partText,
  parseParagraphs,
  pPrSummary,
  rPrSummary,
  attr,
} from "./ooxml.ts";

const path = process.argv[2];
const asJson = process.argv.includes("--json");
if (!path) {
  console.error("usage: bun src/inspect.ts <file.docx> [--json]");
  process.exit(1);
}

const entries = readDocx(path);
const doc = partText(entries, "word/document.xml");
const styles = entries["word/styles.xml"]
  ? partText(entries, "word/styles.xml")
  : "";
const settings = entries["word/settings.xml"]
  ? partText(entries, "word/settings.xml")
  : "";

// ---- Global facts ----
function firstMatch(s: string, re: RegExp): string | undefined {
  const m = s.match(re);
  return m ? m[0] : undefined;
}
const pgSz = firstMatch(doc, /<w:pgSz\b[^>]*\/?>/);
const pgMar = firstMatch(doc, /<w:pgMar\b[^>]*\/?>/);
const sectTypes = [...doc.matchAll(/<w:type\s+w:val="([^"]*)"/g)].map(
  (m) => m[1]
);
const cols = [...doc.matchAll(/<w:cols\b[^>]*\/?>/g)].map((m) => m[0]);
const ligatures = firstMatch(styles, /<w14:ligatures\b[^>]*\/?>/);
const docDefaultsRpr = (() => {
  const m = styles.match(/<w:rPrDefault>[\s\S]*?<\/w:rPrDefault>/);
  return m ? m[0] : undefined;
})();
const defSz = docDefaultsRpr ? attr(docDefaultsRpr, "w:sz") : undefined;
const defKern = docDefaultsRpr ? attr(docDefaultsRpr, "w:kern") : undefined;
const themeFontMinor = (() => {
  const theme = entries["word/theme/theme1.xml"]
    ? partText(entries, "word/theme/theme1.xml")
    : "";
  const m = theme.match(/<a:minorFont>[\s\S]*?<a:latin\s+typeface="([^"]*)"/);
  return m ? m[1] : undefined;
})();

const paras = parseParagraphs(doc);

if (asJson) {
  console.log(
    JSON.stringify(
      {
        parts: Object.keys(entries).sort(),
        page: { pgSz, pgMar, sectTypes, cols },
        defaults: { defSz, defKern, ligatures, themeFontMinor },
        paragraphs: paras.map((p, i) => ({
          i,
          pStyle: p.pStyle,
          numId: p.numId,
          jc: p.jc,
          hasSectPr: p.hasSectPr,
          summary: pPrSummary(p),
          runs: p.runs.map((r) => ({
            rpr: rPrSummary(r.rPrXml),
            text: r.text,
          })),
          text: p.text,
        })),
      },
      null,
      2
    )
  );
} else {
  console.log(`FILE: ${path}`);
  console.log(`PARTS: ${Object.keys(entries).length}`);
  console.log(`PAGE:  ${pgSz}  ${pgMar}`);
  console.log(`SECTS: types=[${sectTypes.join(",")}]  cols=${cols.length}`);
  console.log(
    `DEFAULTS: themeMinorFont=${themeFontMinor} defSz=${defSz} kern=${defKern}`
  );
  console.log(`LIGATURES: ${ligatures ?? "(none set)"}`);
  console.log(`PARAGRAPHS: ${paras.length}`);
  console.log("─".repeat(100));
  paras.forEach((p, i) => {
    const head = `${String(i).padStart(3)} │ ${pPrSummary(p) || "(plain)"}`;
    console.log(head);
    // dominant run summary + text preview
    const domRpr =
      p.runs.find((r) => r.text.trim())?.rPrXml ?? p.runs[0]?.rPrXml ?? "";
    const preview = p.text.length > 90 ? p.text.slice(0, 90) + "…" : p.text;
    console.log(`    │   run: ${rPrSummary(domRpr)}`);
    if (preview.trim()) console.log(`    │   text: "${preview}"`);
    // show distinct run styles if mixed
    const styleSet = new Set(
      p.runs.filter((r) => r.text.trim()).map((r) => rPrSummary(r.rPrXml))
    );
    if (styleSet.size > 1)
      console.log(`    │   mixed runs: ${[...styleSet].join(" | ")}`);
  });
}

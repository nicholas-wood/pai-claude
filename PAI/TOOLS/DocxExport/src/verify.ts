// verify.ts — compare two .docx files on the dimensions that determine visual
// appearance, and report PASS/FAIL with specifics. Designed to catch exactly
// the failures that make an export "look different": wrong font, size,
// spacing, ligatures, page setup, headings, bullets/indents.
//
// Usage: bun src/verify.ts <expected.docx> <actual.docx> [--json]

import {
  readDocx,
  partText,
  parseParagraphs,
  pPrSummary,
  rPrSummary,
  attr,
  type Para,
} from "./ooxml.ts";

function facts(path: string) {
  const e = readDocx(path);
  const doc = partText(e, "word/document.xml");
  const styles = e["word/styles.xml"] ? partText(e, "word/styles.xml") : "";
  const m = (s: string, re: RegExp) => s.match(re)?.[0];
  const paras = parseParagraphs(doc);
  return {
    entries: e,
    parts: Object.keys(e).sort(),
    pgSz: m(doc, /<w:pgSz\b[^>]*\/?>/) ?? "",
    pgMar: m(doc, /<w:pgMar\b[^>]*\/?>/) ?? "",
    ligatures: m(styles, /<w14:ligatures\b[^>]*\/?>/) ?? "(none)",
    defSz: (() => {
      const d = styles.match(/<w:rPrDefault>[\s\S]*?<\/w:rPrDefault>/)?.[0] ?? "";
      return attr(d, "w:sz") ?? "";
    })(),
    sectBreaks: [...doc.matchAll(/<w:type\s+w:val="([^"]*)"/g)].map((x) => x[1]),
    paras,
    // normalized non-empty content paragraphs
    content: paras
      .filter((p) => p.text.trim())
      .map((p) => ({
        pPr: pPrSummary(p),
        text: p.text.replace(/\s+/g, " ").trim(),
        rprs: [
          ...new Set(p.runs.filter((r) => r.text.trim()).map((r) => rPrSummary(r.rPrXml))),
        ].sort(),
      })),
  };
}

const expPath = process.argv[2];
const actPath = process.argv[3];
const asJson = process.argv.includes("--json");
if (!expPath || !actPath) {
  console.error("usage: bun src/verify.ts <expected.docx> <actual.docx> [--json]");
  process.exit(1);
}

const E = facts(expPath);
const A = facts(actPath);

interface Issue {
  level: "FAIL" | "WARN";
  dim: string;
  detail: string;
}
const issues: Issue[] = [];

function eq(dim: string, a: string, b: string, level: "FAIL" | "WARN" = "FAIL") {
  if (a !== b) issues.push({ level, dim, detail: `expected ${a || "(empty)"} | actual ${b || "(empty)"}` });
}

// Global invariants
eq("page-size", E.pgSz, A.pgSz);
eq("page-margins", E.pgMar, A.pgMar);
eq("ligatures", E.ligatures, A.ligatures);
eq("default-size", E.defSz, A.defSz);
// Parts: every template part must survive (actual must be superset of expected core parts)
const styleParts = E.parts.filter((p) => /styles|theme|fontTable|settings|numbering|header|footer/.test(p));
for (const p of styleParts)
  if (!A.parts.includes(p)) issues.push({ level: "FAIL", dim: "missing-part", detail: p });

// Content alignment (text + per-paragraph formatting)
const n = Math.max(E.content.length, A.content.length);
if (E.content.length !== A.content.length)
  issues.push({
    level: "WARN",
    dim: "paragraph-count",
    detail: `expected ${E.content.length} content paras | actual ${A.content.length}`,
  });
for (let i = 0; i < n; i++) {
  const e = E.content[i];
  const a = A.content[i];
  if (!e || !a) continue;
  if (e.text !== a.text)
    issues.push({
      level: "FAIL",
      dim: `text[${i}]`,
      detail: `\n   exp: ${e.text.slice(0, 80)}\n   act: ${a.text.slice(0, 80)}`,
    });
  if (e.pPr !== a.pPr)
    issues.push({ level: "FAIL", dim: `pPr[${i}]`, detail: `exp {${e.pPr}} | act {${a.pPr}}` });
  if (JSON.stringify(e.rprs) !== JSON.stringify(a.rprs))
    issues.push({
      level: "FAIL",
      dim: `rPr[${i}]`,
      detail: `exp [${e.rprs.join("; ")}] | act [${a.rprs.join("; ")}]`,
    });
}

const fails = issues.filter((i) => i.level === "FAIL");
const warns = issues.filter((i) => i.level === "WARN");

if (asJson) {
  console.log(JSON.stringify({ pass: fails.length === 0, fails, warns }, null, 2));
} else {
  console.log(`VERIFY: ${expPath}  vs  ${actPath}`);
  console.log(
    `  page=${A.pgSz ? "ok" : "?"} ligatures=${A.ligatures} defSz=${A.defSz} sects=[${A.sectBreaks.join(",")}]`
  );
  if (!issues.length) console.log("  ✓ no differences on tracked dimensions");
  for (const it of issues) console.log(`  ${it.level} ${it.dim}: ${it.detail}`);
  console.log(fails.length === 0 ? "RESULT: PASS" : `RESULT: FAIL (${fails.length} fails, ${warns.length} warns)`);
}
process.exit(fails.length === 0 ? 0 : 1);

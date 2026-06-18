// selftest.ts — regression harness. Proves the fidelity guarantees hold:
//   1. Cover letter: regenerating from the original's own text is byte-identical
//      on every tracked formatting dimension (verify PASS).
//   2. Resume: every non-body template part is byte-preserved; header ref,
//      titlePg and A4 survive; body text is intact.
//   3. Inline markdown parser handles the tricky cases without corruption.
//   4. Empty input errors instead of emitting a junk document.
//
// Usage: bun src/selftest.ts   (exit 0 = all pass)

import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { readDocx, writeDocx, partText, parseParagraphs } from "./ooxml.ts";
import { exportCoverLetter } from "./coverletter.ts";
import { exportResume } from "./resume.ts";
import { parseInline } from "./inline.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const W = resolve(ROOT, ".work");

let pass = 0;
let fail = 0;
function check(name: string, cond: boolean, detail = "") {
  if (cond) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? "  — " + detail : ""}`);
  }
}

const dec = new TextDecoder();
const bytesEq = (a?: Uint8Array, b?: Uint8Array) =>
  !!a && !!b && a.length === b.length && a.every((v, i) => v === b[i]);

// ---- 1. cover letter byte-identical formatting ----
console.log("COVER LETTER");
{
  const ref = readDocx(resolve(W, "ref-cover.docx"));
  const md = require("fs").readFileSync(resolve(W, "mckinsey.md"), "utf8");
  const out = exportCoverLetter(readDocx(resolve(ROOT, "profiles/coverletter.template.docx")), md);
  const rp = parseParagraphs(partText(ref, "word/document.xml")).filter((p) => p.text.trim());
  const op = parseParagraphs(partText(out, "word/document.xml")).filter((p) => p.text.trim());
  check("same content-paragraph count", rp.length === op.length, `${rp.length} vs ${op.length}`);
  let textMatch = true,
    fmtMatch = true;
  for (let i = 0; i < Math.min(rp.length, op.length); i++) {
    if (rp[i].text.replace(/\s+/g, " ").trim() !== op[i].text.replace(/\s+/g, " ").trim()) textMatch = false;
    if (rp[i].pPrXml !== op[i].pPrXml) fmtMatch = false;
  }
  check("every paragraph text identical", textMatch);
  check("every paragraph pPr identical", fmtMatch);
  // non-body parts preserved
  const tmpl = readDocx(resolve(ROOT, "profiles/coverletter.template.docx"));
  const parts = Object.keys(tmpl).filter((p) => !/document\.xml/.test(p));
  check("all non-body parts byte-preserved", parts.every((p) => bytesEq(tmpl[p], out[p])));
}

// ---- 2. resume part preservation + page invariants ----
console.log("RESUME");
{
  const md = require("fs").readFileSync(resolve(W, "resume.md"), "utf8");
  const tmpl = readDocx(resolve(ROOT, "profiles/resume.template.docx"));
  const out = exportResume(readDocx(resolve(ROOT, "profiles/resume.template.docx")), md);
  const mustPreserve = Object.keys(tmpl).filter(
    (p) => !/word\/document\.xml$/.test(p) && !/document\.xml\.rels$/.test(p)
  );
  const changed = mustPreserve.filter((p) => !bytesEq(tmpl[p], out[p]));
  check("styles/theme/fontTable/settings/numbering/headers byte-preserved", changed.length === 0, `changed: ${changed.join(", ")}`);
  const doc = partText(out, "word/document.xml");
  check("A4 page size preserved", /<w:pgSz w:w="11906" w:h="16838"\/>/.test(doc));
  check("header reference survives", /<w:headerReference\b/.test(doc));
  check("titlePg survives", /<w:titlePg\b/.test(doc));
  check("no stale OneDrive rels", !/d\.docs\.live\.net/.test(partText(out, "word/_rels/document.xml.rels")));
  // body integrity: name present, all section headers present
  for (const s of ["Nicholas Wood", "Key Skills", "Experience", "Education", "Certifications"])
    check(`body contains "${s}"`, doc.includes(s));
  // well-formedness
  check("balanced <w:p>", (doc.match(/<w:p\b/g) || []).length === (doc.match(/<\/w:p>/g) || []).length);
  check("no unescaped ampersand", !/&(?!amp;|lt;|gt;|quot;|apos;|#)/.test(doc));
}

// ---- 3. inline parser ----
console.log("INLINE PARSER");
{
  const fmt = (s: string) => parseInline(s).map((x) => (x.bold ? "B" : "") + (x.italic ? "I" : "") + ":" + x.text).join("|");
  check("**bold** has no stray asterisk", fmt("**bold**") === "B:bold");
  check("mixed bold/italic spans correctly", fmt("a **b** & *i* c") === ":a |B:b|: & |I:i|: c");
  check("snake_case not italicised", fmt("snake_case_var") === ":snake_case_var");
  check("path underscores literal", fmt("path/to_file.ts") === ":path/to_file.ts");
  check("unbalanced ** literal", fmt("**unclosed") === ":**unclosed");
  check("arithmetic asterisks literal", fmt("5 * 3 = 15") === ":5 * 3 = 15");
}

// ---- 4. empty-input guard ----
console.log("GUARDS");
{
  let threw = false;
  try {
    exportResume(readDocx(resolve(ROOT, "profiles/resume.template.docx")), "   \n  ");
  } catch {
    threw = true;
  }
  check("empty resume markdown throws", threw);
  threw = false;
  try {
    exportCoverLetter(readDocx(resolve(ROOT, "profiles/coverletter.template.docx")), "");
  } catch {
    threw = true;
  }
  check("empty cover markdown throws", threw);
}

console.log(`\n${fail === 0 ? "ALL PASS" : "FAILURES"}: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);

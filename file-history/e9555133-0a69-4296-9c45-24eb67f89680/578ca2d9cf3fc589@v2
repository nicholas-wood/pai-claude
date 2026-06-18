// coverletter.ts — regenerate a cover letter's body from markdown using the
// template's exact paragraph/run formatting.
//
// Markdown contract (a .md file):
//   - Paragraphs separated by blank lines.
//   - A single newline inside a paragraph becomes a line break (<w:br/>) — used
//     for the "Yours sincerely,\nNicholas Wood" sign-off.
//   - Inline **bold** and *italic* supported.
//   - Leading vertical spacers are taken from the template (not the markdown).

import { partText, setPart, parseParagraphs, type Para } from "./ooxml.ts";
import { makePara, replaceBody, pruneHyperlinkRels, type RunSpec } from "./build.ts";
import { parseInline, applyToggles } from "./inline.ts";
import type { Entries } from "./ooxml.ts";

export interface CoverArchetypes {
  spacerPpr: string; // pPr inner of a leading empty paragraph
  bodyPpr: string; // pPr inner of a body paragraph
  bodyRpr: string; // rPr inner of a body run
  leadingSpacers: number; // count of leading empty paragraphs in template
  finalSectPr: string; // body-final sectPr (empty for cover letter — uses default)
}

export function captureCoverArchetypes(entries: Entries): CoverArchetypes {
  const doc = partText(entries, "word/document.xml");
  const paras = parseParagraphs(doc);
  // Leading empty paragraphs = spacers.
  let leadingSpacers = 0;
  while (leadingSpacers < paras.length && !paras[leadingSpacers].text.trim())
    leadingSpacers++;
  const firstBody = paras.find((p) => p.text.trim());
  if (!firstBody) throw new Error("cover template has no body paragraph");
  const bodyRun = firstBody.runs.find((r) => r.text.trim()) ?? firstBody.runs[0];
  const spacerPara = paras[0];
  // body-final sectPr lives inside the LAST paragraph's pPr or at body end
  const last = paras[paras.length - 1];
  const sectMatch = last.pPrXml.match(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/);
  // For the cover letter the sectPr is a direct child of body (self-contained).
  const bodySect = doc.match(/<\/w:p>\s*(<w:sectPr\b[\s\S]*?<\/w:sectPr>)/);
  return {
    spacerPpr: spacerPara.pPrXml,
    bodyPpr: firstBody.pPrXml,
    bodyRpr: bodyRun?.rPrXml ?? "",
    leadingSpacers,
    finalSectPr: (sectMatch?.[0] ?? bodySect?.[1] ?? ""),
  };
}

// Split markdown into content paragraphs (blocks separated by blank lines).
export function splitParagraphs(md: string): string[] {
  const norm = md.replace(/\r\n?/g, "\n").trim();
  // Drop an optional leading markdown H1 title and any HTML comments.
  const cleaned = norm
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/^#\s.*$/m, "")
    .trim();
  return cleaned
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter((b) => b.length > 0);
}

export function exportCoverLetter(entries: Entries, md: string): Entries {
  const a = captureCoverArchetypes(entries);
  const blocks = splitParagraphs(md);
  if (!blocks.length) throw new Error("cover letter markdown is empty — nothing to export");
  pruneHyperlinkRels(entries);

  const out: string[] = [];
  // Leading spacers, verbatim from template formatting.
  for (let i = 0; i < a.leadingSpacers; i++) out.push(makePara(a.spacerPpr, []));

  for (const block of blocks) {
    const lines = block.split("\n");
    const runs: RunSpec[] = [];
    lines.forEach((line, li) => {
      const segs = parseInline(line);
      segs.forEach((seg, si) => {
        runs.push({
          rPrInner: applyToggles(a.bodyRpr, seg),
          text: seg.text,
          breakBefore: li > 0 && si === 0, // line break between wrapped lines
          preserveSpace: true,
        });
      });
    });
    out.push(makePara(a.bodyPpr, runs));
  }

  const sect = a.finalSectPr ? a.finalSectPr : "";
  const doc = partText(entries, "word/document.xml");
  const newDoc = replaceBody(doc, out.join("") + sect);
  setPart(entries, "word/document.xml", newDoc);
  return entries;
}

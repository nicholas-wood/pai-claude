// build.ts — paragraph/run construction helpers shared by all exporters.
// Every property block (pPr inner, rPr inner) is captured verbatim from the
// template, so output formatting is identical to the original by construction.

import { xmlEscape, parseParagraphs, type Para } from "./ooxml.ts";

export interface RunSpec {
  rPrInner: string; // inner XML of <w:rPr> to clone
  text: string;
  preserveSpace?: boolean; // emit xml:space="preserve"
  breakBefore?: boolean; // emit <w:br/> before the text (within same run grouping)
  hyperlinkRid?: string; // wrap run in <w:hyperlink r:id="...">
}

export function makeRun(spec: RunSpec): string {
  const rpr = spec.rPrInner.trim() ? `<w:rPr>${spec.rPrInner}</w:rPr>` : "";
  const space =
    spec.preserveSpace || /^\s|\s$/.test(spec.text) ? ' xml:space="preserve"' : "";
  const br = spec.breakBefore ? "<w:br/>" : "";
  const t = spec.text === "" && !spec.breakBefore ? "" : `<w:t${space}>${xmlEscape(spec.text)}</w:t>`;
  const inner = `${rpr}${br}${t}`;
  const run = `<w:r>${inner}</w:r>`;
  if (spec.hyperlinkRid) {
    return `<w:hyperlink r:id="${spec.hyperlinkRid}" w:history="1">${run}</w:hyperlink>`;
  }
  return run;
}

export function makePara(pPrInner: string, runs: RunSpec[]): string {
  const ppr = pPrInner.trim() ? `<w:pPr>${pPrInner}</w:pPr>` : "";
  const body = runs.map(makeRun).join("");
  return `<w:p>${ppr}${body}</w:p>`;
}

// Replace the <w:body>…</w:body> inner content while preserving the body's
// trailing <w:sectPr> (the document-final section properties) unless the
// generated content supplies its own.
export function replaceBody(
  documentXml: string,
  newBodyInner: string
): string {
  return documentXml.replace(
    /(<w:body>)[\s\S]*(<\/w:body>)/,
    (_m, open, close) => `${open}${newBodyInner}${close}`
  );
}

// Extract the document-final sectPr (the one that is a direct child of body,
// i.e. the last top-level <w:sectPr> not inside a <w:p>).
export function finalSectPr(documentXml: string): string {
  // The body-level sectPr is the last <w:sectPr>…</w:sectPr> that appears
  // after the last </w:p>.
  const lastP = documentXml.lastIndexOf("</w:p>");
  const tail = lastP >= 0 ? documentXml.slice(lastP) : documentXml;
  const m = tail.match(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/);
  return m ? m[0] : "";
}

// Capture the pPr inner XML of a representative paragraph matching a predicate.
export function findArchetype(
  paras: Para[],
  pred: (p: Para) => boolean
): Para | undefined {
  return paras.find(pred);
}

// Pull the dominant run's rPr inner from a paragraph (first run with text,
// else first run).
export function dominantRpr(p: Para): string {
  const r = p.runs.find((x) => x.text.trim()) ?? p.runs[0];
  return r ? r.rPrXml : "";
}

// Remove all external hyperlink relationships from word/_rels/document.xml.rels.
// Safe because we fully regenerate document.xml: the only hyperlinks in the
// output are the ones the exporter re-adds. Prevents stale template URLs (e.g.
// a OneDrive autosave path) from shipping in the deliverable.
import { partText, setPart, type Entries } from "./ooxml.ts";
export function pruneHyperlinkRels(entries: Entries): void {
  const name = "word/_rels/document.xml.rels";
  if (!entries[name]) return;
  const rels = partText(entries, name).replace(
    /<Relationship\b[^>]*Type="[^"]*\/hyperlink"[^>]*\/>/g,
    ""
  );
  setPart(entries, name, rels);
}

// Escape a value for use inside an XML attribute (rels Target).
export function attrEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export { parseParagraphs };

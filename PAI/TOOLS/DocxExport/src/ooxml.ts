// OOXML / docx low-level helpers for template-surgery export.
// A .docx is a zip. We read every entry, regenerate ONLY word/document.xml,
// and rewrite the zip with every other part byte-identical. That makes the
// output's fonts, ligatures, spacing, page setup, numbering, headers/footers
// and theme identical to the template by construction.

import { unzipSync, zipSync } from "fflate";

export type Entries = Record<string, Uint8Array>;

export function readDocx(path: string): Entries {
  const buf = require("fs").readFileSync(path);
  return unzipSync(new Uint8Array(buf));
}

export function writeDocx(path: string, entries: Entries): void {
  // Keep deflate; docx has no stored-mimetype-first requirement (unlike ODF/epub).
  const out = zipSync(entries, { level: 6 });
  require("fs").writeFileSync(path, out);
}

const dec = new TextDecoder();
const enc = new TextEncoder();

export function partText(entries: Entries, name: string): string {
  const e = entries[name];
  if (!e) throw new Error(`missing part: ${name}`);
  return dec.decode(e);
}

export function setPart(entries: Entries, name: string, text: string): void {
  entries[name] = enc.encode(text);
}

// XML escape for text nodes / attribute values.
export function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---- Lightweight structural parsing (w:p never nests; resume has no tables) ----

export interface Run {
  rPrXml: string; // inner XML of <w:rPr>...</w:rPr> ("" if none)
  text: string; // concatenated decoded text from <w:t>
  isBreak?: boolean; // run contained a <w:br/>
  inHyperlink?: { rid?: string };
}

export interface Para {
  raw: string; // full <w:p ...>...</w:p>
  pPrXml: string; // inner XML of <w:pPr> ("" if none)
  pStyle?: string;
  numId?: string;
  ilvl?: string;
  jc?: string;
  text: string; // concatenated visible text
  runs: Run[];
  hasSectPr: boolean;
}

function attr(xml: string, tag: string, name = "w:val"): string | undefined {
  const m = xml.match(new RegExp(`<${tag}\\b[^>]*\\b${name}="([^"]*)"`));
  return m ? m[1] : undefined;
}

function inner(xml: string, tag: string): string {
  // inner content of first <tag ...>...</tag>; "" if self-closing or absent.
  const open = xml.match(new RegExp(`<${tag}\\b[^>]*?>`));
  if (!open) return "";
  if (open[0].endsWith("/>")) return "";
  const start = (open.index ?? 0) + open[0].length;
  const close = xml.indexOf(`</${tag}>`, start);
  if (close < 0) return "";
  return xml.slice(start, close);
}

export function getBody(documentXml: string): string {
  return inner(documentXml, "w:body");
}

export function parseParagraphs(documentXml: string): Para[] {
  const body = getBody(documentXml);
  const paras: Para[] = [];
  const re = /<w:p\b[^>]*>[\s\S]*?<\/w:p>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body))) {
    const raw = m[0];
    const pPrXml = inner(raw, "w:pPr");
    const numPr = inner(pPrXml, "w:numPr");
    const runs: Run[] = [];
    // walk runs in order
    const runRe = /<w:r\b[^>]*>[\s\S]*?<\/w:r>/g;
    let rm: RegExpExecArray | null;
    while ((rm = runRe.exec(raw))) {
      const rraw = rm[0];
      const rPrXml = inner(rraw, "w:rPr");
      // concat all <w:t ...>text</w:t>
      let text = "";
      const tRe = /<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g;
      let tm: RegExpExecArray | null;
      while ((tm = tRe.exec(rraw))) text += decodeEntities(tm[1]);
      const isBreak = /<w:br\b/.test(rraw);
      runs.push({ rPrXml, text, isBreak });
    }
    let visible = runs.map((r) => r.text).join("");
    paras.push({
      raw,
      pPrXml,
      pStyle: attr(pPrXml, "w:pStyle"),
      numId: numPr ? attr(numPr, "w:numId") : undefined,
      ilvl: numPr ? attr(numPr, "w:ilvl") : undefined,
      jc: attr(pPrXml, "w:jc"),
      text: visible,
      runs,
      hasSectPr: /<w:sectPr\b/.test(pPrXml),
    });
  }
  return paras;
}

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

// Compact one-line summary of a run's rPr for human/agent inspection.
export function rPrSummary(rPrXml: string): string {
  if (!rPrXml.trim()) return "(default)";
  const bits: string[] = [];
  const rStyle = attr(rPrXml, "w:rStyle");
  if (rStyle) bits.push(`rStyle=${rStyle}`);
  const font =
    attr(rPrXml, "w:rFonts", "w:ascii") ??
    attr(rPrXml, "w:rFonts", "w:asciiTheme");
  if (font) bits.push(`font=${font}`);
  const sz = attr(rPrXml, "w:sz");
  if (sz) bits.push(`sz=${sz}`);
  if (/<w:b\/>|<w:b\s/.test(rPrXml) && !/<w:b\s+w:val="0"/.test(rPrXml))
    bits.push("b");
  if (/<w:b\s+w:val="0"/.test(rPrXml)) bits.push("b=0");
  if (/<w:i\/>|<w:i\s/.test(rPrXml) && !/<w:i\s+w:val="0"/.test(rPrXml))
    bits.push("i");
  if (/<w:u\b/.test(rPrXml)) bits.push(`u=${attr(rPrXml, "w:u") ?? "single"}`);
  const color = attr(rPrXml, "w:color");
  if (color && color !== "auto") bits.push(`color=${color}`);
  return bits.join(" ") || "(default)";
}

export function pPrSummary(p: Para): string {
  const bits: string[] = [];
  if (p.pStyle) bits.push(`pStyle=${p.pStyle}`);
  if (p.numId) bits.push(`numId=${p.numId}/il${p.ilvl ?? "0"}`);
  if (p.jc) bits.push(`jc=${p.jc}`);
  const spacing = inner(p.pPrXml, "w:spacing") === "" ? p.pPrXml.match(/<w:spacing\b[^>]*\/?>/)?.[0] : undefined;
  const sp = p.pPrXml.match(/<w:spacing\b[^>]*\/?>/);
  if (sp) bits.push(sp[0].replace(/<w:|\/>|w:/g, "").trim());
  const ind = p.pPrXml.match(/<w:ind\b[^>]*\/?>/);
  if (ind) bits.push(ind[0].replace(/<w:|\/>|w:/g, "").trim());
  if (p.hasSectPr) bits.push("SECTPR");
  return bits.join("  ");
}

export { attr, inner };

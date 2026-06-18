// extract.ts — convert an existing resume/cover .docx into markdown in this
// tool's authoring contract. Lets Nick pull any historical doc into editable
// markdown, and serves as the fidelity-test fixture.
//
// Usage: bun src/extract.ts <resume|coverletter> <file.docx>

import { readDocx, partText, parseParagraphs, type Para } from "./ooxml.ts";

const type = process.argv[2];
const path = process.argv[3];
if (!type || !path) {
  console.error("usage: bun src/extract.ts <resume|coverletter> <file.docx>");
  process.exit(1);
}

const paras = parseParagraphs(partText(readDocx(path), "word/document.xml"));
const dom = (p: Para) => (p.runs.find((r) => r.text.trim()) ?? p.runs[0])?.rPrXml ?? "";
const has = (s: string, re: RegExp) => re.test(s);

// reconstruct inline text with bold markers, merging consecutive same-style
// runs and keeping whitespace OUTSIDE the ** markers (so "** **" never forms).
function inlineMd(p: Para): string {
  type Seg = { text: string; bold: boolean };
  const segs: Seg[] = [];
  for (const r of p.runs) {
    if (!r.text) continue;
    const bold = has(r.rPrXml, /<w:b\/>/) && !has(r.rPrXml, /<w:b w:val="0"/);
    const last = segs[segs.length - 1];
    if (last && last.bold === bold) last.text += r.text;
    else segs.push({ text: r.text, bold });
  }
  let s = "";
  for (const seg of segs) {
    if (seg.bold && seg.text.trim()) {
      const lead = seg.text.match(/^\s*/)![0];
      const trail = seg.text.match(/\s*$/)![0];
      s += lead + "**" + seg.text.trim() + "**" + trail;
    } else {
      s += seg.text;
    }
  }
  return s.trim();
}

const out: string[] = [];

if (type === "coverletter") {
  for (const p of paras) {
    let s = "";
    p.runs.forEach((r) => {
      if (r.isBreak) s += "\n";
      s += r.text;
    });
    if (s.trim()) out.push(s.trim());
  }
  console.log(out.join("\n\n"));
} else {
  let lastBlank = true;
  const contact: string[] = [];
  let nameDone = false;
  for (const p of paras) {
    const txt = p.text.trim();
    const d = dom(p);
    if (p.pStyle === "Title" && has(d, /w:sz w:val="36"/)) {
      out.push(`# ${txt}`);
      nameDone = true;
      continue;
    }
    if (p.pStyle === "Title") {
      if (txt) contact.push(txt);
      continue;
    }
    if (nameDone && contact.length && !out.includes(contact.join(" | "))) {
      // flush contact block once we leave Title paragraphs
      out.push(contact.join(" | "));
      out.push("");
      contact.length = 0;
    }
    if (!txt) continue;
    if (p.pStyle === "Heading2" && p.numId) {
      out.push(`- ${inlineMd(p)}`);
    } else if (p.pStyle === "Heading2" && has(d, /u w:val="single"/)) {
      out.push("", `## ${txt}`);
    } else if (p.pStyle === "Heading2") {
      const bold = !has(d, /<w:b w:val="0"/);
      out.push(bold ? `**${txt}**` : txt);
    } else if (p.pStyle === "NoSpacing" && has(d, /u w:val="single"/)) {
      out.push("", `## ${txt}`);
    } else if (p.pStyle === "NoSpacing") {
      out.push(inlineMd(p) || txt);
    } else if (p.pStyle === "ListParagraph") {
      out.push(`- ${txt}`);
    } else if (!p.pStyle && has(d, /<w:b\/>/)) {
      out.push("", `### ${txt}`);
    } else {
      out.push(txt);
    }
  }
  if (contact.length) {
    out.push(contact.join(" | "), "");
  }
  console.log(out.join("\n").replace(/\n{3,}/g, "\n\n").trim());
}

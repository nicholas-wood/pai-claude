// resume.ts — regenerate a resume body from markdown using the template's exact
// archetypes. Tuned to the "Eng" resume structure (the source of the submitted
// Virgin Australia CV): 0.5" margins, Calibri, a plain summary paragraph,
// bold+underline section headers, NoSpacing skill bullets with bold-italic
// labels, two bold lines per job (company, then "Role | Dates"), plain intros,
// and bulleted achievements.
//
// MARKDOWN CONTRACT
//   # Name
//   <contact line(s)>            ' | ' splits into items; blank line ends block
//   Summary paragraph.           (plain text before the first "## ")
//   ## Section Header            -> bold + underline
//   - **Label:** rest            (under "## Key Skills") -> bold-italic label + italic rest
//   ### Company                  -> bold line
//   **Role | Dates**             -> bold line (standalone fully-bold line)
//   Intro sentence.              (plain line under an entry)
//   - achievement                -> bullet
//   **Technology:** ...          -> bold line
//   ## Education / ## Certifications -> **Bold** + plain, or plain lines
//
// Inline **bold** / *italic* supported.

import {
  partText,
  setPart,
  parseParagraphs,
  type Entries,
  type Para,
} from "./ooxml.ts";
import { makePara, replaceBody, pruneHyperlinkRels, attrEscape, type RunSpec } from "./build.ts";
import { parseInline, applyToggles, insertRpr } from "./inline.ts";

interface Arch {
  namePpr: string; nameRpr: string;
  contactPpr: string; contactPlainRpr: string; contactLinkRpr: string;
  summaryPpr: string; summaryRpr: string;
  headerPpr: string; headerRpr: string;           // section header (Heading2 + u=single)
  skillPpr: string; skillLabelRpr: string; skillContentRpr: string;
  boldPpr: string; boldRpr: string;               // company / role / technology lines
  introPpr: string; introRpr: string;
  bulletPpr: string; bulletRpr: string;
  sect0: string; sectFinal: string;
}

const has = (s: string, re: RegExp) => re.test(s);
function dom(p: Para): string {
  return (p.runs.find((r) => r.text.trim()) ?? p.runs[0])?.rPrXml ?? "";
}
function pprNoSect(p: Para): string {
  return p.pPrXml.replace(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/, "");
}

export function captureArch(entries: Entries): Arch {
  const doc = partText(entries, "word/document.xml");
  const paras = parseParagraphs(doc);
  const find = (pred: (p: Para) => boolean) => paras.find(pred);
  const isTitle = (p: Para) => p.pStyle === "Title";
  const isH2 = (p: Para) => p.pStyle === "Heading2";

  const nameP = find((p) => isTitle(p) && has(dom(p), /w:sz w:val="36"/))!;
  const phoneP = find((p) => isTitle(p) && has(dom(p), /w:sz w:val="20"/) && !has(dom(p), /Hyperlink/))!;
  const linkP = find((p) => isTitle(p) && has(dom(p), /Hyperlink/))!;
  const summaryP = find((p) => isH2(p) && !p.numId && has(dom(p), /<w:b w:val="0"/) && !has(dom(p), /u w:val="single"/))!;
  const headerP = find((p) => isH2(p) && !p.numId && p.runs.some((r) => has(r.rPrXml, /u w:val="single"/)))!;
  const skillP = find((p) => p.pStyle === "NoSpacing" && p.numId && p.runs.some((r) => has(r.rPrXml, /<w:b\/>/) && has(r.rPrXml, /<w:i\/>/)))!;
  const skillLabelR = skillP.runs.find((r) => has(r.rPrXml, /<w:b\/>/) && has(r.rPrXml, /<w:i\/>/))!;
  const skillContentR = skillP.runs.find((r) => has(r.rPrXml, /<w:i\/>/) && !has(r.rPrXml, /<w:b\/>/)) ?? skillLabelR;
  const boldP = find((p) => !p.numId && !p.pStyle && p.runs.some((r) => r.text.trim() && has(r.rPrXml, /<w:b\/>/)))
    ?? find((p) => !p.numId && p.runs.some((r) => r.text.trim() && has(r.rPrXml, /<w:b\/>/) && !has(r.rPrXml, /<w:i\/>/) && !has(r.rPrXml, /u w:val/)))!;
  const introP = find((p) => !p.numId && (p.pPrXml.includes('w:after="0"')) && p.runs.some((r) => r.text.trim()) && !has(dom(p), /<w:b\/>/) && !p.pStyle)!;
  const bulletP = find((p) => p.pStyle === "ListParagraph" && p.numId)!;

  const sectPrs = [...doc.matchAll(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g)].map((m) => m[0]);
  const sect0 = sectPrs.find((s) => /headerReference/.test(s)) ?? sectPrs[0];
  const sectFinal = sect0
    .replace(/<w:headerReference\b[^>]*\/>/g, "")
    .replace(/<w:footerReference\b[^>]*\/>/g, "")
    .replace(/<w:titlePg\b[^>]*\/?>/g, "");

  // a clean bold-line pPr: just spacing after=0
  const boldPpr = boldP ? pprNoSect(boldP) : '<w:spacing w:after="0"/>';
  const boldRpr = boldP ? dom(boldP) : "<w:b/><w:bCs/>";

  return {
    namePpr: pprNoSect(nameP), nameRpr: dom(nameP),
    contactPpr: pprNoSect(phoneP), contactPlainRpr: dom(phoneP), contactLinkRpr: dom(linkP),
    summaryPpr: pprNoSect(summaryP), summaryRpr: dom(summaryP),
    headerPpr: pprNoSect(headerP), headerRpr: headerP.runs.find((r) => has(r.rPrXml, /u w:val="single"/))!.rPrXml,
    skillPpr: pprNoSect(skillP), skillLabelRpr: skillLabelR.rPrXml, skillContentRpr: skillContentR.rPrXml,
    boldPpr, boldRpr,
    introPpr: introP ? pprNoSect(introP) : '<w:spacing w:after="0"/>', introRpr: introP ? dom(introP) : "",
    bulletPpr: `<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${bulletP.numId}"/></w:numPr>`,
    bulletRpr: dom(bulletP),
    sect0, sectFinal,
  };
}

function addHyperlinkRel(entries: Entries, target: string): string {
  const name = "word/_rels/document.xml.rels";
  let rels = partText(entries, name);
  const ids = [...rels.matchAll(/Id="rId(\d+)"/g)].map((m) => Number(m[1]));
  const next = "rId" + (ids.reduce((a, b) => Math.max(a, b), 0) + 1);
  rels = rels.replace(/<\/Relationships>/, `<Relationship Id="${next}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${attrEscape(target)}" TargetMode="External"/></Relationships>`);
  setPart(entries, name, rels);
  return next;
}
function linkTarget(text: string): string | null {
  const t = text.trim();
  if (/^[\w.+-]+@[\w.-]+\.\w+$/.test(t)) return "mailto:" + t;
  if (/^https?:\/\//.test(t)) return t;
  if (/^www\./.test(t) || /\b(linkedin\.com|github\.com|[\w-]+\.(com|au|io|dev|net|org))\b/.test(t)) return "https://" + t.replace(/^\/+/, "");
  return null;
}
function inlineRuns(base: string, text: string): RunSpec[] {
  return parseInline(text).map((seg) => ({ rPrInner: applyToggles(base, seg), text: seg.text, preserveSpace: true }));
}

export function exportResume(entries: Entries, md: string): Entries {
  if (!md.replace(/<!--[\s\S]*?-->/g, "").trim()) throw new Error("resume markdown is empty");
  pruneHyperlinkRels(entries);
  const a = captureArch(entries);
  const lines = md.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "").split("\n");
  const out: string[] = [];
  let i = 0;

  // name
  while (i < lines.length && !lines[i].trim()) i++;
  const name = lines[i]?.replace(/^#\s+/, "").trim() ?? "Nicholas Wood";
  out.push(makePara(a.namePpr, inlineRuns(a.nameRpr, name)));
  i++;

  // contact block (until blank line)
  const contacts: string[] = [];
  while (i < lines.length && lines[i].trim()) {
    for (const part of lines[i].split("|")) { const t = part.trim(); if (t) contacts.push(t); }
    i++;
  }
  contacts.forEach((item, idx) => {
    const tgt = linkTarget(item);
    const runs: RunSpec[] = tgt
      ? [{ rPrInner: a.contactLinkRpr, text: item, hyperlinkRid: addHyperlinkRel(entries, tgt), preserveSpace: true }]
      : inlineRuns(a.contactPlainRpr, item);
    out.push(makePara(idx === contacts.length - 1 ? a.contactPpr + a.sect0 : a.contactPpr, runs));
  });

  let inSkills = false;
  let seenSection = false;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      out.push(makePara(a.headerPpr, [{ rPrInner: a.headerRpr, text: title, preserveSpace: true }]));
      inSkills = /key skills|^skills$/i.test(title);
      seenSection = true;
      continue;
    }
    if (line.startsWith("### ")) {
      out.push(makePara(a.boldPpr, [{ rPrInner: a.boldRpr, text: line.replace(/^###\s+/, "").trim(), preserveSpace: true }]));
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.replace(/^[-*]\s+/, "");
      if (inSkills) {
        const clean = text.replace(/\*\*/g, "");
        const ci = clean.indexOf(":");
        if (ci >= 0) {
          // bold-italic label, then a tab (column-aligns the content like the template), then italic content
          out.push(makePara(a.skillPpr, [
            { rPrInner: a.skillLabelRpr, text: clean.slice(0, ci + 1), preserveSpace: true },
            { rPrInner: a.skillContentRpr, text: clean.slice(ci + 1).replace(/^\s+/, ""), tabBefore: true, preserveSpace: true },
          ]));
        } else {
          out.push(makePara(a.skillPpr, [{ rPrInner: a.skillContentRpr, text: clean, preserveSpace: true }]));
        }
      } else {
        out.push(makePara(a.bulletPpr, inlineRuns(a.bulletRpr, text)));
      }
      continue;
    }
    // fully-bold standalone line -> bold line (role / technology / degree)
    const boldWhole = line.match(/^\*\*([\s\S]+?)\*\*\s*(.*)$/);
    if (boldWhole && !boldWhole[2]) {
      out.push(makePara(a.boldPpr, [{ rPrInner: a.boldRpr, text: boldWhole[1], preserveSpace: true }]));
      continue;
    }
    if (boldWhole && boldWhole[2]) {
      // "**Bold** rest" -> bold lead + plain remainder (degree line)
      out.push(makePara(a.boldPpr, [
        { rPrInner: a.boldRpr, text: boldWhole[1], preserveSpace: true },
        { rPrInner: insertRpr(a.boldRpr, ""), text: " " + boldWhole[2], preserveSpace: true }, // remainder bold too (matches template tech/degree)
      ]));
      continue;
    }
    // plain line: summary before first section, else intro/body
    if (!seenSection) out.push(makePara(a.summaryPpr, inlineRuns(a.summaryRpr, line)));
    else out.push(makePara(a.introPpr, inlineRuns(a.introRpr, line)));
  }

  const doc = partText(entries, "word/document.xml");
  setPart(entries, "word/document.xml", replaceBody(doc, out.join("") + a.sectFinal));
  return entries;
}

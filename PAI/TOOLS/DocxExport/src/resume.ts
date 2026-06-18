// resume.ts — regenerate a resume's body from markdown using the template's
// exact archetypes (captured from the template at runtime) and a clean
// 2-section page model that preserves the header/footer + titlePg behaviour.
//
// MARKDOWN CONTRACT
//   # Name
//   <contact line>            (one or more lines; ' | ' splits into items)
//                             (blank line ends the contact block)
//   **Bold headline summary.**
//   Plain summary paragraph.
//   ## Section Header
//   - *Label:* skill text     (bullets under "Key Skills" render italic w/ label)
//   ### Org | Role | Dates | Location   (bold entry header)
//   Intro sentence            (plain line directly under a ### entry)
//   - Bullet                  (job bullets)
//   Plain line directly under ## (no ### yet) -> NoSpacing body line (Education etc.)
//   **Bold** - rest           -> NoSpacing line with bold lead (degree line)
//
// Inline **bold** / *italic* supported everywhere.

import {
  partText,
  setPart,
  parseParagraphs,
  attr,
  type Entries,
  type Para,
} from "./ooxml.ts";
import { makePara, replaceBody, pruneHyperlinkRels, attrEscape, type RunSpec } from "./build.ts";
import { parseInline, applyToggles, insertRpr } from "./inline.ts";

// ---------- archetype capture ----------
interface ResumeArch {
  namePpr: string;
  nameRpr: string;
  contactPpr: string; // Title centered pPr WITHOUT sectPr
  contactPlainRpr: string; // phone etc.
  contactLinkRpr: string; // hyperlink run rPr
  summaryPpr: string; // Heading2 ind
  summaryBoldRpr: string; // bold (no b=0)
  summaryPlainRpr: string; // b=0
  sectionHeaderPpr: string; // Heading2
  sectionHeaderRpr: string; // u=single
  skillPpr: string; // Heading2 numId=1
  skillRpr: string; // italic
  jobHeaderPpr: string; // plain spacing after=0
  jobHeaderRpr: string; // bold
  jobIntroPpr: string; // plain
  jobIntroRpr: string; // default
  bulletPpr: string; // ListParagraph numId
  bulletRpr: string; // default
  noSpacingPpr: string; // NoSpacing
  noSpacingBoldRpr: string; // bold (cert/degree lead)
  noSpacingPlainRpr: string;
  sect0: string; // contact-block sectPr (header/footer/titlePg) verbatim
  sectFinal: string; // body-final sectPr (no header refs, no titlePg)
}

function dom(p: Para): string {
  return (p.runs.find((r) => r.text.trim()) ?? p.runs[0])?.rPrXml ?? "";
}
function pprNoSect(p: Para): string {
  return p.pPrXml.replace(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/, "");
}
const has = (s: string, re: RegExp) => re.test(s);

export function captureResumeArch(entries: Entries): ResumeArch {
  const doc = partText(entries, "word/document.xml");
  const paras = parseParagraphs(doc);

  const find = (pred: (p: Para) => boolean) => paras.find(pred);
  const isTitle = (p: Para) => p.pStyle === "Title";
  const isH2 = (p: Para) => p.pStyle === "Heading2";

  const nameP = find((p) => isTitle(p) && has(dom(p), /w:sz w:val="36"/))!;
  const phoneP = find(
    (p) => isTitle(p) && has(dom(p), /w:sz w:val="20"/) && !has(dom(p), /Hyperlink/)
  )!;
  const linkP = find((p) => isTitle(p) && has(dom(p), /Hyperlink/))!;
  const summaryBoldP = find(
    (p) => isH2(p) && !p.numId && p.runs.some((r) => r.text.trim()) &&
      !has(dom(p), /w:val="0"/) && !has(dom(p), /u w:val="single"/)
  )!;
  const summaryPlainP = find(
    (p) => isH2(p) && !p.numId && has(dom(p), /<w:b w:val="0"/) && !has(dom(p), /u w:val="single"/)
  )!;
  const sectionHeaderP = find((p) => isH2(p) && !p.numId && has(dom(p), /u w:val="single"/))!;
  const skillP = find((p) => isH2(p) && p.numId)!;
  const jobHeaderP = find(
    (p) => !p.pStyle && p.runs.some((r) => r.text.trim()) && has(dom(p), /<w:b\/>/)
  )!;
  const jobIntroP = find(
    (p) => !p.pStyle && p.runs.some((r) => r.text.trim()) && !has(dom(p), /<w:b\/>/)
  )!;
  // Dominant bullet list: the numId used by the most ListParagraph paragraphs.
  // Reusing one consistent bullet (rather than the original's per-job mix of
  // numIds at 360/720/1080 indents) gives uniform indentation across the whole
  // resume — a deliberate normalisation of the originals' inconsistency.
  const bulletParas = paras.filter((p) => p.pStyle === "ListParagraph" && p.numId);
  const numIdCounts = new Map<string, number>();
  for (const p of bulletParas) numIdCounts.set(p.numId!, (numIdCounts.get(p.numId!) ?? 0) + 1);
  const dominantBulletNumId =
    [...numIdCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "6";
  const bulletP = find((p) => p.pStyle === "ListParagraph" && p.numId)!;
  // bold-but-NOT-underlined NoSpacing line (the degree line). Underlined
  // NoSpacing-bold paragraphs are section headers and are routed via "## ".
  const noSpacingBoldP =
    find((p) => p.pStyle === "NoSpacing" && has(dom(p), /<w:b\/>/) && !has(dom(p), /u w:val="single"/)) ??
    find((p) => p.pStyle === "NoSpacing" && has(dom(p), /<w:b\/>/));
  const noSpacingPlainP = find(
    (p) => p.pStyle === "NoSpacing" && p.runs.some((r) => r.text.trim()) && !has(dom(p), /<w:b\/>/)
  );

  // section properties
  const sectPrs = [...doc.matchAll(/<w:sectPr\b[\s\S]*?<\/w:sectPr>/g)].map((m) => m[0]);
  const sect0 = sectPrs.find((s) => /headerReference/.test(s)) ?? sectPrs[0];
  const sectFinal = sect0
    .replace(/<w:headerReference\b[^>]*\/>/g, "")
    .replace(/<w:footerReference\b[^>]*\/>/g, "")
    .replace(/<w:titlePg\b[^>]*\/?>/g, "");

  return {
    namePpr: pprNoSect(nameP),
    nameRpr: dom(nameP),
    contactPpr: pprNoSect(phoneP),
    contactPlainRpr: dom(phoneP),
    contactLinkRpr: dom(linkP),
    summaryPpr: pprNoSect(summaryBoldP),
    summaryBoldRpr: dom(summaryBoldP),
    summaryPlainRpr: dom(summaryPlainP),
    sectionHeaderPpr: pprNoSect(sectionHeaderP),
    sectionHeaderRpr: dom(sectionHeaderP),
    skillPpr: pprNoSect(skillP),
    skillRpr: dom(skillP),
    jobHeaderPpr: pprNoSect(jobHeaderP),
    jobHeaderRpr: dom(jobHeaderP),
    jobIntroPpr: pprNoSect(jobIntroP),
    jobIntroRpr: dom(jobIntroP),
    // Clean, consistent bullet: ListParagraph + dominant bullet numId, with no
    // per-paragraph indent/spacing overrides (those are the source of the
    // originals' drift). Indentation then comes purely from the list definition.
    bulletPpr: `<w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="0"/><w:numId w:val="${dominantBulletNumId}"/></w:numPr>`,
    bulletRpr: dom(bulletP),
    noSpacingPpr: noSpacingBoldP ? pprNoSect(noSpacingBoldP) : pprNoSect(bulletP),
    noSpacingBoldRpr: noSpacingBoldP ? dom(noSpacingBoldP) : "<w:b/><w:bCs/>",
    noSpacingPlainRpr: noSpacingPlainP ? dom(noSpacingPlainP) : "",
    sect0,
    sectFinal,
  };
}

// ---------- relationships (hyperlinks) ----------
function addHyperlinkRel(entries: Entries, target: string): string {
  const relsName = "word/_rels/document.xml.rels";
  let rels = partText(entries, relsName);
  const ids = [...rels.matchAll(/Id="rId(\d+)"/g)].map((m) => Number(m[1]));
  const next = "rId" + (ids.reduce((a, b) => Math.max(a, b), 0) + 1);
  const rel = `<Relationship Id="${next}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${attrEscape(target)}" TargetMode="External"/>`;
  rels = rels.replace(/<\/Relationships>/, rel + "</Relationships>");
  setPart(entries, relsName, rels);
  return next;
}

function linkTarget(text: string): string | null {
  const t = text.trim();
  if (/^[\w.+-]+@[\w.-]+\.\w+$/.test(t)) return "mailto:" + t;
  if (/^https?:\/\//.test(t)) return t;
  if (/^www\./.test(t) || /\b(linkedin\.com|github\.com|[\w-]+\.(com|au|io|dev|net|org))\b/.test(t))
    return "https://" + t.replace(/^\/+/, "");
  return null; // phone / plain
}

// ---------- inline -> runs ----------
function inlineRuns(baseRpr: string, text: string): RunSpec[] {
  return parseInline(text).map((seg) => ({
    rPrInner: applyToggles(baseRpr, seg),
    text: seg.text,
    preserveSpace: true,
  }));
}

// skill bullet: "Label: rest" -> bold-italic label + plain-italic rest, exactly
// as the template (the category label is bold-italic, the listing is italic).
function skillRuns(a: ResumeArch, text: string): RunSpec[] {
  const clean = text.replace(/\*\*/g, "").replace(/(^|[^*])\*(?!\*)/g, "$1"); // drop md markers
  const idx = clean.indexOf(":");
  if (idx >= 0) {
    const label = clean.slice(0, idx + 1); // include colon
    const rest = clean.slice(idx + 1); // keeps leading space
    return [
      { rPrInner: a.skillRpr, text: label, preserveSpace: true },
      { rPrInner: insertRpr(a.skillRpr, '<w:b w:val="0"/><w:bCs w:val="0"/>'), text: rest, preserveSpace: true },
    ];
  }
  return inlineRuns(a.skillRpr, clean);
}

// ---------- main ----------
export function exportResume(entries: Entries, md: string): Entries {
  if (!md.replace(/<!--[\s\S]*?-->/g, "").trim()) {
    throw new Error("resume markdown is empty — nothing to export");
  }
  pruneHyperlinkRels(entries);
  const a = captureResumeArch(entries);
  const lines = md.replace(/\r\n?/g, "\n").replace(/<!--[\s\S]*?-->/g, "").split("\n");

  const out: string[] = [];
  let i = 0;

  // ---- title + contact block ----
  // first non-blank line must be "# Name"
  while (i < lines.length && !lines[i].trim()) i++;
  const nameLine = lines[i]?.replace(/^#\s+/, "").trim() ?? "Nicholas Wood";
  out.push(makePara(a.namePpr, inlineRuns(a.nameRpr, nameLine)));
  i++;

  // contact lines until blank
  const contactItems: string[] = [];
  while (i < lines.length && lines[i].trim()) {
    for (const part of lines[i].split("|")) {
      const t = part.trim();
      if (t) contactItems.push(t);
    }
    i++;
  }
  contactItems.forEach((item, idx) => {
    const tgt = linkTarget(item);
    const runs: RunSpec[] = tgt
      ? [{ rPrInner: a.contactLinkRpr, text: item, hyperlinkRid: addHyperlinkRel(entries, tgt), preserveSpace: true }]
      : inlineRuns(a.contactPlainRpr, item);
    // last contact paragraph carries sect0
    const ppr = idx === contactItems.length - 1 ? a.contactPpr + a.sect0 : a.contactPpr;
    out.push(makePara(ppr, runs));
  });

  // ---- body ----
  type Ctx = "top" | "section" | "entry";
  let ctx: Ctx = "top";
  let inSkills = false;

  const flushBlank = () => {};

  for (; i < lines.length; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line) continue;

    if (line.startsWith("## ")) {
      const title = line.replace(/^##\s+/, "").trim();
      out.push(makePara(a.sectionHeaderPpr, inlineRuns(a.sectionHeaderRpr, title)));
      inSkills = /key skills|skills/i.test(title);
      ctx = "section";
      continue;
    }
    if (line.startsWith("### ")) {
      const title = line.replace(/^###\s+/, "").trim();
      out.push(makePara(a.jobHeaderPpr, inlineRuns(a.jobHeaderRpr, title)));
      ctx = "entry";
      continue;
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      const text = line.replace(/^[-*]\s+/, "");
      if (inSkills) {
        out.push(makePara(a.skillPpr, skillRuns(a, text)));
      } else {
        out.push(makePara(a.bulletPpr, inlineRuns(a.bulletRpr, text)));
      }
      continue;
    }
    // plain paragraph
    if (ctx === "top") {
      // summary: fully-bold => bold archetype, else plain
      const isBold = /^\*\*[\s\S]+\*\*$/.test(line);
      if (isBold) {
        const inner = line.replace(/^\*\*([\s\S]+)\*\*$/, "$1");
        out.push(makePara(a.summaryPpr, [{ rPrInner: a.summaryBoldRpr, text: inner, preserveSpace: true }]));
      } else {
        out.push(makePara(a.summaryPpr, inlineRuns(a.summaryPlainRpr, line)));
      }
    } else if (ctx === "entry") {
      out.push(makePara(a.jobIntroPpr, inlineRuns(a.jobIntroRpr, line)));
    } else {
      // directly under a ## section (Education / Certifications) -> NoSpacing line
      // support "**Bold**<rest>" preserving the exact spacing of <rest>.
      const m = line.match(/^\*\*([\s\S]+?)\*\*([\s\S]*)$/);
      if (m) {
        const runs: RunSpec[] = [{ rPrInner: a.noSpacingBoldRpr, text: m[1], preserveSpace: true }];
        if (m[2]) runs.push({ rPrInner: a.noSpacingPlainRpr, text: m[2], preserveSpace: true });
        out.push(makePara(a.noSpacingPpr, runs));
      } else {
        out.push(makePara(a.noSpacingPpr, inlineRuns(a.noSpacingPlainRpr, line)));
      }
    }
  }

  const doc = partText(entries, "word/document.xml");
  setPart(entries, "word/document.xml", replaceBody(doc, out.join("") + a.sectFinal));
  return entries;
}

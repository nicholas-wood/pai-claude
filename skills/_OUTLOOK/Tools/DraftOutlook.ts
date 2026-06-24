#!/usr/bin/env bun
/**
 * DraftOutlook.ts — open a fully-formatted email draft in Outlook for Mac.
 *
 * Draft-only by design: this NEVER sends. It opens the compose window so the
 * human reviews and clicks Send. (PAI autonomy: send_external_message must ask.)
 *
 * Primary path  — classic Outlook for Mac via osascript/AppleScript. Sets the
 *                 message `content` as HTML, so paragraphs and lists render.
 * Fallback path — `mailto:` opened with `open`. PLAIN TEXT ONLY: paragraphs
 *                 survive as blank-line gaps, lists survive as "- " / "1. "
 *                 prefixes, but there is no real rich formatting. The tool
 *                 prints a clear warning when it falls back.
 *
 * The body is authored in lightweight Markdown. The converter handles the
 * formatting Nick actually uses in email: paragraphs, bullet lists, numbered
 * lists, bold, italic, and links. Headings degrade to bold paragraphs (Outlook
 * compose does not want <h1> sizing in a personal email).
 *
 * Usage:
 *   bun DraftOutlook.ts --to a@b.com,c@d.com --subject "Hi" --body-file note.md
 *   bun DraftOutlook.ts --to a@b.com --subject "Hi" --body "Line one\n\n- a\n- b"
 *   bun DraftOutlook.ts ... --dry-run     # print HTML + AppleScript, run nothing
 *   bun DraftOutlook.ts ... --plain       # force the plain-text mailto path
 */

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

// ─────────────────────────── arg parsing ───────────────────────────
interface Args {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  dryRun: boolean;
  plain: boolean;
}

function parseArgs(argv: string[]): Args {
  const get = (name: string): string | undefined => {
    const i = argv.indexOf(`--${name}`);
    return i !== -1 && i + 1 < argv.length ? argv[i + 1] : undefined;
  };
  const has = (name: string): boolean => argv.includes(`--${name}`);
  const list = (v?: string): string[] =>
    v ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const to = list(get("to"));
  const subject = get("subject") ?? "";
  let body = get("body") ?? "";
  const bodyFile = get("body-file");
  if (bodyFile) body = readFileSync(bodyFile, "utf8");
  // a literal "\n" typed on the CLI should become a real newline
  body = body.replace(/\\n/g, "\n");

  if (to.length === 0) fail("--to is required (comma-separated email addresses)");
  if (!subject) fail("--subject is required");
  if (!body.trim()) fail("--body or --body-file is required");

  return {
    to,
    cc: list(get("cc")),
    bcc: list(get("bcc")),
    subject,
    body,
    dryRun: has("dry-run"),
    plain: has("plain"),
  };
}

function fail(msg: string): never {
  console.error(`error: ${msg}`);
  process.exit(1);
}

// ─────────────────────── markdown → html ───────────────────────────
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline formatting on a single line. Escapes HTML first, then re-introduces tags. */
function inline(s: string): string {
  let t = escapeHtml(s);
  // links [text](url) — do before emphasis so URL contents are untouched
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, txt, url) => `<a href="${url}">${txt}</a>`);
  // bold **text**
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // italic *text* (not part of **) and _text_
  t = t.replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1<em>$2</em>");
  t = t.replace(/(^|[^_])_([^_\s][^_]*?)_/g, "$1<em>$2</em>");
  return t;
}

const UL = /^\s*[-*]\s+/;
const OL = /^\s*\d+\.\s+/;

/** Convert lightweight Markdown to an HTML fragment Outlook renders cleanly. */
function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  const blocks: string[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].trim() === "") {
      i++;
      continue;
    }

    if (UL.test(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && UL.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(UL, ""))}</li>`);
        i++;
      }
      blocks.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (OL.test(lines[i])) {
      const items: string[] = [];
      while (i < lines.length && OL.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(OL, ""))}</li>`);
        i++;
      }
      blocks.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    const heading = lines[i].match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      blocks.push(`<p><strong>${inline(heading[1])}</strong></p>`);
      i++;
      continue;
    }

    // paragraph: consecutive non-blank, non-list lines joined with <br>
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !UL.test(lines[i]) &&
      !OL.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(`<p>${para.map(inline).join("<br>")}</p>`);
  }

  // Wrapper sets a sane default font so the draft matches a normal Outlook email.
  return `<div style="font-family:Calibri,Helvetica,Arial,sans-serif;font-size:11pt;">${blocks.join("")}</div>`;
}

/** Degrade Markdown to readable plain text for the mailto fallback. */
function mdToPlain(md: string): string {
  return md
    .replace(/\r\n/g, "\n")
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1 ($2)")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, "$1$2")
    .replace(/(^|[^_])_([^_\s][^_]*?)_/g, "$1$2")
    .replace(/^#{1,6}\s+/gm, "")
    .trim();
}

// ─────────────────────── applescript build ─────────────────────────
/** Escape a JS string for embedding in an AppleScript double-quoted literal. */
function asStr(s: string): string {
  // collapse newlines — the HTML carries its own structure and AppleScript
  // string literals cannot span raw newlines.
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ");
}

function buildAppleScript(a: Args): string {
  const html = mdToHtml(a.body);
  const recip = (addr: string, kind: "" | "cc " | "bcc ") =>
    `    make new ${kind}recipient with properties {email address:{address:"${asStr(addr)}"}}`;
  const recipients = [
    ...a.to.map((x) => recip(x, "")),
    ...a.cc.map((x) => recip(x, "cc ")),
    ...a.bcc.map((x) => recip(x, "bcc ")),
  ].join("\n");

  return `tell application "Microsoft Outlook"
  set theMsg to make new outgoing message with properties {subject:"${asStr(a.subject)}", content:"${asStr(html)}"}
  tell theMsg
${recipients}
  end tell
  open theMsg
  activate
end tell`;
}

function buildMailto(a: Args): string {
  const enc = (s: string) => encodeURIComponent(s);
  const q: string[] = [];
  if (a.cc.length) q.push(`cc=${a.cc.map(enc).join(",")}`);
  if (a.bcc.length) q.push(`bcc=${a.bcc.map(enc).join(",")}`);
  q.push(`subject=${enc(a.subject)}`);
  q.push(`body=${enc(mdToPlain(a.body))}`);
  return `mailto:${a.to.map(enc).join(",")}?${q.join("&")}`;
}

// ─────────────────────────── execution ─────────────────────────────
function runOsascript(script: string): { ok: boolean; stderr: string } {
  const r = spawnSync("osascript", ["-"], { input: script, encoding: "utf8" });
  if (r.error) return { ok: false, stderr: String(r.error.message ?? r.error) };
  return { ok: r.status === 0, stderr: r.stderr ?? "" };
}

/** Heuristic: did AppleScript fail because Outlook does not support scripting (New Outlook)? */
function isUnscriptable(stderr: string): boolean {
  return /(-1728|-1708|doesn.t understand|not allowed to send|Application isn.t running|can.t get|isn.t scriptable|execution error)/i.test(
    stderr,
  );
}

function main(): void {
  const a = parseArgs(process.argv.slice(2));
  const script = buildAppleScript(a);
  const mailto = buildMailto(a);

  if (a.dryRun) {
    console.log("── HTML BODY ──");
    console.log(mdToHtml(a.body));
    console.log("\n── APPLESCRIPT ──");
    console.log(script);
    console.log("\n── MAILTO FALLBACK ──");
    console.log(mailto);
    return;
  }

  if (a.plain) {
    openMailto(mailto);
    return;
  }

  const { ok, stderr } = runOsascript(script);
  if (ok) {
    console.log(`✓ Draft opened in Outlook (HTML, ${a.to.length} recipient(s)). Review and send.`);
    return;
  }

  if (isUnscriptable(stderr)) {
    console.warn(
      "⚠ Outlook AppleScript path unavailable (likely New Outlook, which is not scriptable).\n" +
        "  Falling back to mailto: PLAIN TEXT only — bold/lists will not be rich-formatted.",
    );
    openMailto(mailto);
    return;
  }

  console.error(`✗ osascript failed:\n${stderr.trim()}`);
  process.exit(1);
}

function openMailto(url: string): void {
  const r = spawnSync("open", [url], { encoding: "utf8" });
  if (r.status === 0) {
    console.log("✓ Draft opened via mailto (plain text). Review and send.");
  } else {
    console.error(`✗ failed to open mailto: ${r.stderr ?? r.error}`);
    process.exit(1);
  }
}

main();

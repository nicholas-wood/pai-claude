#!/usr/bin/env bun
/**
 * PerplexityImport.ts — Sync Nick's perplexity.ai Library into PAI MEMORY/RESEARCH.
 *
 * Drives the `interceptor` CLI over SSH against the logged-in Chrome on the Mac
 * (host `mac`). Walks /library, captures each task page, writes one markdown
 * file per task under ~/.claude/PAI/MEMORY/RESEARCH/perplexity/. Idempotent —
 * existing files skipped unless --force.
 *
 * Why SSH+interceptor: perplexity.ai is behind Cloudflare and only the real
 * logged-in Chrome session avoids the bot challenge. Companion to Perplexity.ts
 * (Sonar API), which can't read account-side data.
 *
 * Usage:
 *   bun PerplexityImport.ts                              # sync everything new
 *   bun PerplexityImport.ts --thread <url-or-uuid>       # import one task only
 *   bun PerplexityImport.ts --force                      # re-import existing
 *   bun PerplexityImport.ts --dry-run                    # list, don't write
 *   bun PerplexityImport.ts --probe                      # dump raw text for debug
 *   bun PerplexityImport.ts --host <ssh-host>            # default: mac
 *   bun PerplexityImport.ts --leave-tabs                 # don't close tabs we open
 */

import { existsSync, mkdirSync, writeFileSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const OUT_DIR = join(homedir(), ".claude", "PAI", "MEMORY", "RESEARCH", "perplexity");

interface Args {
  thread?: string;
  force: boolean;
  dryRun: boolean;
  probe: boolean;
  host: string;
  leaveTabs: boolean;
}

interface Task {
  taskId: string;
  title: string;
  url: string;
  type: "computer-task" | "search-thread";
}

function parseArgs(argv: string[]): Args {
  const a: Args = { force: false, dryRun: false, probe: false, host: "mac", leaveTabs: false };
  for (let i = 0; i < argv.length; i++) {
    switch (argv[i]) {
      case "--thread": a.thread = argv[++i]; break;
      case "--force": a.force = true; break;
      case "--dry-run": a.dryRun = true; break;
      case "--probe": a.probe = true; break;
      case "--host": a.host = argv[++i] ?? "mac"; break;
      case "--leave-tabs": a.leaveTabs = true; break;
      case "-h":
      case "--help":
        console.log(
          `PerplexityImport.ts — sync perplexity.ai Library to MEMORY/RESEARCH/perplexity.\n\n` +
          `Flags: --thread <url|uuid> | --force | --dry-run | --probe | --host <ssh> | --leave-tabs`,
        );
        process.exit(0);
    }
  }
  return a;
}

function sh(host: string, cmd: string, timeoutMs = 60_000): string {
  const res = spawnSync(
    "ssh",
    ["-o", "ConnectTimeout=10", "-o", "BatchMode=yes", host, cmd],
    { encoding: "utf-8", timeout: timeoutMs, maxBuffer: 32 * 1024 * 1024 },
  );
  if (res.error) throw new Error(`ssh ${host}: ${res.error.message}`);
  if (res.status !== 0) {
    throw new Error(`ssh ${host} exited ${res.status}: ${res.stderr.slice(0, 500)}`);
  }
  return res.stdout;
}

function shQuote(s: string): string {
  return `'${s.replace(/'/g, "'\\''")}'`;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function isoToday(): string {
  // YYYY-MM-DD in local time; matches the rest of MEMORY's convention.
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function isoNow(): string {
  return new Date().toISOString();
}

function ensureOutDir(): void {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });
}

function existingTaskIds(): Set<string> {
  if (!existsSync(OUT_DIR)) return new Set();
  return new Set(
    readdirSync(OUT_DIR)
      .filter((f) => f.endsWith(".md"))
      .map((f) => {
        // Filename: <date>__<taskId-prefix>__<slug>.md  →  extract the UUID-looking middle part.
        const m = f.match(/__([0-9a-f-]{8,})__/);
        return m?.[1] ?? "";
      })
      .filter(Boolean),
  );
}

async function openTab(host: string, url: string): Promise<number> {
  const out = sh(host, `interceptor tab new ${shQuote(url)} --json`);
  const m = out.match(/"tabId"\s*:\s*(\d+)/);
  if (!m) throw new Error(`tab new: no tabId in:\n${out.slice(0, 400)}`);
  const tabId = Number(m[1]);
  // tab_new creates the tab but the daemon's "active" target is whatever Chrome
  // last focused — switch explicitly so subsequent tree/text/wait-stable calls
  // route to this tab (per Interceptor gotcha: multi-tab routing is finicky).
  sh(host, `interceptor tab switch ${tabId}`, 10_000);
  return tabId;
}

function waitStable(host: string, timeoutMs = 15_000): void {
  try {
    sh(host, `interceptor wait-stable --timeout ${timeoutMs}`, timeoutMs + 5000);
  } catch {
    // wait-stable can exit non-zero on no-op pages; not fatal.
  }
}

function readText(host: string): string {
  return sh(host, `interceptor text`);
}

function readTree(host: string, maxChars = 120_000): string {
  return sh(host, `interceptor tree --filter all --max-chars ${maxChars}`);
}

function closeTab(host: string, tabId: number): void {
  try {
    sh(host, `interceptor tab close ${tabId}`, 10_000);
  } catch {
    /* ignore */
  }
}

function parseLibraryTree(tree: string): Task[] {
  // Matches lines like:  [e14] link "Finding a Mentor..." href="/computer/tasks/26f0abf5-..."
  const tasks: Task[] = [];
  const seen = new Set<string>();
  const re = /\[e\d+\] link "([^"]+)" href="(\/computer\/tasks\/[a-f0-9-]{8,}|\/search\/[a-zA-Z0-9-]+)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tree)) !== null) {
    const title = m[1];
    const path = m[2];
    if (path === "/library" || title === "History") continue;
    const url = `https://www.perplexity.ai${path}`;
    if (seen.has(url)) continue;
    seen.add(url);
    if (path.startsWith("/computer/tasks/")) {
      const taskId = path.split("/").pop()!;
      tasks.push({ taskId, title, url, type: "computer-task" });
    } else {
      const slug = path.split("/").pop()!;
      tasks.push({ taskId: slug, title, url, type: "search-thread" });
    }
  }
  return tasks;
}

function cleanThreadText(raw: string, title: string): { prompt?: string; body: string } {
  // Strip the leading interceptor command echo.
  const t = raw.replace(/^\[[0-9a-f]+\] → extract_text\n/, "");
  const lines = t.split("\n");

  // The content area starts at "Share" (the action toolbar at the top of the
  // task view). Everything before that line is left-nav + user button + title
  // repeat — all noise. Anchoring on "Share" is far more reliable than trying
  // to find the right title occurrence among repeats.
  const shareIdx = lines.findIndex((ln) => ln.trim() === "Share");
  if (shareIdx >= 0) {
    lines.splice(0, shareIdx + 1);
  }

  // Drop the trailing footer: from "Type a command..." or cookie banner onward.
  const cutoff = lines.findIndex((ln) =>
    /^Type a command\.\.\.$/.test(ln.trim()) ||
    /^Cookie Policy$/.test(ln.trim()),
  );
  if (cutoff > 0) lines.length = cutoff;

  // Original prompt sits between the start (now line 0, after "Share" was
  // stripped) and the first "HH:MM" timestamp.
  let prompt: string | undefined;
  const stopAt = lines.findIndex((ln) => /^\d{1,2}:\d{2}$/.test(ln.trim()));
  if (stopAt > 0) {
    prompt = lines.slice(0, stopAt).map((l) => l.trim()).filter(Boolean).join(" ");
  }

  // Suppress: we just hoisted the title above, no need to repeat it inside
  // the transcript; drop it if it's the first non-empty content line.
  void title;

  return {
    prompt,
    body: lines.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
  };
}

function renderMarkdown(task: Task, prompt: string | undefined, body: string): string {
  const fm = [
    "---",
    `title: ${JSON.stringify(task.title)}`,
    `source: perplexity.ai`,
    `type: ${task.type}`,
    `task_id: ${task.taskId}`,
    `url: ${task.url}`,
    `captured_at: ${isoNow()}`,
    `captured_via: PerplexityImport.ts + Interceptor (Chrome on mac)`,
    "---",
    "",
  ].join("\n");
  const promptBlock = prompt
    ? `## Prompt\n\n> ${prompt}\n\n`
    : "";
  return `${fm}# ${task.title}\n\n${promptBlock}## Transcript\n\n${body}\n`;
}

async function importTask(args: Args, task: Task): Promise<{ written: boolean; path: string }> {
  const date = isoToday();
  const slug = slugify(task.title);
  const idPrefix = task.taskId.slice(0, 8);
  const filename = `${date}__${idPrefix}__${slug}.md`;
  const path = join(OUT_DIR, filename);

  if (args.dryRun) {
    console.log(`[dry-run] would import ${task.url} → ${filename}`);
    return { written: false, path };
  }

  const tabId = await openTab(args.host, task.url);
  try {
    waitStable(args.host, 15_000);
    const raw = readText(args.host);
    const { prompt, body } = cleanThreadText(raw, task.title);
    const md = renderMarkdown(task, prompt, body);
    writeFileSync(path, md);
    console.error(`✓ ${task.title}  →  ${filename}  (${body.length} chars)`);
    return { written: true, path };
  } finally {
    if (!args.leaveTabs) closeTab(args.host, tabId);
  }
}

function extractTaskIdFromArg(arg: string): { url: string; taskId: string } {
  if (/^[a-f0-9-]{30,}$/i.test(arg)) {
    return { url: `https://www.perplexity.ai/computer/tasks/${arg}`, taskId: arg };
  }
  if (arg.startsWith("http")) {
    const m = arg.match(/\/computer\/tasks\/([a-f0-9-]{8,})|\/search\/([a-zA-Z0-9-]+)/);
    if (m) return { url: arg, taskId: m[1] ?? m[2] ?? arg };
  }
  return { url: arg, taskId: slugify(arg) };
}

async function singleThread(args: Args): Promise<void> {
  const { url, taskId } = extractTaskIdFromArg(args.thread!);
  const tabId = await openTab(args.host, url);
  try {
    waitStable(args.host, 15_000);
    const raw = readText(args.host);
    // Title fallback: take the first non-trivial line of the cleaned body.
    const tmpTask: Task = { taskId, title: taskId, url, type: "computer-task" };
    const { body } = cleanThreadText(raw, tmpTask.title);
    const firstLine = body.split("\n").map((l) => l.trim()).find((l) => l.length > 3) ?? taskId;
    tmpTask.title = firstLine.slice(0, 120);
    const { prompt, body: cleanBody } = cleanThreadText(raw, tmpTask.title);
    const md = renderMarkdown(tmpTask, prompt, cleanBody);
    ensureOutDir();
    const filename = `${isoToday()}__${tmpTask.taskId.slice(0, 8)}__${slugify(tmpTask.title)}.md`;
    const path = join(OUT_DIR, filename);
    if (existsSync(path) && !args.force) {
      console.error(`= ${filename} (exists; --force to overwrite)`);
      return;
    }
    if (args.dryRun) {
      console.log(`[dry-run] would write ${filename}`);
      return;
    }
    writeFileSync(path, md);
    console.error(`✓ ${tmpTask.title}  →  ${filename}`);
  } finally {
    if (!args.leaveTabs) closeTab(args.host, tabId);
  }
}

async function syncLibrary(args: Args): Promise<void> {
  ensureOutDir();
  console.error(`→ opening perplexity.ai/library on ${args.host}`);
  const tabId = await openTab(args.host, "https://www.perplexity.ai/library");
  let tasks: Task[] = [];
  try {
    waitStable(args.host, 15_000);
    const tree = readTree(args.host, 200_000);
    if (args.probe) {
      const probePath = join(OUT_DIR, `_probe_library_${Date.now()}.txt`);
      writeFileSync(probePath, tree);
      console.error(`probe: wrote library tree to ${probePath}`);
    }
    tasks = parseLibraryTree(tree);
    console.error(`→ ${tasks.length} task(s) found in Library`);
  } finally {
    if (!args.leaveTabs) closeTab(args.host, tabId);
  }

  if (!tasks.length) {
    console.error("no tasks parsed from Library — try --probe to inspect");
    return;
  }

  const have = args.force ? new Set<string>() : existingTaskIds();
  // Filenames store an 8-char prefix of the taskId, so compare on prefix.
  const todo = tasks.filter((t) => !have.has(t.taskId.slice(0, 8)));
  console.error(`→ ${todo.length} to import (${tasks.length - todo.length} already on disk)`);

  let written = 0;
  for (const task of todo) {
    try {
      const r = await importTask(args, task);
      if (r.written) written++;
    } catch (e) {
      console.error(`✗ ${task.title}: ${(e as Error).message.slice(0, 200)}`);
    }
  }
  console.error(`\nDone: ${written} written, ${todo.length - written} skipped/failed.`);
  console.error(`Output: ${OUT_DIR}`);
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (args.thread) {
    await singleThread(args);
  } else {
    await syncLibrary(args);
  }
}

main().catch((e) => {
  console.error(`fatal: ${(e as Error).message}`);
  process.exit(1);
});

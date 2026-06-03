#!/usr/bin/env bun
/**
 * run-cadence.ts - the local engine for Nick's operating cadence (the retired `life` project's job).
 *
 * Reads every active project ISA's open Criteria + the PROJECTS index, asks the PAI Inference
 * tool (Opus, no nested `claude` session) to synthesise, and writes a dated digest. Optionally
 * posts to Slack if PAI_SLACK_WEBHOOK is set.
 *
 * Usage:  bun run-cadence.ts daily     (weekday top-five)
 *         bun run-cadence.ts weekly    (Monday review)
 *
 * Invoked by launchd (com.pai.cadence.daily / com.pai.cadence.weekly). Runs outside any Claude
 * session, so calling Inference.ts is safe (no CLAUDECODE nesting).
 */
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const HOME = process.env.HOME!;
const WORKSPACE = join(HOME, "Documents/workspace");
const PROJECTS_INDEX = join(HOME, ".claude/PAI/USER/PROJECTS/PROJECTS.md");
const INFERENCE = join(HOME, ".claude/PAI/TOOLS/Inference.ts");
const OUT_DIR = join(HOME, ".claude/PAI/MEMORY/STATE/cadence");
const ENV_FILE = join(HOME, ".claude/.env");

// Read a key from ~/.claude/.env (launchd has a bare environment, so we source creds from the file
// Pulse already uses, rather than relying on the shell env).
function fromEnvFile(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  if (!existsSync(ENV_FILE)) return undefined;
  const line = readFileSync(ENV_FILE, "utf8").split("\n").find((l) => l.trim().startsWith(key + "="));
  return line?.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

const mode = (process.argv[2] || "daily").toLowerCase();
if (mode !== "daily" && mode !== "weekly") {
  console.error("usage: bun run-cadence.ts daily|weekly");
  process.exit(1);
}

// Collect open Criteria from every active (non-retired, non-completed) project ISA.
function collectProjects(): string {
  const dirs = readdirSync(WORKSPACE, { withFileTypes: true }).filter((d) => d.isDirectory());
  const blocks: string[] = [];
  for (const d of dirs) {
    const isa = join(WORKSPACE, d.name, "ISA.md");
    if (!existsSync(isa)) continue;
    const text = readFileSync(isa, "utf8");
    const phase = (text.match(/^phase:\s*(.+)$/m)?.[1] || "").trim();
    if (phase === "retired" || phase === "completed") continue;
    const open = text
      .split("\n")
      .filter((l) => l.trim().startsWith("- [ ] ISC-"))
      .map((l) => "    " + l.trim());
    if (open.length === 0) continue;
    blocks.push(`### ${d.name} (phase: ${phase})\n${open.join("\n")}`);
  }
  return blocks.join("\n\n");
}

const projectsContext = collectProjects();
const indexText = existsSync(PROJECTS_INDEX) ? readFileSync(PROJECTS_INDEX, "utf8") : "";

// Feedback harvest (daily only): sweep the LEARNING corpus for recurring cross-cutting
// failure themes and queue promotion candidates for Nick's approval. The harvester is
// queue-only - it NEVER auto-writes a feedback rule - so running it unattended is safe.
// We surface the pending count in the digest; approval stays a manual, deliberate act.
function runFeedbackHarvest(): string {
  const harvester = join(HOME, ".claude/PAI/TOOLS/FeedbackHarvester.ts");
  if (!existsSync(harvester)) return "";
  try {
    // Harvest is idempotent: re-runs over an unchanged corpus queue nothing new.
    Bun.spawnSync(["bun", harvester, "harvest"], { stdout: "pipe", stderr: "pipe" });
    const out = Bun.spawnSync(["bun", harvester, "queue"], { stdout: "pipe", stderr: "pipe" });
    const text = new TextDecoder().decode(out.stdout);
    // queue prints the PENDING block first, then APPROVED/REJECTED. Slice to the pending
    // region and count its slug lines so approved/rejected slugs are never miscounted.
    const start = text.indexOf("PENDING");
    if (start === -1) return "";
    const endMarkers = ["\nAPPROVED", "\nREJECTED"].map((m) => text.indexOf(m)).filter((i) => i > start);
    const end = endMarkers.length ? Math.min(...endMarkers) : text.length;
    const pendingSlugs = [...text.slice(start, end).matchAll(/^\s*slug:\s*(.+)$/gm)].map((m) => m[1].trim());
    if (pendingSlugs.length === 0) return "";
    return `\n\n---\n\n**Feedback candidates pending your approval (${pendingSlugs.length}):**\n` +
      pendingSlugs.map((s) => `- \`${s}\``).join("\n") +
      `\n\nReview: \`bun ~/.claude/PAI/TOOLS/FeedbackHarvester.ts queue\` | Approve: \`... approve <slug>\``;
  } catch (e) {
    return "";
  }
}

const feedbackSummary = mode === "daily" ? runFeedbackHarvest() : "";

const SYSTEM = `You are Jarvis, Nick's DA, running his standing operating cadence (the role the retired 'life' project used to hold). You orchestrate and report only - you do NOT execute project work; executable tasks delegate to each project's registered agents. There is no competing orchestrator; this cadence IS the orchestration layer. Synthesise, never enumerate. Australian English. No em dashes. Executive tone, no fluff. Recommendation first.`;

const DAILY = `Below are the open Criteria across Nick's active projects, plus the project index. Produce TODAY'S FIVE highest-leverage actions - ranked, five maximum, fewer if fewer are genuinely high-leverage. Each line: the action, the project it serves, and the goal it advances. Do not list everything; choose. If little is high-leverage today, say so honestly.\n\n=== PROJECT INDEX ===\n${indexText}\n\n=== OPEN CRITERIA BY PROJECT ===\n${projectsContext}`;

const WEEKLY = `Below are the open Criteria across Nick's active projects, plus the project index. Produce a WEEKLY REVIEW: for each project, one line on what is open and whether it is moving, stalled, or newly unblocked (infer from criteria). Surface the open loops that look oldest or most stuck. Recommend the week's THREE TO FIVE priorities, ranked, each tied to a project and goal. Synthesise, do not enumerate.\n\n=== PROJECT INDEX ===\n${indexText}\n\n=== OPEN CRITERIA BY PROJECT ===\n${projectsContext}`;

const userPrompt = mode === "daily" ? DAILY : WEEKLY;

const proc = Bun.spawnSync(["bun", INFERENCE, "--level", "smart", SYSTEM, userPrompt], {
  stdout: "pipe",
  stderr: "pipe",
});
const digest = new TextDecoder().decode(proc.stdout).trim();
const err = new TextDecoder().decode(proc.stderr).trim();
if (!digest) {
  console.error("Inference returned no output. stderr:\n" + err);
  process.exit(1);
}

// Write the dated digest (primary delivery).
mkdirSync(OUT_DIR, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const title = mode === "daily" ? "Daily Top-Five" : "Weekly Review";
const outPath = join(OUT_DIR, `${mode}-${stamp}.md`);
writeFileSync(outPath, `# ${title} - ${stamp}\n\n${digest}${feedbackSummary}\n`);
console.log("Wrote " + outPath);

// Telegram delivery via the Bot API (PAI's actual notification channel). A one-shot sendMessage does
// not conflict with Pulse's grammY polling. Creds come from ~/.claude/.env, the same source Pulse uses.
const token = fromEnvFile("TELEGRAM_BOT_TOKEN");
const chatId = fromEnvFile("TELEGRAM_PRINCIPAL_CHAT_ID") || fromEnvFile("TELEGRAM_ALLOWED_USERS")?.split(",")[0]?.trim();
if (token && chatId) {
  // Telegram caps messages at 4096 chars; the full digest is always in the file.
  const body = `*${title} - ${stamp}*\n\n${digest}${feedbackSummary}`.slice(0, 3900);
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: body, parse_mode: "Markdown" }),
  })
    .then(async (r) => console.log(r.ok ? "Sent to Telegram" : "Telegram send failed: " + (await r.text())))
    .catch((e) => console.error("Telegram send failed:", e));
} else {
  console.log("Telegram delivery skipped (TELEGRAM_BOT_TOKEN / chat id not found in ~/.claude/.env).");
}

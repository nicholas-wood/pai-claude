#!/usr/bin/env bun
/**
 * telegram-agent-runner.ts — detached task runner for the Telegram bot.
 *
 * The Telegram message handler processes messages inline, which gets summarised/cut off between
 * turns — so multi-step tasks never finish. This runner is spawned fire-and-forget by the handler:
 * it lives under the long-running Pulse daemon (not the message turn), runs `claude` headless to
 * completion with no turn pressure, and posts the result back to Telegram when done.
 *
 * Usage: bun telegram-agent-runner.ts --chat <chatId> --prompt "<task>"
 */
import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const HOME = process.env.HOME!;
const ENV_FILE = join(HOME, ".claude", ".env");

function fromEnvFile(key: string): string | undefined {
  if (process.env[key]) return process.env[key];
  if (!existsSync(ENV_FILE)) return undefined;
  const line = readFileSync(ENV_FILE, "utf8").split("\n").find((l) => l.trim().startsWith(key + "="));
  return line?.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
}

function arg(name: string): string {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : "";
}

const chatId = arg("chat");
const prompt = arg("prompt");
const token = fromEnvFile("TELEGRAM_BOT_TOKEN");

async function tg(text: string): Promise<void> {
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 3900) }),
  }).catch(() => {});
}

if (!chatId || !prompt) {
  console.error("usage: bun telegram-agent-runner.ts --chat <id> --prompt \"<task>\"");
  process.exit(1);
}

// Run claude headless to completion. Clean env (drop CLAUDECODE so the nested-session guard doesn't fire).
const env = { ...process.env };
delete (env as any).CLAUDECODE;

const proc = spawnSync(
  "claude",
  ["-p", prompt, "--dangerously-skip-permissions"],
  { env, cwd: join(HOME, ".claude"), encoding: "utf8", timeout: 25 * 60 * 1000, maxBuffer: 50 * 1024 * 1024 },
);

const out = (proc.stdout || "").trim();
const err = (proc.stderr || "").trim();

if (out) {
  await tg(out);
} else {
  await tg(`The agent finished but produced no text output.${err ? `\n\n(stderr: ${err.slice(0, 500)})` : ""}`);
}

#!/usr/bin/env bun
/**
 * Perplexity.ts — thin Perplexity Sonar API CLI for PAI.
 *
 * Web-grounded, citation-backed answers. Two uses:
 *   1. The PerplexityResearcher agent ("Ava") calls this via Bash.
 *   2. Direct fast-path for quick cited lookups without spinning the Research skill.
 *
 * Env:  PERPLEXITY_API_KEY (required) — lives alongside GEMINI_API_KEY / XAI_API_KEY.
 *
 * Usage:
 *   bun Perplexity.ts "what changed in the EU AI Act this month"
 *   bun Perplexity.ts --model sonar-pro --recency week "<query>"
 *   bun Perplexity.ts --json "<query>"      # raw API JSON for programmatic use
 */

import { existsSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const API_URL = "https://api.perplexity.ai/chat/completions";
const CREDENTIALS_FILE = join(
  process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"),
  "PAI",
  "credentials.env",
);

interface Args {
  query: string;
  model: string;
  recency?: string;
  system?: string;
  json: boolean;
}

function printHelp(): void {
  console.log(`Perplexity.ts — Sonar web-search CLI

Usage: bun Perplexity.ts [options] "<query>"

Options:
  --model <name>     sonar | sonar-pro | sonar-reasoning  (default: sonar)
  --recency <span>   hour | day | week | month
  --system <text>    system-prompt override
  --json             print raw API JSON instead of formatted answer
  -h, --help         show this help

Env: PERPLEXITY_API_KEY (required)`);
}

function parseArgs(argv: string[]): Args {
  const args: Args = { query: "", model: "sonar", json: false };
  const positional: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    switch (a) {
      case "--model": args.model = argv[++i] ?? args.model; break;
      case "--recency": args.recency = argv[++i]; break;
      case "--system": args.system = argv[++i]; break;
      case "--json": args.json = true; break;
      case "-h":
      case "--help": printHelp(); process.exit(0);
      default: positional.push(a);
    }
  }
  args.query = positional.join(" ").trim();
  return args;
}

function resolveKey(): string | undefined {
  const fromEnv = process.env.PERPLEXITY_API_KEY?.trim();
  if (fromEnv) return fromEnv;
  if (existsSync(CREDENTIALS_FILE)) {
    const match = readFileSync(CREDENTIALS_FILE, "utf-8").match(
      /(?:^|\n)\s*(?:export\s+)?PERPLEXITY_API_KEY\s*=\s*["']?([^"'\s#]+)/,
    );
    if (match) return match[1];
  }
  return undefined;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));

  const key = resolveKey();
  if (!key) {
    console.error(
      `error: PERPLEXITY_API_KEY not found. Set it in your shell env, or add it to ${CREDENTIALS_FILE}:\n  PERPLEXITY_API_KEY=pplx-...`,
    );
    process.exit(1);
  }
  if (!args.query) {
    console.error("error: no query provided. See --help.");
    process.exit(1);
  }

  const body: Record<string, unknown> = {
    model: args.model,
    messages: [
      ...(args.system ? [{ role: "system", content: args.system }] : []),
      { role: "user", content: args.query },
    ],
  };
  if (args.recency) body.search_recency_filter = args.recency;

  let res: Response;
  try {
    res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (e) {
    console.error(`error: request to Perplexity failed: ${(e as Error).message}`);
    process.exit(1);
  }

  const raw = await res.text();
  if (!res.ok) {
    console.error(`error: Perplexity API ${res.status}: ${raw}`);
    process.exit(1);
  }

  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    console.error(`error: could not parse API response: ${raw.slice(0, 200)}`);
    process.exit(1);
  }

  if (args.json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const answer: string = data?.choices?.[0]?.message?.content ?? "(no content returned)";
  const citations: string[] =
    data?.citations ??
    (Array.isArray(data?.search_results)
      ? data.search_results.map((r: any) => r.url).filter(Boolean)
      : []);

  console.log(answer.trim());
  if (citations.length) {
    console.log("\nSources:");
    citations.forEach((u, i) => console.log(`  [${i + 1}] ${u}`));
  }
}

main();

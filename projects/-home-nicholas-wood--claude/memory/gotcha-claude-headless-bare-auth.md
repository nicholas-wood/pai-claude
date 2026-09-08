---
name: gotcha-claude-headless-bare-auth
description: "Headless claude -p from a service: --bare drops subscription credentials (Not logged in); MCP stdio tools + --tools '' work without it; Inference.ts advisor needs 3 args and >120s"
metadata:
  type: reference
---

Verified 2026-09-08 on the Linux box (claude 2.1.263): `claude -p --bare …` fails with "Not logged in · Please run /login" even though the same command without `--bare` runs under Nick's subscription. Without `--bare`, `--mcp-config <file> --strict-mcp-config --allowedTools mcp__<server>__<tool> --tools ""` loads a stdio MCP server, exposes only that tool, and completes in 2 turns. Unset `CLAUDECODE` when spawning from inside a Claude Code session; systemd services don't have it.

`PAI/TOOLS/Inference.ts --mode advisor` needs three positional args (task, state, question) unless `--auto-state`; its default 120 s timeout is too short for Opus on a design question, pass `--timeout 180000`.

**Why:** the BudgetBuddy diagnostic-chat design ([[project-budgetbuddy-sept-2026-diagnosis]]) depends on this pattern; the first probe wasted a run on `--bare`.
**How to apply:** never add `--bare` to subscription-billed headless calls; assert the tool list from the stream-json init event rather than trusting the flag alone.

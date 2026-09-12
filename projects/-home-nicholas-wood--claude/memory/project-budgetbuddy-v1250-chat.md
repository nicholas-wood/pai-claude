---
name: project-budgetbuddy-v1250-chat
description: "BudgetBuddy v1.25.0 (12 Sep 2026): in-app read-only diagnostic chat live behind the Why? sheet; claude -p on Nick's subscription, typed MCP tools, masked payees, consent gate ISC-45.1, audit to events; CLI gotchas recorded"
metadata:
  type: project
---

**Shipped 2026-09-12 (v1.25.0), commit in ~/Documents/workspace.** Chat panel at the bottom of the explain sheet ("Why?" on the net-position banner). Server: `src/diagnostics/provider.ts` (ClaudeCliDiagnosticProvider), `src/diagnostics/tools.ts` (closed typed tool set), `scripts/diagnose-mcp.ts` (stdio MCP over SQLITE_OPEN_READONLY, no PocketSmith key), `src/server/handlers/diagnose.ts` (status / ask / audit), gate `assertConsentedAiEgress` in `src/security/egress.ts`. Deployment switch is a systemd drop-in `~/.config/systemd/user/penny.service.d/ai-diagnostics.conf` (PENNY_AI_DIAGNOSTICS=on, PENNY_CLAUDE_BIN). Consent is per request (`consent: z.literal(true)`) and remembered per browser tab only; nothing persistent.

**Proven live (read-only ledger copy):** "Why is my budget unbalanced?" → explain_delta, 2 turns, 11 s, named the $129.30 unpaired transfer, residual −$14.00, change since 9 Sep. "Which pending charges look stale?" → 3 tool calls, 29 s, masked payees, correct "none" verdict.

**CLI recipe that works (and the traps):** `claude -p <question> --model sonnet --output-format stream-json --verbose --setting-sources project --exclude-dynamic-system-prompt-sections --system-prompt … --mcp-config <file> --strict-mcp-config --allowedTools a,b,c --tools "" --disallowedTools Bash,Edit,…`. The question MUST precede the tool-list flags (they are variadic; a trailing positional is swallowed and the CLI exits with no result). Without `--exclude-dynamic-system-prompt-sections` the owner's CLAUDE.md shaped answers (PAI banner). `--bare` drops subscription auth. The service unit PATH lacks ~/.local/bin, hence PENNY_CLAUDE_BIN. Runtime init-event assertion (tools/mcp status/model) is the real guard, not the flags.

Related: [[project-budgetbuddy-v1240-explainer]], [[gotcha-claude-headless-bare-auth]], [[project-budgetbuddy-unpaired-transfer-gap]].

**Why:** the next chat change (streaming, cloud API-key adapter, unmasking toggle) must start from this recipe and the ISC-313..331 block, not rediscover the traps.
**How to apply:** for any headless `claude -p` product integration, copy the flag order above and assert the init event; treat the peer-session shared-worktree rule (explicit git add paths, no restarts without telling the other session) as standing.

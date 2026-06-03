---
name: reference-telegram-bot-architecture
description: "How Nick's Telegram bot (Pulse) handles chat vs multi-step tasks, and the chief-of-staff/DA merge"
metadata: 
  node_type: memory
  type: reference
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

Nick's Telegram bot is the Pulse `telegram` module (`~/.claude/PAI/Pulse/modules/telegram.ts`, grammY bot `@jarvis_nhw_bot`).

**Two paths (added 2026-06-02):**
- **Quick chat** → handled inline in the message handler (Claude Agent SDK `query()`), with conversation history injected from `conversations.json`. Continuity does NOT use SDK session resume (that was removed; resuming wiped sessions threw "No conversation found" and broke every message).
- **Multi-step tasks** → routed to a DETACHED runner `telegram-agent-runner.ts`, which runs `claude -p` headless to completion under the long-lived Pulse daemon (not the message turn) and posts the result back via the Telegram Bot API. The handler replies instantly and returns. This fixes the turn-cutoff problem: inline task work got summarised/cut between turns and never finished (failed ~5x on the project-agent registration before this fix). Force the task path with a `/task` or `/agent` prefix; otherwise a verb+length heuristic decides.

**Known limitation:** inline chat replies still take ~2-3 min because each spins up a full Claude Code agent with the claude_code tool preset. Candidate tuning: cap maxTurns or use a fast model for short messages.

**Orchestrator = the DA only.** The `chief-of-staff` agent was merged into the DA (Jarvis) on 2026-06-02: its role lives in `USER/DA_IDENTITY.md` ("Orchestration (Chief of Staff)"), and all chief-of-staff agent files (global pointer, project pointer, `life/agents/chief-of-staff/`) were deleted. Do not recreate a separate chief-of-staff agent. See [[reference-interview-scanner-false-complete]].

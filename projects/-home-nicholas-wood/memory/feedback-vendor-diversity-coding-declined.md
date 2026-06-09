---
name: feedback-vendor-diversity-coding-declined
description: Nick declined the Forge/codex vendor-diversity coding doctrine; do not auto-route to non-Claude coders without his ask
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 278482df-bea1-4a04-83c6-9b558492e10c
---

Do not propose or auto-route to cross-vendor coding agents (Forge via codex exec / GPT-5.4) for routine work. Nick uninstalled `@openai/codex` and removed the CLAUDE.md "Forge auto-include" binding on 2026-06-09. The Forge.md agent file is retained, so if Nick explicitly names "Forge" the agent definition still resolves — but it will run native Claude, not GPT-5.4.

**Why:** The marginal value of OpenAI-corpus diversity didn't justify the cost stack — ChatGPT subscription or API tokens at GPT-5 reasoning_effort=high, the auth setup friction, and codex exec being materially slower than Claude in-process. The giveaway in the session that triggered this: Forge ran *native* (no codex) and still surfaced two real bugs in a small TypeScript change, which suggested today's value was the persona's adversarial completeness prompt rather than the vendor swap. The classifier had also crashed and auto-tagged an E2-shaped task as E3, dragging Forge into glue-code review where vendor diversity was overkill.

**How to apply:**
- Default coding work to Claude-family agents (Engineer / Marcus Webb / in-context).
- Do not auto-spawn Forge on E3+ coding tasks. The CLAUDE.md auto-include line is gone; do not "helpfully" re-add it.
- The Cato auditor (also cross-vendor, read-only) was not in scope for this decision and stays as configured.
- If you encounter genuine E4/E5 production-grade work where missed-bug cost is high (AccessBuddy migrations, Lifesaver dispatch logic, contract-grade code), you may *offer* vendor diversity as a one-line ask ("want me to set up Forge for this?"), not assume it.
- Reversal: if Nick wants Forge back, the path is `bun install -g @openai/codex`, `codex login` (ChatGPT sub) or `OPENAI_API_KEY` in `~/.claude/.env`, then re-add the one-line binding to CLAUDE.md.

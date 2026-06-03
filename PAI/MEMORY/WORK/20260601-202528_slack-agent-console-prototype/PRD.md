---
task: Build local Slack agent-console prototype
slug: 20260601-202528_slack-agent-console-prototype
effort: advanced
phase: complete
progress: 18/18
mode: interactive
started: 2026-06-01T10:25:28Z
updated: 2026-06-01T10:40:00Z
---

## Context

Nick chose to prototype the "Slack route" of the agent-ops console, local-only on his laptop (no
remote). Built `life-os-console`: a Bolt (Socket Mode) bot that scans the represented-agent
directories as its data model and routes each message through the PAI Inference tool (Claude via
subscription — no API key, no `@anthropic-ai/sdk` import per steering rules).

### Decisions
- TypeScript ESM (matches his stack); deps minimal (@slack/bolt + dotenv); tsx to run.
- Single Slack app (not one-bot-per-agent): App Home roster + active-agent selection + DM chat.
- Chat is advisory in phase 1 (no tool execution) for safety/scope.
- Brain = `bun ~/.claude/PAI/Tools/Inference.ts` (verified working via smoke test).

## Criteria

- [x] ISC-1: New project life-os-console under workspace, code in own repo
- [x] ISC-2: roster.ts scans real workspace agent dirs (project/agents/name/claude.md)
- [x] ISC-3: System prompt assembled from claude.md + memory.md + project context
- [x] ISC-4: inference.ts shells to PAI Inference.ts (no SDK import)
- [x] ISC-5: Bolt app in Socket Mode (local, no public URL)
- [x] ISC-6: App Home renders roster grouped by project with Chat buttons
- [x] ISC-7: DM routes to active agent, per-user conversation history
- [x] ISC-8: /agents, /agent <name>, /status commands
- [x] ISC-9: CoS register card from life/context/state.md
- [x] ISC-10: Slack app manifest.yml for paste-once setup
- [x] ISC-11: .env.example + .gitignore (no secrets/node_modules committed)
- [x] ISC-12: README with full setup + security notes + roadmap
- [x] ISC-13: tsc --noEmit passes (0 errors)
- [x] ISC-14: roster scan verified against real workspace (18 agents/8 projects)
- [x] ISC-15: entrypoint exits gracefully without tokens
- [x] ISC-16: /simplify run, consensus findings applied
- [x] ISC-17: committed (code repo + parent meta)
- [x] ISC-A1: No @anthropic-ai/sdk import; no remote execution in phase 1

## Verification

- `npx tsc --noEmit` → exit 0 (twice: after build, after simplify).
- `getRoster()` → 8 projects / 18 agents; `findAgentByName('chief')` → life/chief-of-staff.
- Entrypoint without tokens → graceful "Missing env vars" + exit.
- Inference smoke test → subscription reply returned ("Hello Nick, welcome!").
- NOT verified (needs Nick's Slack tokens): live Socket Mode connection + end-to-end Slack chat.
- Commits: eda33d6 (build), 83dd9b9 (simplify), parent 3432b70 (project meta).

## Decisions (post)
- Phase 2 (not built): swap chat for Claude Agent SDK → tool execution + skill visibility; per-project
  channels; real CoS delegation. Recommend routing that build through a represented life-os-console
  engineer agent created via agent-onboarder.

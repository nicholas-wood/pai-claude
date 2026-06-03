---
title: LifeOS Console
type: idea
status: paused
tags: [project, agent-cockpit, discord, slack, typescript, pai, local-first]
created: 2026-06-02
updated: 2026-06-02
---

# LifeOS Console

## Summary

A local agent-operations cockpit that surfaces Nick's workspace represented agents as a chat roster inside Discord (default) and Slack (legacy). Agents reply under their own name and avatar via per-channel webhooks. The cockpit is a thin shell: the data model is the on-disk agent directories (`~/Documents/workspace/<project>/agents/<name>/`); the brain is the PAI `Inference.ts` quick-path and the Claude Agent SDK for full task execution. Paused 2026-06-02 in a clean, committed, typechecking state at Phase 3a (channel-aware delegation complete; persistent memory and `ask_user` not yet built).

## Key Facts

- Stack: TypeScript ESM, `discord.js` (default frontend), `@slack/bolt` Socket Mode (legacy), Claude Agent SDK, PAI `Inference.ts`, `tsx`, `tsc`.
- Architecture: platform-agnostic engine modules (`config`, `roster`, `inference`, `executor`, `approval`, `agentConfig`, `delegation`, `delegateTool`, `tasks`, `autopilot`, `util`); frontends are `discordApp.ts` and `app.ts`/`slackIndex.ts`.
- Verified phases: Phase 1 (roster + `/ask`), Phase 2 (Agent SDK, approval gates, task instances), Discord frontend (live on "NW Life OS" server), Autopilot, Phase 3a (CoS delegation via `delegate` MCP tool).
- Remaining: Phase 3 -- persistent memory (per-channel SDK session resume + gated `memory.md` updates) and free-form `ask_user` tool.
- Constraint: Discord per-agent identity requires webhooks on guild channels; DM identity would need one bot per agent.
- Security note: tokens pasted into chat during development -- HANDOFF.md flags rotation as required before resuming.
- Agents: `life-os-console-engineer` (Engineer base, full tools, voice Charlie) and `life-os-console-qa-verify` (QATester base, read-only tools, voice Marcus).
- `code/` is its own git repo (gitignored from the parent workspace project).

## Links

- ISA (system of record): `~/Documents/workspace/life-os-console/ISA.md`
- Handoff / cold-start guide: `~/Documents/workspace/life-os-console/HANDOFF.md`
- Agent pointers: `~/Documents/workspace/life-os-console/.claude/agents/life-os-console-engineer.md`, `~/Documents/workspace/life-os-console/.claude/agents/life-os-console-qa-verify.md`
- Note: no PAI project-index entry exists yet (`USER/PROJECTS/life-os-console.md` is not created). The recipe step to add that entry and register in `USER/SKILLCUSTOMIZATIONS/Agents/NamedAgents.md` remains outstanding.

## Source

Authored 2026-06-02 from `overview.md`, `HANDOFF.md`, `CLAUDE.md`, `context/{facts,state,references,feedback}.md`, and agent `claude.md`/`memory.md` files. PAI convergence recipe applied (ISA + agent harness pointers + knowledge note).

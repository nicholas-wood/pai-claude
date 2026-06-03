# Life OS Console

## Status
Active (paused mid-build per its HANDOFF notes)

## Summary
A local agent-operations cockpit: a thin Discord/Slack bot that surfaces Nick's workspace represented agents as a chat roster, routes messages through the PAI inference pipeline, and runs full Agent SDK tasks with approval gates and channel-aware delegation.

## System Prompt
You are working on Life OS Console. It is the chat-front-end to Nick's agent fleet. Route work to the right represented agent; respect approval gates before running Agent SDK tasks. Read the project ISA at `~/Documents/workspace/life-os-console/ISA.md` first.

## Pointer
- Project ISA (system of record): `~/Documents/workspace/life-os-console/ISA.md`
- Agents: life-os-console-engineer (Engineer), life-os-console-qa-verify (QATester)
- KNOWLEDGE: `MEMORY/KNOWLEDGE/Ideas/life-os-console.md`

## Open / Gaps
- Token exposure flagged in HANDOFF.md - rotation not confirmed; treat as unverified before any live resume.
- Direct `@anthropic-ai/sdk` import check not independently run.

<!-- created during PAI convergence 2026-06-02 -->

---
task: LifeOS Console Phase 2 — Agent SDK execution
slug: 20260601-212422_lifeos-console-phase2
effort: advanced
phase: build
progress: 0/29
mode: interactive
started: 2026-06-01T11:24:22Z
updated: 2026-06-01T11:24:22Z
---

## Context

Phase 1 = chat (one-shot PAI Inference text). Phase 2 swaps the DM path for full **Claude Agent SDK**
execution so agents run tools, stream their tool/skill activity to Slack, delegate to each other, and
create steerable task instances — with approval gates on destructive/outbound actions.

Verified SDK API (v0.3.159): `query({prompt, options}) → AsyncGenerator<SDKMessage>`; `Options`:
cwd, systemPrompt ({type:'preset',preset:'claude_code',append}), tools/allowedTools/disallowedTools,
canUseTool (CanUseTool), agents (Record<string,AgentDefinition>), env, model, maxTurns, permissionMode,
settingSources, abortController. `PermissionResult` = allow{updatedInput?} | deny{message}. Subscription
auth by stripping ANTHROPIC_API_KEY (+ CLAUDECODE to avoid nested-session guard) from `env`.

Design: `/ask` keeps Phase-1 quick chat (no tools). DM = execution. Safe tools (Read/Grep/Glob/Web)
auto-run; gated tools (Edit/Write/Bash/Agent) require Slack approval. Spawned sub-sessions do NOT load
user PAI settings/hooks (settingSources []). Delegated doer subagents are read-only in the prototype.

## Criteria

- [ ] ISC-1: executor.ts runs an agent via Agent SDK query()
- [ ] ISC-2: systemPrompt = claude_code preset + persona append
- [ ] ISC-3: cwd scoped to the agent's project directory
- [ ] ISC-4: env strips ANTHROPIC_API_KEY + CLAUDECODE (subscription, no nested guard)
- [ ] ISC-5: SAFE tools auto-run via allowedTools
- [ ] ISC-6: stream emits text events
- [ ] ISC-7: stream emits tool_use as tool events (visible skills)
- [ ] ISC-8: stream emits result event with cost + turns
- [ ] ISC-9: maxTurns + abortController wired
- [ ] ISC-10: agentConfig defines SAFE_TOOLS + GATED_TOOLS + summarizeTool
- [ ] ISC-11: policyFor returns cwd + allowedTools per agent
- [ ] ISC-12: chief-of-staff flagged orchestrator, gets Agent tool allowed
- [ ] ISC-13: delegationAgents builds AgentDefinition map from roster
- [ ] ISC-14: orchestrator runs with agents = doers (read-only)
- [ ] ISC-15: delegated subagent activity surfaces in the stream
- [ ] ISC-16: canUseTool auto-allows safe, routes gated to approver
- [ ] ISC-17: PermissionResult allow/deny shapes correct
- [ ] ISC-18: denyAllApprover default for non-interactive contexts
- [ ] ISC-19: Slack approver posts Approve/Deny + awaits resolution
- [ ] ISC-20: tasks.ts registry create/append/setStatus/list + persisted
- [ ] ISC-21: each DM creates a task instance with events
- [ ] ISC-22: /tasks lists recent instances with status
- [ ] ISC-23: DM → execution with live timeline rendering
- [ ] ISC-24: approve_tool/deny_tool actions resolve approvals
- [ ] ISC-25: /ask retains Phase-1 quick chat (no tools)
- [ ] ISC-26: tsc --noEmit passes
- [ ] ISC-27: local smoke test runs a real task via executor (subscription)
- [ ] ISC-28: README updated for Phase 2
- [ ] ISC-29: /simplify run + qa-verify pass
- [ ] ISC-A1: spawned agents do NOT load user PAI settings/hooks
- [ ] ISC-A2: gated tools never auto-run without approval

## Decisions

- Self-author for coherence (API just de-risked); use qa-verify agent + /simplify as the verification gates.
- Doers delegated read-only in prototype; mutation-via-delegation is a later, separately-gated step.

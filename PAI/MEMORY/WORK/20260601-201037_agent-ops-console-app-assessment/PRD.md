---
task: Assess agent-ops console app + existing-tool landscape
slug: 20260601-201037_agent-ops-console-app-assessment
effort: extended
phase: complete
progress: 26/26
mode: interactive
started: 2026-06-01T10:10:37Z
updated: 2026-06-01T10:10:37Z
---

## Context

Nick wants my assessment of an "agent operations console" app: Slack-like contacts UI of agents
grouped by project; chat with any agent (Claude-backed); edit agent params (claude.md); see all
running instances/tasks of an agent; drill into a task (status, progress, skills in use, ask
questions, steer, assign new); inter-agent delegation (CoS → others); checks out the life-os repo;
executes on a remote server. Plus: does an app already exist that fits?

Mid-flight refinement: the **Chief of Staff** is a pure manager/delegator — empowered to make
decisions on Nick's behalf to keep things advancing; provides on-demand status + key-decisions
across ALL tasks; accepts Nick's to-do list as intake; does NOTHING but delegation itself; can
create / combine / retire agents like a CEO's chief of staff managing a team and resources.

### Recon + research (verified)
- PAI already has `MEMORY/STATE/work.json` (38KB, live) + prior admin-dashboard work → partly exists.
- Claude Code **cloud** + **Managed Agents**: remote Linux server runs CLI continuously, persists git
  state + agent memory + MCP; background agents; Agent View dashboard. (first-party remote exec)
- **Claude Agent SDK** (Py/TS): same agent loop/tools/context as Claude Code, subagents, MCP, hooks. Build substrate.
- Orchestration UIs: Conductor (mac, parallel agents in worktrees, dashboard), Vibe Kanban (Bloop shut
  down early-2026, now OSS), Crystal/Nimbalyst, Octogent — all code/kanban-centric, no persona model.
- Slack: Mar-2026 overhaul (MCP client, agentic Slackbot), Apr-2026 Block Kit Cards = structured
  contacts/status UI with no frontend; Claude Agent SDK is a first-class Slack-agent option.
- OpenHands (OSS, sub-agent delegation, sandboxed, Daytona) + Devin (parallel, Slack task assignment,
  Windsurf Kanban) = remote delegation model, but engineering-centric, persona-blind.

## Criteria

- [x] ISC-1: Verdict — concept sound, reframed as ops-console over PAI not greenfield
- [x] ISC-2: Name the genuinely hard part (durable steerable cross-project instance tree)
- [x] ISC-3: State ~70% exists on disk + work.json/dashboard
- [x] ISC-4: Build-vs-buy = hybrid (rent engine, build cockpit)
- [x] ISC-5: Recommend Agent SDK / Claude Code cloud as execution layer, not custom loop
- [x] ISC-6: Call out Slack/Mattermost-as-frontend (Block Kit cards, agents-as-bots)
- [x] ISC-7: Concrete target architecture (execution/state/orchestration/UI/sync)
- [x] ISC-8: App reads/writes git-tracked life-os so files stay source of truth
- [x] ISC-9: Risk — secrets/security on remote, sandboxing, approval gates
- [x] ISC-10: Risk — cost of always-on sessions + lifecycle management
- [x] ISC-11: Risk — don't reinvent the harness
- [x] ISC-12: Phasing 0→3
- [x] ISC-13: Claude Code cloud + Managed Agents covered + cited
- [x] ISC-14: Claude Agent SDK as build substrate + cited
- [x] ISC-15: Third-party orchestration UIs + their persona gap + cited
- [x] ISC-16: OpenHands/Devin delegation+remote model + gap + cited
- [x] ISC-17: Honest "no single app does exactly this" + best assemblage
- [x] ISC-18: CoS reframed as pure delegator/manager
- [x] ISC-19: CoS has delegated decision authority
- [x] ISC-20: CoS gives on-demand status + key-decisions across all tasks
- [x] ISC-21: CoS accepts Nick's to-do list as intake
- [x] ISC-22: CoS can create/combine/retire agents (team+resource mgmt)
- [x] ISC-23: Update chief-of-staff claude.md to encode the model
- [x] ISC-24: Update memory.md + life/CLAUDE.md + overview consistent
- [x] ISC-A1: Do NOT recommend building the execution engine from scratch
- [x] ISC-A2: CoS does NOT do execution work itself

## Decisions

- Recommend hybrid build: Claude Agent SDK (or Claude Code cloud/Managed Agents) for execution +
  thin bespoke cockpit (or Slack frontend) for the persona/project/instance views that no tool gives.
- The app is the CEO's window into a Chief-of-Staff-run agent org — the CoS refinement is the spine.

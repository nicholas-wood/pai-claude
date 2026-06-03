---
task: Analyse PAI usage, design project consolidation and agent setup
slug: 20260528-212546_pai-project-consolidation-analysis
effort: advanced
phase: complete
progress: 31/31
mode: interactive
started: 2026-05-28T11:25:46Z
updated: 2026-05-28T12:40:00Z
---

## Context

Nick wanted: deep analysis of PAI usage; consolidation into `~/Documents/workspace/` with per-project
overview/context/agents/code; agent definitions separated from content; recommended agents per project;
and agent setup guidance. Mid-session he (1) redefined agents to a directory model (each agent =
dedicated dir with claude.md + memory.md, six fixed memory sections, in-place maintenance, startup
routine), (2) asked for an `agent-onboarder` that mints new agents to a standard, and (3) confirmed
cleanup of `~/workspace`, `~/dev`, and OneDrive `07_Dev` is in scope.

Decisions taken (via AskUserQuestion): all 8 projects approved; shared `context/` per project; scaffold
all 8 shells now; AccessBuddy code is at `/Users/nicholaswood/dev/accessbuddy`.

### Built this session
- `AGENT_STANDARD.md` at workspace root (Nick edited it: agents may also have own context/; 2 files = minimum).
- 8 project folders: accessbuddy, lifesaveroncall, limsoc-national-ims, smlsc-club, career, gym, personal, pai.
- Each: overview.md, CLAUDE.md, context/{facts,state,references,feedback}.md, agents/, code|artifacts/.
- 15 agents (dir model): each agents/<name>/{claude.md, memory.md, context/}. personal has none.
- agent-onboarder in pai/agents/ with full creation procedure.

### Cleanup map (PLANNED, not executed — awaiting approval)
- ~/workspace/smlsc-master-plan → smlsc-club/artifacts
- ~/dev/accessbuddy (github nicholas-wood/accessbuddy) → accessbuddy/code
- ~/dev/brief-poc (github limsoc-poc) → limsoc-national-ims
- ~/dev/linear-tracking (github lsv) → limsoc-national-ims (or own tracking area)
- ~/dev/aus (github connexta/aus) → AMBIGUOUS, likely LIMSOC platform/work repo — confirm
- ~/dev/pai-upstream (danielmiessler PAI) → pai (reference clone for version comparison)
- ~/dev/docs-cleanup-2026-04 (no git) → likely archive/temp — confirm
- OneDrive 07_Dev/Home_Automation → personal/artifacts
- OneDrive 07_Dev/PAI → pai/artifacts
- OneDrive 07_Dev/LSV_Notifications_VBA → AMBIGUOUS (LSV VBA) — confirm destination
- OneDrive 07_Dev/non-git-projects → needs inspection

### Risks (cleanup phase)
- Live git repos with remotes; moving is generally safe but local CI/tooling abs paths can break.
- lifesaveroncall-wt is a worktree set tied to the main repo — moving repos can break worktree links.
- OneDrive items are cloud-synced; moving them OUT stops sync. Confirm intent before relocating.

## Criteria

- [x] ISC-1: All 80 work sessions clustered into named project groups
- [x] ISC-2: Each cluster reports session count and date range
- [x] ISC-3: 11 PAI project context files mapped to clusters
- [x] ISC-4: 35 memory files categorised and mapped to projects
- [x] ISC-5: Code-bearing projects distinguished from content-only projects
- [x] ISC-6: External systems per project enumerated
- [x] ISC-7: Duplicate and orphan sessions identified
- [x] ISC-8: Final consolidated project list proposed with rationale
- [x] ISC-9: LSV cluster split decision explained
- [x] ISC-10: IMS commercials placement decided and justified
- [x] ISC-11: Career cluster consolidation scope defined
- [x] ISC-12: Personal low-frequency items consolidation defined
- [x] ISC-13: PAI-system project placement addressed
- [x] ISC-14: Standard per-project folder layout specified and built
- [x] ISC-15: context/ folder file breakdown specified and built
- [x] ISC-16: Existing memory mapped to new context files (migration TODOs in stubs)
- [x] ISC-17: code/ vs artifacts distinction applied per project
- [x] ISC-18: Agent format specified (directory model per Nick's redefinition)
- [x] ISC-19: Per-project agent roster recommended and scaffolded
- [x] ISC-20: Agent count justified against actual session patterns
- [x] ISC-21: How agents reference context/ specified in every claude.md startup routine
- [x] ISC-22: Agent-definition separated from content (agents/ vs code|artifacts/)
- [x] ISC-23: Global PAI memory vs per-project context relationship clarified
- [x] ISC-24: Migration approach proposed; Nick chose scaffold-all-now
- [x] ISC-25: AccessBuddy repo located (/Users/nicholaswood/dev/accessbuddy)
- [x] ISC-26: Decision questions surfaced before execution
- [x] ISC-27: AGENT_STANDARD.md written as canonical guide
- [x] ISC-28: Every agent has claude.md with startup routine + memory protocol
- [x] ISC-29: Every agent has memory.md with six fixed sections
- [x] ISC-30: agent-onboarder created with full new-agent procedure
- [x] ISC-31: Cleanup of ~/workspace, ~/dev, OneDrive 07_Dev mapped (execution pending approval)
- [x] ISC-A1: No content created/moved beyond approved scaffold
- [x] ISC-A2: No existing memory or session data deleted (only my own garbage dir removed)
- [x] ISC-A3: No invented project details — all from mined data

## Decisions

- Agent model = directory per agent (Nick's redefinition), reconciled with harness: directory is source
  of truth; agent-onboarder generates a thin .claude/agents pointer for sub-agent invocation.
- Shared project context/ = foundation; per-agent memory.md = learnings; per-agent context/ = optional personal working files.
- Cleanup is the content-migration phase: PLAN now, execute after approval. Do not blind-sweep live
  git repos or OneDrive-synced folders.
- zsh does not word-split unquoted scalars; use explicit lists/arrays in loops (one bad loop created a
  garbage dir, removed surgically by inode).

## Verification

- find over target tree confirms all 8 projects have overview.md + CLAUDE.md + 4 context files + code|artifacts.
- 15 agent dirs each contain claude.md + memory.md + context/. memory.md count = 15.
- AGENT_STANDARD.md present; activation notes in accessbuddy/lifesaveroncall/limsoc updated to dir model.
- Cleanup locations inventoried with git remotes captured; ambiguous items flagged for Nick.

### Final scope (expanded from original analysis)
- Scaffolded 10 workspace projects; migrated all source content (~/dev repos into code/, OneDrive +
  ~/workspace into projects), deleted aus, removed the 3 empty source dirs.
- lifesaveroncall repo moved into code/ with 64 worktrees repaired (65/65 resolve).
- Migrated 32 project memories into per-project context/; global memory reduced to 3 + index.
- Built 17 represented agents (claude.md persona/responsibilities/operating-rules + memory.md 6 sections
  + context); seeded memory + curated context via 7 parallel agents.
- AGENT_STANDARD.md established; agent-onboarder created; Base/shell-over-built-in scheme applied to all.
- Global CLAUDE.md: added specialised/represented-agent + parallelisation directive; PreToolUse hook
  (prefer-specialised-agent.sh) added to settings.json (ask on generic spawns).
- Learnings captured: [[workspace-agent-system]], [[iterative-refinement]] memories + reflection JSONL.
- COMPLETE.

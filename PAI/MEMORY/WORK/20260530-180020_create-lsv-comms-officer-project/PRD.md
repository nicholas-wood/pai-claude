---
task: Create LSV Communications Officer role project
slug: 20260530-180020_create-lsv-comms-officer-project
effort: extended
phase: complete
progress: 25/25
mode: interactive
started: 2026-05-30T08:00:20Z
updated: 2026-05-30T08:20:00Z
---

## Context

Nick wants a dedicated workspace project for his **State Lifesaving Communications Officer**
role at Life Saving Victoria (LSV), so the role has its own `context/`, `memory`, and
represented `agents/` — the same pattern every other workspace project follows
(per `AGENT_STANDARD.md`).

**What the role IS (Nick's clarification):** the LSV role covers everything to do with
**LIMSOC** (the operational system), **Operational Communications**, and **LSOCE** (Life Saving
Operations Communications Executive). It is the connective umbrella over a body of related work.

**What it is NOT:**
- NOT the **SLSA Deputy Chair** position — that is a separate governance role. The national
  water safety supervision policy was a *project done in that role*, not this one.
- NOT the **LIMSOC National Scaling Strategy** engagement itself — that was a separate, paid,
  independent consulting engagement (`limsoc-national-ims`). Its *work product is directly
  relatable* to the role, but the engagement and the role are distinct.

**Directly relatable work to cross-reference (not absorb):**
- `limsoc-national-ims` — national IMS consulting work, feature briefs, season priorities.
- `lsv-notifications` — notification workbook tooling (VBA/Python) + pager.
- `linear-tracking` — Linear→GitHub issue sync built for the LIMSOC engagement.
- `lifesaveroncall` — Nick's own GoodSAM-style dispatch product for LSV.

The new project is a **role hub**: it holds role-specific context and agents and cross-references
the related projects rather than moving them.

### Confirmed decisions (OBSERVE — AskUserQuestion)
- Project name: **lsv-comms-officer**.
- Structure: **Hub + move the LSV tooling** — cross-reference `limsoc-national-ims` and
  `lifesaveroncall` (stay separate); RELOCATE `lsv-notifications` and `linear-tracking` under
  the hub.
- Agents: **Scaffold only, no agent** now — `agents/` placeholder created, mint later via
  `agent-onboarder` when role work is active.

## Criteria

Scaffold:
- [x] ISC-1: Project directory created at ~/Documents/workspace/lsv-comms-officer/
- [x] ISC-2: overview.md written as human index (role + nested tooling)
- [x] ISC-3: CLAUDE.md operator brief written, points to context/, lists tooling + future agent
- [x] ISC-4: context/ folder created with the four standard files
- [x] ISC-5: agents/ placeholder folder created (empty, for future agent)

facts.md (durable role definition):
- [x] ISC-6: facts.md names the role: State Lifesaving Communications Officer at LSV
- [x] ISC-7: facts.md scopes role as LIMSOC + Operational Communications + LSOCE
- [x] ISC-8: facts.md distinguishes role from SLSA Deputy Chair position
- [x] ISC-9: facts.md distinguishes role from the paid LIMSOC scaling engagement
- [x] ISC-10: facts.md records LSV org hierarchy (SLSA -> LSV -> Region -> Area -> Club)

references.md (related work):
- [x] ISC-11: references.md cross-refs external project limsoc-national-ims
- [x] ISC-12: references.md cross-refs external product lifesaveroncall
- [x] ISC-13: references.md points to LSOCE SOP feedback location
- [x] ISC-14: references.md points to LIMSOC season priorities (OneDrive path)
- [x] ISC-15: references.md documents the two nested sub-projects

state.md (current working state):
- [x] ISC-16: state.md captures current active role workstreams
- [x] ISC-17: state.md has In progress / Backlog / Blockers sections

feedback.md (how Nick wants role work done):
- [x] ISC-18: feedback.md captures exec-comms voice and AU-English preferences

Relocations (Hub + move):
- [x] ISC-19: lsv-notifications relocated under hub, contents intact
- [x] ISC-20: linear-tracking relocated under hub, nested git repo + sync state intact
- [x] ISC-21: stale path refs to moved projects updated (limsoc references.md, MEMORY.md)

Anti-criteria:
- [x] ISC-A1: limsoc-national-ims and lifesaveroncall NOT moved (stay external, cross-referenced)
- [x] ISC-A2: Role NOT conflated with the paid consulting engagement
- [x] ISC-A3: Moved projects' internal content NOT edited (relocate only)
- [x] ISC-A4: No agent created (scaffold only, per confirmed choice)

## Decisions
- Nested tooling placed directly as `lsv-comms-officer/<name>/` (self-contained sub-projects) rather
  than under a `tooling/` wrapper — they keep their own CLAUDE.md/overview and stay portable.
- Did NOT edit the moved projects' own `overview.md` (which still say "moved to its own project")
  to respect ISC-A3; the hub `overview.md` is the authoritative location record.
- `agent-onboarder` deselected mid-run: Nick chose scaffold-only, so minting an agent would be
  phantom work. Honest deselection per the consumption check.

## Verification
- `ls` confirms hub has overview.md, CLAUDE.md, context/{facts,state,references,feedback}.md,
  agents/README.md, and nested linear-tracking/ + lsv-notifications/ (ISC-1..5, 16-18).
- `grep -c` returns 6 hits in facts.md for role title / LSOCE / Deputy Chair / paid-engagement /
  hierarchy strings (ISC-6..10).
- references.md cross-refs limsoc-national-ims + lifesaveroncall, LSOCE feedback path, season
  priorities OneDrive path, and the two nested sub-projects (ISC-11..15).
- Old paths `~/Documents/workspace/{lsv-notifications,linear-tracking}` return "No such file";
  destinations present; nested `.git` and `linear_sync_state.json` intact (ISC-19, 20).
- limsoc references.md + MEMORY.md updated to new paths (ISC-21).
- limsoc-national-ims/ and lifesaveroncall/ still external and untouched (ISC-A1, A3).
- No code edited → `/simplify` gate correctly not triggered. No agent created (ISC-A4).
</content>
</invoke>

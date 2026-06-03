---
task: Analyse Documents and OneDrives propose cleanup structure
slug: 20260421-164927_documents-onedrive-cleanup-proposal
effort: extended
phase: complete
progress: 30/30
mode: interactive
started: 2026-04-21T06:49:27Z
updated: 2026-04-21T07:15:00Z
---

## Context

Nick wants a clean proposal to reorganise files across five locations: local `~/Documents`, `~/Desktop`, and four OneDrive mirrors (Personal, Lifesaving Victoria, Lifesaving Victoria Shared Libraries, Surf Life Saving Australia). Decisions confirmed: Personal OneDrive is source of truth for everything, work OneDrives are publishing surfaces only, large media stays in place within `Operational Media/` folders per drive, life-domain taxonomy (9 top-level folders), full scope (Documents + Desktop + Downloads + loose home files).

### Discovered state

- `~/Documents` (65 GB): raw IRB drone footage, Anglesea Carnival media, LSV Notifications xlsm, loose VBA text files, active `workspace/` dev tree
- `~/Desktop`: empty
- `OneDrive-Personal` (2.2 GB): mature 43-folder nested archive with typos (Bililng, Documenation)
- `OneDrive-LIFESAVINGVICTORIALIMITED`: real mount, empty
- `OneDrive-SharedLibraries-LIFESAVINGVICTORIALIMITED`: empty, org-owned
- `OneDrive-SurfLifeSavingAustralia` (80 GB): active SLSA work plus heavy media
- `~` loose files: LSV Notifications Python scripts, Home Assistant yaml
- `~/Downloads`: 398 items, 264 aged 90-365 days, dominated by PDF/xlsx/docx/png
- iCloud Desktop/Documents sync: OFF (no collision risk)

### Plan

Extended effort, single deliverable: executive-ready Markdown proposal at `~/Documents/workspace/docs-cleanup-2026-04/PROPOSAL.md`. No file moves. Proposal includes taxonomy, mapping tables, migration phases, ongoing rules, and 5 open questions for Nick to answer before execution runbook.

### Risks

- Data classification: Nick chose Personal-as-source-of-truth despite risk of LSV/SLSA policy breach. Proposal acknowledges this honestly.
- OneDrive quota: assumes Microsoft 365 1 TB. Flagged as open question.
- `workspace/` git repos: strong recommendation in proposal to leave local.

## Criteria

- [x] ISC-1: Top level of ~/Documents enumerated
- [x] ISC-2: Top level of ~/Desktop verified effectively empty
- [x] ISC-3: Top level of Personal OneDrive enumerated
- [x] ISC-4: Personal OneDrive/Documents subfolder enumerated
- [x] ISC-5: LSV OneDrive state determined (empty)
- [x] ISC-6: LSV SharedLibraries state determined (empty)
- [x] ISC-7: SLSA OneDrive top level enumerated
- [x] ISC-8: Size footprint per location captured
- [x] ISC-9: Content classified by domain
- [x] ISC-10: Data-classification risk flagged in Context
- [x] ISC-11: Duplicate/typo'd folders flagged
- [x] ISC-12: Work-content policy question asked
- [x] ISC-13: Scope boundary question asked
- [x] ISC-14: Taxonomy question asked
- [x] ISC-15: Media handling question asked
- [x] ISC-16: Archive approach implied in taxonomy question
- [x] ISC-17: Loose files in ~ enumerated
- [x] ISC-18: Downloads composition sampled
- [x] ISC-19: iCloud Desktop/Documents sync status determined (OFF)
- [x] ISC-20: LSV OneDrive sync state verified (real mount, empty)
- [x] ISC-21: Microsoft/app-managed folders marked as do-not-touch
- [x] ISC-22: Target taxonomy defined with subfolder pattern
- [x] ISC-23: Mapping table produced for every top-level item
- [x] ISC-24: Operational Media convention defined per drive
- [x] ISC-25: Migration sequence proposed in 5 phases with risk ordering
- [x] ISC-26: Rule for ~/Desktop proposed
- [x] ISC-27: Rule for ~/Downloads proposed (age-based triage)
- [x] ISC-28: Typo'd folder handling proposed (shadow-folder method)
- [x] ISC-29: Workspace dev content handling proposed (stay local if .git)
- [x] ISC-30: Proposal delivered as executive-ready document
- [x] ISC-A1: No files moved, deleted, or modified in live locations
- [x] ISC-A2: Zero em dashes verified via grep
- [x] ISC-A3: Australian English verified via grep

## Decisions

- Work policy: Personal OneDrive as source of truth (Nick's call, flagged risk in proposal)
- Media policy: leave in place within per-drive `Operational Media/` folders (Nick's note)
- Taxonomy: nine numbered life-domain folders (Nick's selection)
- Scope: full (Documents + Desktop + Downloads + loose ~ files)
- Dev workspace: recommend strictly local for anything with .git
- Typo fix method: shadow-folder with 30-day transition to preserve OneDrive web links

## Verification

- `grep -c '—' PROPOSAL.md` returns 0 (em dash rule enforced)
- `grep -i -E 'color|organiz|favorit|analyze|recognize'` returns nothing (AU spelling)
- File lives in workspace project dir, not Downloads (per memory rule)
- 297 lines, 16.8 KB, structured with 12 numbered sections
- All 30 ISC pass; all 3 anti-criteria pass
- Five open questions surfaced at end of proposal for Nick to answer before runbook

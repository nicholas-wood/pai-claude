---
task: Assess LIMSOC-BRIEF-LSV-2026-012 (Incident Categorisation) for quality against the Feature Brief standard and completeness against Proposal Pack v0.9
slug: brief-012-incident-categorisation-assessment
effort: E3
phase: complete
progress: 36/36
mode: standard
started: 2026-08-30T20:30:00+10:00
updated: 2026-08-30T21:05:00+10:00
---

## Problem

Flynn Young's LIMSOC Feature Brief 012 (v0.1, 17 Aug 2026) is the next level of detail handed to the LIMSOC dev team for the incident categorisation change. Nick is a sign-off on the brief and the author of the source Operational Change Proposal Pack v0.9. Nobody has yet checked (a) whether the brief meets the LIMSOC Feature Brief template standard well enough to be dev-ready, and (b) whether every element of the pack that a developer needs has landed in the brief. Gaps discovered after dev starts are expensive; gaps discovered now are a one-line comment.

## Vision

Nick opens one assessment, sees a clear verdict on brief quality with the specific defects listed, sees a traceability table of every pack element marked covered / partial / missing, and sees a short list of things neither document covers that a dev team will ask about. He can send the findings to Flynn with minimal editing.

## Out of Scope

Rewriting the brief. Changing the pack. Exporting to docx or pushing to OneDrive (Nick asked for an assessment, not an artefact for circulation). Re-litigating model design decisions already in Annex B.

## Constraints

- Assessment only; no edits to the brief or pack (Nick asked a question, per feedback-advice-not-action).
- Australian English, no em dashes, documentary register suitable for forwarding to LSV staff.
- Source of truth for "the standard" is the LIMSOC Feature Brief template as evidenced by the 012 brief's own section prompts and the SRR brief (005 v1.0).
- Source of truth for completeness is Pack v0.9 (inbox docx, verified identical in structure to the workspace v0.9 source).
- Markdown source lives in the workspace project directory, not OneDrive.

## Goal

A written assessment at `projects/limsoc/incident-categorisation/Brief-012-Assessment.md` that (1) grades the brief section by section against the template with concrete defects, (2) traces every pack element to the brief with a covered / partial / missing status, and (3) lists dev-relevant gaps in both documents, with a prioritised fix list Nick can hand to Flynn.

## Criteria

- [x] ISC-1: Assessment file exists at the workspace path named in Goal
- [x] ISC-2: Assessment names the brief ID, version, author and date read from the docx
- [x] ISC-3: Assessment names the pack version it was traced against (v0.9)
- [x] ISC-4: Part A covers every template section present in the 012 brief (16 sections)
- [x] ISC-5: Part A identifies every template section left empty or placeholder
- [x] ISC-6: Part A lists each grammar/typo/incomplete-sentence defect with quoted text
- [x] ISC-7: Part A flags the broken Risks table formatting
- [x] ISC-8: Part A flags missing requirement numbering and prioritisation
- [x] ISC-9: Part A flags unmeasurable NFR language with quoted examples
- [x] ISC-10: Part A flags the unselected Feature Category with a recommendation
- [x] ISC-11: Part A gives an overall verdict with a dev-readiness call
- [x] ISC-12: Part B traceability table has a row for every pack Part 2 mechanism (8 mechanisms)
- [x] ISC-13: Part B traces Incident Outcome requirements (required at close, controlled, gated by Type)
- [x] ISC-14: Part B traces Rule 1 (Type only updated on miscategorisation)
- [x] ISC-15: Part B traces Rule 2 precedence order
- [x] ISC-16: Part B traces Rule 3 (our incident or theirs)
- [x] ISC-17: Part B traces Rule 4 (activations keep their Type)
- [x] ISC-18: Part B traces the Action Log proposal and its scoping
- [x] ISC-19: Part B traces Annex C platform notes (form vs section requirement, People inputs, tag scoping, type states)
- [x] ISC-20: Part B traces migration target kinds beyond Type/Tag (Outcome, Responding Agency, Out, Removed, Retired, Split)
- [x] ISC-21: Part B traces the guided-question quantitative structured fields allowance
- [x] ISC-22: Part B traces the rescue-method flow-back platform requirement
- [x] ISC-23: Part B traces the no-priority-codes decision as an anti-requirement
- [x] ISC-24: Part B traces Incident and Event definitions
- [x] ISC-25: Part B traces linked-incident capability (severe member injury during Tasking)
- [x] ISC-26: Part B traces Part 4 dependencies (Simplified Incident Creation, Incident Labels 1.8)
- [x] ISC-27: Part B traces the pack's open items and flagged migration rows
- [x] ISC-28: Part B traces the full type tree and Medical branch as required attachments
- [x] ISC-29: Part B lists brief content that is NOT in the pack (notifications, multi-device, audit)
- [x] ISC-30: Part C identifies SOP 4.3 notification matrix dependency on legacy type codes
- [x] ISC-31: Part C identifies SOP 4.3 cross-cutting conditions needing Tags (member injury, media, state resources, multi-club, protracted)
- [x] ISC-32: Part C identifies cutover of in-flight incidents as a gap in both documents
- [x] ISC-33: Part C identifies stable Type codes/IDs for reporting and paging as a gap
- [x] ISC-34: Assessment ends with a prioritised fix list (must / should / could) for Flynn
- [x] ISC-35: Anti: assessment does not contain em dashes
- [x] ISC-36: Anti: brief and pack docx files are byte-unchanged after the run

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | file | path exists | yes | Bash ls |
| ISC-2..3 | content | grep for "2026-012", "0.1", "Flynn", "v0.9" | all present | Grep |
| ISC-4..11 | content | Part A headings and quoted defects present | each item | Read |
| ISC-12..29 | content | traceability rows present with status | each row | Grep |
| ISC-30..34 | content | Part C items and fix list present | each item | Read |
| ISC-35 | anti | grep U+2014 | 0 hits | Grep |
| ISC-36 | anti | md5sum before/after | identical | Bash |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| extract | docx and pdf to text | ISC-2, ISC-3 | none | yes |
| part-a-quality | template-by-section quality review | ISC-4..11 | extract | yes |
| part-b-trace | pack-to-brief traceability | ISC-12..29 | extract | yes |
| part-c-gaps | gaps in both documents incl. SOP 4.3 | ISC-30..33 | part-b-trace | no |
| fix-list | prioritised actions for Flynn | ISC-34 | all | no |

## Decisions

- 2026-08-30: Delegation floor (E3 soft ≥2) relaxed. Show your math: both documents fit in context in full (2.6k and 7.5k words); a subagent tracing pack-to-brief would re-read the same text with less context on Nick's design intent and the Decision Log. Delegation would add latency and lose precision on a task that is single-author judgment. Advisor call retained as the second opinion.
- 2026-08-30: Assessment only, no brief rewrite (feedback-advice-not-action). Nick asked "assess", not "fix".
- 2026-08-30: "The standard" interpreted as the LIMSOC Feature Brief template (section prompts visible in both the 012 and 005 briefs). No separate written standard exists in the workspace (fd/rg found none).
- 2026-08-30: Advisor (Inference.ts --mode advisor) returned ten candidate gaps; four adopted into Part C items 8 to 11 (taxonomy versioning, exclusive Tag groups, guided-question answer persistence, migration sign-off/rollback). Six rejected as either already covered (validation gates, downstream contracts, reclassification audit) or platform-wide rather than feature-scoped (per-agency status, concurrent edits, offline capture).

## Verification

- ISC-1: Bash ls — Brief-012-Assessment.md exists, 32k+ bytes at workspace path
- ISC-2..3: rg — "2026-012" 2 hits, "v0.1" 6, "Flynn Young" 3, "17/08" 2, "v0.9" 3
- ISC-4..5: rg '^### A' — 12 Part A subsections covering all 16 template sections (grouped); empty sections listed in Verdict and A5, A8, A10, A11
- ISC-6: Read — A3 defect table has 9 quoted defects
- ISC-7: rg "Risks table" — 1 hit (A7)
- ISC-8: rg "FR-01" — 2 hits
- ISC-9: rg "promptly" — 2 hits, quoted in A4
- ISC-10: rg "Feature Category" — 2 hits with recommendation 2
- ISC-11: Read — Verdict section opens with dev-readiness call
- ISC-12: Read — B2 table has 8 mechanism rows
- ISC-13..28: rg — every traced string hit (Incident Outcome, Rule 1/3/4, precedence order, Action Log, form submission required, People (patient count), Responding Agency (A04 AMSA), quantitative and reporting-critical, Heli technique, No priority codes, Incident definition, linked incident, Simplified Incident Creation, Open Decisions, Medical branch)
- ISC-29: rg "Notification Requirements" — B9 table present
- ISC-30..33: rg — "keyed on legacy type codes", "media interest", "Cutover of open incidents", "Stable Type identifiers" all 1+ hits
- ISC-34: rg "Fix list for Flynn" — 1 hit, Must/Should/Could tiers present
- ISC-35: rg U+2014 — 0 hits after final edit
- ISC-36: md5sum diff before/after — UNCHANGED for both docx files

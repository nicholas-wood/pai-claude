---
task: Ultra-examine First Aid Form Data.xlsx — executive/conference-ready insights on the new branching form
slug: first-aid-form-analysis
effort: E3
phase: complete
progress: 36/36
mode: algorithm
started: 2026-08-09T21:05:00+10:00
updated: 2026-08-09T21:05:00+10:00
---

## Problem

LSV replaced a basic flat first aid form with a conditional (branching) form for the 2025/26 season. The organisation cannot yet articulate, with evidence, what the upgrade bought: which clinical and operational facts are now visible that were structurally invisible before, whether presentation trends across six seasons hold new signal, and where the form performs poorly (slow completion, badly answered question sets) so training can be targeted. A colleague has produced formula-level crunching in the workbook, but no rigorous, re-derived, executive-grade analysis exists.

## Vision

Nick opens the findings and immediately sees statistics he can lift straight into an executive report and a conference deck for other states: numbers that are correct because they were re-derived from raw rows, framed as clarity-gained / trends / form-quality / training-targets, with the "wow" statistics clearly flagged. Nothing in it is an assumption; every claim traces to a sheet and a count.

## Out of Scope

External benchmarking, literature, or comparison to other states' data (no data present). Clinical judgment about treatment correctness. Any modification of the source workbook. Publishing or emailing the report anywhere. Patient-level narratives or any PII reproduction (names appearing inside free-text notes must not surface in outputs).

## Constraints

- Evidence only from `First Aid Form Data.xlsx` — no assumptions, no inferred external facts.
- All headline numbers re-derived from raw season sheets, not trusted from the colleague's formula sheets; discrepancies with the colleague's sheets are surfaced, not silently overwritten.
- Analysis tooling in TypeScript run with bun; work in `$CLAUDE_JOB_DIR/tmp/fa`; source file untouched on OneDrive.
- Aggregate-only outputs; PII tokens (FullName/NotCaptured etc.) treated as capture flags, never as identity data.
- Report register: formal documentation (LSV proposal register rule) — no colloquial devices.

## Goal

Deliver a re-derived, statistically thorough analysis of all seven raw season sheets plus the colleague's crunched sheets, packaged as executive/conference-ready findings across the four asked dimensions (clarity gained vs old form, presentation trends, form-quality insights including completion time and poorly-answered question sets, and training targets), written to a durable markdown report and a visual artifact.

## Criteria

- [x] ISC-1: All 7 raw season sheets exported to JSON with row counts matching sheet refs
- [x] ISC-2: New-form field inventory vs old-form field inventory produced (structural delta table)
- [x] ISC-3: 25/26 season total case count re-derived and reconciled against colleague's "Total 1494/1495"
- [x] ISC-4: Season-over-season case volume series re-derived (20-21 → 25-26)
- [x] ISC-5: Nature-of-presentation distribution computed for 25/26 (injury/medical/envenomation/etc.)
- [x] ISC-6: Nature trends computed across seasons where old form allows comparison (injury_nature mapping)
- [x] ISC-7: Major/minor severity split re-derived for 25/26 and compared to is_major in prior seasons
- [x] ISC-8: Referral/disposition distribution computed for 25/26 and compared across seasons
- [x] ISC-9: Time-from-treatment-to-creation distribution computed (James's delayed-creation angle re-derived from timestamps)
- [x] ISC-10: Time-from-creation-to-completion distribution computed with median/quartiles, not just buckets
- [x] ISC-11: Delayed creation/completion buckets reconciled against By Unit sheet buckets
- [x] ISC-12: Field-level capture rates computed for demographic fields (name, DOB, address, phone, gender, age)
- [x] ISC-13: Capture rates compared old form (24-25 and prior) vs new form (25-26) for the shared fields
- [x] ISC-14: New-only field utilisation computed (SAMPLE history, allergies, medications, past medical history)
- [x] ISC-15: Conditional-branch utilisation computed — which branches fire and at what rate (resus, oxygen, methoxyflurane, mental health, drowning, envenomation)
- [x] ISC-16: Methoxyflurane analgesia record analysed — pain scores before/2min/4min where present (clinical wow stat)
- [x] ISC-17: Oxygen administration records analysed (time applied, duration, method) where present
- [x] ISC-18: Resuscitation case detail depth compared old vs new form (fields populated per resus case)
- [x] ISC-19: Poorly-answered question sets identified quantitatively (highest null/other/malformed rates among applicable cases)
- [x] ISC-20: "Other" free-text overflow rates computed per categorical question (form option coverage quality)
- [x] ISC-21: Multiselect malformation issues (Sheet1 note) verified against raw data
- [x] ISC-22: Age and gender distributions computed for 25/26 and reconciled with Stats sheet
- [x] ISC-23: Per-unit engagement spread computed (cases per unit, concentration) from raw data
- [x] ISC-24: Incomplete/open case rates computed (completed flag / current_step) old vs new
- [x] ISC-25: Occupational violence and peer-support flag rates computed (new-only welfare signal)
- [x] ISC-26: Treating-skills field analysed (who treats — skill levels) where captured
- [x] ISC-27: Ambulance involvement rates computed and trended across seasons
- [x] ISC-28: Colleague-sheet discrepancies (if any) listed explicitly with both values
- [x] ISC-29: Findings organised under the four asked dimensions with wow-stats flagged for conference use
- [x] ISC-30: Durable markdown report written to workspace (not OneDrive, not .md into OneDrive)
- [x] ISC-31: Visual artifact published with charts following dataviz skill guidance
- [x] ISC-32: Every headline number in the report traceable to a computed output (analysis script committed alongside)
- [x] ISC-33: Anti: No patient names, phone numbers, addresses, or note excerpts containing identity data appear in report or artifact
- [x] ISC-34: Anti: No claim in the report relies on data not present in the workbook
- [x] ISC-35: Anti: Source workbook on OneDrive unmodified (byte-identical)
- [x] ISC-36: Limitations section states what the data cannot support (no satisfaction survey data unless present, etc.)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1 | data | JSON row counts match sheet refs | exact | Bash (bun) |
| 2-8 | analysis | computed tables exist in analysis output | non-empty | Bash (bun) |
| 9-11 | analysis | distributions with median/IQR printed; bucket reconciliation table | exact/±1 | Bash (bun) |
| 12-27 | analysis | per-field rate tables printed with denominators | denominators shown | Bash (bun) |
| 28 | reconciliation | discrepancy list printed (possibly empty with proof) | explicit | Bash (bun) |
| 29-30 | report | Read report file, four dimensions present | all 4 | Read |
| 31 | artifact | Artifact published, charts render | URL returned | Artifact |
| 32 | traceability | analysis scripts saved next to report | files exist | Bash |
| 33 | anti | rg for PII patterns in outputs returns nothing | 0 matches | Bash (rg) |
| 34 | anti | report claims cross-checked in RE-READ | 0 violations | Read |
| 35 | anti | checksum source vs OneDrive copy | identical | Bash (sha256) |
| 36 | report | Limitations section exists | present | Read |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| extract | Export sheets to JSON, field inventories | ISC-1,2 | — | no |
| colleague-read | Full read of Year 2 Year, Stats, By Unit, Resus, Sheet1 | ISC-3,11,22,28 | extract | yes |
| trends-engine | Season-over-season volumes, natures, severity, referral, ambulance | ISC-4..8,27 | extract | yes |
| quality-engine | Timestamps, capture rates, branch utilisation, poorly-answered sets, multiselect | ISC-9..26 | extract | yes |
| synthesis | Four-dimension findings + wow stats + limitations | ISC-28,29,36 | all engines | no |
| report | Markdown report + dataviz artifact | ISC-30,31,32 | synthesis | no |
| privacy-gate | PII sweep + source checksum | ISC-33,35 | report | no |

## Decisions

- 2026-08-09 21:05 — Delegation floor (E3 ≥2) relaxed, show-your-math: the entire evidence base is one 2.4 MB workbook already exported to JSON in one working directory; delegating analysis slices to subagents would duplicate the dataset into contexts that cannot share computed intermediates, and the two natural "delegates" (trend engine, quality engine) are bun scripts, not judgment tasks. Deterministic code beats parallel model contexts here (PAI principle: Code Before Prompts).
- 2026-08-09 21:05 — Colleague sheets treated as claims to reconcile, not sources of truth, per Nick's "do not make assumptions" instruction.

## Verification

- ISC-1: Bash — JSON exports printed row counts matching sheet refs (1494/24/1688/1510/1097/920/673)
- ISC-3/22/28: Bash — reconciliation block: name 863/422/209, dob 1308, major 249, gender 767/720, peer support 7, occ violence 1, incident 253 all match colleague sheets; Year 2 Year prior-season totals and Age/Postcode captured formulas confirmed broken
- ISC-9/10/11: Bash — treatment→creation median 0.0h, 87.1% <1h; creation→last-edit median 0.07h (~4 min), 85.4% <1h; buckets consistent with By Unit within method differences
- ISC-12/13/14: Bash — capture tables across 7 season sheets; old vs new deltas in report §5.4
- ISC-15/16/17/18: Bash — branch answer rates 96.6–100%; methoxyflurane 14 records, mean pain 7.1 −2.6 @4min; oxygen 47; resus 7/7 at 11/12 fields vs 14/28 old
- ISC-19/20/21: Bash — poorly-answered table (SAMPLE 6–7.2%, amb case no 8.2%); Other overflow 1.1–30.5%; 0 malformed multiselect cells in core fields
- ISC-29/30/36: Read — report at ~/Documents/workspace/projects/lsv-first-aid-form/FirstAidFormAnalysis2025-26.md with four dimensions, wow list, limitations
- ISC-31: Artifact — published https://claude.ai/code/artifact/2ccce9a8-6a50-4edf-8e32-91c045e7765b (palette validator ALL PASS light/dark/ordinal)
- ISC-32: Bash — 8 analysis scripts copied to analysis/
- ISC-33: Bash — rg PII sweep returned no matches (exit 1)
- ISC-35: Bash — sha256 identical for OneDrive source and working copy (99ca023c…)

## Iteration 2 (2026-08-23) — feedback round

- [x] ISC-37: Section titles in artifact rewritten to documentary register (no "ten numbers that carry the story" style)
- [x] ISC-38: Background section explains the form to a reader with no prior knowledge (what it is, who completes it, old vs new, which question sets branch on what)
- [x] ISC-39: New-form activity deep dive: natures with specific problems, body locations, age bands and severity by age, cohorts, gender, treating skills, unit types, month/hour timing, treatments, discharge, ambulance attendance, resuscitation detail
- [x] ISC-40: Every quoted exception explained from structured fields (envenomation 7, injury 7, drowning minor, MH minor, resus 5 vs 7, major envenomations, 41 late, 3 negative, 24 nature-blank, 249 vs 253, methoxyflurane 6 unscored)
- [x] ISC-41: Legacy activity/experience/contributing-factor questions confirmed absent from new form (0/1,494 vs 1,688/1,688) and reported honestly
- [x] ISC-42: Where-to-next section with One action form and Incident categorisation sub-sections in Nick's framing, formal register
- [x] ISC-43: Anti: no narrative text reproduced; PII sweep clean on both deliverables
- ISC-37..43 verification: Bash rg sweep exit 1 (clean); analyze5.ts copied to analysis/; artifact republished at same URL (label deep-dive-and-roadmap); report rewritten with sections 1, 4, 7, 10 added.

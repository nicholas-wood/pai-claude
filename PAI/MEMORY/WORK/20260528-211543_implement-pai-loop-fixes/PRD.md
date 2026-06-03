---
task: Implement PAI fixes - close loop, fix ratings, auto-fire skills
slug: 20260528-211543_implement-pai-loop-fixes
effort: advanced
phase: complete
progress: 27/27
mode: interactive
started: 2026-05-28T11:15:43Z
updated: 2026-05-28T11:24:00Z
---

## Context

Implementing the fixes from the prior PAI assessment. Verified current state first
(steering: never assert without verification, surgical fixes only, read before modifying).

### Verified facts (OBSERVE)
- RatingCapture.hook.ts already iterated heavily (many "BUG FIX" guards). Residual bug CONFIRMED by running the parser: bare "2"/"3" and "2 alphabetical if no location is set" are parsed as ratings 1-3. These happen when Nick answers a PROSE question from the assistant by typing a message starting with a digit. AskUserQuestion answers bypass this hook entirely (they are tool results), so the fix targets prose-question answers only.
- The fix is surgical: do NOT run the brittle explicit regex when the assistant's last turn posed a question. The context-aware implicit path already handles answers correctly (rates them null/neutral). last-response.txt holds the assistant's last text, so a question-detector can read it.
- MineReflections + AlgorithmUpgrade are MANUAL workflows under skills/Utilities/PAIUpgrade. Nothing schedules them. Open-loop CONFIRMED: 37 reflections accumulate unmined.
- ~/.claude is NOT a git repo. No VCS safety net, so back up each file before editing.
- Algorithm v3.7.0.md line ~220 uses soft language: "/simplify should be near-default", "/batch should be considered", "Agent Teams should be considered". This is where the loop is open: capabilities are softly suggested, then not invoked.

### Scope decisions
- KEEP voice + reflections (not cutting; P2 makes reflections valuable by being mined).
- Do NOT auto-create scheduled MineReflections (recurring billed remote agent). Offer it instead.
- Loop closure done at the decision point: strengthen Algorithm gates + have OBSERVE pre-load chronic regrets from reflections (durable, no new infra/cost).

### Risks
- Over-suppressing genuine ratings: mitigated by only gating the explicit regex when a question was pending; implicit path still runs.
- Editing core Algorithm spec with no git: mitigated by .bak backups + additive-only edits.

## Criteria
- [x] ISC-1: Backup of RatingCapture.hook.ts created before edit
- [x] ISC-2: Helper lastResponseAskedQuestion added to hook
- [x] ISC-3: Detector returns true for trailing "?"
- [x] ISC-4: Detector returns true for numbered options (1. / 2))
- [x] ISC-5: Detector returns true for choice phrases (which/should I/would you)
- [x] ISC-6: main() gates explicit path on questionWasPending
- [x] ISC-7: Bare "2" with question pending no longer parsed as rating
- [x] ISC-8: "2 alphabetical..." with question pending no longer a rating
- [x] ISC-9: Genuine "9 great work" after a non-question still captured
- [x] ISC-10: Implicit sentiment path left unchanged (no regression)
- [x] ISC-11: Edited hook parses without syntax error (bun check)
- [x] ISC-12: Backup of v3.7.0.md created before edit
- [x] ISC-13: /simplify changed to mandatory post-code-change gate
- [x] ISC-14: /batch made default for 3+ similar-file edits
- [x] ISC-15: Guidance added to prefer specialised agents over general-purpose
- [x] ISC-16: TeamCreate guidance for independent workstreams at Extended+
- [x] ISC-17: VERIFY phase enforces simplify-on-code-change as a failure if missed
- [x] ISC-18: OBSERVE step added to scan recent reflection_q3 for recurring regrets
- [x] ISC-19: Chronic-miss defaults (simplify/batch/teams/thinking) recorded
- [x] ISC-20: Algorithm edits additive, no existing content deleted
- [x] ISC-21: No components removed (voice, reflections intact)
- [x] ISC-22: Scheduled MineReflections NOT auto-created (offered only)
- [x] ISC-23: Edited sections re-read to confirm applied correctly
- [x] ISC-24: Parser re-test confirms fix end-to-end
- [x] ISC-A1: No em dashes in added text/comments
- [x] ISC-A2: No working code modified beyond the confirmed bug
- [x] ISC-A3: No new recurring cost imposed without consent

## Decisions
- Ratings fix: gate the explicit-rating regex on a question-pending check rather than rewriting the parser. Implicit (LLM) path untouched, so answers are still read in context and no signal is lost.
- Loop closure done at the decision point (Algorithm prose), not via a new hook: hooks cannot inject a Skill call into the main agent, and the Algorithm file is already followed each run. Plus an OBSERVE reflection-scan so it self-corrects durably.
- Kept voice + reflections. Did NOT auto-schedule MineReflections (recurring billed remote agent) - offered to Nick instead.
- /simplify review found no fixes; one accepted trade-off (numbered result-lists also trip the question detector, compensated by implicit path).

## Verification
- Hook parses (bun build OK). Parser re-test: "2","3","2 alphabetical...","1 please" SKIPPED when question pending; "9 great work","3 this is wrong","8" still captured after delivered work.
- Algorithm edits confirmed present (3/3 markers: MANDATORY CAPABILITY GATES, LOOP-CLOSURE SCAN, Mandatory-gate check).
- Backups: hooks/RatingCapture.hook.ts.bak-20260528, PAI/Algorithm/v3.7.0.md.bak-20260528.
- /simplify invoked via real Skill tool call (dogfooded the new gate).

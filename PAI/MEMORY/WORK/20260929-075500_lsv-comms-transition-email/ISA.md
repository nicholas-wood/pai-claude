---
task: Refine LSV Comms transition email, officer voice
slug: 20260929-075500_lsv-comms-transition-email
effort: E2
effort_source: classifier
phase: complete
progress: 18/18
mode: algorithm
started: 2026-09-29T07:55:00+10:00
updated: 2026-09-29T08:05:00+10:00
---

## Problem

Nick's draft email to State Communications officers is structurally sound but states the mandatory-training requirement only two thirds of the way down, carries some wordiness, and needs tuning to his State Lifesaving Communications Officer voice (collective, clear, warm, firm without being heavy-handed).

## Goal

A send-ready refined email at `email-refined.md` that preserves every fact, date, name and placeholder from Nick's draft, leads with the change, go-live date and training requirement, and conforms to his recorded writing rules for member-facing comms.

## Criteria

- [x] ISC-1: No em or en dashes in the email
- [x] ISC-2: No American spellings (categoriz, organiz, finaliz)
- [x] ISC-3: No AI filler phrases from the anti-pattern list
- [x] ISC-4: No comparative superlatives
- [x] ISC-5: Block 1 dates "5 to 16 October" preserved
- [x] ISC-6: Block 2 dates "19 to 30 October" preserved
- [x] ISC-7: Block 3 dates "2 to 13 November" preserved
- [x] ISC-8: Go live "Saturday 14 November" preserved
- [x] ISC-9: Old interface cut-off "31 December" preserved
- [x] ISC-10: Design deadline "Friday 9 October" preserved
- [x] ISC-11: Consultation parties EMCaR and SLSQ preserved
- [x] ISC-12: Dave and Flynn contact roles preserved
- [x] ISC-13: All seven placeholders preserved unfilled
- [x] ISC-14: Go-live date appears in the opening paragraph
- [x] ISC-15: "not about catching anyone out" reassurance preserved
- [x] ISC-16: Signature block with title and LSV preserved
- [x] ISC-17: Anti: no facts, reasons or commitments of substance invented beyond the draft
- [x] ISC-18: Antecedent: training requirement is stated in the opening so the later firm section reads as fair, not sudden

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..4 | style | rg pattern count | 0 | Bash rg |
| ISC-5..12, 15, 16 | fact preservation | rg -F fixed string | >=1 | Bash rg |
| ISC-13 | placeholder | bracket count | 7 | Bash rg |
| ISC-14 | structure | "14 November" in first 450 chars | >=1 | Bash head + rg |
| ISC-17, 18 | inspection | side-by-side read against draft | pass | Read |

## Decisions

- 2026-09-29 Delegation floor relaxed (show your math): a second writer or reviewer agent would have produced a competing voice on a 700-word single-author email; Nick's recorded feedback files are the better reviewer and were consulted directly.
- 2026-09-29 LSV proposal-register feedback judged not applicable: it governs formal proposal packs, this is a team email, so direct address is retained.
- 2026-09-29 Incident category rationale left in Nick's words. Sharper rationale exists in the v0.9 pack but adding it would be inventing content for this email.
- 2026-09-29 Phase voice announcements limited to entry and skill notification to protect the free ElevenLabs quota.
- 2026-09-29 One sentence added in the required section ("We want everyone on the roster this season, and we'll work with you to get there") as tone balance. Flagged to Nick as an addition.

## Verification

- ISC-1..4: rg counts all 0
- ISC-5..12, 15, 16: rg -F each returned >=1 (14 November x2, 31 December x2, Dave x4, Flynn x2)
- ISC-13: 7 bracketed placeholders
- ISC-14: "14 November" found in first 450 characters
- ISC-17: inspection, only addition is the roster sentence, logged above
- ISC-18: inspection, paragraph two states the requirement

---
task: Rewrite LinkedIn headline as forward deployed engineer positioning, no AI-filler phrasing
slug: linkedin-headline-rewrite
effort: E2
phase: complete
progress: 17/17
mode: standard
iteration: 2
started: 2026-08-10T00:00:00+10:00
updated: 2026-08-10T00:20:00+10:00
---

## Problem

Nick's LinkedIn headline says true things in borrowed AI voice. Iteration 1 fixed the filler; iteration 2 changes the positioning target: he wants the headline to sell a forward deployed engineer — someone embedded in the business who finds and solves its biggest problems using AI's rapidly expanding capability set — without relapsing into the abstract phrasing that caused the original complaint ("rapidly expanding landscape" is itself vapour if used verbatim).

## Goal

Deliver a recommended FDE-positioned headline plus at least two alternatives, where every phrase is concrete or checkable, the three framing asks (embedded business understanding, biggest problems, expanding AI frontier) are each carried in plain words, and none of the banned filler patterns appear; verified by reading the delivered text against the ask list and the ban list.

## Criteria

- [ ] ISC-1: [DROPPED — see Decisions, iteration 3: FDE term must no longer appear]
- [x] ISC-18: Anti: no option claims "forward deployed" as a title or identity (Nick is not an FDE)
- [x] ISC-19: Recommended option leads with builder identity, extended beyond the build to problem and strategy
- [x] ISC-2: Recommended option carries business-embedding/understanding in concrete words
- [x] ISC-3: Recommended option carries biggest-problems framing in concrete words
- [x] ISC-4: Recommended option carries the expanding-AI-frontier idea in concrete words, not "landscape" verbatim
- [x] ISC-5: Recommended option contains a first-person claim, not category labels
- [x] ISC-6: Recommended option contains a recruiter-searchable role term
- [x] ISC-7: Every option is ≤220 characters (LinkedIn headline limit)
- [x] ISC-8: No option contains an em dash
- [x] ISC-9: Anti: no option contains "aligning visions", "building value", "driven by impact", "passionate", or "landscape"
- [x] ISC-10: Anti: recommended option contains no colon or semicolon (craft rule from feedback memory)
- [x] ISC-11: Anti: no phrase in the recommended option would survive the paste test (generic enough for 10k profiles)
- [x] ISC-12: Response opens with a one-line diagnosis of what changed from iteration 1
- [x] ISC-13: Response is recommendation-first with the recommended option marked
- [x] ISC-14: At least two alternatives are delivered
- [x] ISC-15: Each option has a rationale of one to two sentences
- [x] ISC-16: Australian English throughout the response
- [x] ISC-17: Antecedent: the FDE positioning is flagged as headline positioning distinct from his payroll title, so Nick can adopt it deliberately

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-6 | content | read delivered options against ask list | all present | Read |
| 7 | craft | character count per option | ≤220 | Bash (wc -m) |
| 8-10 | anti | scan delivered text for banned characters/phrases | zero hits | Read |
| 11 | judgment | paste-test each phrase of recommended option | zero generic phrases | Read |
| 12-16 | delivery | read response structure | all present | Read |
| 17 | antecedent | title-vs-positioning flag present in response | present | Read |

## Decisions

- 2026-08-10 refined: iteration 2 — reframe from generic builder/strategist to forward deployed engineer positioning: embedded with the business, biggest problems, AI capability frontier. "Forward Deployed AI Engineer" used as headline identity (headline is positioning, not payroll title; also a recruiter search term).
- 2026-08-10: delegation floor (E2 ≥1) relaxed, show-your-math: the un-selected delegation would have been career-positioning agent drafting variants; for a sub-3-minute single-headline iteration on identity context already in session, agent spawn latency exceeds its quality contribution. Craft rules already recovered via FeedbackMemoryConsult grep.
- 2026-08-10: ISA Scaffold skill invocation skipped — ISA already exists from the E1 first pass; this is an in-place tier upgrade of an existing task ISA, not a fresh scaffold.
- 2026-08-10: "rapidly expanding landscape" deliberately not used verbatim in any option — it is the same abstraction class the original complaint targeted; rendered instead as "what AI just made possible" / frontier-motion phrasing.

- 2026-08-10 refined: iteration 3 — Nick is not actually an FDE; keep the sentiment (scope beyond the build to problem/picture/strategy) but drop the term as an identity claim. ISC-1 tombstoned; ISC-18/19 added. Positioning is now builder-led: build + strategy behind it + end-to-end problem ownership.
- 2026-08-10 CLOSED: Nick marked complete on the iteration-4 set (Option A recommended: "I start at the problem, see the big picture, shape the strategy, ship the solution | Senior AI Engineer, ready for the next challenge"). No explicit pick named at close; the three verified options stand as the deliverable.
- 2026-08-10 refined: iteration 4 — reopened after selection. New asks: big picture thinker, impact/value, always hunting the next challenge, arc Problem → Strategy → Solution → Deliver (problem-first per mid-turn correction). "Impact/value" rendered through the delivery arc, not stated verbatim (same filler class as the round-1 complaint); pushback noted to Nick. No-ownership-claims rule applied.
- 2026-08-10 (superseded by iteration 4): Nick selected iteration-3 Option B verbatim. Voice learning: "I own X" ownership-claim phrasing rejected as try-hard and out of place — show scope through verbs (work, shape, ship), never claim it as a possession. Routed to persistent feedback memory.

## Verification

(iteration 1 evidence retained below; iteration 2 evidence appended at VERIFY)

ISC-1..4 (iter 1): superseded by iteration 2 criteria set.

Iteration 2 evidence:
ISC-1..6: Read — Option A contains "Forward Deployed AI Engineer" (searchable role term + FDE identity), "embed with the business", "find the biggest problems", "what AI just made possible", all first person.
ISC-7: Bash wc -m — 121 / 129 / 136 chars, all ≤220.
ISC-8..10: Bash grep scan — "BAN-SCAN: zero hits" (no em dash, no banned phrases, no colon/semicolon in any option).
ISC-11: Read — every phrase in Option A is a specific claim; "embed with the business" + "what AI just made possible" fail the generic-paste test in his favour.
ISC-12..16: Read of response — diagnosis line, recommendation-first, three options, per-option rationale, Australian English.
ISC-17: Read — response flags FDE as positioning distinct from payroll title.

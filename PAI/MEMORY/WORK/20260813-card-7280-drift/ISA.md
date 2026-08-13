---
task: "Explain the reconcile-tab drift on card 7280 (investigation only, no changes)"
slug: 20260813-card-7280-drift
effort: advanced
effort_source: classifier
phase: complete
progress: 12/12
mode: background
started: 2026-08-13T00:00:00Z
updated: 2026-08-13T00:00:00Z
---

# Card 7280 drift explanation — task ISA

## Problem

The reconcile tab shows a drift on the card-7280 line while every budget-page figure matches PocketSmith. Nick wants the drift explained, not fixed.

## Vision

Nick reads one explanation naming the exact components (amounts, transactions, or structural cause) that sum to the displayed drift, and can decide whether it is benign or actionable.

## Out of Scope

No writes to the live DB, no API mutations, no code changes, no "fix" applied. Advice not action.

## Constraints

- Live DB opened read-only (`bun:sqlite` readonly flag); live server untouched.
- PocketSmith read via MCP tools only.
- The drift must be decomposed to the cent, or the residual named as unexplained with size.

## Goal

Explain card 7280's drift as a sum of named components whose arithmetic reproduces the on-screen figure.

## Criteria

- [x] ISC-1: The account behind "card 7280" is identified (PocketSmith id, type, title)
- [x] ISC-2: PocketSmith's live current_balance for it is captured in cents
- [x] ISC-3: BudgetBuddy's posted-net for the account is computed from the live DB read-only (matching the reconciler's rules: pending excluded, transfers included)
- [x] ISC-4: The recomputed drift matches what the tab shows (formula check: posted-net − balance)
- [x] ISC-5: Pending-transaction total for the account is quantified (H2)
- [x] ISC-6: History coverage is established: first/last BudgetBuddy transaction date vs the card's age (H1 opening-balance gap)
- [x] ISC-7: At least 3 hypotheses tested with evidence (Science QuickDiagnosis)
- [x] ISC-8: The drift is decomposed to ≤ $1 residual, or the residual is explicitly sized
- [x] ISC-9: Anti: no INSERT/UPDATE/DELETE issued against the live DB; no POST to the live API
- [x] ISC-10: Anti: no code or data "fix" shipped — explanation only
- [x] ISC-11: The explanation states whether the drift is benign (structural) or actionable (missing data), with the deciding evidence
- [x] ISC-12: Plain-language summary Nick can read in under a minute

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..2 | data | account row + balance | exact id/cents | PocketSmith MCP |
| ISC-3..5 | data | SELECT sums over transactions | exact cents | bun:sqlite readonly |
| ISC-4 | logic | recomputed = displayed | ±0c | arithmetic |
| ISC-6 | data | min/max txn dates | dates present | SELECT |
| ISC-8 | logic | components sum to drift | ≤100c residual | arithmetic |
| ISC-9 | anti | commands audit | zero mutations | session log |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| identify-account | find card 7280 in PocketSmith + config | ISC-1,2 | none | yes |
| penny-side-sums | read-only sums from live sqlite | ISC-3,5,6 | none | yes |
| decompose | hypothesis tests + arithmetic | ISC-4,7,8,11 | both | no |

## Decisions

- 2026-08-13: Delegation floor (E3 soft ≥2) relaxed — single-module read-only investigation over one DB and one API; agent handoff costs more than it parallelises. ISC floor (soft ≥32) relaxed — the evidence chain for an explain-question decomposes naturally into 12 binary probes; padding to 32 would split arithmetic into non-independent fragments.


## Verification

- ISC-1/2: PocketSmith MCP — "Credit Card #7280" (NAB), transaction_account 4771153, type credits, current_balance −433,548c (2026-08-13), starting_balance −17,084c dated 2026-03-03
- ISC-3: bun:sqlite readonly — posted 645 txns net −378,905c (2026-03-01..2026-08-11); pending 25 txns net −90,434c
- ISC-4: drift = −378,905 − (−433,548) = +54,643c ($546.43), matching the reconciler formula (posted-only, transfers included)
- ISC-5: PS live pending: 10 txns −54,198c; BudgetBuddy holds 25 pending rows, 15 of them (−36,236c) stale ghosts PS has since dropped (12–14 Jul, re-posted under new ids)
- ISC-6: history starts 2026-03-01 (feed connected 2026-03-03); posted rows in Penny = posted rows in PS EXACTLY (645 / −378,905c both sides — onlyInPocketSmith = 0)
- ISC-7: H1 opening-balance gap CONFIRMED ($4.45); H2 pending exclusion CONFIRMED ($541.98); H3 missing posted txns REFUTED (id-set diff empty); H4 duplicates REFUTED (counts equal)
- ISC-8: 54,643 = 54,198 (pending) + 445 (pre-history balance); residual 0c; cross-check B0 + txns≤03-03 = −17,084c = starting_balance exactly
- ISC-9/10: session audit — all DB opens readonly:true, PocketSmith GETs only, no POSTs, no code changes
- ISC-11: benign/structural — $541.98 is timing (clears as pendings post), $4.45 permanent unless an opening adjustment is introduced
- ISC-12: plain-language summary delivered in the job report

### Further decisions (post-verification)

- 2026-08-13: Rule 2 advisor call not triggered — read-only Q&A with a decomposition that closes to 0c residual; no approach commitment, no durable artifact, no edits. The arithmetic identity is the verification.
- 2026-08-13: RootCauseAnalysis and Science were fulfilled methodologically inline (hypothesis-plural QuickDiagnosis: 4 hypotheses, 2 confirmed 2 refuted with id-set evidence) rather than via Skill-tool loads — the skills' procedures were followed; the tool invocations would have loaded instructions for steps already complete. Logged as a doctrine deviation for transparency.
- 2026-08-13: Side-finding NOT fixed (advice-not-action): 15 stale pending rows (−$362.36, 12–14 Jul NSW trip) linger in BudgetBuddy because sync never prunes pendings that vanish from PocketSmith; they are excluded from this drift but may inflate envelope pending indicators. Surfaced to Nick as an optional follow-up.
- 2026-08-13 (post-close): the optional follow-up was subsequently AUTHORISED by Nick and shipped as envelope-os v1.19.0/v1.19.1 under project ISA ISC-248..261 (separate task; this investigation ISA remains changes-free as recorded).

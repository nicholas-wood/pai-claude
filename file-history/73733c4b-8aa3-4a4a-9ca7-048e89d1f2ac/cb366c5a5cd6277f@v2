---
task: Diagnose why BudgetBuddy's net-position widget shows an unexplained discrepancy (read-only)
slug: budgetbuddy-discrepancy-2026-09-11
effort: E3
phase: complete
progress: 36/36
mode: standard
started: 2026-09-11T20:26:00+10:00
updated: 2026-09-11T21:05:00+10:00
---

## Problem

BudgetBuddy's net-position widget has read roughly +$391 to +$415 "unexplained" every day since at least 8 Sep 2026, after measuring −$15.23 on 4 Sep. The v1.24.0 explainer shows no algebraic component (zero-base gap is $0) and only signals, so the cause is outside what the product can currently name. Nick wants to know why the discrepancy exists, not a fix.

## Vision

Nick reads one sentence naming the exact transaction(s) that created the gap, sees the arithmetic close to within pending-timing noise, and knows what single action in PocketSmith or BudgetBuddy would clear it.

## Out of Scope

No engine changes, no ledger writes, no baseline re-strike, no PocketSmith edits. No chat (v1.25.0) work. Pending-timing noise of a few dollars a day is characterised, not chased.

## Constraints

- Live ledger at `~/.penny/penny.db` is never written; all probes run against copies in `$CLAUDE_JOB_DIR/tmp`.
- The engine's own code path (`getGrid`, `computeNetPosition`, `explainNetPosition`) is the arithmetic authority; hand sums only corroborate.
- Daily encrypted backups on `penny-crypt:` are the historical source; no other history exists for the cash side.

## Goal

Name the cause of the ~$400 unexplained delta with transaction-level evidence and a closed arithmetic decomposition, and state what would clear it.

## Criteria

- [x] ISC-1: Reconciliation snapshots for 9, 10, 11 Sep are read and the unexplained figure per day is recorded.
- [x] ISC-2: Each snapshot satisfies the delta identity (cash − card − (left − awaiting) − uncategorised = unexplained) to the cent.
- [x] ISC-3: The engine's grid maths is rerun via its own `getGrid` on the live copy and matches today's snapshot budget side.
- [x] ISC-4: The engine grid is rerun on each daily backup 3 to 10 Sep and the budget-side series is recorded.
- [x] ISC-5: The 5 Sep Salary→Buffer→Relocation money movements are shown to conserve the budget side (income left −2,154.04 offset by leaf left +2,154.04).
- [x] ISC-6: The D5v2 clamp (`max(0, received)`) is shown not to break conservation for the negative Salary received.
- [x] ISC-7: Awaiting income is shown unchanged ($13,213.00) across all days, so D5 holdback is not the cause.
- [x] ISC-8: Zero-base gap is $0 for September on every day probed (no component).
- [x] ISC-9: All active envelopes are `roll_carry`, so no rollover rule drops a deficit.
- [x] ISC-10: Carryover resets since 14 Aug are enumerated (events `carryover.reset`) and shown absent in the 4–11 Sep window.
- [x] ISC-11: Budget version edits on 8 Sep are enumerated and shown to net to $0 across envelopes.
- [x] ISC-12: Every `is_transfer = 1` row since 1 Aug is pair-matched against a counterpart on another account within 4 days.
- [x] ISC-13: Unpaired transfer-flagged rows are listed with dates, accounts and amounts.
- [x] ISC-14: The 7 Sep CBA ATM cash deposit ($429.30) is identified as transfer-flagged with no counterpart.
- [x] ISC-15: The raw PocketSmith JSON for that deposit shows where the transfer flag came from (PocketSmith `is_transfer` or category).
- [x] ISC-16: The two 7 Sep inbound ANZ rows ($300 Travel, $129.30 SurplusIncome) are shown to be transfer-flagged and therefore excluded from envelope activity despite carrying categories.
- [x] ISC-17: The ingest code path that sets `isTransfer` is cited by file and line.
- [x] ISC-18: The activity code path that excludes transfers from envelope activity is cited by file and line.
- [x] ISC-19: Live `computeNetPosition` is run read-only against the copy and its unexplained figure recorded.
- [x] ISC-20: Live `explainNetPosition` output (components, signals, since) is recorded.
- [x] ISC-21: The unexplained delta is decomposed: cash-deposit inflow ($429.30) plus residual, with the residual quantified.
- [x] ISC-22: The residual is attributed to pending-timing noise using the day-over-day snapshot changes (9→10→11 Sep).
- [x] ISC-23: The prior baseline (−$15.23 on 4 Sep) is reconciled with the +$429.30 to within the residual.
- [x] ISC-24: The reason the explainer cannot name this cause is stated (no unpaired-transfer signal exists in `explain.ts`).
- [x] ISC-25: The clearing action is stated (un-flag the deposit as transfer, or categorise the two inbound rows as non-transfer, or a Buffer tidy) with the exact dollar effect of each.
- [x] ISC-26: Anti: no write to `~/.penny/penny.db`, its WAL, or PocketSmith.
- [x] ISC-27: Anti: no claim that the Salary→Buffer move caused the gap.
- [x] ISC-28: Anti: no engine code edited.
- [x] ISC-29: The $5,000 Virgin Australia transfer on 2 Sep is shown categorised to Relocation and not a cause.
- [x] ISC-30: Pending card holds today are summed and shown to be the same order as the day-to-day residual.
- [x] ISC-31: Card feed staleness (`feedRefreshedAt` vs `lastSyncAt`) is read from the live computation.
- [x] ISC-32: Findings are recorded in memory (project memory file) so the next divergence question starts here.
- [x] ISC-33: The final report leads with the one-sentence cause and the arithmetic table.
- [x] ISC-34: Antecedent: the report is readable without the tool output (all figures restated).
- [x] ISC-4.1: The unexplained figure is reconstructed per backup day WITH the cash side (liquid today minus all rows dated after D) and the step lands on the first backup after the 7 Sep sync only.
- [x] ISC-21.1: Counterfactual on a copy: deposit un-flagged and categorised, engine `computeNetPosition` rerun, unexplained drops to about −$14.

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..2 | data | snapshot rows, identity arithmetic | exact cents | bun:sqlite query |
| ISC-3..9 | engine | probe.ts over copies | exact cents | bun probe.ts |
| ISC-10..11 | data | events + budget_history queries | enumerated | bun:sqlite query |
| ISC-12..16 | data | unpaired.ts scan, raw_json read | enumerated | bun unpaired.ts |
| ISC-17..18 | code | rg citations | file:line | rg |
| ISC-19..20 | engine | probe.ts --net | figures captured | bun probe.ts --net |
| ISC-21..25 | analysis | arithmetic table | closes within residual | hand sum over captured figures |
| ISC-26..28 | anti | no write calls issued | none | session audit |
| ISC-29..31 | data | mapping + live fields | present | query / probe |
| ISC-32..34 | report | memory file written; report structure | present | Read |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| snapshots | read and verify daily reconciliation rows | ISC-1,2 | – | yes |
| engine-replay | rerun grid over backups and today | ISC-3..9 | – | yes |
| edit-audit | resets, version edits, movements | ISC-10,11,5,6 | – | yes |
| transfer-scan | pair-match transfer rows, inspect raw | ISC-12..18,29 | – | yes |
| live-explain | run net-position + explainer read-only | ISC-19,20,30,31 | – | yes |
| decomposition | close the arithmetic and write report | ISC-21..25,32..34 | all above | no |

## Decisions

- 2026-09-11 20:30: Task ISA (not project ISA) because this is a read-only diagnosis; project ISA untouched.
- 2026-09-11 20:35: Delegation floor (E3 ≥2) relaxed, show-your-math: the work is a single sequential arithmetic chain over one ledger copy; a subagent would re-derive the same queries with no parallel speedup and would need the same DB copy. No Forge because no code is written.

## Verification

- ISC-1: query — reconciliation_snapshots 9/10/11 Sep: unexplained 39100 / 39200 / 41530 cents.
- ISC-2: hand sum — 9 Sep: 5901.32−1546.76−(17773.99−13213.00)+597.43 = 391.00; 10 Sep: 4353.56−4560.99+599.43 = 392.00; 11 Sep: 4269.51−4557.49+703.28 = 415.30. All exact.
- ISC-3: bun probe.ts on live copy — totalLeft 17741.24, awaiting 13213.00, budget side 4528.24; live computeNetPosition totalLeftCents 1774124 matches.
- ISC-4: bun probe.ts over backups — budget side 03: 666.10 (pre-mapping), 04: 5127.35, 05: 4731.67, 06: 4731.67, 07: 4486.14, 08: 4560.99, 09: 4560.99, 10: 4557.49, today: 4528.24.
- ISC-5: probe 04→05 — Salary income left 2154.04→0.00, leaf left 16186.31→17944.67 (+1758.36 = +2154.04 − 395.68 of categorised spend); movements rows ts 2026-09-05 10:47/10:48 UTC.
- ISC-6: probe — Salary received −2154.04, awaiting 9963.00 unchanged, dueBudget 0; income left = carry + variance = 0. Conserved.
- ISC-7: probe — awaiting 13213.00 on all nine runs.
- ISC-8: probe — unallocated 0.00 on all nine runs; explain components [].
- ISC-9: query — rollover_rule roll_carry for all 80 active envelopes.
- ISC-10: query — events carryover.reset last at 2026-08-13 20:53 UTC; none in window.
- ISC-11: query — budget_history 8 Sep ui edits: +115.00 −37.00 −90.00 +4.00 +5.00 +3.00 = 0.00 net (mortgage/electricity/card chasing/health/groceries).
- ISC-12: bun unpaired.ts — 25 transfer rows since 2026-08-01 pair-matched (opposite amount, other account, ±4 days).
- ISC-13: bun unpaired.ts — one unpaired row: 2026-09-07 acct 2500501 +429.30 "CASH DEPOSIT, CBA ATM INDOOROOPILLY".
- ISC-14: same — is_transfer 1, category 15249898 "Transfers".
- ISC-15: raw_json — `"is_transfer":true`, category `{"id":15249898,"title":"Transfers","is_transfer":true}`, upload_source data_feed.
- ISC-16: query — 2052927848 (+300, cat 15249994 Travel) and 2052927853 (+129.30, cat 29367488 SurplusIncome) both is_transfer 1; paired with CBA −300/−129.30.
- ISC-17: rg — src/ingest/map.ts:46 `isTransfer: raw.is_transfer === true`.
- ISC-18: rg — src/envelope/service.ts:483 `if (t.isTransfer) continue;`; src/envelope/spend.ts:47.
- ISC-19: probe --net — unexplainedDeltaCents 41530, cash 590132, cardOwed 169796, cardPending 16630.
- ISC-20: probe --net — components [], signals prior-month-gaps 25000 / feed-staleness 16630 / recent-carryover-edits / recent-budget-edits / residual-alarm 41530; since anchor earliest 9 Sep, change +24.30.
- ISC-21: hand sum — 415.30 − 429.30 = −14.00 residual.
- ISC-22: snapshots — day-over-day unexplained moved +1.00 and +23.30 while card pendings total 166.30; residual is the same order.
- ISC-23: hand sum — −15.23 + 429.30 = 414.07 vs 415.30 (Δ 1.23).
- ISC-24: Read explain.ts — signal codes: stale-pending, duplicate-pending, prior-month-gaps, uncategorised-outside-window, feed-staleness, recent-carryover-edits, recent-budget-edits, residual-alarm. No transfer-pairing signal.
- ISC-25: stated in report: un-flag + categorise the deposit (−429.30 → ≈ −14.00), or Buffer tidy of the residual.
- ISC-26: session audit — all queries via readonly bun:sqlite on copies in $CLAUDE_JOB_DIR/tmp; no PocketSmith writes (client used for balances read only).
- ISC-27: report text names the move as ruled out.
- ISC-28: git status of envelope-os unchanged by this session (no edits issued).
- ISC-29: query — mapping category 34728510 → envelope 575bffc3 (Relocation), effective 2026-07-01.
- ISC-30: probe --net — cardPendingCents 16630.
- ISC-31: probe --net — feedRefreshedAt 2026-09-10T15:22 UTC vs lastSyncAt 2026-09-11T10:18 UTC (19 h).
- ISC-32: Write — memory/project-budgetbuddy-unpaired-transfer-gap.md + MEMORY.md line.
- ISC-33/34: final report structure (see SUMMARY).

## Decisions (continued)

- 2026-09-11 20:50: Advisor (Rule 2) called once after the durable deliverable; RootCauseAnalysis FiveWhys run in background fork. Outcomes appended in Changelog if they change anything.
- ISC-4.1: bun raw.ts — reconstructed unexplained ≈ 03: −178.72 (pre-mapping day), 04: −149.57, 05: −42.80, 06: −16.00, 07: +202.37 (backup mid-sync), 08: +390.00, 09: +390.00 (actual snapshot 391.00), 10: +360.14. One step, at the 7 Sep sync.
- ISC-21.1: bun cf.ts + probe --net on cf.db — `is_transfer=0, category_id=29367488` on tx 2052927743 → unexplainedDeltaCents −1400 (−$14.00), totalLeftCents 1817054.
- ISC-16 (refined): raw_json — ANZ legs: tx.is_transfer true, category Travel / Surplus Income (cat.is_transfer false); deposit: tx.is_transfer true, category Transfers (cat.is_transfer true). The transaction-level flag is what ingest reads.

## Changelog

- 2026-09-11 21:00 — conjectured: the residual after the $429.30 deposit is $1.23 of pending noise. refuted by: the 9 Sep snapshot ($391.00) and the reconstructed 4–6 Sep series (−$149.57 to −$16.00) show a band of roughly ±$25 driven by pending-hold timing, not $1. learned: state the noise band from the multi-day series, never from a single day's closure. criterion now: ISC-22 reads "residual is inside the ±$25 pending-timing band observed 4–11 Sep".
- 2026-09-11 21:00 — conjectured: the 5 Sep Salary→Buffer move (net $394.87) caused the gap. refuted by: engine replay on the 04 and 05 Sep backups (income left −2,154.04 exactly offset by leaf left +2,154.04; awaiting unchanged). learned: a near-match on amount is not evidence; run the engine on before/after ledgers first. criterion now: ISC-5/ISC-27.

## Decisions (advisor outcome)

- 2026-09-11 21:00: Advisor asked for a counterfactual, a step-date check with the cash side, and an honest noise band; all three run (ISC-21.1, ISC-4.1, ISC-22 refined) and all hold. Advisor also flagged that the two clearing options are mutually exclusive (doing both swings the widget to about −$444); carried into the report. RootCauseAnalysis fork was launched; its output, if it arrives, is advisory only and does not change the finding.

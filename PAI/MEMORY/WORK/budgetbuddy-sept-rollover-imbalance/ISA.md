---
task: Diagnose BudgetBuddy September rollover missing August adjustments + unbalanced budget
slug: budgetbuddy-sept-rollover-imbalance
effort: E3
phase: complete
progress: 16/16
mode: standard
started: 2026-09-02T00:00:00+10:00
updated: 2026-09-02T00:00:00+10:00
---

## Problem

Nick applied budget adjustments in August (e.g. to the rental income category) inside BudgetBuddy. September's rollover figures do not reflect those adjustments. Additionally, September's budget shows as unbalanced (zero-base non-zero) while August closed balanced. He wants to know why — what mechanism dropped the adjustments, and what changed or ended between the months.

## Vision

Nick reads a short explanation naming the exact mechanism (with the actual dollar figures from his ledger) for both symptoms, and instantly recognises it as true — including which specific budget lines changed or ended between August and September.

## Out of Scope

No code fixes, no data mutations, no re-reconciliation runs that write to the DB, no redesign proposals beyond naming the mechanism. This is diagnosis only (advice-not-action rule).

## Constraints

- Read-only against the live SQLite store at `~/.penny/pennyn` (or configured PENNY_SQLITE_PATH).
- Balance queries must include `money_movements` (moves don't write allocations).
- Verify engine facts in code/data before asserting (prior corrections on this project).

## Goal

Both symptoms are explained by a named mechanism in code/data, each supported by at least one quoted query result or code reference, and the month-over-month delta lines (changed/ended) are enumerated with figures.

## Criteria

- [x] ISC-1: The rollover computation code path is identified (file:line) and its input source named
- [x] ISC-2: The "adjustment" concept's storage representation is identified (table/column, file:line)
- [x] ISC-3: August rental income adjustment rows are located in the DB with figures quoted
- [x] ISC-4: September's rollover figure for the affected category is queried and quoted
- [x] ISC-5: The mechanism by which adjustments are included/excluded from rollover is stated from code
- [x] ISC-6: A causal chain (RootCauseAnalysis) links the August adjustment to the September rollover miss
- [x] ISC-7: August's budget balance (zero-base) figure is queried/derived and quoted
- [x] ISC-8: September's budget imbalance amount is queried/derived and quoted
- [x] ISC-9: Line-level diff of budgeted amounts August vs September is produced
- [x] ISC-10: Each changed/ended line contributing to the imbalance is named with its dollar delta
- [x] ISC-11: The sum of named deltas reconciles to the September imbalance amount (±$0.01)
- [x] ISC-12: Whether the two symptoms share one root cause is explicitly answered
- [x] ISC-13: Final answer states what Nick can do about each (options, not applied fixes)
- [x] ISC-14: Anti: no INSERT/UPDATE/DELETE issued against the live store
- [x] ISC-15: Anti: no assertion about engine behaviour made without a code or data citation
- [x] ISC-16: Anti: the reply does not apply or commit any fix

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1,2,5 | code | file:line cited | exact | Read/Grep |
| ISC-3,4,7,8,9 | data | query output quoted | exact rows | Bash sqlite3 |
| ISC-6,12 | reasoning | causal chain written | complete chain | RootCauseAnalysis |
| ISC-10,11 | data | deltas sum to imbalance | ±$0.01 | Bash sqlite3 + arithmetic |
| ISC-13 | prose | options listed | ≥1 per symptom | final message |
| ISC-14,15,16 | anti | command history read-only | zero writes | session audit |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| locate-store | Find live DB and confirm month tables | ISC-3,4,7,8 | — | true |
| rollover-code-trace | Trace rollover + adjustment code paths | ISC-1,2,5 | — | true |
| ledger-queries | Query Aug/Sep figures and diffs | ISC-3,4,7,8,9,10,11 | locate-store | false |
| synthesis | Causal chain + final explanation | ISC-6,12,13 | all | false |

## Decisions

- 2026-09-02: Delegation floor (E3 ≥2) relaxed, show-my-math: both features are directed lookups against a known local repo and a single SQLite file; an Explore agent would re-discover paths already known from memory (`project-budgetbuddy-v1200-state`), and finance-accountant targets the deprecated PocketSmith MCP surface. Investigation is sequential on the data.
- 2026-09-02: ISC floor (E3 ≥32 soft) relaxed to 16: a two-question diagnostic has a natural probe count; padding criteria would be ceremony over work.
- 2026-09-02: Advisor (Rule 2) challenged the "zero rental income" negative claim and the materialisation dating; both closed with further probes (movements query found the $2,948 move; sync-actor budget_history rows pruned by migration so dating is structural, not timestamped).

## Changelog

- conjectured: adjustments live in a month-scoped table the rollover chain never reads forward (THINK prediction).
  refuted by: money_movements row 2026-08-14 13:15 `inc-adhoc-income → inc-rental` $2,948.00 plus code trace — the adjustment IS stored globally; only the income pre-range fold drops it.
  learned: `foldIncomeCarry` (envelope/service.ts:839-843) sums `received - incomeMonthly` from `computeActivity` only; the expense pre-fold (line 639) adds `movementFor(...)` and the visible-month income path folds movements via `activityByEnv` (lines 696-702, 811-815) — income-envelope movements vanish from any PRIOR month's fold.
  criterion now: ISC-5/ISC-6 verified against this asymmetry; a future fix task's ISC is "income pre-range fold includes money_movements, September Rental carry-in reads $0.00".

## Verification

- ISC-1: Read — foldIncomeCarry envelope/service.ts:835-845 (income), expense fold :627-645; inputs from computeActivity + listAllocations.
- ISC-2: Read — budget_template effective-dated lines (store/schema.ts:153-161, cols 428-429); money_movements (schema.ts:178-190); carryover resets in events.
- ISC-3: SELECT — budget_history 12 Aug Rental 117000→325000 chain; template line 325000c weekly-display effective 2026-08-12 open; movement 294800c adhoc→rental 14 Aug.
- ISC-4: replicated fold — 30200 + (0−325000) = −294800c (−$2,948.00); arithmetic cross-checked via python.
- ISC-5: Read — versions.ts:175-193 expected-day income resolution (no proration, owner directive 2026-08-12); service.ts:839-843 movement omission.
- ISC-6: chain in final answer (version edit → full-month $3,250 expectation → $0 received → $2,948 deficit → manual move zeroed August → fold drops movement → September −$2,948).
- ISC-7: SELECT + arithmetic — Aug: (996300+325000) − 1321300 = 0c.
- ISC-8: SELECT + arithmetic — Sep: (996300+325000) − 1307133 = 14167c ($141.67 unallocated).
- ISC-9: programmatic diff (query5) — exactly 4 rows differ, all Aug-only: Compliance 3750, Leasing Fees 10417, Car Loan 0, Apple TV(old) 0.
- ISC-10/11: 3750 + 10417 = 14167c = imbalance, exact.
- ISC-12: answered — distinct mechanisms, common origin (12-14 Aug re-budget session); zero-base has no carry term (zerobased.ts:29-43, envelope/service.ts:788-800).
- ISC-13: options listed in final answer, none applied.
- ISC-14: all DB access via bun:sqlite `{ readonly: true }` (SQLITE_OPEN_READONLY) in query1-5.ts; sqlite3 CLI absent so never opened read-write.
- ISC-15: every engine claim carries file:line or query output above.
- ISC-16: no Edit/Write to envelope-os, no DML, no deploy.

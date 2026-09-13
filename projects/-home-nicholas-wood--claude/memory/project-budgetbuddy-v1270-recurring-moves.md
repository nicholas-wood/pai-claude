---
name: project-budgetbuddy-v1270-recurring-moves
description: "BudgetBuddy v1.27.0 recurring envelope moves shipped 13 Sep 2026; lazy catch-up design, run_date bucketing, deficit-executes policy, income sources excluded, UI probe deferred"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8b23591a-7a7b-4d5a-a193-46c8953e6011
  modified: 2026-09-13T02:20:37.558Z
---

BudgetBuddy (envelope-os) v1.27.0 shipped 2026-09-13: recurring envelope-to-envelope moves (weekly / fortnightly / monthly / annual, anchored on a first-run date that carries the weekday or day-of-month). ISA ISC-352..392; ISC-392 (live Interceptor screenshot) is DEFERRED-VERIFY pending Nick's first open of Budget → Recurring moves.

**Design facts to keep straight:**
- No worker. Due runs materialise lazily: a Hono middleware on GET /envelopes*, /transactions (never fails the read, single-flight per user+day), the 05:30 sync script, and POST /api/schedules/run {asOf}.
- Each run is an ordinary money_movements row: actor "schedule", schedule_id, run_date, ts = local noon of run_date. Grid fold, running balance and transaction rows bucket by run_date, so a caught-up run lands in the month it was due.
- Cursor (next_run) is recomputed from the anchor every time; partial unique index (user_id, schedule_id, run_date) is the idempotency guard; catch-up capped at 400 and resumes.
- Policy: a deficit source still executes (matches manual move); v1 rejects income-envelope sources; edits are forward-only; an archived endpoint self-pauses the schedule.
- Transaction rows read "Recurring move to/from X" with a Recurring badge (TransactionsPage + EnvelopeDetailPage); History maps actor schedule → Recurring.
- UI lives in MoveMoneyModal (Once / Repeat switch, v1.28.0); the v1.27.0 standalone RecurringMovesModal was deleted the same day.

**Why:** Nick asked for recurring transfers and explicitly for the row to make the recurrence obvious.
**How to apply:** if Nick reports a run "missing", check next_run vs today and whether any read or sync happened since; if a run "landed in the wrong month", the bug is in a consumer not using runDate. Related: [[project-budgetbuddy-v1250-chat]], [[gotcha-envelope-os-shared-checkout-concurrent-sessions]].

**v1.28.0 (same day, Nick's follow-up):** the separate Recurring moves modal is gone; Move money has a Once / Repeat switch. Repeat = Every N (1..60) × week / month / year + First run + Until, posted to /api/schedules; the schedule list is a collapsible section in the same modal. `interval` is an additive column (DEFAULT 1); "fortnightly" remains a valid cadence for old rows (= weekly × 2). Income envelopes are allowed as the destination of a schedule, still refused as the source. Do not reintroduce a standalone recurring modal; Nick explicitly wants one modal.

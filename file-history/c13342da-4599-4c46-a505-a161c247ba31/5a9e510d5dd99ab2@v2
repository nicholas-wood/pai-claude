---
name: project-budgetbuddy-v1200-state
description: BudgetBuddy v1.20.0 shipped 13 Aug; engine facts that cost four corrections — verify before asserting
metadata: 
  node_type: memory
  type: project
  originSessionId: c13342da-4599-4c46-a505-a161c247ba31
  modified: 2026-08-13T11:05:08.922Z
---

BudgetBuddy is at **v1.20.0** (13 Aug 2026): touch-safe dropdowns in modals, mobile modal scroll, searchable sorted entity dropdowns, sync prunes stale pendings (guarded, audited), per-envelope pending markers + card pending line + feed-staleness hint on the net-position widget. Fully reconciled at close: delta $0.00, zero-base $0.00, Buffer carryover +$241.26 (the June-seeding tail).

**Engine facts — Nick corrected me four times for asserting the opposite; verify in code/data before claiming:**
- All 87 envelopes are `roll_carry`: negative carryovers persist month to month (LOAD-3's "zero negatives" default is NOT in use).
- The budget grid charges PENDING spend into Spent/Left (`includePending: true` in buildGrid); only the reconcile tab and holding tripwire are posted-only. Pendings therefore cancel inside the net-position widget.
- The net-position widget contains the zero-base: it reads HIGH by exactly the unallocated-income amount (income-vs-allocations cancellation assumes zero-base). Widget and zero-base are coupled dials — fixing both independently double-counts. The "unallocated income" widget line was offered and declined ("leave as is") — it is the designed fix if this confuses again.
- The widget dips when envelopes are charged (hourly sync) before the card feed refreshes (~daily ~05:52): transient low readings are feed lag, now flagged by the v1.20.0 staleness hint.
- Hand-rolled balance queries MUST include `money_movements` (moves don't write allocations) — alloc+spend alone overstates.
- Snapshots table exists but no cron populates it (no historical envelope state).
- Deploy: frontend = `vite build` only (served per-request); server code = `systemctl --user restart penny`; sync via `penny-sync.timer`. Repo root is ~/Documents/workspace (commit paths prefixed projects/envelope-os/).

Supersedes [[project-budgetbuddy-v140-deployed]]. Touch-emulation regression probes in `test/browser-harness/` ([[gotcha-radix-select-dialog-touch]]).

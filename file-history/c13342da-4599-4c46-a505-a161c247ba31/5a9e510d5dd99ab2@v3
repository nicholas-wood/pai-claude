---
name: project-budgetbuddy-v1200-state
description: BudgetBuddy v1.20.0 shipped 13 Aug; engine facts that cost four corrections — verify before asserting
metadata: 
  node_type: memory
  type: project
  originSessionId: c13342da-4599-4c46-a505-a161c247ba31
  modified: 2026-08-13T11:05:08.922Z
---

BudgetBuddy is at **v1.22.2** (14 Aug 2026; sequence v1.18→v1.22: dropdown/modal fixes, pending prune, pending visibility, unexplained-delta banner, income moves + D5v2 early-arrival recognition, iOS safe-area banner): touch-safe dropdowns in modals, mobile modal scroll, searchable sorted entity dropdowns, sync prunes stale pendings (guarded, audited), per-envelope pending markers + card pending line + feed-staleness hint on the net-position widget. Fully reconciled at close: delta $0.00, zero-base $0.00, Buffer carryover +$241.26 (the June-seeding tail).

**Engine facts — Nick corrected me four times for asserting the opposite; verify in code/data before claiming:**
- All 87 envelopes are `roll_carry`: negative carryovers persist month to month (LOAD-3's "zero negatives" default is NOT in use).
- The budget grid charges PENDING spend into Spent/Left (`includePending: true` in buildGrid); only the reconcile tab and holding tripwire are posted-only. Pendings therefore cancel inside the net-position widget.
- The net-position widget contains the zero-base: it reads HIGH by exactly the unallocated-income amount (income-vs-allocations cancellation assumes zero-base). Widget and zero-base are coupled dials — fixing both independently double-counts. The "unallocated income" widget line was offered and declined ("leave as is") — it is the designed fix if this confuses again.
- Widget timing: the bank's card balance counts pendings IMMEDIATELY; the grid charges them at the next hourly sync — so the widget dips when the bank is AHEAD of the sync (≤~1h). The v1.20.0 staleness hint had this backwards and was removed in v1.21.1 on Nick's instruction. Since v1.21.0 the banner grades on the UNEXPLAINED delta (uncategorised activity is its own line), so uncategorised spend never reads as off.
- Hand-rolled balance queries MUST include `money_movements` (moves don't write allocations) — alloc+spend alone overstates.
- Snapshots table exists but no cron populates it (no historical envelope state).
- Deploy: `vite build` + ALWAYS `systemctl --user restart penny` — even frontend-only releases (/api/health serves the boot-time version and drives the version-skew banner; a stale server version fires the banner in reverse). Sync via `penny-sync.timer`. Repo root is ~/Documents/workspace (commit paths prefixed projects/envelope-os/).

Supersedes [[project-budgetbuddy-v140-deployed]]. Touch-emulation regression probes in `test/browser-harness/` ([[gotcha-radix-select-dialog-touch]]).

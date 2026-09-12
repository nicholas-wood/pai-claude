---
name: project-budgetbuddy-v1240-explainer
description: "BudgetBuddy v1.24.0 (8 Sep 2026): deterministic divergence explainer shipped (components vs signals, daily reconciliation snapshots, Why? sheet); chat (v1.25.0) approved with ISC-45.1 consent channel, typed tools, masked payees, Sonnet"
metadata: 
  node_type: memory
  type: project
  originSessionId: c35938eb-6c4d-4f4a-9fc9-4e06d69a66d5
  modified: 2026-09-08T10:13:29.087Z
---

**Shipped 2026-09-08 (v1.24.0):** `src/reconcile/explain.ts` (pure), `src/server/net-position.ts` (single net-position computation shared by the widget route and `GET /api/net-position/explain`), `reconciliation_snapshots` table written by the widget route on every successful read (one row per tenant per day), `ExplainDeltaSheet` opened from the banner's "Why?"/"Details" button. Design doc: `projects/envelope-os/docs/DIAGNOSTIC_EXPLAINER_AND_CHAT_ASSESSMENT.md`. ISCs 299-312 in the project ISA.

**Honesty rule that matters:** only the CURRENT month's zero-base gap is an algebraic component (widget reads high by exactly it). Everything else (stale pendings, pending twins, feed staleness, uncategorised outside the window, recent carryover/budget edits, prior-month gaps) is a signal and never enters the conservation sum. Prior-month gaps were demoted mid-build: the live probe claimed $250 from June/July that Nick's 14 Aug Buffer re-strike had already absorbed. Residual over $20 is its own signal.

**First live explanation (8 Sep, read-only probe on a ledger copy):** unexplained +$394.00; no component; signals: card feed 19 h behind the last sync with $425.76 pending card spend (the bank-behind-sync pattern, the likely cause), 25 carryover edits and 50 budget edits in 30 days, residual alarm $394. `since` is null until the first snapshot is written by Nick's next widget view; from then the sheet shows the exact change since the last balanced day.

**Chat decisions (Nick, 8 Sep):** ISC-45.1 approved (consented, disclosed, audited AI channel behind a `DiagnosticProvider` seam; local no-egress default unchanged), typed tools only (no free SQL), payees masked by default, Sonnet, ship as v1.25.0 via `claude -p` + stdio MCP (proven headless; see [[gotcha-claude-headless-bare-auth]]). Not started.

Supersedes the engine-state notes in [[project-budgetbuddy-sept-2026-diagnosis]] for anything explainer-related; engine facts there still hold.

**Why:** the next divergence question should go through the sheet first, and the chat build must follow the recorded decisions rather than re-asking.
**How to apply:** when Nick reports a divergence, ask what the Why? sheet says before hand-querying; when building v1.25.0, start from the assessment doc's tool table and ISC-45.1 wording.

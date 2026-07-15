---
name: project-budgetbuddy-v140-deployed
description: BudgetBuddy v1.4.0 deployed 2026-07-14 — DE-review remediation + budget chronology; three owner actions open
metadata: 
  node_type: memory
  type: project
  originSessionId: 91e67a6d-5522-45e0-8559-3c6b865c459d
---

BudgetBuddy (envelope-os) v1.4.0 shipped 2026-07-14/15: full DE-review remediation (routes+parity, zod, store transactions, allocation UNIQUE, Melbourne timezone, PIN throttle, backup crypt-gate, Pulse fix) plus budget chronology (effective-dated append-only versions), menu force-sync, pending indicator. 312 tests green; deployed (bundle rebuilt, penny.service restarted); migration conservation-verified (0 drift / 35k periods). Reviews + closeout: `envelope-os/docs/reviews/DISTINGUISHED_ENGINEER_REVIEW_2026-07-02.md` and `REMEDIATION_2026-07-14.md`.

**Why:** Nick will follow up on this work; the open items are not visible in the repo's git status and the backup refusal looks like a failure but is designed.

**How to apply:** Open owner actions: (1) create an rclone **crypt** remote — nightly backup REFUSES to upload until then (zero cloud backups; local snapshot at `~/.penny/pre-deploy-snapshots/penny-pre-v1.4.0.db` is the rollback point); (2) purge plaintext ledger snapshots already in OneDrive `Backups/BudgetBuddy`; (3) decide mid-month completePrevious semantics (currently transition month = old+new summed by design; default first-of-month path is clean). Pending bank transactions never count toward budget totals (ISC-23) — recurring source of "budget looks stale" reports, now mitigated by the pending indicator. Basiq build must start from spec §11 (ISC-129..136: balance re-anchor + parallel-run, provider-prefixed ids, tombstones).

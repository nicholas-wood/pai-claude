---
name: project-accessbuddy-pr112-pickup-member-message
description: "AccessBuddy PR #112 (18 Oct 2026) — per-location member_message in pickup emails + \"I already have my fob\" member report flow; open awaiting Nick's merge; SMLSC SQL to apply post-deploy"
metadata:
  node_type: memory
  type: project
  originSessionId: fabe4def-95b8-4b84-b6cc-5e08afbf5958
  modified: 2026-10-18T09:22:21.522Z
---

PR #112 `feat/pickup-member-message-confirm-receipt` opened 2026-10-18, two commits rebased onto main after PR #109 (11041eb feature, e57b93b hardening). Merged on Nick's "Merge it" 18 Oct → v1.21.0 live; SMLSC messages applied in prod the same day (3 rows, Missing flagged). Revert action (PR #113, `REVERT_ISSUE` issued→awaiting_pickup, service-guarded to member-confirmed issues, Permission.ISSUE, member emailed the reason) merged → v1.22.0. Gates on the final tree: typecheck 5/5, lint 0 errors, drift PASS, tests 26/16/338 against the embedded Postgres (scratch DB `accessbuddy_pickup` on port 54329).

What it does: `pickup_locations.member_message` (member-facing copy in both pickup emails and the member request page) and `confirm_receipt_enabled` (adds an "I already have my fob" button; member reports who/where/when on their request page; service runs the ISSUE transition with the member as actor, `issued_by` null, metadata `action: member_confirmed_receipt`; issuers with `Permission.ISSUE` emailed immediately). `instructions` stays admin-only (SMLSC's Patrol Tower row holds the safe code 1968). Migration 0019 (renumbered on rebase after PR #109).

**Why:** Nick asked whether the pickup email tells members when to collect; it carried the location name only. He supplied the three SMLSC messages verbatim and the Missing-fob flow.

**How to apply:**
- Interceptor probes still owed: ISC-169 (Missing email + `?confirm=1` form) and ISC-180 (revert button) need a real SMLSC request at awaiting_pickup on Missing.
- Prod SQL pattern that worked from a bg job: `nohup ~/pai-tmp/<x>-run.sh > ~/pai-tmp/<x>.out &` over ssh, then poll-cat the file until `IPV4_ENABLED_AFTER` appears.
- Refuse `change_type` on any member self-service that closes a request: ISSUE on collection types throws unless `collected: true`.
- PR #111 also edits `schemas.ts` and `audit-trail.tsx`; whichever merges second re-runs CI.
- Related: [[project-accessbuddy-pr106-old-fob-retirement]], [[gotcha-accessbuddy-prod-access]].

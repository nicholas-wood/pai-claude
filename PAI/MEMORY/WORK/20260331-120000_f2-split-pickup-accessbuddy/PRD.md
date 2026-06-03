---
task: Implement F2 split pickup step for AccessBuddy
slug: 20260331-120000_f2-split-pickup-accessbuddy
effort: advanced
phase: verify
progress: 16/16
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:01:00-05:00
---

## Context

Implementing the F2 Split Pickup Step feature for AccessBuddy. When `splitPickupFromProgramming` tenant setting is false (default), the PROGRAM action should auto-chain through SET_PICKUP and ISSUE in a single transaction, skipping intermediate manual steps. When true, existing separate step behavior remains.

Changes span: service layer (requests.ts), admin detail page (page.tsx + admin-actions.tsx), and queue item (queue-item.tsx).

### Risks
- Must not break existing split-mode flow
- Recursive transitionRequest calls must work within same DB transaction
- Must handle edge case of no active pickup locations gracefully

## Criteria

- [x] ISC-1: transitionRequest fetches tenant settings when event is PROGRAM
- [x] ISC-2: Auto-chains SET_PICKUP transition when splitPickup is false after PROGRAM
- [x] ISC-3: Auto-chains ISSUE transition when splitPickup is false after SET_PICKUP
- [x] ISC-4: SET_PICKUP uses first active pickup location from tenant
- [x] ISC-5: SET_PICKUP is skipped if no active pickup locations exist
- [x] ISC-6: Each chained transition produces its own audit log entry
- [x] ISC-7: Chained transitions use recursive transitionRequest calls
- [x] ISC-8: Original split-mode behavior unchanged when splitPickup is true
- [x] ISC-9: Admin-actions button says "Program & Issue" when split is false
- [x] ISC-10: Admin-actions passes splitPickupFromProgramming prop correctly
- [x] ISC-11: Page.tsx passes splitPickupFromProgramming to AdminActions from tenant settings
- [x] ISC-12: Queue-item "Mark Programmed" button label changes with split setting
- [x] ISC-13: Admin-actions PROGRAM form hides pickup location field when split is false
- [x] ISC-14: Admin-actions PROGRAM form submit only calls program endpoint when split is false
- [x] ISC-15: Queue-item detail API response includes settings for split check
- [x] ISC-16: Queue-item PROGRAM action skips pickup location when split is false

## Decisions

## Verification

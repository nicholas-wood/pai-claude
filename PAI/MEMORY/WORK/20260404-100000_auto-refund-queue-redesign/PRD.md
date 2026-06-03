---
task: Auto-refund on cancel/reject and queue redesign
slug: 20260404-100000_auto-refund-queue-redesign
effort: deep
phase: complete
progress: 44/44
mode: interactive
started: 2026-04-04T10:00:00+10:00
updated: 2026-04-04T10:15:00+10:00
---

## Context

Two changes: (1) Auto-trigger Stripe refund when a paid request is cancelled or rejected. (2) Redesign the queue view for scanability - compact rows with contextual info and inline popover actions.

### Risks
- Stripe refund API calls in transitionRequest could slow down state transitions
- Popover positioning needs to work across different viewport sizes
- Optimistic UI could show stale state if the action fails silently

### Plan
1. Auto-refund: add refund logic to transitionRequest for CANCEL/REJECT events
2. Queue item: rewrite as compact table-like row with always-visible core info
3. Action popover: new component for tooltip-positioned modals
4. Tick animation: optimistic state after successful action

## Criteria

### Auto-refund
- [ ] ISC-1: CANCEL event triggers refund if paidAt set and not already refunded
- [ ] ISC-2: REJECT event triggers refund if paidAt set and not already refunded
- [ ] ISC-3: Refund records stripeRefundId on the request
- [ ] ISC-4: Refund sends notification email to member
- [ ] ISC-5: Refund creates audit entry
- [ ] ISC-6: Refund failure does not block the state transition
- [ ] ISC-7: Already-refunded requests are not double-refunded

### Queue row design
- [ ] ISC-8: Each row shows member name
- [ ] ISC-9: Each row shows request type label
- [ ] ISC-10: Each row shows credential type
- [ ] ISC-11: AWAITING_EXEMPTION rows show exemption reason
- [ ] ISC-12: AWAITING_APPROVAL rows show suggested access level
- [ ] ISC-13: AWAITING_PROGRAMMING rows show programming instruction
- [ ] ISC-14: AWAITING_PICKUP rows show pickup location or serial
- [ ] ISC-15: ON_HOLD rows show hold reason
- [ ] ISC-16: Each row has primary affirmative action button
- [ ] ISC-17: Each row has View link to request detail page

### Action popover
- [ ] ISC-18: Actions without input execute immediately (Issue, Resume)
- [ ] ISC-19: Actions with input show popover near click point
- [ ] ISC-20: Approve popover has access level selector
- [ ] ISC-21: Program popover has serial number input
- [ ] ISC-22: Reject/Cancel popover has reason textarea
- [ ] ISC-23: Hold popover has reason textarea
- [ ] ISC-24: Set Pickup popover has location selector
- [ ] ISC-25: Exemption review popovers have approve/reject with reason
- [ ] ISC-26: Popover closes on successful action or Escape

### Optimistic UI
- [ ] ISC-27: Successful action shows tick on the button
- [ ] ISC-28: Row fades/transitions out after brief tick display
- [ ] ISC-29: No full page reload on action completion
- [ ] ISC-30: Failed action shows error, row stays in place

### Permissions
- [ ] ISC-31: Action buttons only show for users with correct permission
- [ ] ISC-32: Approve button needs approve permission
- [ ] ISC-33: Program button needs program permission
- [ ] ISC-34: Issue button needs issue permission
- [ ] ISC-35: Exemption buttons need approve_exemption permission
- [ ] ISC-36: Hold/Resume buttons need approve, program, or issue permission

### Data loading
- [ ] ISC-37: Popover loads access levels on demand for approve
- [ ] ISC-38: Popover loads pickup locations on demand for set-pickup
- [ ] ISC-39: Queue page query includes exemption reason field
- [ ] ISC-40: Queue page query includes pickup location name

### Tests
- [ ] ISC-41: Test: cancel with payment triggers refund
- [ ] ISC-42: Test: reject with payment triggers refund
- [ ] ISC-43: Test: cancel without payment does not attempt refund
- [ ] ISC-44: Test: already-refunded request not double-refunded

### Anti-criteria
- [ ] ISC-A-1: No flow silently eats Stripe errors without logging

## Decisions

- 2026-04-04 10:00: Auto-refund is fire-and-forget in transitionRequest. Stripe failures are logged but don't block the state transition. Reason: the member should still see their request cancelled even if Stripe has a transient issue.
- 2026-04-04 10:00: Queue rows are a flat table layout, not cards. Cards waste vertical space when scanning 20+ items.
- 2026-04-04 10:00: Popovers use absolute positioning relative to the button click, not a separate modal. Keeps the user in spatial context.

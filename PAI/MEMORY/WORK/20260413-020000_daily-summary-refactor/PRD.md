---
task: Refactor daily summary to query current request state
slug: 20260413-020000_daily-summary-refactor
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-04-13T02:00:00+10:00
updated: 2026-04-13T02:00:00+10:00
---

## Context

The daily summary email currently reads from the notifications table (queued snapshots). This is fundamentally wrong - notifications become stale when requests are actioned. Refactoring to query current request states directly. Notification table remains for realtime admin pings only.

## Criteria

- [ ] ISC-1: sendDailySummaryEmails queries fob_requests by current status
- [ ] ISC-2: Summary includes awaiting_approval requests
- [ ] ISC-3: Summary includes awaiting_programming requests
- [ ] ISC-4: Summary includes awaiting_exemption_review requests
- [ ] ISC-5: Summary includes awaiting_pickup requests
- [ ] ISC-6: Each section shows member name and request detail
- [ ] ISC-7: Summary sent per-admin based on their permissions
- [ ] ISC-8: Tenant branding applied via setEmailBranding
- [ ] ISC-9: Stale notification filtering code removed (no longer needed)
- [ ] ISC-10: TypeScript compiles and tests pass

- [ ] ISC-A1: Notification table still used for realtime admin emails
- [ ] ISC-A2: No changes to the notifications insert path in sendAdminNotification

## Decisions

## Verification

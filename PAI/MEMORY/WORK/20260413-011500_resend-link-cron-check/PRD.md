---
task: Resend link, fix daily summary styling and stale notifications
slug: 20260413-011500_resend-link-cron-check
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-04-13T01:15:00+10:00
updated: 2026-04-13T01:25:00+10:00
---

## Context

Three tasks:
1. Add "Didn't receive an email? Click here to resend" to the magic link sent page
2. Fix daily summary email styling (not using correct brand styling)
3. Fix daily summary including already-actioned requests (stale notifications)

Cron is confirmed working (summary email received). KYC complete. Deploy succeeded.

## Criteria

- [ ] ISC-1: Sign-in form shows resend link after sending magic link
- [ ] ISC-2: Resend link has cooldown to prevent spam
- [ ] ISC-3: Resend calls same API endpoint with same email
- [ ] ISC-4: Daily summary email uses tenant-branded email styling
- [ ] ISC-5: Daily summary email matches other email templates visually
- [ ] ISC-6: Notifications marked as sent after daily summary processes them
- [ ] ISC-7: Already-actioned requests excluded from daily summary
- [ ] ISC-8: TypeScript compiles clean
- [ ] ISC-9: Tests pass
- [ ] ISC-10: Changes committed to dev

## Decisions

## Verification

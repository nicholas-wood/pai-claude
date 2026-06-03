---
task: AccessBuddy automated cron and renewal credential updates
slug: 20260330-140000_accessbuddy-automated-cron-renewal
effort: standard
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-30T14:00:00+10:00
updated: 2026-03-30T14:00:00+10:00
---

## Context

Implement two features in AccessBuddy: (1) a daily cron endpoint that expires officer/board permissions and credentials, (2) modify the renewal endpoint to update credential expiry dates after membership renewal.

### Risks
- RLS bypass needed for cross-tenant cron job
- Season format parsing must handle edge cases
- Must not break existing audit trail patterns

## Criteria

- [x] ISC-1: Daily cron route file exists at correct path
- [x] ISC-2: Cron checks CRON_SECRET header for authorization
- [x] ISC-3: Expired officer flags cleared and audit entries created
- [x] ISC-4: Expired board member flags cleared and audit entries created
- [x] ISC-5: Rules re-evaluated after permission expiry with access change auditing
- [x] ISC-6: Expired credentials status set to expired with deactivatedAt
- [x] ISC-7: Renewal endpoint updates active credential expiresAt dates
- [x] ISC-8: Renewal skips credential expiry for staff and board members

## Decisions

## Verification

---
task: Implement F8 access dates with timezone handling
slug: 20260331-120000_f8-access-dates-timezone
effort: advanced
phase: observe
progress: 24/24
mode: interactive
started: 2026-03-31T12:00:00+11:00
updated: 2026-03-31T12:00:10+11:00
---

## Context

F8: Access Start & Expiry Dates feature for AccessBuddy. The credentials table already has `accessStartsAt` and `expiresAt` columns. The tenant has a `timezone` field. Three areas need code changes:

1. **Timezone utility** - new file `apps/web/src/lib/timezone.ts` with `midnightInTimezone` and `parseDateWithTimezone` helpers
2. **Approval expiry fix** - `apps/web/src/lib/services/requests.ts` lines 338-348 use raw `new Date()` without timezone; need to look up tenant timezone and use it for Jul 1 cutoff and Sep 1 expiry
3. **Renewal expiry fix** - `apps/web/src/app/api/v1/t/[slug]/members/[id]/renew/route.ts` line 85 uses `Date.UTC` for Sep 1; needs tenant timezone
4. **New PATCH endpoint** - `apps/web/src/app/api/v1/t/[slug]/credentials/[id]/route.ts` for updating `accessStartsAt`/`expiresAt` with timezone-aware date parsing

### Risks
- Timezone offset calculation must handle DST correctly (probe at noon UTC avoids DST edge)
- The `transitionRequest` function operates within a transaction and needs tenant timezone lookup; tenant is already imported
- Must not break existing callers of `transitionRequest` or `issueCredential`

### Plan
1. Create `timezone.ts` utility with `midnightInTimezone` and `parseDateWithTimezone`
2. Modify `requests.ts` APPROVE handler to query tenant timezone and use `midnightInTimezone` for expiry
3. Modify `renew/route.ts` to use tenant timezone for Sep 1 calculation
4. Create new PATCH route for credential date editing following swap/route.ts pattern

## Criteria

- [x] ISC-1: `midnightInTimezone` function exported from `apps/web/src/lib/timezone.ts`
- [x] ISC-2: `midnightInTimezone` accepts year, month (0-indexed), day, timezone string
- [x] ISC-3: `midnightInTimezone` returns Date representing 00:00:00 in target timezone
- [x] ISC-4: `midnightInTimezone` probes at noon UTC to avoid DST edge cases
- [x] ISC-5: `parseDateWithTimezone` function exported from same file
- [x] ISC-6: `parseDateWithTimezone` treats date-only strings as midnight in tenant timezone
- [x] ISC-7: `parseDateWithTimezone` passes full ISO strings through unchanged
- [x] ISC-8: Approval handler queries tenant timezone from tenants table
- [x] ISC-9: Approval Jul 1 cutoff uses tenant timezone not UTC
- [x] ISC-10: Approval Sep 1 expiry uses `midnightInTimezone` for tenant timezone
- [x] ISC-11: Approval expiry stored as UTC (converted from tenant midnight)
- [x] ISC-12: Renewal handler uses tenant timezone instead of Date.UTC
- [x] ISC-13: Renewal queries timezone from already-resolved tenant variable
- [x] ISC-14: Renewal Sep 1 expiry uses `midnightInTimezone`
- [x] ISC-15: PATCH endpoint exists at credentials/[id]/route.ts
- [x] ISC-16: PATCH requires Permission.CONFIGURE authorization
- [x] ISC-17: PATCH accepts accessStartsAt as optional ISO date string
- [x] ISC-18: PATCH accepts expiresAt as optional ISO date string
- [x] ISC-19: PATCH uses parseDateWithTimezone for date-only inputs
- [x] ISC-20: PATCH converts dates to UTC before storing
- [x] ISC-21: PATCH creates audit entry for credential update
- [x] ISC-22: PATCH uses withTenant transaction pattern
- [x] ISC-23: PATCH returns updated credential in response
- [x] ISC-24: No schema files or shared package files modified

## Decisions

## Verification

---
task: Implement F10 Phase 3 notification preferences API
slug: 20260331-120000_f10-phase3-notification-preferences
effort: advanced
phase: verify
progress: 24/24
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:05-05:00
---

## Context

F10 Phase 3 adds notification preferences so members can control which emails they receive. The DB table `notification_preferences` already exists with RLS enabled. The `@accessbuddy/shared` package already has `NotificationType`, `NotificationFrequency`, `TIME_CRITICAL_NOTIFICATIONS`, and `updateNotificationPreferencesSchema`. This task creates the API route and wires preference checking into the email sending pipeline.

Admin notifications (Phase 2) are NOT preference-gated. Only member-facing emails respect preferences.

### Risks
- Event names in `sendTransitionEmail` (e.g., "APPROVE") differ from NotificationType enum values (e.g., "request_approved") - need mapping
- RLS is enabled on `notification_preferences` so queries must run inside `withTenant`
- Must not break existing email sending for cases where no preference record exists (default = enabled)

### Plan
1. Create GET/PUT route at `apps/web/src/app/api/v1/t/[slug]/notifications/preferences/route.ts`
2. Add `shouldSendNotification()` to `apps/web/src/lib/services/email.ts`
3. Add event-to-NotificationType mapping in `requests.ts`
4. Gate member-facing emails in `sendTransitionEmail` with `shouldSendNotification`

## Criteria

- [x] ISC-1: GET route exists at notifications/preferences/route.ts
- [x] ISC-2: GET route requires authentication via withTenantAuth
- [x] ISC-3: GET queries notification_preferences for tenant+user pair
- [x] ISC-4: GET returns defaults for unconfigured notification types
- [x] ISC-5: GET returns all NotificationType values with preferences
- [x] ISC-6: PUT route exists at notifications/preferences/route.ts
- [x] ISC-7: PUT validates body with updateNotificationPreferencesSchema
- [x] ISC-8: PUT returns 400 on invalid body with error details
- [x] ISC-9: PUT rejects disabling time-critical notifications with 400
- [x] ISC-10: PUT upserts into notification_preferences table
- [x] ISC-11: PUT returns the updated preference record
- [x] ISC-12: shouldSendNotification function exported from email.ts
- [x] ISC-13: shouldSendNotification returns true for time-critical types
- [x] ISC-14: shouldSendNotification returns true when no preference exists
- [x] ISC-15: shouldSendNotification returns false when emailEnabled is false
- [x] ISC-16: shouldSendNotification returns false when frequency is off
- [x] ISC-17: shouldSendNotification accepts tx, tenantId, userId, notificationType
- [x] ISC-18: Event-to-NotificationType mapping covers all member email events
- [x] ISC-19: sendTransitionEmail calls shouldSendNotification before member emails
- [x] ISC-20: sendTransitionEmail skips member email when preference says no
- [x] ISC-21: Admin notifications remain ungated by preferences
- [x] ISC-22: Queries run inside withTenant for RLS compliance
- [x] ISC-23: No modifications to schema or shared package files
- [x] ISC-24: Existing email behavior unchanged when no preferences configured

## Decisions

- Event-to-NotificationType mapping: REQUEST_EXEMPTION maps to EXEMPTION_REVIEW_NEEDED (closest semantic match for member exemption request confirmation)
- Orphaned requests (no requesterId) skip preference check - always send
- shouldSendNotification receives the tx from sendTransitionEmail (already RLS-scoped)

## Verification

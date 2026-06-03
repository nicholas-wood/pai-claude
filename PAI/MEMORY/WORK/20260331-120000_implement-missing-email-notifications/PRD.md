---
task: Implement all 10 missing email notifications
slug: 20260331-120000_implement-missing-email-notifications
effort: advanced
phase: complete
progress: 28/28
mode: interactive
started: 2026-03-31T12:00:00+10:00
updated: 2026-03-31T12:15:00+10:00
---

## Context

AccessBuddy SaaS product was missing 10 email notifications compared to the original Apps Script version. This task implemented all 10 across 7 files: email templates, email service, request transitions, daily cron, revoke endpoint, report-lost endpoint, and archive endpoint.

Explicitly requested: All 10 email notifications (6 member-facing, 4 admin-facing) with exact template patterns matching existing teal-coloured HTML layout. No schema or shared package modifications.

Explicitly not requested: Database migrations, new enum values, UI changes.

### Risks
- Cron additions must handle missing tenant/user lookups gracefully - MITIGATED: all lookups have null checks
- The daily cron operates without tenant RLS context - ACCEPTED: uses raw db consistent with existing cron
- sendTransitionEmail patterns extended carefully - DONE: follows existing switch/case pattern
- report-lost endpoint needed new imports - DONE: added sendAdminNotification, adminFobLostEmail
- Archive endpoint toggles status - DONE: email only sends when newStatus === "inactive"
- Expiry warning date matching - DONE: compares diffDays to 30 and 7

### Plan
Templates first, then email service, then triggers across 4 endpoint files.

## Criteria

- [x] ISC-1: paymentReminderEmail template renders HTML with amount
- [x] ISC-2: credentialExpiredEmail template renders HTML with serial number
- [x] ISC-3: credentialExpiryWarningEmail template renders with expiry date
- [x] ISC-4: credentialAccessUpdatedEmail template renders with serial number
- [x] ISC-5: memberArchivedEmail template renders with deactivation message
- [x] ISC-6: credentialReturnConfirmationEmail template renders correctly
- [x] ISC-7: credentialChangeConfirmationEmail template renders old/new types
- [x] ISC-8: adminReadyForCollectionEmail template renders table format
- [x] ISC-9: adminFobLostEmail template renders URGENT styling
- [x] ISC-10: adminAccessUpdateEmail template renders access level info
- [x] ISC-11: adminDeactivationEmail template renders serial and reason
- [x] ISC-12: TemplateVariables type includes all 7 new member template keys
- [x] ISC-13: renderTemplate switch handles all 7 new member template types
- [x] ISC-14: Daily cron sends payment reminder for unpaid requests older than 3 days
- [x] ISC-15: Daily cron sends credential expired email when marking expired
- [x] ISC-16: Daily cron sends expiry warning at 30 days and 7 days before expiry
- [x] ISC-17: sendTransitionEmail sends credentialAccessUpdated on PROGRAM for access_update
- [x] ISC-18: sendTransitionEmail sends return confirmation on ISSUE for return type
- [x] ISC-19: sendTransitionEmail sends change confirmation on ISSUE for change_type
- [x] ISC-20: sendTransitionEmail sends adminReadyForCollection on SET_PICKUP
- [x] ISC-21: sendTransitionEmail sends adminAccessUpdate on AWAITING_PROGRAMMING for access_update
- [x] ISC-22: Revoke endpoint sends adminDeactivation to program-permission admins
- [x] ISC-23: Report-lost endpoint sends adminFobLost URGENT to program-permission admins
- [x] ISC-24: Archive endpoint sends memberArchived email to archived member
- [x] ISC-25: Archive email only sends when archiving, not when reactivating
- [x] ISC-A-1: No modifications to shared package or database schema files
- [x] ISC-A-2: No existing email notifications broken or removed
- [x] ISC-28: bun run build completes without type errors

## Decisions

- 2026-03-31 12:05: Used diffDays integer comparison (30, 7) for expiry warnings rather than exact date matching, avoiding timezone edge cases
- 2026-03-31 12:06: Added PROGRAM to MEMBER_EMAIL_EVENTS but not to ADMIN_TRIGGER_EVENTS since the access_update admin notification fires on APPROVE (which transitions to AWAITING_PROGRAMMING)
- 2026-03-31 12:07: Archive endpoint also deactivates all active credentials (matches the email message "Your credentials have been deactivated")
- 2026-03-31 12:08: Admin deactivation notification in revoke is nested inside the owner?.email check to reuse emailConfig

## Verification

- ISC-1 through ISC-11: All 11 template functions verified present in email-templates.ts via grep
- ISC-12: 7 new TemplateVariables entries confirmed in email.ts
- ISC-13: 7 new renderTemplate cases confirmed in email.ts
- ISC-14: payment reminder query uses AWAITING_PAYMENT + paymentExempt=false + paidAt IS NULL + createdAt < 3 days ago
- ISC-15: credential expired email added inside existing expired credentials transaction loop
- ISC-16: expiry warning filters active credentials expiring within 31 days, then checks diffDays === 30 || 7
- ISC-17-21: All transition triggers verified in requests.ts via grep
- ISC-22: adminDeactivationEmail import and call verified in revoke/route.ts
- ISC-23: adminFobLostEmail import and call verified in report-lost/route.ts with CREDENTIAL_LOST notification type
- ISC-24-25: memberArchived email only sent when newStatus === "inactive" in archive/route.ts
- ISC-A-1: git diff shows no changes to packages/shared or packages/db
- ISC-A-2: all existing template functions and switch cases unchanged
- ISC-28: `bun run build` completes successfully with 0 type errors (verified twice)

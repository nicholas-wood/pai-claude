---
task: Implement F10 Notifications Phase 1-2 AccessBuddy
slug: 20260331-120000_f10-notifications-phase-1-2
effort: advanced
phase: verify
progress: 31/31
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:05-05:00
---

## Context

Implementing F10 Notifications Phase 1-2 for AccessBuddy. Phase 1 wires up missing member-facing email triggers for 5 new events (PAYMENT_RECEIVED, HOLD, REQUEST_EXEMPTION, APPROVE_EXEMPTION, REJECT_EXEMPTION) plus 2 future-proofing templates. Phase 2 adds admin notification infrastructure with a sendAdminNotification function and 3 admin-facing email triggers.

Three files to modify:
- `apps/web/src/lib/email-templates.ts` - add 10 new email template functions
- `apps/web/src/lib/services/email.ts` - add new template types + sendAdminNotification function
- `apps/web/src/lib/services/requests.ts` - expand sendTransitionEmail with new cases + admin triggers

### Risks
- Admin permission lookup must handle club_admin and global_admin role types having all permissions
- Fire-and-forget admin emails must not break the transaction if they fail
- Template HTML must match existing colour scheme and layout function exactly

## Criteria

### Phase 1: Member Email Templates
- [x] ISC-1: paymentReceivedEmail template function exists in email-templates.ts
- [x] ISC-2: requestOnHoldEmail template function exists with reason parameter
- [x] ISC-3: exemptionRequestedEmail template function exists in email-templates.ts
- [x] ISC-4: exemptionApprovedEmail template function exists in email-templates.ts
- [x] ISC-5: exemptionRejectedEmail template function exists with reason parameter
- [x] ISC-6: paymentRefundedEmail template function exists with reason parameter
- [x] ISC-7: attestationRequestedEmail template function exists with attestUrl parameter
- [x] ISC-8: All 7 new templates use existing layout() function and PRIMARY_COLOUR

### Phase 1: Email Service Integration
- [x] ISC-9: TemplateVariables type includes all 7 new template keys
- [x] ISC-10: renderTemplate function handles paymentReceived case
- [x] ISC-11: renderTemplate function handles requestOnHold case
- [x] ISC-12: renderTemplate function handles exemptionRequested case
- [x] ISC-13: renderTemplate function handles exemptionApproved case
- [x] ISC-14: renderTemplate function handles exemptionRejected case
- [x] ISC-15: renderTemplate function handles paymentRefunded case
- [x] ISC-16: renderTemplate function handles attestationRequested case
- [x] ISC-17: New template imports added to email.ts

### Phase 1: Transition Email Triggers
- [x] ISC-18: PAYMENT_RECEIVED event sends payment confirmation email
- [x] ISC-19: HOLD event sends hold notification with reason
- [x] ISC-20: REQUEST_EXEMPTION event sends exemption submitted email
- [x] ISC-21: APPROVE_EXEMPTION event sends exemption approved email
- [x] ISC-22: REJECT_EXEMPTION event sends exemption rejected email

### Phase 2: Admin Notification Infrastructure
- [x] ISC-23: sendAdminNotification function exported from email.ts
- [x] ISC-24: sendAdminNotification queries adminAssignments for matching permission
- [x] ISC-25: sendAdminNotification treats club_admin and global_admin as having all permissions

### Phase 2: Admin Email Templates
- [x] ISC-26: adminApprovalNeededEmail template exists in email-templates.ts
- [x] ISC-27: adminProgrammingNeededEmail template exists with optional serialNumber
- [x] ISC-28: adminExemptionReviewEmail template exists with reason parameter

### Phase 2: Admin Triggers in sendTransitionEmail
- [x] ISC-29: AWAITING_APPROVAL state triggers admin email to approve permission holders
- [x] ISC-30: AWAITING_PROGRAMMING state triggers admin email to program permission holders
- [x] ISC-31: AWAITING_EXEMPTION_REVIEW state triggers admin email to approve_exemption permission holders

### Anti-Criteria
- [ ] ISC-A1: No modifications to schema files
- [ ] ISC-A2: No modifications to shared package files
- [ ] ISC-A3: Existing email sending for APPROVE/REJECT/SET_PICKUP/ISSUE/CANCEL unchanged

## Decisions

## Verification

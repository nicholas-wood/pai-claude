---
task: Fix AccessBuddy UI gaps for exemptions and email
slug: 20260331-120000_accessbuddy-ui-gaps-exemptions-email
effort: advanced
phase: complete
progress: 12/12
mode: interactive
started: 2026-03-31T12:00:00+11:00
updated: 2026-03-31T12:01:00+11:00
---

## Context

Fix four UI gaps in the AccessBuddy web app: (1) OTP email uses hardcoded sender instead of tenant config, (2) no payment exemption option exists for members, (3) admin queue doesn't show AWAITING_EXEMPTION_REVIEW status, (4) admin actions lack exemption review buttons.

### Risks
- Payment step is step=-2 in request form; exemption needs to be an alternative path
- Admin actions use validEvents from state machine; APPROVE_EXEMPTION/REJECT_EXEMPTION must map to permissions
- Status badge missing AWAITING_EXEMPTION_REVIEW entry

## Criteria

- [x] ISC-1: send-code route reads fromEmail from tenant.settings
- [x] ISC-2: send-code route reads replyToEmail from tenant.settings
- [x] ISC-3: send-code passes tenant.name as clubName to sendEmail
- [x] ISC-4: Payment step shows "I believe I should be exempt" link
- [x] ISC-5: Clicking exemption link reveals textarea for reason
- [x] ISC-6: Submitting exemption calls request-exemption API endpoint
- [x] ISC-7: Confirmation message shown after exemption submission
- [x] ISC-8: AWAITING_EXEMPTION_REVIEW added to QUEUE_SECTIONS array
- [x] ISC-9: AWAITING_EXEMPTION_REVIEW added to status badge config
- [x] ISC-10: Admin actions show Approve Exemption button when status matches
- [x] ISC-11: Admin actions show Reject Exemption button with reason input
- [x] ISC-12: Admin actions display exemption reason from requestor

## Decisions

## Verification

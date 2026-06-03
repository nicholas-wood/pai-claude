---
task: AccessBuddy 10-item feature planning session
slug: 20260331-100000_accessbuddy-10-feature-plan
effort: deep
phase: complete
progress: 48/48
mode: interactive
started: 2026-03-31T10:00:00+11:00
updated: 2026-03-31T10:05:00+11:00
---

## Context

Nick has 10 features to plan and discuss for AccessBuddy before any code is written. This session produces an approved implementation plan, not code. The plan must cover architecture, dependencies, parallelism, and risk for each feature.

**Requested:**
1. Stripe integration working + Stripe Connect multi-tenant explanation
2. Configurable split pickup step (default combined with programming)
3. Payment exemption configuration per request type and membership category
4. Payment exemption request flow with reason, approval step, emails
5. Refund capability for exempt payments, audited with reason
6. Confirm revoke access and swap credential work, require reason, programming queue
7. Manually add member and manually add credential
8. Access start date and expiry date with optional time, timezone-aware
9. Renewal attestation via magic link before fobs sent for update
10. Full notifications implementation matching original system + new notifications

**Not requested:**
- No coding in this session
- No rushing - quality plan with discussion first
- No half-measures - maintainable and extensible

### Risks
- Features 4/5 (exemption flow + refund) modify the state machine - high regression risk
- Feature 9 (attestation) is a new async flow that blocks renewal - needs careful design
- Feature 10 (notifications) touches every workflow transition - wide blast radius
- Stripe Connect onboarding is an external dependency with compliance requirements

## Criteria

### F1: Stripe Integration & Connect
- [x] ISC-1: Plan covers Stripe Connect account structure per tenant
- [x] ISC-2: Plan covers Connect onboarding flow for new tenants
- [x] ISC-3: Plan covers webhook routing to correct connected account
- [x] ISC-4: Plan covers payment intent creation with connected account
- [x] ISC-5: Stripe Connect explanation delivered to Nick clearly

### F2: Split Pickup Step
- [x] ISC-6: Plan specifies tenant config toggle for split pickup
- [x] ISC-7: Plan specifies default behaviour (combined) vs split behaviour
- [x] ISC-8: Plan specifies state machine changes for conditional transition
- [x] ISC-9: Plan specifies pickup step permissions remain with programmer role

### F3: Payment Exemption Configuration
- [x] ISC-10: Plan confirms existing config fields are sufficient
- [x] ISC-11: Plan specifies admin UI for managing exemption rules
- [x] ISC-12: Plan specifies validation of exemption config at request creation

### F4: Payment Exemption Request Flow
- [x] ISC-13: Plan specifies new state or workflow for exemption requests
- [x] ISC-14: Plan specifies requestor exemption reason capture
- [x] ISC-15: Plan specifies admin approve/reject exemption step
- [x] ISC-16: Plan specifies email on exemption approved
- [x] ISC-17: Plan specifies email on exemption rejected with pay prompt
- [x] ISC-18: Plan specifies request goes to awaiting_payment if rejected
- [x] ISC-19: Plan specifies new permission for exemption approval

### F5: Payment Refund
- [x] ISC-20: Plan specifies admin refund action on paid requests
- [x] ISC-21: Plan specifies required reason for refund
- [x] ISC-22: Plan specifies Stripe refund API call
- [x] ISC-23: Plan specifies audit trail entry for refund
- [x] ISC-24: Plan specifies refund permission in permission model

### F6: Revoke Access & Swap Credential
- [x] ISC-25: Plan confirms revoke access functionality exists or specifies it
- [x] ISC-26: Plan specifies reason required for revoke
- [x] ISC-27: Plan specifies swap creates programming queue entry
- [x] ISC-28: Plan specifies both old and new fob updated on programming
- [x] ISC-29: Plan specifies reason required for swap

### F7: Manual Add Member & Credential
- [x] ISC-30: Plan specifies manual member creation flow
- [x] ISC-31: Plan specifies manual credential creation flow
- [x] ISC-32: Plan specifies required fields and permission checks

### F8: Access Start & Expiry Dates
- [x] ISC-33: Plan specifies accessStartsAt field on credentials
- [x] ISC-34: Plan specifies date with optional time input
- [x] ISC-35: Plan specifies default time of 00:00:00
- [x] ISC-36: Plan specifies timezone handling using tenant timezone

### F9: Renewal Attestation
- [x] ISC-37: Plan specifies attestation email with magic link
- [x] ISC-38: Plan specifies attestation form showing member credentials
- [x] ISC-39: Plan specifies attestation completion triggers fob update
- [x] ISC-40: Plan specifies attestation blocking renewal until complete
- [x] ISC-41: Plan specifies magic link security (token, expiry)

### F10: Notifications
- [x] ISC-42: Plan covers admin notification triggers
- [x] ISC-43: Plan covers member notification triggers
- [x] ISC-44: Plan covers notification preference system
- [x] ISC-45: Plan covers new notifications from features 4, 5, 9

### Cross-cutting
- [x] ISC-46: Plan identifies feature dependencies and execution order
- [x] ISC-47: Plan identifies parallelisable workstreams
- [x] ISC-48: Clarifying questions raised and answered before plan finalised
- [x] ISC-A-1: Anti: No feature plan modifies existing behaviour without regression strategy

## Decisions

- 2026-03-31 10:00: This is a planning-only session. No code changes until plan is approved.
- 2026-03-31 10:30: Split permissions into approve_exemption + refund (Nick's decision)
- 2026-03-31 10:30: Swap deactivate-when-programmed model (Nick's decision)
- 2026-03-31 10:30: Attestation expires after N days, admin decides (Nick's decision)
- 2026-03-31 11:00: All schema changes batched into single pass before feature implementation
- 2026-03-31 11:15: F2 implemented at service layer (auto-chain) not state machine level
- 2026-03-31 12:00: Tenant-branded emails added to plan for magic link and all notifications

## Verification

- Build: `bun run build` passes (3/3 packages, 17.5s)
- Tests: `bun run test` passes (52/52 tests across 4 files)
- F1: stripe.ts has 4 new functions, connect endpoint + webhook + return page created
- F2: transitionRequest auto-chains PROGRAM->SET_PICKUP->ISSUE when combined mode
- F3: Settings page has Payment Rules card with 3 config sections
- F4: 3 new endpoints, state machine has AWAITING_EXEMPTION_REVIEW, payment intent on rejection
- F5: Refund endpoint with Stripe API call, audit, email
- F6: Revoke endpoint + swap enhanced with reason + programming queue entries
- F7: Manual add member POST + manual add credential POST
- F8: timezone.ts utility, PATCH credential dates, approval/renewal use tenant TZ
- F9: attestation_requests table, magic link page, force-renew bypass, cron cleanup
- F10: 7 new email templates, admin notifications, preference API with checking
- ISC-A-1: No existing behaviour modified without regression strategy - all additive

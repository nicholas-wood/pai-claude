---
task: Comprehensive rewrite of AccessBuddy flow documentation
slug: 20260408-120000_accessbuddy-docs-rewrite
effort: deep
phase: complete
progress: 50/50
mode: interactive
started: 2026-04-08T12:00:00+10:00
updated: 2026-04-08T12:00:00+10:00
---

## Context

Comprehensive rewrite of `docs/FLOWS.md`. Current docs are significantly out of date - missing REOPEN, credential status transitions, programmingRequired concept, simplified deactivation flow, and many refinements. Must serve both users (members/admins/programmers/issuers) and developers, with developer details in separate sections.

## Criteria

- [x] ISC-1: Document has clear user-focused sections with developer sub-sections
- [x] ISC-2: Personas section updated with all roles
- [x] ISC-3: Core concepts section explains credentials, requests, state machines
- [x] ISC-4: Request state machine diagram includes REOPEN
- [x] ISC-5: Credential state machine diagram added (new)
- [x] ISC-6: New fob flow documented
- [x] ISC-7: Lost fob flow shows two-stage (Reported Lost -> Inactive - Lost)
- [x] ISC-8: Damaged fob flow shows two-stage (Reported Damaged -> Inactive - Damaged)
- [x] ISC-9: Additional fob flow documented
- [x] ISC-10: Return fob flow documented
- [x] ISC-11: Change fob type flow documented
- [x] ISC-12: Access update flow (member-initiated) documented
- [x] ISC-13: Access update flow (permission expiry) documented
- [x] ISC-14: Attestation renewal flow documented with direct credential updates
- [x] ISC-15: Payment determination documented including NEW-only category exemption
- [x] ISC-16: Stripe payment flow documented
- [x] ISC-17: Payment exemption flow documented
- [x] ISC-18: Auto-refund on cancel/reject documented
- [x] ISC-19: Manual refund flow documented
- [x] ISC-20: Hold/resume with multi-permission documented
- [x] ISC-21: Cancel with member/admin paths documented
- [x] ISC-22: Reject flow documented
- [x] ISC-23: Reopen flow documented with permission requirement
- [x] ISC-24: Approval flow documented
- [x] ISC-25: Programming flow for new fobs documented
- [x] ISC-26: Deactivation flow documented (simplified, no pickup/issue)
- [x] ISC-27: Pickup and issuing documented
- [x] ISC-28: Programming queue concept documented (requests + credentials)
- [x] ISC-29: Confirm programming endpoint documented
- [x] ISC-30: Revoke credential flow documented
- [x] ISC-31: Swap credential flow documented (two-request creation)
- [x] ISC-32: Manual add credential flow documented with stage options
- [x] ISC-33: Returned fob reallocation documented
- [x] ISC-34: Manual add member documented
- [x] ISC-35: Archive member documented
- [x] ISC-36: Force renew documented
- [x] ISC-37: Orphaned request linking documented
- [x] ISC-38: Credential expiry cron documented
- [x] ISC-39: Permission expiry cron documented (direct updates)
- [x] ISC-40: Notifications documented (CREDENTIAL_LOST only time-critical, summary default)
- [x] ISC-41: Email branding documented (colours, logo, attachments)
- [x] ISC-42: Permissions table complete including REOPEN
- [x] ISC-43: Data model section for developers documenting all tables
- [x] ISC-44: API endpoints reference for developers
- [x] ISC-45: State transition reference for developers
- [x] ISC-46: All Mermaid diagrams use consistent syntax
- [x] ISC-47: Table of contents navigable and complete
- [x] ISC-48: Credential uniqueness rule documented (tenant + type + serial)
- [x] ISC-49: Account lookup security behaviour documented
- [x] ISC-50: Notification types table updated
- [x] ISC-A-1: No flows described that don't match current code

---
task: Guide Stripe Connect platform setup with tenant commissions
slug: 20260329-163500_stripe-connect-platform-tenant-commissions
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-03-29T16:35:00+11:00
updated: 2026-03-29T16:35:10+11:00
---

## Context

Nick needs guidance on setting up Stripe Connect for AccessBuddy, a multi-tenant SaaS platform for sports club building access management. Clubs are tenants. Members pay clubs for credentials (fobs, keys, codes). The platform takes a configurable commission per club/tenant and passes the remainder through to the club's Stripe account.

This is an architecture and setup guidance task, not a code implementation task. The output should be a practical, decision-oriented walkthrough covering Stripe Connect account types, onboarding, payment flows, and commission configuration.

## Criteria

- [x] ISC-1: Correct Stripe Connect account type recommended with reasoning
- [x] ISC-2: Platform vs tenant responsibility split clearly defined
- [x] ISC-3: Stripe Dashboard setup steps documented for platform account
- [x] ISC-4: Tenant onboarding flow explained (OAuth or embedded)
- [x] ISC-5: Payment flow architecture explained (direct charges vs destination charges vs separate charges and transfers)
- [x] ISC-6: Per-tenant configurable commission mechanism explained
- [x] ISC-7: Application fee vs transfer-based commission trade-offs covered
- [x] ISC-8: Stripe fee responsibility (who pays) clearly addressed
- [x] ISC-9: Payout timing and tenant settlement explained
- [x] ISC-10: Testing and go-live checklist provided

## Decisions

## Verification

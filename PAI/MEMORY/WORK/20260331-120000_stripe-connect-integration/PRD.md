---
task: Implement Stripe Connect integration for AccessBuddy
slug: 20260331-120000_stripe-connect-integration
effort: advanced
phase: verify
progress: 27/27
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:05-05:00
---

## Context

AccessBuddy is a multi-tenant SaaS for fob/credential management. The existing `stripe.ts` has `getStripe()` and `createPaymentIntent()`. The tenants table already has `stripeAccountId` and `stripeOnboardingStatus` columns. The webhook handler currently handles `payment_intent.succeeded`. This task adds Stripe Connect Standard account onboarding so each tenant can receive payments directly.

### Risks
- Must not break existing payment_intent.succeeded webhook handler
- Must use `db` (not `withTenant`) for querying tenants table since it has no RLS
- Must follow existing `withTenantAuth` pattern with Permission.CONFIGURE for auth
- Stripe API version "2026-03-25.dahlia" must be respected

### Plan
1. Add 4 helper functions to stripe.ts (createConnectAccount, createAccountLink, getConnectAccountStatus, createRefund)
2. Create POST/GET route at api/v1/t/[slug]/config/stripe/connect/route.ts
3. Enhance webhook to handle account.updated events
4. Create client-side return page at t/[slug]/admin/config/stripe/return/page.tsx

## Criteria

- [x] ISC-1: createConnectAccount function exists in stripe.ts
- [x] ISC-2: createConnectAccount creates standard type Stripe account
- [x] ISC-3: createConnectAccount accepts tenantName and optional tenantEmail
- [x] ISC-4: createAccountLink function exists in stripe.ts
- [x] ISC-5: createAccountLink creates account_onboarding type link
- [x] ISC-6: createAccountLink accepts stripeAccountId, refreshUrl, returnUrl
- [x] ISC-7: getConnectAccountStatus function exists in stripe.ts
- [x] ISC-8: getConnectAccountStatus returns chargesEnabled, payoutsEnabled, detailsSubmitted
- [x] ISC-9: createRefund function exists in stripe.ts
- [x] ISC-10: createRefund uses stripeAccount option when stripeAccountId provided
- [x] ISC-11: POST endpoint exists at config/stripe/connect route
- [x] ISC-12: POST endpoint requires CONFIGURE permission
- [x] ISC-13: POST creates new account if tenant has no stripeAccountId
- [x] ISC-14: POST saves stripeAccountId to tenant record via db
- [x] ISC-15: POST creates account link and returns URL
- [x] ISC-16: POST re-onboards if tenant already has stripeAccountId
- [x] ISC-17: GET endpoint exists at config/stripe/connect route
- [x] ISC-18: GET endpoint requires CONFIGURE permission
- [x] ISC-19: GET returns connected:false when no stripeAccountId
- [x] ISC-20: GET returns full status when stripeAccountId exists
- [x] ISC-21: Webhook handles account.updated event type
- [x] ISC-22: Webhook looks up tenant by stripeAccountId using db
- [x] ISC-23: Webhook sets correct onboarding status based on account state
- [x] ISC-24: Return page exists at t/[slug]/admin/config/stripe/return
- [x] ISC-25: Return page fetches connect status from GET endpoint
- [x] ISC-26: Return page shows success or pending message based on status
- [x] ISC-27: Return page has link back to settings
- [x] ISC-A1: Existing payment_intent.succeeded handler not modified

## Decisions

## Verification

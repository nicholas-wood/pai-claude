---
task: Implement F5 payment refund API endpoint
slug: 20260331-120000_f5-payment-refund-endpoint
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:01-05:00
---

## Context

F5 Payment Refund endpoint for AccessBuddy. Creates a POST route at `api/v1/t/[slug]/requests/[id]/refund` that processes Stripe refunds for paid fob requests. Follows the direct implementation pattern (like `change-credential/route.ts`) rather than `createWorkflowAction` since refund is not a state machine transition. All schema, shared types, Stripe helper, and email templates already exist.

### Risks
- Stripe API could fail or timeout during refund creation
- Double-refund risk if concurrent requests hit the endpoint

## Criteria

- [x] ISC-1: Route file exists at correct path under requests/[id]/refund
- [x] ISC-2: POST handler exports correctly as named export
- [x] ISC-3: Authentication check returns 401 when unauthenticated
- [x] ISC-4: Tenant resolution returns 404 for invalid slug
- [x] ISC-5: Permission.REFUND check returns 403 when unauthorized
- [x] ISC-6: Body validated with refundRequestSchema returning 400 on failure
- [x] ISC-7: Validation rejects requests without paidAt or stripePaymentIntentId or already refunded
- [x] ISC-8: Calls createRefund with paymentIntentId and tenant stripeAccountId
- [x] ISC-9: Updates request with refundedAt, refundedBy, refundReason, stripeRefundId
- [x] ISC-10: Creates audit entry and sends paymentRefunded email

## Decisions

## Verification

- ISC-1: PASS -- file at `apps/web/src/app/api/v1/t/[slug]/requests/[id]/refund/route.ts`
- ISC-2: PASS -- `export async function POST` named export
- ISC-3: PASS -- 401 on missing auth (line 19-24)
- ISC-4: PASS -- 404 on missing tenant (line 28-33)
- ISC-5: PASS -- 403 on Permission.REFUND failure (line 35-41)
- ISC-6: PASS -- refundRequestSchema validation, 400 on failure (line 43-50)
- ISC-7: PASS -- three separate checks for paidAt, stripePaymentIntentId, refundedAt (lines 65-73)
- ISC-8: PASS -- createRefund called with paymentIntentId and stripeAccountId (line 77-81)
- ISC-9: PASS -- updates refundedAt, refundedBy, refundReason, stripeRefundId (lines 91-101)
- ISC-10: PASS -- audit entry created (lines 103-117), paymentRefunded email sent (lines 152-157)
- TypeScript: 0 errors in refund file
- /simplify: Removed redundant tenant query (1 DB round-trip saved), removed narrating comments, removed unused import

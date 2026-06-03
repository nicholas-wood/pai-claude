---
task: Implement payment exemption request flow endpoints
slug: 20260331-120000_payment-exemption-request-flow
effort: standard
phase: verify
progress: 10/10
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:01:00-05:00
---

## Context

Implement the payment exemption request flow for AccessBuddy. The state machine, schema, validation schemas, permissions, and email templates are all already in place. This task creates three new API route endpoints and adds payment intent creation logic on exemption rejection.

The request-exemption endpoint allows any authenticated user (no specific permission) to request a payment exemption on a SUBMITTED request. Approve/reject endpoints require APPROVE_EXEMPTION permission. When an exemption is rejected, the request goes to AWAITING_PAYMENT and needs a Stripe payment intent created.

### Risks
- The createWorkflowAction helper requires a non-optional `requiredPermission` field, but request-exemption needs no permission check. Must make permission optional in the helper.
- Payment intent creation on rejection needs access to credential type pricing and tenant stripeAccountId within the transaction context.

### Plan
1. Make `requiredPermission` optional in `createWorkflowAction` — skip permission check when not provided.
2. Create three route files using the helper pattern.
3. Add REJECT_EXEMPTION handling in `transitionRequest` to create Stripe payment intent.

## Criteria

- [x] ISC-1: request-exemption route.ts file exists at correct path
- [x] ISC-2: request-exemption uses requestExemptionSchema for body validation
- [x] ISC-3: request-exemption passes correct updates and metadata to transitionRequest
- [x] ISC-4: approve-exemption route.ts file exists at correct path
- [x] ISC-5: approve-exemption requires APPROVE_EXEMPTION permission
- [x] ISC-6: approve-exemption passes paymentExempt and reviewer fields in updates
- [x] ISC-7: reject-exemption route.ts file exists at correct path
- [x] ISC-8: reject-exemption requires APPROVE_EXEMPTION permission and passes rejection fields
- [x] ISC-9: transitionRequest creates Stripe payment intent on REJECT_EXEMPTION event
- [x] ISC-10: createWorkflowAction supports optional requiredPermission without breaking existing endpoints

## Decisions

## Verification

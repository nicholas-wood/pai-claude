---
task: "Require payment on issued requests, return to issued, withdraw action"
slug: 20261016-accessbuddy-require-payment-on-issued
project: accessbuddy
effort: advanced
effort_source: classifier
phase: complete
progress: 34/34
mode: interactive
started: 2026-10-16T09:00:00+11:00
updated: 2026-10-18T12:00:00+11:00
---

## Problem

Issued is terminal, so a club cannot demand payment on a credential that was issued free (exempt by category, exemption granted in error). Nick wants Require Payment on issued requests, with payment or a withdrawn demand returning the request to Issued rather than re-entering approval.

## Vision

An approver opens an issued, unpaid request and clicks Require Payment. The member is emailed a pay link (no cancel link, the fob is in their hand). When they pay, the request is Issued again with paidAt set. If the club changes its mind, Withdraw Payment Request puts it straight back to Issued and voids the Stripe intent.

## Out of Scope

Deactivating the credential on non-payment. Require Payment on Cancelled or Rejected (Reopen covers those). Member-side decline of a post-issue demand.

## Constraints

- Return target stored on the row (`payment_return_status`), hand-written SQL migration plus journal entry, matching 0017's pattern; CI applies all migrations from zero and runs the drift check.
- No change to webhook signature handling.
- Branch from origin/main (v1.20.0); PR for Nick to merge.

## Goal

PR on `feat/require-payment-on-issued` where PAYMENT_REQUIRED is valid from ISSUED, every exit from the resulting Awaiting Payment returns to ISSUED, a WITHDRAW_PAYMENT_REQUEST admin action exists, no cancel path reaches a post-issue demand, typecheck and tests green.

## Criteria

- [x] ISC-1: schema has paymentReturnStatus text column on fobRequests
- [x] ISC-2: migration 0018 adds payment_return_status and journal has idx 18
- [x] ISC-3: state machine ISSUED allows PAYMENT_REQUIRED (no longer type final)
- [x] ISC-4: state machine AWAITING_PAYMENT allows WITHDRAW_PAYMENT_REQUEST
- [x] ISC-5: resolveNewStatus maps ISSUED+PAYMENT_REQUIRED and AWAITING_PAYMENT+WITHDRAW
- [x] ISC-6: PAYMENT_REQUIRED from ISSUED stores paymentReturnStatus=issued
- [x] ISC-7: PAYMENT_RECEIVED with return status set lands on ISSUED and clears it
- [x] ISC-8: PAYMENT_EXEMPT with return status lands on ISSUED and clears it
- [x] ISC-9: APPROVE_EXEMPTION with return status lands on ISSUED and clears it
- [x] ISC-10: WITHDRAW_PAYMENT_REQUEST lands on ISSUED, clears it, restores paymentExempt=true
- [x] ISC-11: WITHDRAW without return status throws a Cannot error
- [x] ISC-12: CANCEL with return status set throws (withdraw instead)
- [x] ISC-13: WITHDRAW voids the Stripe intent via the leaves-payment block; succeeded blocks it
- [x] ISC-14: audit entry toState is the actual return status
- [x] ISC-15: admin notification skipped when returning to ISSUED
- [x] ISC-16: member PAYMENT_RECEIVED email uses paymentReceived template when returning
- [x] ISC-17: paymentRequired email omits cancel link for post-issue demands
- [x] ISC-18: new payment_request_withdrawn email event and template sent on WITHDRAW
- [x] ISC-19: resend-payment-link omits cancel link when return status set
- [x] ISC-20: cron reminder omits cancel link when return status set
- [x] ISC-21: cancel-by-token refuses when return status set
- [x] ISC-22: payment-required route accepts ISSUED
- [x] ISC-23: new route withdraw-payment-request, APPROVE_EXEMPTION, optional reason
- [x] ISC-24: admin UI Require Payment visible on issued unpaid requests
- [x] ISC-25: admin UI Withdraw Payment Request visible only when return status set
- [x] ISC-26: admin UI hides Cancel and Grant Exemption when return status set
- [x] ISC-27: page passes paymentReturnStatus to AdminActions
- [x] ISC-28: audit labels for issued_awaiting_payment, awaiting_payment_issued, exemption return, withdraw
- [x] ISC-29: FLOWS.md rows for the new transitions
- [x] ISC-30: shared state-machine tests cover issued->awaiting_payment->withdraw and ->payment
- [x] ISC-31: tests asserting ISSUED is final updated in three files
- [x] ISC-32: typecheck, lint, tests green
- [x] ISC-33: Anti: no webhook signature or Stripe account changes
- [x] ISC-34: Anti: cron sweep still only touches SUBMITTED

## Test Strategy

| isc | type | check | tool |
|-----|------|-------|------|
| 1-2 | file | schema + sql + journal | Read |
| 3-5, 30-31 | unit | vitest shared + web | bun test |
| 6-23 | code | Read hunks | Read |
| 24-29 | code | Read tsx/md | Read |
| 32 | build | turbo typecheck/lint/test | Bash |
| 33-34 | git | diff --stat | Bash |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| schema-migration | 1-2 | none | yes |
| state-machine | 3-5, 30-31 | none | yes |
| transition-core | 6-16 | schema, state-machine | no |
| emails | 17-20 | transition-core | no |
| routes | 21-23 | transition-core | no |
| admin-ui | 24-29 | routes | no |

## Decisions

- 2026-10-16: Return target is a dedicated column, not holdPreviousStatus, because HOLD from Awaiting Payment would clobber it.
- 2026-10-16: Withdraw restores paymentExempt=true; a post-issue demand can only exist on a request that was free, since paid ones hide the button.
- 2026-10-16: Grant Exemption hidden on post-issue demands; Withdraw is the same outcome with clearer wording.
- 2026-10-18: Advisor + reviewer acted on: stale-status guard (override only from AWAITING_PAYMENT / AWAITING_EXEMPTION_REVIEW), payment_return_exempt snapshot, post-issue billing limited to new/additional, damaged-fob re-queue blocked, email routing for post-issue settlements, controls hidden on queue card / fob page / member dashboard, update route guard, DB-gated service test with Stripe stubbed. Declined: row-level status lock in transitionRequest (global behaviour change, pre-existing race shared by every transition; noted in PR).

## Changelog

- conjectured: a post-issue demand can only exist on an exempt request, so withdraw may set paymentExempt=true.
- refuted_by: SMLSC's migrated rows are unpaid with paymentExempt=false; the Require Payment button keys on paidAt, not the flag.
- learned: restore state from a snapshot, never from an inference about how the state was reached.
- criterion_now: ISC-10 evidence shows paymentReturnExempt round-tripping in the DB-gated test.

## Verification

- ISC-1..2: packages/db/src/schema/requests.ts paymentReturnStatus + paymentReturnExempt; drizzle/0018_fob_requests_payment_return_status.sql; _journal.json idx 18.
- ISC-3..5, 30..31: state-machine.ts ISSUED.on.PAYMENT_REQUIRED, AWAITING_PAYMENT.on.WITHDRAW_PAYMENT_REQUEST; resolveNewStatus entries; shared tests 26 passing; flow/workflow tests updated.
- ISC-6..13: requests.ts post-issue block after RESUME handling; LEAVES_PAYMENT_STATES includes WITHDRAW; DB-gated test post-issue-payment-demand.test.ts (CI).
- ISC-14: audit toState via actualNewStatus = updateValues.status.
- ISC-15..18: settlesPostIssueDemand skips admin block; PAYMENT_RECEIVED/APPROVE/EXEMPT/WITHDRAW member email cases; paymentRequired postIssue variant; payment_request_withdrawn event + template; post-issue-payment-email.test.ts 6 passing.
- ISC-19..21: sendPaymentLinkEmail and cron omit cancelUrl when paymentReturnStatus; cancel-by-token refuses.
- ISC-22..23: payment-required route accepts ISSUED (new/additional only); withdraw-payment-request route via createWorkflowAction.
- ISC-24..28: admin-actions.tsx canRequirePayment / canWithdrawPaymentRequest / hidden Cancel + Grant Exemption; page passes paymentReturnStatus; audit-trail labels.
- ISC-29: docs/FLOWS.md three rows.
- ISC-32: typecheck 5/5; tests shared 26, db 16, web 237; lint 0 errors.
- ISC-33: git diff --stat origin/main excludes webhooks/stripe/route.ts and stripe account code.
- ISC-34: cron sweep where-clause unchanged (status SUBMITTED only); only the reminder select gained paymentReturnStatus.

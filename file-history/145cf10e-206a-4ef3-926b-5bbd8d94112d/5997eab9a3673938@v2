---
task: "Check AccessBuddy for manual payment-required request mechanism"
slug: 20261005-172959_accessbuddy-payment-required-mechanism
effort: advanced
effort_source: classifier
phase: complete
progress: 32/32
mode: interactive
started: 2026-10-05T17:29:59+11:00
updated: 2026-10-10T00:00:00+11:00
---

## Problem

Nick asked whether AccessBuddy already has a way to handle a request where the member did not pay: flag it as payment required, send the requestor a payment link, and have the status move correctly once paid. The answer is not known without reading the request workflow, Stripe, and email code. Recent sessions were marked down for factual errors, so the answer must be evidence-backed, not recalled.

## Vision

Nick reads a short answer that says yes, partly, or no, names exactly which of the three parts exist, where they live in the admin UI and code, and what is missing. He can decide whether a feature is needed without opening the repo.

## Out of Scope

No code changes, no branches, no deploys. No design or build of a new payment-required feature (this is a question, so the deliverable is the assessment). No production database or Stripe dashboard access. No changes to the project ISA.

## Constraints

- Read-only against `~/Documents/workspace/projects/accessbuddy/code`.
- Every claim in the answer cites a file path and line read in this session.
- Local checkout is on branch `fix/audit-log-resend-and-email-noise`; payment-relevant claims must also hold on `origin/main` (what production runs).
- Australian English, no em dashes, recommendation first.

## Goal

Deliver a verified yes/partly/no answer on each of the three parts of Nick's question (mark as payment required, send payment link, status update on payment), with file evidence, the admin-facing path to use it if it exists, and the gaps if it does not.

## Criteria

- [x] ISC-1: Request status enum located and all states listed from schema source
- [x] ISC-2: Presence or absence of an AWAITING_PAYMENT (or equivalent) status confirmed in schema
- [x] ISC-3: Allowed status-transition map located (which states can move to AWAITING_PAYMENT)
- [x] ISC-4: Whether an admin can manually move a request back to AWAITING_PAYMENT confirmed in API code
- [x] ISC-5: Admin API route(s) that change request status identified with path and line
- [x] ISC-6: Admin UI control for setting status identified (or confirmed absent)
- [x] ISC-7: Whether the admin UI offers AWAITING_PAYMENT as a selectable target confirmed
- [x] ISC-8: Stripe checkout session creation code located
- [x] ISC-9: Who can trigger checkout creation (member only, admin, or both) confirmed
- [x] ISC-10: Whether a payment link can be generated for an existing request after submission confirmed
- [x] ISC-11: Email event for payment required / payment link identified in email-events registry (or confirmed absent)
- [x] ISC-12: Email template for payment request located (or confirmed absent)
- [x] ISC-13: Whether the payment email contains a pay link/URL confirmed from template source
- [x] ISC-14: Trigger point that sends the payment email identified (which transition or action)
- [x] ISC-15: Whether an admin can resend the payment email/link confirmed
- [x] ISC-16: Member-facing pay page/route for an outstanding request located (or confirmed absent)
- [x] ISC-17: Stripe webhook handler for checkout completion located
- [x] ISC-18: Status the webhook moves the request to on successful payment confirmed
- [x] ISC-19: Handling of expired/abandoned checkout sessions confirmed (handler present or absent)
- [x] ISC-20: Handling of failed payment events confirmed (handler present or absent)
- [x] ISC-21: Whether a manual "mark as paid" (offline/cash payment) admin action exists confirmed
- [x] ISC-22: Payment reminder cron behaviour for AWAITING_PAYMENT requests confirmed (present or absent)
- [x] ISC-23: Payment exemption path (AWAITING_EXEMPTION_REVIEW) relationship to payment-required confirmed
- [x] ISC-24: Behaviour when exemption is rejected (does it route to payment) confirmed
- [x] ISC-25: Refund or payment-reversal handling affecting status confirmed (present or absent)
- [x] ISC-26: Audit log entry on payment-related status change confirmed (present or absent)
- [x] ISC-27: Key payment findings checked against `origin/main`, not only the feature branch
- [x] ISC-28: Project docs/state checked for any known payment-required backlog item
- [x] ISC-29: Answer states a clear verdict for each of the three parts of the question
- [x] ISC-30: Answer names gaps explicitly where a part is missing or partial
- [x] ISC-31: Anti: no file in the AccessBuddy repo modified by this session (`git status` unchanged)
- [x] ISC-32: Anti: answer contains no claim without a file read in this session backing it

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..3 | code read | schema enum + transition map | exact lines quoted | Grep/Read |
| ISC-4..7 | code read | API route + admin UI component | path:line | Grep/Read |
| ISC-8..10, 16 | code read | Stripe checkout creation + member pay route | path:line | Grep/Read |
| ISC-11..15 | code read | email-events registry, template, send call sites | path:line | Grep/Read |
| ISC-17..20, 25 | code read | webhook handler switch cases | path:line | Grep/Read |
| ISC-21..24, 26 | code read | admin actions, cron, exemption flow, audit | path:line | Grep/Read |
| ISC-27 | git | `git grep` on origin/main for key symbols | same hits | Bash |
| ISC-28 | doc read | context/state.md, ISA.md | grep hits | Grep |
| ISC-29..30, 32 | inspection | final answer vs evidence | each claim cited | ReReadCheck |
| ISC-31 | git | `git status --porcelain` | empty diff vs start | Bash |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| workflow-map | Status enum, transitions, admin status controls | ISC-1..7, 23, 24, 26 | none | yes |
| payment-path | Stripe checkout, pay route, webhook, refunds | ISC-8..10, 16..21, 25 | none | yes |
| comms-path | Payment email event, template, triggers, resend, reminders | ISC-11..15, 22 | none | yes |
| cross-check | origin/main parity, backlog docs, repo untouched | ISC-27, 28, 31 | above | no |
| answer | Verdict per part with gaps | ISC-29, 30, 32 | all | no |

## Decisions

- 2026-10-05 17:30: Task ISA, not project ISA. This is a read-only question; nothing about the project's ideal state changes.
- 2026-10-05 17:30: Delegation: one Explore sweep for breadth, with my own reads of the load-bearing lines before any claim reaches Nick. Second delegation (qa/architect) not used: show-your-math, a second agent would re-read the same files for a factual lookup and add summary-loss risk without new information.

- 2026-10-10: refined: the service-layer createRequest (requests.ts:176) is not the production path. The submit route (submit/route.ts:176-179) keeps paid requests in SUBMITTED and relies on a client transition that payment-step.tsx never makes. Answer reframed around that.
- 2026-10-10: Advisor (Inference.ts) raised five checks; all run. Resend routes exist only for auth codes and attestations. confirm-payment is an untracked empty local dir with no git history on any branch.

## Changelog

- conjectured: unpaid requests rest in AWAITING_PAYMENT, so the question is only about re-sending a link.
- refuted_by: submit/route.ts:176-179 sets SUBMITTED when payment is required; payment-step.tsx makes no API call; queue-filter.tsx QUEUE_SECTIONS has no SUBMITTED section.
- learned: a member who abandons the Stripe step leaves a request that no queue column renders and no reminder targets.
- criterion_now: ISC-22 and ISC-6 evidence record the SUBMITTED gap explicitly.

## Verification

- ISC-1/2: Read packages/shared/src/enums.ts:2-18, RequestStatus includes awaiting_payment, on_hold.
- ISC-3/4: Read state-machine.ts:68-122 and requests.ts:1808-1850. PAYMENT_REQUIRED only from SUBMITTED; no route or UI calls it (rg PAYMENT_REQUIRED: enum, machine, map only).
- ISC-5: ls requests/[id]/ lists approve, approve-exemption, cancel, hold, payment-exempt, reject-exemption, request-exemption, refund, resume, reopen, update, etc. No require-payment or resend-payment route.
- ISC-6/7: admin-actions.tsx:49-62 EVENT_PERMISSION_MAP omits PAYMENT_REQUIRED and PAYMENT_RECEIVED; buttons at 222-260 are Approve/Reject Exemption, Grant Exemption, Refund, Cancel, Hold.
- ISC-8/9/10: createPaymentIntent at submit/route.ts:353,429 (member submit) and requests.ts:731 (on REJECT_EXEMPTION when no intent). Admin cannot create one on demand.
- ISC-11/12/13: email-events.ts:235-252 payment_reminder has Pay Now button in block defaults; email-templates.ts:570-590 code template has no link; exemptionRejected (email.ts:632, templates:440-444) carries paymentUrl.
- ISC-14: requests.ts:1637-1648 only REJECT_EXEMPTION emails a pay link.
- ISC-15: rg resend under api/v1: send-code and resend-attestation only.
- ISC-16: apps/web/src/app/t/[slug]/pay/[id]/page.tsx calls public payment-info; payment-info/route.ts checks paidAt and intent presence only.
- ISC-17/18: webhooks/stripe/route.ts:61-85 payment_intent.succeeded -> transitionRequest PAYMENT_RECEIVED -> AWAITING_APPROVAL.
- ISC-19: no handler for canceled/expired intents (only succeeded, payment_failed, charge.dispute.created, account.updated).
- ISC-20: payment_failed logs audit only (route.ts:92-128).
- ISC-21: no mark-as-paid route; confirm-payment dir empty, git log --all empty.
- ISC-22: cron/daily/route.ts:470-547 queries status AWAITING_PAYMENT only, older than 3 days, no dedupe column, fires every run.
- ISC-23/24: AWAITING_EXEMPTION_REVIEW REJECT_EXEMPTION -> AWAITING_PAYMENT, creates intent and emails link.
- ISC-25: refund/route.ts sets refundedAt, no status transition.
- ISC-26: transitionRequest writes STATUS_CHANGE audit (requests.ts:368).
- ISC-27: git diff --stat origin/main on all cited files empty.
- ISC-28: context/state.md and project ISA have no payment-required backlog item.
- ISC-29/30/32: answer below cites each file.
- ISC-31: git status --porcelain in code repo returns 0 lines.

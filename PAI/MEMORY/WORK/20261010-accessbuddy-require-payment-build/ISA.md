---
task: "Build require-payment, resend-link, abandoned sweep, member cancel link"
slug: 20261010-accessbuddy-require-payment-build
project: accessbuddy
effort: advanced
effort_source: classifier
phase: complete
progress: 36/36
mode: interactive
started: 2026-10-10T09:00:00+11:00
updated: 2026-10-14T21:30:00+11:00
---

## Problem

AccessBuddy has no admin action to demand payment on a request, no way to resend a payment link, and a member who abandons the Stripe step leaves the request in SUBMITTED where no queue column renders it and no reminder targets it. The only email that carries a pay link is the exemption-rejected email. Members have no cancel path from an email.

## Vision

An approver opens any unpaid request and sees "Require payment" or "Resend payment link". The member gets a branded email with a Pay button and a "Cancel this request" link that works without signing in. Overnight, abandoned requests move themselves to Awaiting Payment and the member is emailed. Nothing silently sits in SUBMITTED again.

## Out of Scope

No manual "record offline payment" action. No change to Stripe account model or webhooks beyond intent cancellation hygiene. No migration (the cancel link is a signed token, not a stored column). No deploy; this ships as a PR for Nick to merge.

## Constraints

- Branch from origin/main; PR #102 branch untouched.
- Postgres RLS: writes go through withTenant; cron selects follow the existing bare-db pattern.
- Email rendering goes through sendTemplatedEmail so setEmailBranding runs.
- No new env vars; cancel token signs with the existing SESSION_SIGNING_SECRET.
- bun only; TypeScript only; Australian English in copy.
- Commit prefix feat: so release-please ships it on merge.

## Goal

A PR on branch feat/require-payment-and-abandoned-sweep that adds the PAYMENT_REQUIRED transition with intent creation and email, an admin resend-payment-link action, a nightly abandoned-payment sweep, and a signed cancel link on the pay page, with typecheck and tests green.

## Criteria

- [x] ISC-1: state-machine.ts allows PAYMENT_REQUIRED from AWAITING_APPROVAL as well as SUBMITTED
- [x] ISC-2: requests.ts resolveNewStatus maps PAYMENT_REQUIRED from AWAITING_APPROVAL to AWAITING_PAYMENT
- [x] ISC-3: shared state-machine test covers PAYMENT_REQUIRED from both states and rejects it from AWAITING_PROGRAMMING
- [x] ISC-4: transitionRequest creates a Stripe intent on PAYMENT_REQUIRED when none exists
- [x] ISC-5: transitionRequest persists paymentAmountCents and paymentExempt=false on PAYMENT_REQUIRED
- [x] ISC-6: transitionRequest sends the paymentRequired email on PAYMENT_REQUIRED with pay and cancel links
- [x] ISC-7: new route requests/[id]/payment-required exists, POST, permission APPROVE_EXEMPTION, body {reason}
- [x] ISC-8: payment-required route refuses paid requests and orphaned requests with a 400
- [x] ISC-9: new route requests/[id]/resend-payment-link exists, POST, permission APPROVE_EXEMPTION
- [x] ISC-10: resend route accepts SUBMITTED and AWAITING_PAYMENT only, refuses when paidAt set
- [x] ISC-11: resend route ensures an intent exists before emailing
- [x] ISC-12: resend route writes an audit UPDATE entry with metadata.action payment_link_resent
- [x] ISC-13: shared helper builds paymentUrl and cancelUrl from NEXT_PUBLIC_APP_URL, slug, request id
- [x] ISC-14: cancel token is HMAC-SHA256 over tenantId, requestId, expiry using SESSION_SIGNING_SECRET
- [x] ISC-15: cancel token verify rejects tampered signature, wrong request id, and expired token (unit test)
- [x] ISC-16: new public route requests/[id]/cancel-by-token POST {token, reason} transitions CANCEL when valid
- [x] ISC-17: cancel-by-token refuses paid requests and non-cancellable statuses
- [x] ISC-18: pay page shows a "Cancel this request" section only when ?cancel=<token> is present
- [x] ISC-19: pay page cancel posts to cancel-by-token and renders a cancelled confirmation
- [x] ISC-20: payment-info returns a cancelled flag (no client secret) for cancelled or rejected requests
- [x] ISC-21: CANCEL on an unpaid request with an intent cancels the Stripe intent best-effort
- [x] ISC-22: email-events.ts registers payment_required with amount, paymentUrl, cancelUrl variables
- [x] ISC-23: email-templates.ts paymentRequiredEmail renders amount, Pay button, cancel link
- [x] ISC-24: email.ts TemplateVariables and renderTemplate include paymentRequired
- [x] ISC-25: paymentReminder template accepts paymentUrl and cancelUrl and renders both when given
- [x] ISC-26: cron reminder passes paymentUrl and cancelUrl to paymentReminder
- [x] ISC-27: cron has an abandoned-payment sweep over SUBMITTED, non-orphaned, paymentExempt=false, unpaid, older than grace
- [x] ISC-28: sweep transitions each via transitionRequest PAYMENT_REQUIRED with metadata.action abandoned_payment_sweep
- [x] ISC-29: cron results include abandonedPaymentsSwept counter
- [x] ISC-30: admin-actions.tsx shows Require Payment (reason form) when PAYMENT_REQUIRED is valid and unpaid
- [x] ISC-31: admin-actions.tsx shows Resend Payment Link for SUBMITTED or AWAITING_PAYMENT unpaid requests with APPROVE_EXEMPTION
- [x] ISC-32: queue-filter.tsx renders a Submitted (unpaid) section so same-day abandoned requests are visible
- [x] ISC-33: audit-trail.tsx labels submitted_awaiting_payment, awaiting_approval_awaiting_payment, payment_link_resent, abandoned sweep, member cancel via link
- [x] ISC-34: payment-exempt route accepts SUBMITTED as well as AWAITING_PAYMENT
- [x] ISC-35: bun typecheck and bun test pass across the monorepo
- [x] ISC-36: Anti: no change to webhook signature handling, Stripe account model, or PR #102 branch

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-3 | unit | vitest state-machine | green | bun test |
| 4-6, 21 | code | Read requests.ts hunks | present | Read |
| 7-12, 16-17, 20, 34 | code | Read route files | present | Read |
| 13-15 | unit | vitest cancel-token + links | green | bun test |
| 18-19, 30-32 | code | Read tsx; typecheck | green | tsc |
| 22-26 | unit | vitest renders template with links | green | bun test |
| 27-29 | code | Read cron hunk | present | Read |
| 33 | code | Read audit-trail labels | present | Read |
| 35 | build | turbo typecheck + test | exit 0 | Bash |
| 36 | git | diff --stat excludes webhook route; PR #102 branch sha unchanged | true | Bash |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| transition | PAYMENT_REQUIRED from AWAITING_APPROVAL, intent + amount + email | 1-6 | none | no |
| links-and-token | payment-links helper, cancel token sign/verify | 13-15 | none | yes |
| emails | payment_required event, template, reminder links | 22-26 | links-and-token | yes |
| admin-routes | payment-required, resend-payment-link, payment-exempt fix | 7-12, 34 | transition, emails | no |
| member-cancel | cancel-by-token route, pay page cancel UI, payment-info flag, intent cancel | 16-21 | links-and-token | no |
| sweep | cron abandoned sweep + reminder links | 26-29 | transition, emails | no |
| admin-ui | buttons, queue section, audit labels | 30-33 | admin-routes | no |
| verify | typecheck, tests, review | 35-36 | all | no |

## Decisions

- 2026-10-10: Cancel link is a signed token (HMAC over tenantId:requestId:exp with SESSION_SIGNING_SECRET), not a stored column. Avoids a migration, matches the existing session-signing pattern, and expires in 30 days.
- 2026-10-10: PAYMENT_REQUIRED allowed from SUBMITTED and AWAITING_APPROVAL only. ON_HOLD resumes to its prior state first; AWAITING_EXEMPTION_REVIEW already has Reject Exemption.
- 2026-10-10: Both admin actions use Permission.APPROVE_EXEMPTION, matching Grant Exemption and Reject Exemption, the existing payment-adjacent actions.
- 2026-10-10: Sweep grace is 1 hour at the 2am run, so anything left overnight is swept; same-day abandonment is covered by the new queue section.
- 2026-10-10: Delegation: Forge unavailable (codex CLI missing on this box). One Claude-family review agent at VERIFY.
- 2026-10-14: Advisor and code-review agent both consulted. Acted on: Stripe-state check before any "unpaid" action (late webhook), replace cancelled/mismatched intents and void the old one, 30 day lower bound on the sweep, cancel:v1 token prefix, token stripped from URL, orphan guards on resend/exempt/UI, intent voided on exemption, payment-info restricted to money-owed states, sweep no longer requires requesterId. Declined: Stripe idempotency keys (24h key reuse would return a cancelled intent after cancel-then-reopen), moving emails outside the transaction (existing documented pattern), route-level tests needing a database (DB suites only run in CI here).

## Changelog

- conjectured: paidAt null means unpaid, so every new action could key off it.
- refuted_by: advisor and reviewer both named the late-webhook window; Stripe is the source of truth for whether money moved.
- learned: any action that demands or forgives money must read the intent from Stripe first; paidAt is a cache.
- criterion_now: ISC-4, ISC-11, ISC-17, ISC-21 evidence records the Stripe read before acting.

## Verification

- ISC-1..3: packages/shared state-machine.ts AWAITING_APPROVAL gains PAYMENT_REQUIRED; state-machine.test.ts 19 passing incl. 3 new.
- ISC-4..6: requests.ts ensurePaymentIntent (ready/paid/no_price), PAYMENT_REQUIRED throws on no_price/paid, sendTransitionEmail case PAYMENT_REQUIRED sends paymentRequired with pay + cancel links.
- ISC-7..12: routes payment-required, resend-payment-link exist; orphan/paid/status guards; audit UPDATE payment_link_resent.
- ISC-13..15: payment-links.ts; payment-links.test.ts 10 passing.
- ISC-16..21: cancel-by-token route with Stripe in-flight check; pay page cancel form; payment-info cancelled flag + status gate; CANCEL/REJECT/exemption void intent or record paidAt.
- ISC-22..26: email-events payment_required + cancelUrl on reminder; templates; email.ts cases; cron passes links; payment-required-email.test.ts 6 passing.
- ISC-27..29: cron 1c2 sweep block, counter abandonedPaymentsSwept.
- ISC-30..33: admin-actions buttons + form; queue-filter Submitted (unpaid); audit-trail labels.
- ISC-34: payment-exempt accepts SUBMITTED, refuses orphans.
- ISC-35: bun run typecheck 5/5 tasks; bun run test shared 19, db 16, web 193 passing; lint 0 errors.
- ISC-36: git diff --stat origin/main excludes webhooks/stripe/route.ts; branch fix/audit-log-resend-and-email-noise untouched (no checkout, no commits).

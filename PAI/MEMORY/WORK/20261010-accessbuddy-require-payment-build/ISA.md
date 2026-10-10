---
task: "Build require-payment, resend-link, abandoned sweep, member cancel link"
slug: 20261010-accessbuddy-require-payment-build
project: accessbuddy
effort: advanced
effort_source: classifier
phase: build
progress: 0/36
mode: interactive
started: 2026-10-10T09:00:00+11:00
updated: 2026-10-10T09:00:00+11:00
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

- [ ] ISC-1: state-machine.ts allows PAYMENT_REQUIRED from AWAITING_APPROVAL as well as SUBMITTED
- [ ] ISC-2: requests.ts resolveNewStatus maps PAYMENT_REQUIRED from AWAITING_APPROVAL to AWAITING_PAYMENT
- [ ] ISC-3: shared state-machine test covers PAYMENT_REQUIRED from both states and rejects it from AWAITING_PROGRAMMING
- [ ] ISC-4: transitionRequest creates a Stripe intent on PAYMENT_REQUIRED when none exists
- [ ] ISC-5: transitionRequest persists paymentAmountCents and paymentExempt=false on PAYMENT_REQUIRED
- [ ] ISC-6: transitionRequest sends the paymentRequired email on PAYMENT_REQUIRED with pay and cancel links
- [ ] ISC-7: new route requests/[id]/payment-required exists, POST, permission APPROVE_EXEMPTION, body {reason}
- [ ] ISC-8: payment-required route refuses paid requests and orphaned requests with a 400
- [ ] ISC-9: new route requests/[id]/resend-payment-link exists, POST, permission APPROVE_EXEMPTION
- [ ] ISC-10: resend route accepts SUBMITTED and AWAITING_PAYMENT only, refuses when paidAt set
- [ ] ISC-11: resend route ensures an intent exists before emailing
- [ ] ISC-12: resend route writes an audit UPDATE entry with metadata.action payment_link_resent
- [ ] ISC-13: shared helper builds paymentUrl and cancelUrl from NEXT_PUBLIC_APP_URL, slug, request id
- [ ] ISC-14: cancel token is HMAC-SHA256 over tenantId, requestId, expiry using SESSION_SIGNING_SECRET
- [ ] ISC-15: cancel token verify rejects tampered signature, wrong request id, and expired token (unit test)
- [ ] ISC-16: new public route requests/[id]/cancel-by-token POST {token, reason} transitions CANCEL when valid
- [ ] ISC-17: cancel-by-token refuses paid requests and non-cancellable statuses
- [ ] ISC-18: pay page shows a "Cancel this request" section only when ?cancel=<token> is present
- [ ] ISC-19: pay page cancel posts to cancel-by-token and renders a cancelled confirmation
- [ ] ISC-20: payment-info returns a cancelled flag (no client secret) for cancelled or rejected requests
- [ ] ISC-21: CANCEL on an unpaid request with an intent cancels the Stripe intent best-effort
- [ ] ISC-22: email-events.ts registers payment_required with amount, paymentUrl, cancelUrl variables
- [ ] ISC-23: email-templates.ts paymentRequiredEmail renders amount, Pay button, cancel link
- [ ] ISC-24: email.ts TemplateVariables and renderTemplate include paymentRequired
- [ ] ISC-25: paymentReminder template accepts paymentUrl and cancelUrl and renders both when given
- [ ] ISC-26: cron reminder passes paymentUrl and cancelUrl to paymentReminder
- [ ] ISC-27: cron has an abandoned-payment sweep over SUBMITTED, non-orphaned, paymentExempt=false, unpaid, older than grace
- [ ] ISC-28: sweep transitions each via transitionRequest PAYMENT_REQUIRED with metadata.action abandoned_payment_sweep
- [ ] ISC-29: cron results include abandonedPaymentsSwept counter
- [ ] ISC-30: admin-actions.tsx shows Require Payment (reason form) when PAYMENT_REQUIRED is valid and unpaid
- [ ] ISC-31: admin-actions.tsx shows Resend Payment Link for SUBMITTED or AWAITING_PAYMENT unpaid requests with APPROVE_EXEMPTION
- [ ] ISC-32: queue-filter.tsx renders a Submitted (unpaid) section so same-day abandoned requests are visible
- [ ] ISC-33: audit-trail.tsx labels submitted_awaiting_payment, awaiting_approval_awaiting_payment, payment_link_resent, abandoned sweep, member cancel via link
- [ ] ISC-34: payment-exempt route accepts SUBMITTED as well as AWAITING_PAYMENT
- [ ] ISC-35: bun typecheck and bun test pass across the monorepo
- [ ] ISC-36: Anti: no change to webhook signature handling, Stripe account model, or PR #102 branch

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

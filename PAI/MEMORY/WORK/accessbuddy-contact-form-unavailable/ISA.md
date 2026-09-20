---
task: Find where AccessBuddy can show contact form unavailable
slug: accessbuddy-contact-form-unavailable
effort: E2
phase: complete
progress: 8/8
mode: algorithm
started: 2026-09-20
updated: 2026-09-20
---

## Problem
Nick asked whether any AccessBuddy surface can present a "contact form unavailable" state. Unknown whether it exists, where, and whether production can hit it.

## Goal
Name every code path that yields a contact-form-unavailable message, its trigger conditions, and production exposure, with file references. Read-only. No fix applied.

## Criteria
- [x] ISC-1: String search across code for "contact form ... unavailable" returns all hits
- [x] ISC-2: API route branch producing the message identified with line number
- [x] ISC-3: Destination resolver precedence read and documented
- [x] ISC-4: Default landing content destinationEmail value confirmed
- [x] ISC-5: UI surface rendering the form identified
- [x] ISC-6: Live Cloud Run env var names checked for CONTACT_EMAIL
- [x] ISC-7: Anti: no live form submission made (would email or log to prod)
- [x] ISC-8: Anti: no code or config modified (question, not a change request)

## Test Strategy
ISC-1..5 rg/Read on repo at af48f8e. ISC-6 read-only gcloud describe via ssh mac. ISC-7/8 by absence of POST and git status untouched.

## Decisions
- 2026-09-20: ISC floor (16) and delegation floor relaxed. Show your math: directed lookup answerable with rg + Read in under 30s per the Delegation Gate; splitting further adds no probes.
- 2026-09-20: Thinking capabilities used: FeedbackMemoryConsult (advice-not-action, no-form-submission memories shaped scope), ReReadCheck.
- 2026-09-20: Prod DB value of contact.destinationEmail NOT verified. Admin-auth only; prod DB access blocked in bg jobs per memory.

## Verification
- ISC-2: Read — apps/web/src/app/api/contact/route.ts:62-73 returns 503 "The contact form is temporarily unavailable. Please try again later."
- ISC-3: Read — landing-content.ts:255-259, CONTACT_EMAIL env then contact.destinationEmail then null
- ISC-4: Read — landing-content.ts:171 destinationEmail: ""
- ISC-5: rg — ContactForm rendered only at apps/web/src/app/page.tsx:498; error shown at contact-form.tsx:128
- ISC-6: gcloud — live env names include RESEND_API_KEY, no CONTACT_EMAIL, no CONTACT_FROM_EMAIL

## Iteration 2 (2026-09-20): fix requested by Nick
Goal: the landing contact form cannot fall into "unavailable" because of a blank destination.
- [x] ISC-9: resolver falls back to global admin emails when env and landing setting are blank (vitest 5/5)
- [x] ISC-10: Anti: global admin addresses never echoed to enquirer (route.ts fallbackHint branch)
- [x] ISC-11: undeliverable enquiry logged in full at error level
- [x] ISC-12: tsc clean, eslint clean, CI green on PR #100 (Build, Lint & Type Check, Test, Review all pass)
- [x] ISC-13: prod exposure confirmed via Cloud Logging: two 503s 2026-09-20T01:01Z, Belinda Porter SMLSC
- [DEFERRED-VERIFY] ISC-14: live form delivers after deploy. Blocked on Nick merging PR #100 (merge = prod deploy). Follow-up: after merge, check logs for absence of "no destination" and a delivered enquiry.
- [x] ISC-15: Anti: no merge to main, no prod config change, no live form submission made
Decisions:
- Rejected hardcoding support@accessbuddy.com.au: unverified mailbox, original code deliberately avoids dead inboxes. Global admin login emails are verified reachable.
- RLS: fallback reads admin_assignments on bare db, works while `accessbuddy` role bypasses RLS; set CONTACT_EMAIL before accessbuddy_app cutover (noted in code and PR).
- Work done in worktree ../code-contact-fix on branch fix/contact-form-never-unavailable; main checkout left on its existing branch.

## Iteration 3 (2026-09-20): merge and deploy, authorised by Nick
- [x] ISC-16: PR #100 merged 01:59Z, release PR #101 merged 02:00Z
- [x] ISC-17: Release workflow incl. Deploy to Cloud Run exit 0
- [x] ISC-18: live site reports 1.18.2, revision 00069-gj6 at 100% traffic
- [x] ISC-19: POST /api/contact with empty body returns 400 validation, route healthy
- [x] ISC-20: no ERROR logs on new revision
- [DEFERRED-VERIFY] ISC-14: real enquiry delivered to a global admin inbox. Needs one real submission by Nick.

---
task: Check login activity for two SMLSC AccessBuddy accounts
slug: 20260920-smlsc-belinda-login-check
effort: E3
effort_source: classifier
phase: verify
progress: 9/12
mode: algorithm
started: 2026-09-20T01:20:00Z
updated: 2026-09-20T01:51:20Z
---

## Problem

Belinda Porter (SMLSC) reports she cannot log in to AccessBuddy. Nick asked for the activity of membership@southmelbournelsc.com.au and belinda.porter@southmelbournelsc.com.au.

## Vision

Nick gets a dated, evidenced account of what each address did, and a cause for "can't log in" specific enough to reply to Belinda in one message and fix in one step.

## Out of Scope

No writes to prod. No granting Belinda a role, no editing her user row, no replying to her. The in-flight contact-form fix on `fix/contact-form-never-unavailable` belongs to another session and is not touched.

## Constraints

- Prod DB is private-IP; opening the public-IP window is not launched autonomously from a background job (see memory gotcha-automode-blocks-prod-db-window). Nick launches it.
- Read-only everywhere. SQL is SELECT-only and runs with `default_transaction_read_only=on`.
- Never print DATABASE_URL or tokens.

## Goal

Establish from prod evidence what both accounts did recently and why Belinda's sign-in does not get her into the club, with each claim tied to a log line, Firebase record, or DB row.

## Criteria

- [x] ISC-1: Auth endpoint request timeline for the last 7 days captured from Cloud Run logs
- [x] ISC-2: Belinda's sign-in session today reconstructed request by request
- [x] ISC-3: App log lines naming either address found and read in context
- [x] ISC-4: Firebase Auth record for membership@ retrieved (exists, enabled, last login)
- [x] ISC-5: Firebase Auth record for belinda.porter@ retrieved (exists, enabled, last login)
- [x] ISC-6: Post-login routing code read and the fall-through-to-`/` path identified
- [x] ISC-7: Admin activity by client IP summarised per day
- [x] ISC-8: Contact form 503 cause identified (no CONTACT_EMAIL on the live service)
- [x] ISC-9: SELECT-only SQL and hardened one-shot runner staged and syntax-checked
- [ ] ISC-10: DB confirms whether belinda.porter@ has a users row, admin assignment, or membership
- [ ] ISC-11: DB shows membership@ audit activity (logins, actions per day) for the last 30 days
- [ ] ISC-12: Anti: the Cloud SQL public-IP window is not left open (ipv4Enabled False after the run)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-3, 7 | log probe | gcloud logging read, filtered | lines returned | Bash over ssh mac |
| 4-5 | API probe | identitytoolkit accounts:lookup | 2 users found | curl over ssh mac |
| 6, 8 | code read | route + callback source | path named | Read/rg |
| 9 | static | `bash -n`, rg for write keywords | clean | Bash |
| 10-11 | SELECT | bp.sql sections 1-7 | rows returned | psql via bp-query.sh |
| 12 | config probe | IPV4_ENABLED_AFTER line | False | bp-query.sh output |

## Features

| name | satisfies | depends_on | parallelizable |
|------|-----------|------------|----------------|
| Log forensics | ISC-1,2,3,7,8 | none | yes |
| Firebase lookup | ISC-4,5 | none | yes |
| Routing code read | ISC-6 | none | yes |
| DB confirmation | ISC-9,10,11,12 | Nick launches bp-query.sh | no |

## Decisions

- 2026-09-20T01:25Z: Did not launch the Cloud SQL IP-window script from this background job. Memory records the classifier denying it and one incident where the window stayed open four hours. Staged the script and handed Nick a one-line launcher instead.
- 2026-09-20T01:40Z: Used Firebase identitytoolkit accounts:lookup (read-only, Nick's gcloud token on the Mac) to get last-login times without the DB. This carried most of the diagnosis.
- 2026-09-20T01:50Z: Process honesty. This run was executed as a direct evidence-led investigation. The E3 thinking-capability floor (four Skill-invoked capabilities) and the 32-ISC soft floor were not met; no capability is claimed that was not invoked. Twelve atomic ISCs cover the actual test surface.
- 2026-09-20T01:50Z: Left `code-contact-fix` (branch fix/contact-form-never-unavailable, uncommitted) untouched. It is another session's work.

## Verification

- ISC-1: log probe. 15 auth requests since 13 Sep: 5 send-magic-link, 2 session, 1 send-otp, 1 verify-otp, 2 webauthn/login, 4 scanner 405s.
- ISC-2: log probe. 103.232.162.113 Edge/Mac, 20 Sep 10:58:42 AEST send-magic-link 200, 10:59:27 /auth/callback, 10:59:29 POST /api/auth/session 200, then `/` and `/sign-in` only, no `/t/south-melb-lsc/*`. Link re-clicked 11:00:33 (304).
- ISC-3: log probe. `[contact] Submission received but no destination configured` with name Belinda and her address, 11:01:31 and 11:01:36 AEST, both POST /api/contact 503.
- ISC-4: API probe. membership@ created 13 Apr 2026, lastLogin 5 Sep 2026 17:42 AEST, lastRefresh 2026-09-20T00:59:28.039Z, enabled, verified.
- ISC-5: API probe. belinda.porter@ created 13 Apr 2026, lastLogin 20 Sep 2026 10:59 AEST, enabled, verified.
- ISC-6: code read. `auth-callback.tsx` lines 59-78: routes into the tenant only when `sessionData.tenantSlug` is set, otherwise `router.replace(redirectTo)` which is `/`.
- ISC-7: log probe. 103.232.162.113 admin page requests: 13 Sep 189, 14 Sep 31, 17 Sep 39, 20 Sep 0.
- ISC-8: config probe. Live service env has no CONTACT/SUPPORT/ADMIN_EMAIL variable; image 0b24140 (v1.18.1).
- ISC-9: static. `bash -n` clean; no write statements in bp.sql.

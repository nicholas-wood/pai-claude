---
task: Auto-resend lapsed renewal attestations weekly until the member completes them
slug: accessbuddy-attestation-auto-resend
effort: E3
phase: complete
progress: 34/34
mode: standard
started: 2026-09-04T12:20:00+10:00
updated: 2026-09-04T12:20:00+10:00
---

## Problem

When an admin renews a member, one attestation email goes out with a 7-day token. If the member does not act, the nightly cron marks the attestation expired and nothing else happens: no reminder, no visibility, and the member's fobs are never staged for the programmer. As of 4 Sep, 14 of 53 renewed SMLSC members have an expired attestation and 7 more are pending, none with a flagged fob (Dinah Boswell investigation, same day).

## Vision

A renewed member who ignores the attestation simply gets another one a week later, and another the week after, until they confirm their fobs. Admins do nothing. The programmer list fills itself as members respond. Nick sees the 14 lapsed members receive a fresh email on the first cron run after deploy.

## Out of Scope

No change to the attestation page or template copy. No change to Force Renew (separate defect, logged). No member-list UI for attestation status. No cap on the number of resends (Nick: "every week until they do it"). No change to the 7-day token length.

## Constraints

- Bulk mail goes through `enqueueEmail` at priority 2 so the 85/day queue budget and Resend cap are respected; never inline `sendTemplatedEmail` from the cron for a cohort.
- `attestation_requests` is FORCE RLS: every read/write inside `withTenant(tenantId, …)` per tenant.
- `attestation_requests.initiated_by` is NOT NULL: system-created rows carry the original attestation's initiator (no migration).
- Cadence is driven by `attestationTokenExpiryDays` (default 7): a lapsed attestation is replaced on the cron run after its token expires, so the member hears weekly.
- Only the membership's `current_season` is nagged; historical seasons are never resent.
- Pure decision logic lives in `apps/web/src/lib/attestation-resend-logic.ts` with vitest coverage, mirroring `email-queue-logic.ts`.
- Ship as a `feat:` commit on a feature branch, pushed for PR; no merge, no deploy from this session.

## Goal

The nightly cron replaces every lapsed current-season attestation for an active member with attestable credentials with a fresh pending attestation and queues the attestation email, audit-logged, so members are re-asked weekly until they complete; the change is unit-tested, typechecks, and is pushed as a PR-ready branch.

## Criteria

### Pure logic
- [x] ISC-1: `attestation-resend-logic.ts` exports `shouldAutoResend(input)` returning `{ resend: boolean; reason: string }`
- [x] ISC-2: Returns resend=false when latest attestation status is `completed`
- [x] ISC-3: Returns resend=false when latest attestation status is `pending` and token not yet expired
- [x] ISC-4: Returns resend=true when latest attestation status is `expired`
- [x] ISC-5: Returns resend=true when latest is `pending` but token expired (same cron run expires then resends)
- [x] ISC-6: Returns resend=false when attestation season differs from membership current_season
- [x] ISC-7: Returns resend=false when membership status is not `active`
- [x] ISC-8: Returns resend=false when member has zero active/expired credentials
- [x] ISC-9: Returns resend=false when member has no email
- [x] ISC-10: Returns resend=false when tenant setting `attestationAutoResend` is false
- [x] ISC-11: `nextTokenExpiry(now, days)` returns now + days at same wall time
- [x] ISC-12: vitest file `attestation-resend.test.ts` covers ISC-2..11 and passes

### Cron integration
- [x] ISC-13: Cron step 1b still expires pending-past-token attestations per tenant inside withTenant
- [x] ISC-14: New step 1b2 selects, per tenant, the latest attestation per (user, season) joined to membership, user email, and attestable-credential count
- [x] ISC-15: For each eligible row a new `attestation_requests` row is inserted: fresh 64-hex token, status pending, tokenExpiresAt = now + tenant days, initiatedBy = previous initiator
- [x] ISC-16: The previous attestation is left as `expired` (never mutated to pending)
- [x] ISC-17: `attestationRequested` email is enqueued (priority 2) with memberName and attestUrl for the new token, entity MEMBER/userId
- [x] ISC-18: Audit entry on MEMBER with metadata.action `attestation_auto_resent`, previousAttestationId, attestationId, season, cycle
- [x] ISC-19: `cycle` = count of prior attestations for that (user, season) so the audit shows "3rd reminder"
- [x] ISC-20: Cron results include `attestationsAutoResent` count
- [x] ISC-21: A member with multiple expired rows for the season is resent once per run (dedupe on latest row only)
- [x] ISC-22: `attestationRequested` is a queueable template type so the drain can send it

### Settings
- [x] ISC-23: `tenantSettingsSchema` gains `attestationAutoResend: z.boolean().default(true)`
- [x] ISC-24: Existing tenant settings JSON without the key parses with default true (zod default)

### Quality gates
- [x] ISC-25: `bun run typecheck` passes in apps/web
- [x] ISC-26: `bun run test` passes in apps/web (all suites)
- [x] ISC-27: `bun run lint` passes in apps/web
- [x] ISC-28: Change committed on branch `feat/attestation-auto-resend` with a `feat(attestation):` message
- [x] ISC-29: Branch pushed to origin; PR URL reported to Nick

### Anti-criteria
- [x] ISC-30: Anti: no inline `sendTemplatedEmail` added to the cron for the resend path (grep)
- [x] ISC-31: Anti: no historical-season attestation is eligible (unit test ISC-6)
- [x] ISC-32: Anti: no DB migration added (schema untouched, initiated_by reused)
- [x] ISC-33: Anti: nothing merged to main and no deploy triggered from this session
- [x] ISC-34: Anti: no prod data touched

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..11 | unit | vitest cases in attestation-resend.test.ts | all green | Bash `bun run test` |
| ISC-12 | unit | test file exists and runs | pass | Bash |
| ISC-13..22 | code | Read cron route + queue types | present | Read/Grep |
| ISC-23..24 | code | Read schemas.ts; zod default | present | Read |
| ISC-25..27 | gate | typecheck/test/lint output | exit 0 | Bash |
| ISC-28..29 | git | `git log`, `git push` output | present | Bash |
| ISC-30 | anti | grep cron for sendTemplatedEmail in 1b2 block | zero | Grep |
| ISC-31 | anti | unit test | pass | Bash |
| ISC-32 | anti | `git diff --stat packages/db` | empty | Bash |
| ISC-33 | anti | branch only; `git branch --show-current` | not main | Bash |
| ISC-34 | anti | no prod commands issued | zero | self-audit |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| logic | Pure eligibility + cadence helpers | ISC-1..11 | — | true |
| tests | vitest coverage for logic | ISC-12, ISC-31 | logic | true |
| settings | attestationAutoResend flag | ISC-23..24 | — | true |
| queue-type | attestationRequested queueable | ISC-22 | — | true |
| cron | Step 1b2 in daily cron | ISC-13..21 | logic, settings, queue-type | false |
| gates | typecheck/test/lint/commit/push | ISC-25..29 | all | false |

## Decisions

- 2026-09-04: Task ISA; feature reconciles to the project backlog on merge.
- 2026-09-04: Forge (E3 auto-include) skipped, show-your-math: codex CLI is not installed on this box (memory: gotcha-cato-codex-cli-missing); delegation floor relaxed for the same reason. Thinking floor met with FeedbackMemoryConsult, FirstPrinciples (constraint check on cadence/initiator), RootCauseAnalysis (carried from the Dinah run), ReReadCheck.
- 2026-09-04: New row per resend rather than re-tokening the expired row: keeps the audit lineage (cycle count) and leaves `expired` rows truthful. Initiator reused from the previous row to avoid a migration on a NOT NULL column.
- 2026-09-04: Season guard uses `tenant_memberships.current_season`, which the Renew click sets; this is the only signal that the admin intends this season's attestation.

## Verification

- ISC-1..11, ISC-31: `bun run test` in apps/web: 9 files passed, 172 tests (17 new in attestation-resend.test.ts covering completed, live pending, lapsed pending, expired, season mismatch, null season, inactive membership, zero credentials, no email, kill switch, absent setting, unknown status, token expiry, latest-per-member).
- ISC-12: file `apps/web/src/__tests__/attestation-resend.test.ts` present and run by vitest.
- ISC-13: cron 1b block unchanged (withTenant update pending→expired), followed by 1b2 in the same tenant loop.
- ISC-14..21: cron/daily/route.ts 1b2 block: one select of the tenant's attestations, `latestPerUserSeason`, batched membership/user/credential lookups via inArray, insert with randomBytes(32) hex token + nextTokenExpiry + previous initiatedBy, enqueueEmail attestationRequested priority default 2 entity MEMBER, createAuditEntry actorType system with action attestation_auto_resent / previousAttestationId / attestationId / season / cycle / tokenExpiryDays; results.attestationsAutoResent incremented.
- ISC-22: QUEUEABLE_TEMPLATE_TYPES includes "attestationRequested" (email-queue.ts).
- ISC-23/24: schemas.ts `attestationAutoResend: z.boolean().default(true)`; existing JSON parses with default (zod default semantics; test fixtures updated).
- ISC-25: `tsc --noEmit` exit 0 in apps/web and packages/shared. ISC-26: tests exit 0. ISC-27: eslint 0 errors (5 pre-existing warnings).
- ISC-28: commit e9b1797 `feat(attestation): auto-resend lapsed renewal attestations weekly` on branch feat/attestation-auto-resend. ISC-29: pushed, `[new branch]` confirmed; PR to open at github.com/nicholas-wood/accessbuddy/compare/main...feat/attestation-auto-resend.
- ISC-30: awk over the 1b2 block, `sendTemplatedEmail` count 0. ISC-32: `git diff --cached --stat -- packages/db` empty. ISC-33: branch is feat/attestation-auto-resend, main untouched, no merge. ISC-34: no prod commands this run.

## Changelog

- conjectured: a system-issued attestation would need a nullable initiator or a system user, i.e. a migration. refuted by: the previous attestation row already carries the renewing admin as `initiated_by`; reusing it keeps the NOT NULL constraint and the audit answer to "who started this renewal" truthful. learned: when a follow-up action is a continuation of a human-initiated one, inherit the initiator instead of inventing a system principal. criterion now: ISC-15 requires initiatedBy = previous initiator; ISC-32 forbids a migration.

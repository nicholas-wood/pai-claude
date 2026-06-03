---
task: Patch redteam findings F2.2 F2.3 F2.4
slug: 20260507-022052_redteam-c1-sse-idem
effort: advanced
phase: complete
progress: 26/26
mode: interactive
started: 2026-05-06T16:20:52Z
updated: 2026-05-06T16:20:52Z
---

## Context

Cycle 1 red-team patch worktree `c1-sse` on branch `fix/redteam-c1-sse-idem` off
`origin/dev` (b558a4d). Three CRITICAL findings remain in this branch:

- **F2.2** SSE event stream `/v1/callouts/:id/events:stream` has no participant
  scope check. Any tenant member who knows a `callout_id` can subscribe and
  watch every emission live (responder.accepted, responder.location_ping,
  broadcast.sent, etc.). Must gate on (a) active dispatcher row, (b) accepted
  responder row, or (c) `view_member_pii` role; 403 NOT_PARTICIPANT otherwise.
- **F2.3** `broadcast.sent` event payload publishes `recipient_ids` array of
  identified member ids. Replace with `recipient_count`. The push-worker
  currently relies on this list — refactor it to query the DB instead.
- **F2.4** `idempotency_keys` UNIQUE is `(tenant_id, key)` — two users in the
  same tenant collide and the second receives the first's response body. Add
  `actor_user_id text` column, flip UNIQUE to `(tenant_id, actor_user_id, key)`.
  Wire firebase_uid through middleware + repo signatures.

Out of scope: F1.x (already done in C1-identity), F2.1/F2.5/F2.6/F12.1
(already done in C1-PII), F9.x (cycle 2). The F2.5 co-responders gate is the
template for the F2.2 helper.

### Risks

- F2.2 helper duplication risk — must extract `assertCalloutParticipant` once
  and refactor the F2.5 co-responders site to use it (per brief).
- F2.3 push-worker silent regression — broadcasts stop firing if we drop
  `recipient_ids` without first switching the worker to DB lookup. Order of
  changes matters: switch the worker first, ensure tests stay green, THEN
  drop from publish payload.
- F2.4 migration ordering — ALTER must add the column nullable, drop the old
  UNIQUE, add new UNIQUE, backfill `'unknown'`, then NOT NULL. Existing dev
  rows will be backfilled to `'unknown'` per brief; backfill is acceptable.
- F2.4 middleware order — auth middleware sets `c.var.firebase` and
  `c.var.linked` before idempotencyMiddleware runs (per
  apps/api/src/index.ts). Must verify ordering before relying on it.
- Tenant isolation — every new repo function must use `currentTenantId()` and
  `assertSameTenantOnly`; every new SQL touching `idempotency_keys` requires
  `tenant_id` filter or it fails `lint:tenant`.

### Plan

Logical commits:
1. F2.4 migration (`0016_idempotency_actor_scope.sql`) + repo signatures + middleware + test.
2. F2.2 SSE participant gate + extracted `assertCalloutParticipant` helper +
   F2.5 site refactored to use it + test asserting non-participant 403.
3. F2.3 broadcast payload PII removal + push-worker DB-lookup refactor + test
   asserting `recipient_count` not `recipient_ids`.

Each commit cites the finding ID. Run `lint:au` + `lint:tenant` on touched
files only and `format` on touched files only after each commit.

## Criteria

### F2.4 — Idempotency actor-scope (10)

- [x] ISC-1: Migration file `packages/db/migrations/0016_idempotency_actor_scope.sql` exists
- [x] ISC-2: Migration adds `actor_user_id text` column (nullable initially)
- [x] ISC-3: Migration drops existing `(tenant_id, key)` UNIQUE constraint
- [x] ISC-4: Migration adds new `(tenant_id, actor_user_id, key)` UNIQUE constraint
- [x] ISC-5: Migration backfills existing rows with `actor_user_id='unknown'` then sets NOT NULL
- [x] ISC-6: `findIdempotencyHit` signature accepts `actor_user_id: string` and includes it in WHERE
- [x] ISC-7: `recordIdempotency` signature accepts `actor_user_id: string` and includes it in INSERT
- [x] ISC-8: `idempotencyMiddleware` reads firebase_uid from `c.var.firebase` (fallback to linked.member_id)
- [x] ISC-9: Middleware passes the actor as fourth keying dimension to both repo calls
- [x] ISC-10: Test asserts two actors with same key+body get separate replays (no cross-actor leak)

### F2.2 — SSE participant gate (8)

- [x] ISC-11: Helper `assertCalloutParticipant` exists in `apps/api/src/features/dispatch/participation.ts`
- [x] ISC-12: Helper checks active `callout_dispatcher` (left_at IS NULL) for the viewer user_id
- [x] ISC-13: Helper checks accepted-status `callout_responders` row for viewer's linked member_id
- [x] ISC-14: Helper checks `view_member_pii` role grant for the viewer user_id
- [x] ISC-15: SSE route returns 403 NOT_PARTICIPANT before opening the stream when none match
- [x] ISC-16: Co-responders route in `callouts.ts` refactored to use the same helper
- [x] ISC-17: Test asserts non-participant gets 403 NOT_PARTICIPANT on SSE route
- [x] ISC-18: Test asserts auth-required (401 without bearer) on SSE route

### F2.3 — broadcast.sent payload (7)

- [x] ISC-19: `broadcast.sent` event payload no longer includes `recipient_ids` field
- [x] ISC-20: `broadcast.sent` event payload still carries `recipient_count` integer
- [x] ISC-21: Push-worker `handleBroadcast` queries DB for recipient member_ids (not from event)
- [x] ISC-22: Push-worker uses `tenant_id` filter on the DB lookup (`lint:tenant` passes)
- [x] ISC-23: Test asserts publish payload omits `recipient_ids`
- [x] ISC-24: Test asserts publish payload preserves `recipient_count`
- [x] ISC-25: Test asserts push-worker reads recipients from DB (source-introspection)

### Cross-cutting (1)

- [x] ISC-26: `lint:au` + `lint:tenant` pass on all touched files

## Decisions

## Verification

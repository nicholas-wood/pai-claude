---
task: Mobile responder broadcast inbox + ack
slug: 20260507-004220_mobile-responder-broadcast-inbox-ack
effort: advanced
phase: build
progress: 0/30
mode: interactive
started: 2026-05-07T00:42:20Z
updated: 2026-05-07T00:50:00Z
---

## Context

UI_COVERAGE.md flagged the responder broadcast receive/ack path as the #1 mobile gap (UC-10 step 4). Dispatcher-side broadcast composer + send (FR-6e) already lands; backend `acknowledgeBroadcast()` exists; push-worker fans out per-recipient pushes. What's missing is the responder-facing surface: an inbox screen, a deliberate ack, status banner unread count, in-callout inline render, and a `/v1/me/broadcasts` GET. Worktree `feat/responder-broadcast-mobile` off origin/dev tip 08d8697.

### Plan

1. Backend: add `GET /v1/me/broadcasts` and `POST /v1/me/broadcasts/:id/ack` to `apps/api/src/routes/me.ts`. The POST delegates to existing `acknowledgeBroadcast()`. Idempotency-Key required, audit log entry written by the existing feature module.
2. Mobile: new `apps/mobile/lib/broadcasts.ts` (pure helpers + types — bun-test-friendly), new `apps/mobile/app/(tabs)/broadcasts.tsx` screen, status-screen banner, in-callout inline renderer, tab registration in `_layout.tsx`.
3. Push-worker: keep existing handler shape (it already fans out per-recipient pushes); add a `path` field to `data` so the deeplink target is unambiguous (`/(tabs)/broadcasts` for ack-required, `/callout/:id` otherwise).
4. Tests: `apps/api/src/routes/me-broadcasts.test.ts` (route shape + auth + filter + idempotency + tenant scope), `apps/mobile/lib/broadcasts.test.ts` (helpers + screen source-introspection asserting NEVER auto-acks per KICKOFF §6).
5. Commits: backend route + tests / mobile lib + screen + tests / mobile banners + tab / push-worker deeplink. Cite FR-6e, UC-10, KICKOFF §6.

### Risks

- Schema only allows `priority IN ('normal','high')` but brief mentions CRITICAL — I'll render NORMAL/HIGH only and document the divergence.
- `currentTenantId()` raw-SQL safety note in recent commits — keep raw `${tenant}` parameterised, never identifier interpolation.
- The dispatcher-side `/v1/broadcasts/:id/ack` must keep working (back-compat); add `/v1/me/...` as an additive route.
- Pull-to-refresh + optimistic clear consistent with stand-down inbox.
- AU lint will flag `dialog` if I write it as `dialog` instead of `dialogue` in comments.
- Existing standdown-inbox tests assert `/v1/me/standdowns?status=unacked` — I shouldn't change those.

## Criteria

Backend route — GET inbox:
- [ ] ISC-1: `GET /v1/me/broadcasts` is mounted on `meRoutes` in `apps/api/src/routes/me.ts`
- [ ] ISC-2: GET handler is wrapped in `authMiddleware` (401 without bearer)
- [ ] ISC-3: GET handler scopes by `currentTenantId()` (no cross-tenant leak)
- [ ] ISC-4: GET handler joins `broadcast_recipients.member_id = me.id` (no other-member leak)
- [ ] ISC-5: GET supports `?status=unread` (default) returning rows where `acknowledged_at IS NULL`
- [ ] ISC-6: GET supports `?status=all` returning unread + acknowledged rows
- [ ] ISC-7: GET rejects unknown status with `400 INVALID_STATUS`
- [ ] ISC-8: GET response carries broadcast_id, callout_id, callout_name, message, priority, ack_required, sent_at, sent_by_display, acknowledged_at
- [ ] ISC-9: GET handler is read-only (no UPDATE; KICKOFF §6 — listing never acks)

Backend route — POST ack:
- [ ] ISC-10: `POST /v1/me/broadcasts/:id/ack` is mounted on `meRoutes`
- [ ] ISC-11: POST is wrapped in `authMiddleware` AND `idempotencyMiddleware`
- [ ] ISC-12: POST delegates to existing `acknowledgeBroadcast()` feature
- [ ] ISC-13: POST is idempotent — replay returns 200 without double-mutating

Mobile inbox screen:
- [ ] ISC-14: `apps/mobile/app/(tabs)/broadcasts.tsx` exists and lists broadcasts
- [ ] ISC-15: Pure helpers extracted to `apps/mobile/lib/broadcasts.ts` (bun-test importable)
- [ ] ISC-16: Each row shows callout_name, priority badge, message, sent_at relative time
- [ ] ISC-17: Row tap navigates to `/callout/[id]` (not auto-ack)
- [ ] ISC-18: Acknowledge button only renders when `ack_required && !acknowledged_at`
- [ ] ISC-19: Acknowledge requires Alert.alert confirmation before POST (KICKOFF §6)
- [ ] ISC-20: Inbox load() is GET-only — no POST, no `/ack` URL inside load

Mobile banners + integrations:
- [ ] ISC-21: Status screen renders an unread-broadcast banner that links to inbox tab
- [ ] ISC-22: Status screen banner is read-only — never POSTs ack
- [ ] ISC-23: Callout `[id]` screen renders any broadcasts for that callout inline
- [ ] ISC-24: In-callout broadcast ack also goes through Alert.alert confirmation
- [ ] ISC-25: Tabs `_layout.tsx` registers the new broadcasts tab

Push-worker:
- [ ] ISC-26: handleBroadcast push body is `<sender>: <first 80 chars>` shape
- [ ] ISC-27: handleBroadcast push `data` includes a `path` deeplink target

Quality:
- [ ] ISC-28: Tests added — `me-broadcasts.test.ts` covers GET + POST + KICKOFF §6 invariants
- [ ] ISC-29: Tests added — `broadcasts.test.ts` covers helpers + screen never-auto-ack
- [ ] ISC-30: lint:au, lint:tenant, format pass on touched files

Anti-criteria:
- [ ] ISC-A1: Inbox screen does NOT POST ack on view, focus, or refresh
- [ ] ISC-A2: GET handler does NOT carry recipient member_ids beyond the caller
- [ ] ISC-A3: Push payload does NOT regress `recipient_ids` (F2.3)

## Decisions

(populated during BUILD)

## Verification

(populated during VERIFY)

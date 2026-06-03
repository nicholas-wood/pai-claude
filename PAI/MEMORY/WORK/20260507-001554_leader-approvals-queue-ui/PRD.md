---
task: Leader approvals queue UI and API audit
slug: 20260507-001554_leader-approvals-queue-ui
effort: advanced
phase: complete
progress: 26/26
mode: interactive
started: 2026-05-07T00:15:54Z
updated: 2026-05-07T00:20:00Z
---

## Context

Branch B03 from docs/COVERAGE_TO_100.md. Closes UC-2 — capability leader approves/rejects/suspends member capabilities — and scaffolds the missing `/dashboard/leader/*` UI tree. The C2 redteam branch already added `assertCapabilityLeaderOrStateAdmin` and gated the leaders.ts endpoints. This branch builds the UI and verifies/extends the API.

Worktree: `/Users/nicholaswood/Documents/workspace/lifesaveroncall-wt/leader`, branch `feat/leader-approvals-queue` off `origin/dev` tip `becc4d1`.

Cite: FR-3.1, FR-3.4, FR-3.5, UC-2 in commit messages.

### Key existing surface

- `apps/api/src/routes/leaders.ts` — already has approve / reject / suspend / lift / extend / outage-declare / outage-clear gated by `assertCapabilityLeaderOrStateAdmin`. Existing `/v1/approvals` and `/v1/outages` are unscoped (return all rows in tenant). Missing: `/v1/leader/suspensions`, viewer-scoped variants, base+cap join in outages list.
- `apps/web/app/dashboard/admin/_lib/permissions.ts` + `/v1/me/permissions` already expose `roles[]` with `role_code`, `scope_type`, `scope_id` — sufficient to derive `is_capability_leader` client-side without extending the endpoint shape.
- `apps/web/app/dashboard/admin/layout.tsx` — proven role-gate-with-403-panel pattern to copy.
- `apps/web/lib/api-client.ts` — auto-injects `Idempotency-Key` for POST/PATCH/PUT/DELETE.
- Push-worker subscribes only to `callout-events`, NOT `member-status`. Approve/reject DO publish `member.capability_status_changed` to `member-status`, but no consumer pushes it. Out of scope to wire that up — surface as a finding.

### Risks (from THINK)

- Filtering `/v1/leader/approvals` by viewer's leader scope requires a join from `member_capabilities` to user_roles; need to handle state_admin override (returns ALL caps in state).
- Extend endpoint already exists but its semantics flip status to `suspended`; suspensions list filter must use `status='suspended'` joined to capability info.
- Outages list needs base + capability info hydrated for the table; current shape only returns `base_capability_id`.
- Idempotency-Key auto-set in api-client — BUT POSTed retries (e.g. double-click Approve) generate a new UUID each time. Add explicit key per intended action via header override.

## Criteria

API:

- [x] ISC-1: Add `GET /v1/leader/approvals` returning pending member-capabilities filtered by viewer's leader scope
- [x] ISC-2: Approvals list joins capability + member display fields and supports `?page=` pagination
- [x] ISC-3: Approvals list returns `data` + `pagination.total` envelope
- [x] ISC-4: Approvals list 403 when viewer holds neither capability_leader nor state_admin
- [x] ISC-5: Approvals list state_admin sees all pending in tenant; capability_leader sees only their scoped caps
- [x] ISC-6: Add `GET /v1/leader/suspensions` returning current `status='suspended'` rows scoped to viewer
- [x] ISC-7: Suspensions list joins member full_name + capability display_label + suspended_until/review_at
- [x] ISC-8: Add `GET /v1/leader/outages` returning current outages joined to base name + capability label scoped to viewer
- [x] ISC-9: Outages list filters by `status='offline'` by default, accepts `?status=` override
- [x] ISC-10: Every new GET audit-logs nothing (read-only, per leaders.ts header convention) and tenant-isolates via withTenantContextAsync via authMiddleware

Web layout + landing:

- [x] ISC-11: NEW `apps/web/app/dashboard/leader/layout.tsx` fetches `/v1/me/permissions`
- [x] ISC-12: Layout renders 403 panel when viewer holds neither capability_leader role nor state_admin
- [x] ISC-13: Layout sidebar links to Approvals queue, Suspensions, Outages
- [x] ISC-14: NEW `apps/web/app/dashboard/leader/page.tsx` shows summary tiles (pending approvals, active suspensions, current outages)
- [x] ISC-15: Dashboard header gains a "Leader" link visible when viewer has capability_leader role or state_admin

Approvals UI:

- [x] ISC-16: NEW `apps/web/app/dashboard/leader/approvals/page.tsx` paginated table with member, capability, requested_at, source, Approve/Reject buttons
- [x] ISC-17: NEW `apps/web/app/dashboard/leader/approvals/[id]/page.tsx` detail view with member context, history, Approve/Reject with optional reason

Suspensions UI:

- [x] ISC-18: NEW `apps/web/app/dashboard/leader/suspensions/page.tsx` table of suspended caps with Lift / Extend buttons

Outages UI:

- [x] ISC-19: NEW `apps/web/app/dashboard/leader/outages/page.tsx` table of current outages with Clear button + form to declare outage

Wiring + behaviour:

- [x] ISC-20: Approve / Reject / Lift / Extend / Clear actions POST with explicit Idempotency-Key
- [x] ISC-21: Successful action triggers Next.js `router.refresh()` so list re-renders (revalidatePath equivalent for client-island actions)

Tests:

- [x] ISC-22: NEW api test asserts `/v1/leader/approvals` requires bearer (401) and gates on assertCapabilityLeaderOrStateAdmin
- [x] ISC-23: NEW api test asserts approvals list filters by viewer leader scope (source-introspection style consistent with admin-ui-authz.test.ts)
- [x] ISC-24: NEW web test asserts leader layout renders 403 panel when permissions returns no leader role
- [x] ISC-25: NEW api tests cover suspensions and outages list endpoints (auth + audit-forensics convention)

Quality:

- [x] ISC-26: `bun run lint:au && bun run lint:tenant && bun run format` clean on touched files; existing tests still pass

## Decisions

### Plan

1. **API extension.** Add a new section in `apps/api/src/routes/leaders.ts` with three GET endpoints under `/v1/leader/*`. Don't modify existing `/v1/approvals` and `/v1/outages` to avoid breaking unknown callers. New endpoints share a `viewerScopedFilter` helper that returns SQL fragment + params. State_admin path computed via `assertStateAdmin` (not the cap-specific gate) so the filter is bypassed correctly.
2. **Web layout.** Mirror `apps/web/app/dashboard/admin/layout.tsx` exactly. Replace `is_state_admin` check with `isStateAdmin || hasAnyCapabilityLeaderRole`. Sidebar lists Approvals / Suspensions / Outages.
3. **Approvals page.** Server component (mirrors `admin/users/page.tsx`). Approve/Reject buttons in a small client island — `revalidatePath` + `useRouter().refresh()` after action.
4. **Detail page.** `[id]/page.tsx` shows full member context, capability info, status history (audit_log filtered to this member_capability_id), Approve/Reject form with optional reason textarea.
5. **Suspensions and Outages pages.** Same server-component pattern; client islands for action buttons.
6. **Tests.** Source-introspection style for API gating (consistent with `admin-ui-authz.test.ts`), bun:test source pin for the layout's role-gate logic, no Postgres needed.
7. **Commit chunks:**
   - chunk 1: API endpoints (`/v1/leader/approvals|suspensions|outages`) + tests
   - chunk 2: Layout + landing page + sidebar link in dashboard layout
   - chunk 3: Approvals list + detail + actions
   - chunk 4: Suspensions list + actions
   - chunk 5: Outages list + actions

(populated in BUILD)

## Verification

API endpoint behaviour: 25/25 source-introspection tests in `leaders-listing.test.ts` pass — covers 401-without-bearer, readLeaderGate composition, viewerCapabilityFilter scope semantics (TRUE for state_admin, IN-subquery with COALESCE for capability_leader), no-recordAudit invariant, base+capability JOINs on outages, and { data, pagination, via } envelope shape.

Existing `leaders-authz.test.ts` 7/7 pass after roles.ts import widening (no regression).

Web layout role-gate: 10/10 source-introspection tests in `layout.test.ts` pass — confirms 403 panel renders when neither is_state_admin nor is_capability_leader holds, sidebar lists all four sections, permissions client derives is_capability_leader from roles[] without a second API call, and treats both NULL scope_id and scope_type='global' as a global grant.

Lint + format: `bun run lint:au` and `bun run lint:tenant` clean; `bunx prettier --check` reports all touched files conform.

Pre-existing test failures in `apps/api/` (currentTenantId import error) reproduce on bare `origin/dev` baseline — confirmed via `git stash` round-trip — unrelated to this branch.

Push notification finding: leader actions DO publish `member.capability_status_changed` to topic `member-status` (verified in leaders.ts emitCapStatusChanged). Push-worker subscribes only to `callout-events`; no consumer pushes `member-status` events today. Documenting as a follow-up: a separate branch should add a member-status subscription to push-worker so approve/reject reach the member's device.

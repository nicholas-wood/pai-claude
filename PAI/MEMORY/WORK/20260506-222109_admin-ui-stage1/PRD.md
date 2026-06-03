---
task: Build admin UI stage 1
slug: 20260506-222109_admin-ui-stage1
effort: advanced
phase: complete
progress: 30/30
mode: interactive
started: 2026-05-06T22:21:09Z
updated: 2026-05-06T23:05:00Z
---

## Context

Build a stage-1 admin section at `/dashboard/admin/*` for LifesaverOnCall. The product currently only has a base capability-toggle modal. The admin needs read-only views over Users / Roles / Capabilities catalogue / Organisations / Bases / Audit log, plus mutations for capability display labels and role grant/revoke. Whole admin section is gated by `state_admin` role (or `LIMSOC_DEV_TRUST_TOKEN` in dev). Six logical commits: API, web shell, users+roles, capabilities+orgs, bases+audit, tests.

Core pieces already in place:
- `assertStateAdmin` and `auditForensics` in `apps/api/src/features/auth/roles.ts`.
- `recordAudit` plumbs `ip_address` + `user_agent` per F11.2.
- `roles` repo has `userHasRole`, `grantRole`; needs new `listUserRoles` and `revokeRole`.
- `users` table has no `last_login` column — surface `members.last_login_at` via the link instead.
- All routes mount under `/v1/...`; admin shell expects a `/v1/me/permissions` endpoint.

Cite FR/UC: NFR-10 (audit), FR-3 (capabilities), FR-5.6 (`view_member_pii`), FR-6.16 (`state_admin`), FR-7.1 (admin actions via API), F9.1/F9.2 (gates).

### Risks

- `users` table lacks `last_login`. Document and surface `members.last_login_at` via linked_credentials join instead. No new schema.
- `roles` repo has `userHasRole` and `grantRole` but lacks `listUserRoles` and `revokeRoleById` — must add (existing repo only).
- `idempotencyMiddleware` sits before `authMiddleware` only when bound on routes; admin routes must place `authMiddleware` first.
- `state_admin` scope: a state_admin row carries a `state` scope. The viewer's state comes from `process.env.DEV_TENANT_STATE` in dev — gate must check that scope.
- AU English: the lint rule will FAIL on `authorize`. Use `authorise`/`authorisation` everywhere. Other tripwires: `organization`, `color`.
- `idempotencyMiddleware` requires `Idempotency-Key` header on every state-changing route, including PATCH and DELETE.
- Web layout uses Next.js 15 server components — calling `/v1/me/permissions` must use the existing `apiFetch` helper from `lib/api-client`.

### Plan

API (commit 1):
- Create `apps/api/src/routes/admin-ui.ts`. Mount in `apps/api/src/index.ts`.
- Endpoints: `GET /v1/admin/users`, `GET /v1/admin/users/:user_id`, `GET /v1/admin/roles`, `POST /v1/admin/roles`, `DELETE /v1/admin/roles/:id`, `PATCH /v1/admin/capabilities/:id`, `GET /v1/admin/audit-log`, `GET /v1/me/permissions`.
- All gated except `/v1/me/permissions` (anyone authenticated may ask their own permissions).
- Add `listUserRoles`, `listAllRoles`, `revokeRoleById` to `packages/db/src/repos/roles.ts`.

Web (commits 2-5):
- New `apps/web/app/dashboard/admin/layout.tsx` with sidebar + role gate.
- Pages: landing summary, users list, user detail, roles per user, capabilities catalogue, organisations tree, bases list, audit log.
- Reuse existing `apiFetch` for SSR fetches.

Tests (commit 6):
- `admin-ui-authz.test.ts` — every endpoint 401-without-bearer + source-introspection assertions for `assertStateAdmin` calls.
- Web component-existence smoke (no Next.js runtime).

## Criteria

API endpoints (commit 1):
- [x] ISC-1: `GET /v1/admin/users` returns array of users with member join columns
- [x] ISC-2: `GET /v1/admin/users` calls `assertStateAdmin` and 403s on no role
- [x] ISC-3: `GET /v1/admin/users/:user_id` returns single user with linked_credential and member
- [x] ISC-4: `GET /v1/admin/roles?user_id=` returns array of role grants for that user
- [x] ISC-5: `POST /v1/admin/roles` grants a role, idempotent on (user_id, role_code, scope_type, scope_id)
- [x] ISC-6: `POST /v1/admin/roles` writes audit row with action `role_granted`
- [x] ISC-7: `DELETE /v1/admin/roles/:id` revokes the role grant by id
- [x] ISC-8: `DELETE /v1/admin/roles/:id` writes audit row with action `role_revoked`
- [x] ISC-9: `PATCH /v1/admin/capabilities/:id` updates `display_label` and `display_description` only
- [x] ISC-10: `PATCH /v1/admin/capabilities/:id` rejects attempts to change `code` field
- [x] ISC-11: `GET /v1/admin/audit-log` returns paginated rows with `?page=&page_size=`
- [x] ISC-12: `GET /v1/admin/audit-log` accepts `?actor=&action=&target_type=&since=&until=` filters
- [x] ISC-13: `GET /v1/me/permissions` returns viewer's role-grant rows, no role required
- [x] ISC-14: All admin endpoints route through `authMiddleware` before any handler logic
- [x] ISC-15: `admin-ui` routes are mounted in `apps/api/src/index.ts`

Repo additions (commit 1):
- [x] ISC-16: `roles` repo exports `listUserRoles(user_id)` returning role rows
- [x] ISC-17: `roles` repo exports `listAllRoleGrants(filters)` for admin list view
- [x] ISC-18: `roles` repo exports `revokeRoleById(id)` deleting the user_roles row

Web shell (commit 2):
- [x] ISC-19: `/dashboard/admin/layout.tsx` exists and fetches `/v1/me/permissions`
- [x] ISC-20: Layout shows sidebar with 6 sections (Users, Roles, Capabilities, Orgs, Bases, Audit)
- [x] ISC-21: Layout renders 403 page when viewer lacks `state_admin` role
- [x] ISC-22: `/dashboard/admin/page.tsx` shows summary tiles for each section

Web pages (commits 3-5):
- [x] ISC-23: `/dashboard/admin/users/page.tsx` lists users with email, member name, link status
- [x] ISC-24: `/dashboard/admin/users/[uid]/page.tsx` shows identity + roles + audit tabs
- [x] ISC-25: User detail page has grant-role button and revoke-role buttons per row
- [x] ISC-26: `/dashboard/admin/capabilities/page.tsx` lists 8 capabilities with inline edit
- [x] ISC-27: `/dashboard/admin/organisations/page.tsx` shows read-only org tree
- [x] ISC-28: `/dashboard/admin/bases/page.tsx` lists bases with search and state filter
- [x] ISC-29: `/dashboard/admin/audit/page.tsx` shows paginated audit log with filters

Tests + verification (commit 6):
- [x] ISC-30: `admin-ui-authz.test.ts` verifies 401-without-bearer and `assertStateAdmin` is wired

## Decisions

- `last_login` for users surfaces from `members.last_login_at` via the linked_credentials join. Users without a linked member show `null`. No schema change.
- `/v1/me/permissions` is NOT gated by state_admin — it must be callable by anyone so the layout can decide what to render.
- Bases admin page reuses the existing `/v1/bases` list + `BaseDetailPanel`-style content; no new endpoints needed for the bases section.
- Audit log filters use `actor_user_id` (not display name) for `?actor=` to keep server filtering deterministic.
- ULID generation for new role grants uses `newId("user_role")` — already the pattern in `grantRole`.
- All POST/PATCH/DELETE require `Idempotency-Key`; the middleware enforces it.

## Verification

- All 30 ISC criteria pass.
- 20/20 new tests in `admin-ui-authz.test.ts` green; 63/63 across all four authz test files.
- AU English lint + tenant-isolation lint pass on whole repo.
- 6 commits on branch `feat/admin-ui`:
  - `c58c344` feat(api): admin UI endpoints + role mutations + audit-log query
  - `8ddbef5` feat(web): admin shell — sidebar, role gate, landing tiles
  - `0fa9654` feat(web): admin users list + user-detail with role grant/revoke
  - `92bdcbd` feat(web): admin capabilities catalogue + organisations tree
  - `c6a35db` feat(web): admin bases list + audit log viewer
  - `82e5a55` test(api): admin-ui route authorisation invariants
- Pre-existing failures NOT introduced by this branch:
  - `bun --filter @lifesaveroncall/api typecheck` fails on `bun-types` and TS6310 (also fails on baseline 1f76390).
  - `apps/api/src/routes/me-limsoc.test.ts` fails because its `mock.module("@lifesaveroncall/db")` is missing `roles` (also fails on baseline).

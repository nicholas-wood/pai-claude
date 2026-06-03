---
task: Extend admin UI capability approval and bases edit
slug: 20260505-153000_admin-extensions-cap-bases
effort: advanced
phase: verify
progress: 52/52
mode: interactive
started: 2026-05-05T15:30:00Z
updated: 2026-05-05T15:38:00Z
---

## Context

LifesaverOnCall admin UI extension on branch `feat/admin-extensions` (worktree `admin-ext`, off origin/dev tip `b58710b`). Two missing edit surfaces:

1. **Capability "Requires approval" toggle** — `capabilities.approval_required boolean` ALREADY EXISTS (since migration 0004) and the onboarding flow ALREADY branches on it (`onboard-member.ts:124`), but admins cannot edit it. The PATCH `/v1/admin/capabilities/:id` allowlist excludes `approval_required` and the admin UI renders it as a static "Yes/No". Maps to **FR-3.2** ("Per capability, admin configures: required award, `approval_required` flag, ...").

2. **Bases full edit** — admin bases page is view-only; only the capability toggle modal exists. Need full CRUD on the editable fields: name, organisation_id, lat/lng, active, coordinator_member_id. There is a legacy `PATCH /v1/bases/:id` in `admin.ts` (no state_admin gate, no audit, limited allowlist) that handles operational_notes/access_details/address. Plan: ADD a new gated `PATCH /v1/admin/bases/:id` (state_admin + audited) for the new editable fields; leave the legacy route alone to avoid breaking unknown callers. Maps to **FR-3.3** (operational base belongs to an org, hosts capabilities), **FR-6.16** + **NFR-10.1** (admin-gated + audited).

### Key existing components (reused, NOT recreated)

- `apps/web/components/ui/MultiSelectPicker.tsx` — has `single` mode; will use for org + coordinator pickers.
- `apps/web/components/map/ConfigureCapabilitiesModal.tsx` — reuse via "Configure capabilities" button on the new edit page.
- `apps/web/lib/coords.ts` — `parseCoord` (lenient DD/DDM/DMS parser) and `formatCoord` plus `CoordFormat`.
- `apps/web/app/dashboard/callouts/[id]/incident-info-panel.tsx` — on-blur autosave pattern with optimistic updates + per-field SaveIndicator. Mirror this pattern.
- `apps/web/lib/api/picker-options.ts` — already has `listOrgs`.

### Out of scope

- Base CREATE/DELETE
- Member CRUD beyond search endpoint
- Capability grant approval workflow UI (B03 branch)
- Schema changes (no migration 0019 needed — column already exists)
- Touching the legacy `PATCH /v1/bases/:id` (would risk breaking unknown clients)

### Risks

- The legacy `PATCH /v1/bases/:id` is unaudited + ungated. Leaving it is a lurking issue but out of scope.
- `coordinator_member_id` was added in 0013 alongside the existing `base_manager_member_id` (0004). The kickoff and the `listVisibleBases` repo standardise on `coordinator_member_id`; we follow that.
- Member search returns PII (full_name) — gate on state_admin; do NOT add to public capability picker.
- Bigger autosave coordination (org change might invalidate base coords if outside state) — out of scope; admin can fix coords next.

## Criteria

### Fix 1 — Capability approval-required toggle (API)

- [x] ISC-1: PATCH `/v1/admin/capabilities/:id` accepts `approval_required: boolean`
- [x] ISC-2: PATCH rejects `approval_required` non-boolean with 400 INVALID_APPROVAL_REQUIRED
- [x] ISC-3: PATCH no-op guard treats `approval_required` as a meaningful field (not "no fields")
- [x] ISC-4: Audit row payload includes before+after `approval_required`
- [x] ISC-5: PATCH still state_admin gated and idempotency-keyed (no regression)

### Fix 1 — Capability approval-required toggle (UI)

- [x] ISC-6: Admin capabilities table renders "Requires approval" as a checkbox (not Yes/No text)
- [x] ISC-7: Toggling the checkbox PATCHes `approval_required` immediately
- [x] ISC-8: Save indicator shows saving / saved on toggle
- [x] ISC-9: Failed PATCH reverts checkbox state and surfaces error

### Fix 2 — Member search endpoint

- [x] ISC-10: GET `/v1/admin/members?q=` returns id + full_name + home_organisation_id
- [x] ISC-11: Endpoint state_admin gated; returns 403 INSUFFICIENT_ROLE for non-admin
- [x] ISC-12: Empty `q` returns first 50 active members alphabetically
- [x] ISC-13: Non-empty `q` filters case-insensitive substring on full_name
- [x] ISC-14: Result capped at 50 rows

### Fix 2 — Bases PATCH endpoint

- [x] ISC-15: PATCH `/v1/admin/bases/:id` allowlist accepts only {name, organisation_id, location:{lat,lng}, active, coordinator_member_id}
- [x] ISC-16: PATCH returns 403 INSUFFICIENT_ROLE for non-state_admin
- [x] ISC-17: PATCH validates location is two finite numbers in lat[-90,90], lng[-180,180]
- [x] ISC-18: PATCH validates organisation_id exists in tenant or 400 INVALID_ORGANISATION
- [x] ISC-19: PATCH validates coordinator_member_id exists in tenant or 400 INVALID_COORDINATOR
- [x] ISC-20: PATCH writes UPDATE with PostGIS ST_MakePoint when location supplied
- [x] ISC-21: PATCH audit-log row carries field-by-field before/after diff
- [x] ISC-22: PATCH requires Idempotency-Key header

### Fix 2 — Bases admin UI list + detail

- [x] ISC-23: `/dashboard/admin/bases` row "View" link replaced with "Edit" linking to `/dashboard/admin/bases/[id]`
- [x] ISC-24: New `/dashboard/admin/bases/[id]/page.tsx` shows form fields for all 5 editable fields plus Configure capabilities button
- [x] ISC-25: Name field saves on blur via PATCH
- [x] ISC-26: Active checkbox saves on change via PATCH
- [x] ISC-27: Organisation single-select MultiSelectPicker saves on change via PATCH
- [x] ISC-28: Coordinator single-select MultiSelectPicker (sourced from member search) saves on change via PATCH
- [x] ISC-29: Coordinates single input parses on blur (DD/DDM/DMS) and saves valid result via PATCH
- [x] ISC-30: Coord format dropdown DD/DDM/DMS persists to localStorage `admin-base-edit:coord-format`

### Fix 3 — Capability soft-delete + add + restore

Schema (migration 0020):

- [x] ISC-31: Migration 0020 adds `deleted_at TIMESTAMPTZ NULL` to capabilities
- [x] ISC-32: Migration 0020 adds `is_canonical boolean DEFAULT false` to capabilities
- [x] ISC-33: Migration 0020 backfills `is_canonical=true` for the 8 canonical codes
- [x] ISC-34: Migration 0020 adds index on capabilities WHERE deleted_at IS NULL

API:

- [x] ISC-35: GET `/v1/capabilities` filters `deleted_at IS NULL`
- [x] ISC-36: GET `/v1/capabilities` includes `is_canonical` in row payload
- [x] ISC-37: GET `/v1/capabilities?include_deleted=1` admin-gated returns soft-deleted rows
- [x] ISC-38: POST `/v1/admin/capabilities` creates a row, state_admin gated, idempotent on (tenant, code)
- [x] ISC-39: POST `/v1/admin/capabilities` validates code regex `^[A-Z][A-Z0-9_]*$`
- [x] ISC-40: POST `/v1/admin/capabilities` audit-logs creation
- [x] ISC-41: DELETE `/v1/admin/capabilities/:id` soft-deletes (sets deleted_at=now()), state_admin gated
- [x] ISC-42: DELETE refuses canonical caps with 409 CAPABILITY_CANONICAL
- [x] ISC-43: DELETE refuses with 409 CAPABILITY_IN_USE when active member_capabilities exist
- [x] ISC-44: DELETE 409 CAPABILITY_IN_USE response includes affected member + base counts
- [x] ISC-45: DELETE on already-soft-deleted cap is idempotent 200
- [x] ISC-46: DELETE audit-logs `capability_soft_deleted`
- [x] ISC-47: POST `/v1/admin/capabilities/:id/restore` clears deleted_at, audit-logs restore
- [x] ISC-48: All UI-list reads (capabilities, dispatch, picker-options) skip soft-deleted

UI:

- [x] ISC-49: Admin capabilities page has "+ New capability" button opening a form
- [x] ISC-50: Admin capabilities row shows Delete button; canonical rows show disabled Delete with tooltip
- [x] ISC-51: 409 CAPABILITY_IN_USE surfaces counts to the admin
- [x] ISC-52: "Show deleted" toggle reveals soft-deleted rows with a Restore button

### Anti-criteria

- [x] ISC-A1: NO migration created (column already exists) — REVISED: Fix 3 adds 0020 (different concern: soft-delete + canonical, not approval_required)
- [x] ISC-A2: Legacy `PATCH /v1/bases/:id` left untouched
- [x] ISC-A3: NO base CREATE/DELETE UI added
- [x] ISC-A4: NO push to remote

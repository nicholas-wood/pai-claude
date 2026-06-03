---
task: Implement B08 outage mark-and-clear features
slug: 20260505-090000_b08-outage-mark-clear
effort: advanced
phase: build
progress: 0/26
mode: interactive
started: 2026-05-05T09:00:00Z
updated: 2026-05-05T09:00:00Z
---

## Context

Branch B08 (`feat/outage-mark-and-clear`) from docs/COVERAGE_TO_100.md for the lifesaveroncall project. Existing state:
- `capability_outages` table already has `expected_return_at` (migration 0005) — no new migration needed
- POST `/v1/bases/:baseId/capabilities/:capId/outage` already accepts `expected_return_at`
- POST `/v1/outages/:id/clear` exists
- /dashboard/leader/outages page already lists outages with declare-form + clear-button
- B09 already shows outage badges on the dispatch map markers

Remaining gaps this branch closes:
1. Mid-incident dispatcher mark — surfaced via BaseDetailPanel inline (FR-3.5 / FR-5.8)
2. Background sweeper auto-clear past expected_return_at (FR-N operational hygiene)
3. BaseDetailPanel renders an Outages section listing active outages with role-gated Clear button
4. CalloutDetailPanel surfaces a warning chip when any target base has an active outage

### Risks
- Schema uses `cleared_at` (not `ended_at` per task wording). Auto-clear writes `cleared_at = expected_return_at` and `status = 'online'`. `cleared_by` left NULL (no human actor).
- The outage-escalation sweep runs at slow cadence (60s); auto-clear runs at the same cadence so no extra timer plumbing required.
- Viewer permissions are runtime via `/v1/me/permissions` — fetch once in the panel; render the action surfaces only when known.

### Plan
1. **Sweeper** `apps/sweeper/src/outage-auto-clear.ts` — `sweepAutoClearOutages` runs at slow cadence inside the existing `Promise.allSettled` block; updates outages where `expected_return_at IS NOT NULL AND expected_return_at <= now() AND cleared_at IS NULL AND status IN ('offline','overdue')`; for each, records a `outage_auto_cleared` audit entry with `actor_user_id = "system-sweeper"`.
2. **Sweeper test** `apps/sweeper/src/outage-auto-clear.test.ts` — DB integration test mirrors the dev-location-heartbeat pattern; inserts a past-expected outage, runs the sweep, asserts row clears.
3. **Web BaseDetailPanel** — load viewer permissions and render an "Outages" section listing active rows with a "Clear" button gated by capability-leader-for/state-admin; "Declare outage" button opens an inline form (capability multi-select + reason + optional expected return).
4. **Web CalloutDetailPanel** — fetch `listBases` once and look up each `target_bases[i]` by id; render a warning chip per active outage on those bases.
5. **Tests** — BaseDetailPanel renders outage rows + clear button calls API.
6. **No new migration** — column already present.

## Criteria

Sweeper auto-clear:
- [ ] ISC-1: New file apps/sweeper/src/outage-auto-clear.ts exists
- [ ] ISC-2: sweepAutoClearOutages exported from new file
- [ ] ISC-3: Sweep clears outages where expected_return_at <= now()
- [ ] ISC-4: Sweep skips outages with cleared_at already set
- [ ] ISC-5: Sweep skips outages with NULL expected_return_at
- [ ] ISC-6: Cleared row sets cleared_at = expected_return_at exactly
- [ ] ISC-7: Cleared row sets status to 'online'
- [ ] ISC-8: recordAudit called with action 'outage_auto_cleared'
- [ ] ISC-9: Sweep runs inside withTenantContextAsync
- [ ] ISC-10: Sweep wired into apps/sweeper/src/index.ts slow tick
- [ ] ISC-11: Sweep returns count of cleared rows

Sweeper test:
- [ ] ISC-12: New file apps/sweeper/src/outage-auto-clear.test.ts exists
- [ ] ISC-13: Test skips when DATABASE_URL missing
- [ ] ISC-14: Test asserts past-expected outage gets cleared_at set
- [ ] ISC-15: Test asserts non-expired outage is untouched

Web BaseDetailPanel:
- [ ] ISC-16: Outages section renders when capability_outages non-empty
- [ ] ISC-17: Each outage row shows capability label + declared-at + expected-return
- [ ] ISC-18: Clear button visible when viewer is capability-leader for that capability
- [ ] ISC-19: Clear button visible when viewer is state_admin
- [ ] ISC-20: Clear button POSTs /v1/outages/{id}/clear with idempotency key
- [ ] ISC-21: Declare outage button visible when viewer has any leader/admin role
- [ ] ISC-22: Declare form posts to existing endpoint with expected_return_at

Web CalloutDetailPanel:
- [ ] ISC-23: Renders BASE OUTAGE warning chip per active outage on target bases
- [ ] ISC-24: Warning chip absent when target bases have no active outages

Tests:
- [ ] ISC-25: BaseDetailPanel test asserts outage row rendering
- [ ] ISC-26: Sweeper test passes against the seeded DB

Anti-criteria:
- ISC-A1: No new migration files added (column already exists)
- ISC-A2: Existing /v1/outages/:id/clear endpoint not modified
- ISC-A3: AU spelling preserved in new copy

## Decisions

- **No new migration** — `expected_return_at` already on capability_outages (verified in 0005_awards_outages_membercaps.sql).
- **Use `cleared_at` not `ended_at`** — schema column name; the task's `ended_at` was a paraphrase.
- **`cleared_by` left NULL** for auto-clear — no human actor, FK is nullable.
- **Audit action string** — `outage_auto_cleared` passed as string (recordAudit accepts AuditAction | string).
- **Auto-clear cadence** — wire into existing slow tick (60s) rather than a fresh timer.
- **BaseDetailPanel reads existing `capability_outages` field** on VisibleBase (already populated by B09).
- **CalloutDetailPanel reuses `listBases`** rather than adding a new API call.

## Verification

(populated in VERIFY)

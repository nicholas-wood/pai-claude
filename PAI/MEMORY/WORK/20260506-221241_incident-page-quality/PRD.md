---
task: Patch incident page quality regressions and gaps
slug: 20260506-221241_incident-page-quality
effort: advanced
phase: observe
progress: 25/55
mode: interactive
started: 2026-05-06T22:12:41Z
updated: 2026-05-06T22:12:41Z
---

## Context

Branch B redesigned `/dashboard/callouts/{id}` into a three-panel layout but lost
features the user actively relied on. Eight issues are queued for one focused
branch (`feat/incident-page-quality`, already created off `origin/dev` tip
`1f76390`). This PRD tracks the patch through to commit-by-issue delivery.

Files in scope:
- `apps/web/app/dashboard/callouts/[id]/incident-page-client.tsx`
- `apps/web/app/dashboard/callouts/[id]/incident-info-panel.tsx`
- `apps/web/app/dashboard/callouts/[id]/paged-and-log-panel.tsx`
- `apps/web/app/dashboard/callouts/[id]/compose-pages-panel.tsx`
- `apps/web/components/CreateIncidentModal.tsx` (or wherever it lives)
- API surfaces are read-only references — no schema changes.

Out of scope: map-level fixes, admin UI build, schema changes.

## Criteria

Issue 1 — fields editable by default:
- [ ] ISC-1: Edit / Cancel / Save buttons removed from incident-info-panel
- [ ] ISC-2: Name field editable always, saves on blur
- [ ] ISC-3: Incident type select saves on change (no blur on a select)
- [ ] ISC-4: Brief textarea editable always, saves on blur
- [ ] ISC-5: Address input editable always, saves on blur
- [ ] ISC-6: Latitude input editable always, saves on blur with validation
- [ ] ISC-7: Longitude input editable always, saves on blur with validation
- [ ] ISC-8: responding_services_summary becomes a chip multiselect
- [ ] ISC-9: Chip picker accepts free-text "Add" entries
- [ ] ISC-10: Chip set saves as comma-joined string on change
- [ ] ISC-11: Saved indicator (green tick) shows for 1.5s on success
- [ ] ISC-12: Failed indicator (red) shows on PATCH error
- [ ] ISC-13: Optimistic update applied; rollback on PATCH failure
- [ ] ISC-14: Idempotency-Key generated client-side per save (UUID)
- [ ] ISC-15: Closed callouts disable inline editing

Issue 2 — page new capabilities/members inline:
- [ ] ISC-16: "Add page" button at top of paged accordion
- [ ] ISC-17: Inline picker (NOT modal) opens within middle panel
- [ ] ISC-18: Mode toggle: Closest-N vs Named individuals
- [ ] ISC-19: Closest-N submits to /v1/callouts/{id}/pages mode=closest_n
- [ ] ISC-20: Named submits to /v1/callouts/{id}/pages mode=named
- [ ] ISC-21: Refresh of paged accordion after submit picks up new tile
- [ ] ISC-22: Reuses existing ComposePagesPanel (no reinvention)

Issue 3 — status pill:
- [ ] ISC-23: Status renders as ALL CAPS pill next to title
- [ ] ISC-24: Pill background colour mapped per status (open/closed/stand_down/active)
- [ ] ISC-25: Pill style: weight 700, padding 4px 10px, radius 999px, 13px

Issue 4 — default incident name:
- [ ] ISC-26: defaultIncidentName helper formats "<Type> @ <Location>"
- [ ] ISC-27: Helper extracts first comma segment from address
- [ ] ISC-28: Helper falls back to "Drop pin" with no address
- [ ] ISC-29: CreateIncidentModal pre-populates name from helper
- [ ] ISC-30: Submit enabled even without manual name edit
- [ ] ISC-31: Helper recomputes when type or address changes (until user types)

Issue 5 — lat/lng format selector:
- [ ] ISC-32: Format dropdown rendered below lat/lng on info panel
- [ ] ISC-33: DD format renders decimal degrees
- [ ] ISC-34: DMS format renders degrees-minutes-seconds with N/S/E/W
- [ ] ISC-35: Format choice persists to localStorage
- [ ] ISC-36: Format choice restores from localStorage on load

Issue 6 — message ack-required toggle:
- [ ] ISC-37: "Require acknowledgement" checkbox in message composer
- [ ] ISC-38: Checked sends ack_required=true; unchecked sends false
- [ ] ISC-39: Default is unchecked

Issue 7 — priority dropdown + confirm:
- [ ] ISC-40: Priority dropdown rendered next to message composer
- [ ] ISC-41: Options: Normal / High (server enum only supports these)
- [ ] ISC-42: Default is Normal
- [ ] ISC-43: High shows confirm dialog before send
- [ ] ISC-44: Confirm dialog mentions time-sensitive push

Issue 8 — Admin UI TODO doc:
- [ ] ISC-45: docs/ADMIN_UI_TODO.md created
- [ ] ISC-46: Doc lists units, members, roles, capabilities, audit-log scope
- [ ] ISC-47: Final chore commit references the new doc

Cross-cutting:
- [ ] ISC-48: AU English on all new UI strings
- [ ] ISC-49: lint:au and lint:tenant pass on touched files
- [ ] ISC-50: bun run format on touched files only (not repo-wide)
- [ ] ISC-51: Eight separate logical commits land on feat/incident-page-quality
- [ ] ISC-52: No schema changes, no API field additions
- [ ] ISC-53: No push to remote
- [ ] ISC-A1: Do NOT touch incident-map-panel.tsx
- [ ] ISC-A2: Do NOT modify ALLOWED_PATCH_FIELDS or any API route schema

## Decisions

- Priority enum: server only supports `normal | high`. UI ships Normal/High dropdown; the brief's "Critical" tier is unsupported by the broadcast feature (`apps/api/src/features/callouts/broadcast.ts` line 18 explicitly excludes critical alerts per FR-N-6e.2). Confirm dialog applied to High instead.
- PATCH field name is `brief` (per ALLOWED_PATCH_FIELDS in `apps/api/src/routes/callouts.ts:43`), not `incident_brief` as referenced in the brief.
- Free-text chip entry: handled in a wrapper around MultiSelectPicker that injects a synthetic "Add 'foo'" option when the query is non-empty and not in the options set. No edits to MultiSelectPicker itself.
- "Add page" surface re-uses the existing ComposePagesPanel from `compose-pages-panel.tsx` (orphaned in branch B). Wired into the paged accordion via a collapsible section instead of as a separate column.
- Per-field PATCH on blur (or change for selects) sends only that field; uses the existing `apiFetchClient` idempotency-key auto-generation.
- Status pill mapping: open/requesting/partially_filled = warn (amber), filled/in_progress = ok (green), closed = neutral, stood_down = neutral, draft = warn.

## Verification

(populated during VERIFY)

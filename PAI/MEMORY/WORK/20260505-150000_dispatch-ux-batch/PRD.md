---
task: Eight related dispatch UX fixes lifesaveroncall
slug: 20260505-150000_dispatch-ux-batch
effort: deep
phase: complete
progress: 60/60
mode: interactive
started: 2026-05-05T15:00:00Z
updated: 2026-05-05T15:05:00Z
---

## Context

Eight fixes to LifesaverOnCall dispatch UX, branch `fix/dispatch-ux-batch` off origin/dev. Each fix gets its own commit. Worktree at `/Users/nicholaswood/Documents/workspace/lifesaveroncall-wt/dispatch-ux`. Conventions: AU English, ULID IDs, lint:au + lint:tenant + format on touched files, tenant isolation via `withTenantContextAsync` for new repo functions. Out of scope: schema beyond migration 0018, logo regen, admin UI ext beyond Fix 1's ring-colour edit.

### Plan (per fix)

- Fix 1: migration 0018 (ring_colour, show_ring); backfill canonical 8 caps; capabilities API returns new fields; BaseMarker + CapabilityLegend read from API; admin PATCH allowlist + UI fields; ARO joins universal set in legend footer.
- Fix 2: New `CalloutDetailPanel.tsx` mirroring `BaseDetailPanel`. URL state `?callout=<id>`. Mutually exclusive with `?base=`. CalloutsLayer marker click sets `?callout=` instead of router.push. Mount in dashboard page.
- Fix 3: Restructure paged-and-log-panel — paged section visually elevated (top, ~60%), broadcast collapsed-by-default ("Send update" 1-line until expanded), divider, smaller heading. Incident log unchanged.
- Fix 4: New `apps/web/lib/coords.ts` with `formatCoord` + `parseCoord` (DD/DDM/DMS) + tests. Replace separate lat/lng inputs with one editable input that re-renders in selected format and parses on blur.
- Fix 5: Replace jittered club-coords for dev members with curated VIC township list (15 onshore points), each member assigned a township + ≤80m jitter, idempotent.
- Fix 6: Verify form writes only to `responding_services_summary` (already does). Add input validation to POST `/v1/callouts/:id/services` to return 400 instead of 500 on invalid `service_type`. Add test. Document split in `docs/RESPONDING_SERVICES.md`.
- Fix 7: Double `ResponderPin` outer ring (24 → 48px), image inset 3 → 5px. Apply same hover-flash fix used in CalloutsLayer (close-grace timer + WeakSet of bound nodes + narrowed deps) to RespondersLayer hover effect.
- Fix 8: Investigate mobile expo-asset error. Add `expo-asset` dependency. Audit `app.config.ts` for asset references. Document if blocked by env.

### Risks

- Migration 0018 backfill must be idempotent and not break existing capability rows.
- BaseMarker reading from a network fetch needs to handle pre-fetch state without breaking SSR off paths (it's already client-only).
- `?callout=` URL state handling needs to be mutually exclusive with `?base=` without race conditions.
- Coord parsing must handle hemispheres, º vs °, tab/space whitespace; tests must cover edge cases.
- POST /services 500 root cause may be elsewhere (e.g. service_type CHECK violation from a different client). Add validation to surface clean 400.
- Hover-flash fix on RespondersLayer must not break the cluster bubble hover that already works.

## Criteria

Fix 1 — capability ring config data-driven:
- [x] ISC-1: Migration 0018 adds `ring_colour text NULL` to capabilities table
- [x] ISC-2: Migration 0018 adds `show_ring boolean NOT NULL DEFAULT true` to capabilities
- [x] ISC-3: Migration 0018 backfills RWC, RPAS, HELI, COMMS with their hex ring colours
- [x] ISC-4: Migration 0018 sets show_ring=false for IRB, SSV, SUPPORT, ARO
- [x] ISC-5: GET /v1/capabilities returns `ring_colour` and `show_ring` per row
- [x] ISC-6: BaseMarker reads ring colour from capabilities API not hardcoded map
- [x] ISC-7: BaseMarker hardcoded colour map remains as fallback for unknown codes
- [x] ISC-8: CapabilityLegend renders only items with show_ring=true from API
- [x] ISC-9: CapabilityLegend footer says "All bases have IRB, SSV, SUPPORT, and ARO"
- [x] ISC-10: PATCH /v1/admin/capabilities/:id allowlist accepts ring_colour
- [x] ISC-11: PATCH /v1/admin/capabilities/:id allowlist accepts show_ring
- [x] ISC-12: Admin capabilities edit page has ring colour input
- [x] ISC-13: Admin capabilities edit page has show ring checkbox

Fix 2 — incident click → RHS panel:
- [x] ISC-14: New CalloutDetailPanel.tsx exists mirroring BaseDetailPanel shape
- [x] ISC-15: CalloutsLayer marker click sets `?callout=<id>` not router.push
- [x] ISC-16: Selecting `?callout=` clears `?base=` (mutually exclusive)
- [x] ISC-17: Selecting `?base=` clears `?callout=` (mutually exclusive)
- [x] ISC-18: ESC key clears `?callout=`
- [x] ISC-19: Close button clears `?callout=`
- [x] ISC-20: CalloutDetailPanel shows name, status, type, location, paged/accepted/arrived counts
- [x] ISC-21: CalloutDetailPanel has "Open full view" button navigating to /dashboard/callouts/{id}
- [x] ISC-22: CalloutDetailPanel mounted in dashboard page next to BaseDetailPanel

Fix 3 — page-vs-broadcast UI separation:
- [x] ISC-23: Paged section is the top, prominently labelled in paged-and-log-panel
- [x] ISC-24: Broadcast section heading is smaller and visually secondary
- [x] ISC-25: Broadcast section is collapsed-by-default to one line "Send update"
- [x] ISC-26: A visible divider separates Paged from Broadcast
- [x] ISC-27: Incident log section remains unchanged

Fix 4 — coord format DDM + editable in any of three:
- [x] ISC-28: lib/coords.ts exports formatCoord supporting DD format
- [x] ISC-29: lib/coords.ts exports formatCoord supporting DDM format
- [x] ISC-30: lib/coords.ts exports formatCoord supporting DMS format
- [x] ISC-31: lib/coords.ts exports parseCoord parsing DD input
- [x] ISC-32: lib/coords.ts exports parseCoord parsing DDM input
- [x] ISC-33: lib/coords.ts exports parseCoord parsing DMS input
- [x] ISC-34: lib/coords.ts handles negative/hemisphere/whitespace edge cases
- [x] ISC-35: lib/coords.test.ts has round-trip tests for each format
- [x] ISC-36: incident-info-panel single coord input edits in selected format
- [x] ISC-37: incident-info-panel coord input parses on blur and saves canonical decimals
- [x] ISC-38: incident-info-panel format selector now offers DD, DDM, and DMS

Fix 5 — responders not in water:
- [x] ISC-39: seed.ts uses 15 fixed VIC township coords list
- [x] ISC-40: each dev member assigned a township location with ≤0.0008 deg jitter
- [x] ISC-41: re-running seed remains idempotent (no duplicate members)

Fix 6 — service POST 500 + docs:
- [x] ISC-42: POST /v1/callouts/:id/services validates service_type enum returning 400
- [x] ISC-43: POST /v1/callouts/:id/services has test for invalid service_type → 400
- [x] ISC-44: docs/RESPONDING_SERVICES.md documents the summary-vs-table split

Fix 7 — responder pin double size + hover-flash:
- [x] ISC-45: ResponderPin SIZE doubled from 24 to 48
- [x] ISC-46: ResponderPin IMAGE_INSET increased from 3 to 5
- [x] ISC-47: RespondersLayer cluster hover uses close-grace timer
- [x] ISC-48: RespondersLayer cluster hover effect dependencies narrowed

Fix 8 — mobile expo-asset:
- [x] ISC-49: apps/mobile/package.json adds expo-asset dependency
- [x] ISC-50: app.config.ts asset references reconciled with present files

Fix 9 — RHS detail panel covers create-incident modal:
- [x] ISC-51: CreateIncidentModal z-index raised above RHS panels (>=18)
- [x] ISC-52: Modal scrim/backdrop covers the RHS detail panel when open

Fix 10 — CreateIncidentModal schema + caps:
- [x] ISC-53: Create form has only Location, Incident Type, Brief, Radio Channel
- [x] ISC-54: Create form Location respects user's coord-format preference
- [x] ISC-55: Incident Type dropdown labels render in ALL CAPS
- [x] ISC-56: Auto-derived name converts to ALL CAPS at submit
- [x] ISC-57: Brief text auto-uppercased on submit (not input)
- [x] ISC-58: Submit gated on Location + Incident Type only
- [x] ISC-59: Severity / required_capabilities / Description / Name fields removed
- [x] ISC-60: Radio Channel free-text input added to form

## Decisions

## Verification

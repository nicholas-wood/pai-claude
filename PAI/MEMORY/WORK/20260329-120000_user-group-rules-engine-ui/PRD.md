---
task: Build User Group Rules Engine UI and API
slug: 20260329-120000_user-group-rules-engine-ui
effort: advanced
phase: complete
progress: 8/8
mode: interactive
started: 2026-03-29T12:00:00-07:00
updated: 2026-03-29T12:05:00-07:00
---

## Context

Built the User Group Rules Engine -- a configurable rules engine that automatically derives a member's access level based on their attributes (membership category, age, officer/board/staff status). This includes CRUD API endpoints and a full management UI page.

## Criteria

- [x] ISC-1: GET endpoint returns rules joined with access level names
- [x] ISC-2: POST endpoint creates rules with Zod validation
- [x] ISC-3: PUT endpoint updates rules by itemId
- [x] ISC-4: DELETE endpoint soft-deletes rules via isActive flag
- [x] ISC-5: Rules page lists rules ordered by priority descending
- [x] ISC-6: Add/Edit form includes all condition fields
- [x] ISC-7: Human-readable rule summary displayed in form
- [x] ISC-8: Config page links to rules page

## Decisions

- Custom API endpoints instead of createConfigEndpoints because GET needs a JOIN with access_levels
- Used native HTML select for access level dropdown (simpler than base-ui Select for this use case)
- Soft delete via isActive=false consistent with existing config-crud pattern
- Common categories shown as quick-add chips for convenience

## Verification

- All 4 API endpoints follow withTenantAuth + Permission.CONFIGURE pattern
- Rules page uses same component patterns (Card, Button, Input, Badge, Label) as settings page
- Loading skeleton uses PageSkeleton from existing loading-skeleton component
- Config page has "Access Level Rules" link alongside "Club Settings" link

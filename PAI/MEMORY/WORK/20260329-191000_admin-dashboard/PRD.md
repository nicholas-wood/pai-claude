---
task: Build admin dashboard with queue views and actions
slug: 20260329-191000_admin-dashboard
effort: advanced
phase: complete
progress: 24/24
mode: interactive
started: 2026-03-29T19:10:00+11:00
updated: 2026-03-29T19:10:00+11:00
---

## Context

Building the admin web dashboard for AccessBuddy. Queue-based views for each workflow stage, action buttons per request, member management, and club configuration. Permission-gated - each section only visible to admins with the right permissions.

## Criteria

### Admin Layout
- [ ] ISC-1: /t/[slug]/admin layout with sidebar navigation
- [ ] ISC-2: Permission-gated: only users with admin_assignments can access
- [ ] ISC-3: Shows current club name and admin user

### Queue Dashboard
- [ ] ISC-4: Overview page shows count cards per workflow stage
- [ ] ISC-5: Awaiting approval queue with approve/reject/hold buttons
- [ ] ISC-6: Awaiting programming queue with program action
- [ ] ISC-7: Awaiting pickup queue grouped by pickup location
- [ ] ISC-8: On hold queue with resume/cancel actions

### Request Detail (Admin)
- [ ] ISC-9: Admin request detail shows full audit trail
- [ ] ISC-10: Shows workflow action buttons based on current status and permissions
- [ ] ISC-11: Approve form with optional access level selection
- [ ] ISC-12: Reject form with mandatory reason
- [ ] ISC-13: Program form with serial number input
- [ ] ISC-14: Set pickup form with location dropdown
- [ ] ISC-15: Issue confirmation

### Member Management
- [ ] ISC-16: Member list page with search
- [ ] ISC-17: Member detail page showing requests and credentials
- [ ] ISC-18: Renew membership action with season selection

### Configuration
- [ ] ISC-19: Credential types CRUD page
- [ ] ISC-20: Access levels CRUD page
- [ ] ISC-21: Pickup locations CRUD page

### API Endpoints
- [ ] ISC-22: GET /t/[slug]/members endpoint with search
- [ ] ISC-23: POST /t/[slug]/members/[id]/renew endpoint
- [ ] ISC-24: CRUD endpoints for configuration entities

---
task: Build auth middleware and tenant resolution layer
slug: 20260329-183000_auth-middleware-tenant-resolution
effort: advanced
phase: complete
progress: 28/28
mode: interactive
started: 2026-03-29T18:30:00+11:00
updated: 2026-03-29T18:30:00+11:00
---

## Context

Building the authentication and tenant resolution layer for AccessBuddy. This is the foundational layer that all API routes and pages depend on. It handles: Clerk JWT verification, user lookup/creation, tenant resolution from URL slug, RLS context setting, and permission checking.

### What was requested
- Clerk integration for auth
- Tenant resolution from URL path (/t/{slug}/...)
- RLS tenant context per transaction
- Permission checking middleware
- API route structure with proper auth gates

### Risks
- Clerk SDK version compatibility with Next.js 15 App Router
- RLS SET LOCAL must happen within the same transaction as queries
- Permission checking must be performant (called on every request)

## Criteria

### Clerk Integration
- [ ] ISC-1: Clerk packages installed and configured
- [ ] ISC-2: Clerk middleware protects API routes
- [ ] ISC-3: Auth helper retrieves current user from Clerk JWT
- [ ] ISC-4: User auto-created in DB on first API call if not exists

### Tenant Resolution
- [ ] ISC-5: Tenant resolved from URL slug parameter
- [ ] ISC-6: Returns 404 if tenant slug not found
- [ ] ISC-7: Tenant context available to all route handlers

### RLS Integration
- [ ] ISC-8: withTenant helper wraps DB operations in transaction with SET LOCAL
- [ ] ISC-9: All tenant-scoped queries use withTenant wrapper
- [ ] ISC-10: RLS bypass available for global admin operations

### Permission Checking
- [ ] ISC-11: requirePermission middleware checks user has permission in tenant
- [ ] ISC-12: Club admin bypasses individual permission checks
- [ ] ISC-13: Global admin bypasses tenant-level checks
- [ ] ISC-14: Returns 403 with descriptive message on permission failure

### API Route Structure
- [ ] ISC-15: Tenant-scoped route pattern /api/v1/t/[slug]/...
- [ ] ISC-16: Auth routes at /api/v1/auth/...
- [ ] ISC-17: Webhook routes at /api/webhooks/... (no auth)
- [ ] ISC-18: Health check route at /api/health

### First API Endpoints
- [ ] ISC-19: GET /api/v1/auth/me returns current user with tenant memberships
- [ ] ISC-20: GET /api/v1/t/[slug]/config returns tenant configuration
- [ ] ISC-21: GET /api/v1/t/[slug]/requests/queue returns request counts by status

### Tests
- [ ] ISC-22: Permission checker correctly grants club admin all permissions
- [ ] ISC-23: Permission checker correctly handles global admin
- [ ] ISC-24: Permission checker rejects missing permissions
- [ ] ISC-25: withTenant sets RLS context correctly
- [ ] ISC-26: Tenant resolution returns 404 for invalid slug
- [ ] ISC-27: User sync creates user on first visit
- [ ] ISC-28: Auth/me endpoint returns correct shape

### Anti-Criteria
- [ ] ISC-A-1: No hardcoded tenant IDs or user IDs
- [ ] ISC-A-2: No permission checks bypassed by default

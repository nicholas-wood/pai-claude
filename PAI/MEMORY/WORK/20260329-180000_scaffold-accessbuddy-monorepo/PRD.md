---
task: Scaffold AccessBuddy monorepo with infra and schema
slug: 20260329-180000_scaffold-accessbuddy-monorepo
effort: advanced
phase: complete
progress: 32/32
mode: interactive
started: 2026-03-29T18:00:00+11:00
updated: 2026-03-29T18:01:00+11:00
---

## Context

First implementation session for AccessBuddy. The planning document (v0.2) has been approved. This session scaffolds the entire project foundation: monorepo, database schema, Docker dev environment, GCP infrastructure (Terraform), CI/CD, shared types, and testing setup. The goal is a working foundation that a team of 5 can clone and start building features on.

### Risks
- Drizzle ORM + RLS integration needs careful handling (SET LOCAL in transactions)
- Terraform for Cloud Run + Cloud SQL has specific networking requirements
- XState v5 API differs significantly from v4 - need to use current patterns

## Criteria

### Monorepo Structure
- [ ] ISC-1: Turborepo config with apps/web and packages/shared, packages/db
- [ ] ISC-2: Root package.json with bun workspaces configured
- [ ] ISC-3: TypeScript config with project references across packages

### Next.js App
- [ ] ISC-4: Next.js 15 app with App Router initialised
- [ ] ISC-5: Tailwind CSS configured with shadcn/ui ready
- [ ] ISC-6: Basic root layout rendering without errors
- [ ] ISC-7: Environment variable schema defined with Zod

### Docker
- [ ] ISC-8: docker-compose.yml runs Postgres 16 and Redis 7
- [ ] ISC-9: Dockerfile builds production Next.js image
- [ ] ISC-10: App starts and connects to local Postgres via docker compose

### Database Schema
- [ ] ISC-11: Drizzle schema defines tenants table with RLS
- [ ] ISC-12: Drizzle schema defines users table (not tenant-scoped)
- [ ] ISC-13: Drizzle schema defines tenant_memberships with tenant_id FK
- [ ] ISC-14: Drizzle schema defines admin_assignments with permissions array
- [ ] ISC-15: Drizzle schema defines credential_types table
- [ ] ISC-16: Drizzle schema defines access_levels table
- [ ] ISC-17: Drizzle schema defines user_group_rules table with JSONB conditions
- [ ] ISC-18: Drizzle schema defines pickup_locations table
- [ ] ISC-19: Drizzle schema defines fob_requests table with all status fields
- [ ] ISC-20: Drizzle schema defines fobs table with all lifecycle fields
- [ ] ISC-21: Drizzle schema defines audit_log as append-only
- [ ] ISC-22: Drizzle schema defines notifications and notification_preferences
- [ ] ISC-23: Drizzle schema defines notification_templates table
- [ ] ISC-24: Drizzle schema defines access_control_systems table (Stage 2 placeholder)
- [ ] ISC-25: RLS helper function sets tenant context per transaction
- [ ] ISC-26: Migration files generated and runnable

### Shared Package
- [ ] ISC-27: Request status enum and state machine defined in XState
- [ ] ISC-28: Zod schemas for API request/response validation
- [ ] ISC-29: Permission enum and type definitions exported

### Infrastructure
- [ ] ISC-30: Terraform defines Cloud Run service and Cloud SQL instance
- [ ] ISC-31: GitHub Actions workflow for lint, test, build, push image

### Testing
- [ ] ISC-32: Vitest configured with first test (state machine valid transitions)

### Anti-Criteria
- [ ] ISC-A-1: No feature implementation (no auth, no API routes, no UI pages)
- [ ] ISC-A-2: No hardcoded credentials anywhere
- [ ] ISC-A-3: No Google Sheets references

## Decisions

- 2026-03-29 18:00: Scaffold only - no features. Clean foundation for team to build on.

---
task: Plan and build club access management SaaS
slug: 20260329-163200_club-access-management-saas-rebuild
effort: deep
phase: complete
progress: 52/52
mode: interactive
started: 2026-03-29T16:32:00+11:00
updated: 2026-03-29T17:15:00+11:00
---

## Context

Nick is rebuilding the South Melbourne LSC (SMLSC) building access / fob management system. The current system runs on Google Sheets + AppSheet + Apps Script with Square payment integration. It manages the full lifecycle of access fobs for club members: request submission, payment, approval, programming, pickup, and ongoing management (renewals, lost/damaged, revocation, archival).

### What was requested
- Full planning document covering functional requirements, non-functional requirements, architecture, tech stack, testing strategy, deployment strategy, security, data migration, multi-tenancy, and Integriti integration approach
- Requirements must be approved before implementation begins
- Test-driven development plan must be approved before implementation
- Architecture and platform decisions must be approved before implementation
- Staged release plan showing what goes into each stage
- Clarifying questions asked before finalising requirements

### What was not requested
- Implementation code in this session
- Quick/hacky rebuild - Nick wants engineering best practices and SaaS-grade architecture
- Keeping any Google Sheets dependency

### Why it matters
The current system is brittle (Sheets as DB, AppScript limitations), data is unencrypted, UX is fragmented across Google Forms/AppSheet/email, and it cannot scale to other clubs. Nick wants to commercialise this as a SaaS product for surf lifesaving and other sports clubs.

### Risks
- Surfguard has no public API (confirmed via research). Membership sync is CSV-only until SLSA opens new platform APIs.
- Integriti Inner Range has a full REST API v2 (confirmed via research). Stage 2 integration is feasible.
- Multi-tenancy architecture decisions are hard to change later - shared DB + RLS chosen for pragmatism.
- Data migration from denormalised Sheets (comma-separated fob lists) needs careful validation.
- Liquid Glass is iOS 26+ only. Android/older iOS gets standard styling. Expo libraries exist.

## Criteria

### Current State Analysis
- [x] ISC-1: Current data model documented with all entities and fields
- [x] ISC-2: Current request workflow states and transitions documented
- [x] ISC-3: Current payment flow (Square + email parsing) documented
- [x] ISC-4: Current notification patterns and admin role types documented
- [x] ISC-5: Current fob lifecycle states and transitions documented

### Functional Requirements - Member Portal
- [x] ISC-6: Member first-time request submission flow specified
- [x] ISC-7: Passwordless auth (magic link) mechanism specified
- [x] ISC-8: Passwordless auth (SMS OTP) mechanism specified
- [x] ISC-9: Member dashboard showing all requests and statuses specified
- [x] ISC-10: Member dashboard showing fobs, access level, expiry specified
- [x] ISC-11: Member cancel request action specified
- [x] ISC-12: Member update email and contact number action specified
- [x] ISC-13: Member report lost fob action specified
- [x] ISC-14: Member report damaged fob action specified
- [x] ISC-15: Member request access update action specified

### Functional Requirements - Request Workflow
- [x] ISC-16: All request types enumerated with validation rules
- [x] ISC-17: Stripe payment integration embedded in request flow
- [x] ISC-18: Payment exemption rules defined per membership and request type
- [x] ISC-19: Approval step with admin actions and auto-approval rules
- [x] ISC-20: Programming step with fob assignment specified
- [x] ISC-21: Pickup location assignment and tracking specified
- [x] ISC-22: Issuance step with member email notification specified
- [x] ISC-23: Hold mechanism with mandatory reason specified
- [x] ISC-24: Superuser cancellation with reason and notifications specified

### Functional Requirements - Admin Portal
- [x] ISC-25: Admin role hierarchy with per-function access defined
- [x] ISC-26: Admin notification preferences (real-time, summary, off) specified
- [x] ISC-27: Time-critical notification override rule specified
- [x] ISC-28: Admin manual fob issuance to existing or new member specified
- [x] ISC-29: Admin fob changeover flow (exchange, damaged, broken) specified
- [x] ISC-30: Admin fob return flow specified
- [x] ISC-31: Admin access revocation with member email notification specified
- [x] ISC-32: Admin membership update triggering fob update specified
- [x] ISC-33: Admin queue views per workflow stage specified
- [x] ISC-34: Admin multi-org navigation specified
- [x] ISC-35: Admin app persistent login with passcode/Face ID specified

### Functional Requirements - User Groups and Multi-Org
- [x] ISC-36: Automatic user group derivation rules engine specified
- [x] ISC-37: Derivation inputs (category, age, officer, board, staff) specified
- [x] ISC-38: Officer and board permission expiry mechanism specified
- [x] ISC-39: Per-club QR code and link for member entry specified
- [x] ISC-40: Multi-tenant data isolation model defined

### Non-Functional Requirements
- [x] ISC-41: Two-factor authentication for all users specified
- [x] ISC-42: Data encryption at rest specified
- [x] ISC-43: Full audit trail for all state changes specified
- [x] ISC-44: Modularity and configurability requirements specified
- [x] ISC-45: Scalability approach for multi-club growth specified

### Architecture and Tech Stack
- [x] ISC-46: Architecture diagram with component boundaries produced
- [x] ISC-47: Tech stack selections with justification for each layer
- [x] ISC-48: Auth/identity solution recommendation specified
- [x] ISC-49: Mobile app framework recommendation specified

### Strategy and Planning
- [x] ISC-50: Stage/release plan with feature allocation per stage
- [x] ISC-51: Data migration strategy from Google Sheets specified
- [x] ISC-52: TDD approach with coverage targets specified

### Anti-Criteria
- [x] ISC-A-1: No Google Sheets dependency in new system
- [x] ISC-A-2: No hardcoded secrets in codebase
- [x] ISC-A-3: No single-tenant assumptions in data model

## Decisions

- 2026-03-29 16:45: Modular monolith over microservices - solo developer velocity trumps distributed systems complexity
- 2026-03-29 16:45: Shared DB with RLS over DB-per-tenant - no regulatory need for physical isolation; logical isolation via RLS sufficient for sports clubs
- 2026-03-29 16:45: Expo (mobile) + Next.js (admin web) over single Expo-for-everything - admin dashboard needs complex tables/filters that React Native Web handles poorly
- 2026-03-29 16:45: Clerk over custom auth - auth is infrastructure not product; Clerk has best passwordless + multi-org out of box
- 2026-03-29 16:50: Neon over Supabase for DB - serverless Postgres with branching; avoids Supabase lock-in while getting same Postgres features
- 2026-03-29 16:50: Inngest over BullMQ - serverless job queue with no infra to manage; built-in retry, cron, fan-out
- 2026-03-29 16:50: Drizzle over Prisma - thinner abstraction, better RLS support via SET LOCAL, faster serverless cold starts
- 2026-03-29 16:55: Access control abstraction via provider interface pattern - enables Integriti first, other systems later without core code changes

## Verification

- ISC-1 through ISC-5: Planning document Section 2 documents all current state entities, workflows, payment flows, notifications, and fob lifecycle
- ISC-6 through ISC-15: Planning document Section 3.1 (FR-M-01 through FR-M-10) specifies all member portal features
- ISC-16 through ISC-24: Planning document Section 3.2 (FR-R-01 through FR-R-10) specifies all request workflow features
- ISC-25 through ISC-35: Planning document Section 3.3 (FR-A-01 through FR-A-10) specifies all admin portal features
- ISC-36 through ISC-40: Planning document Sections 3.4-3.5 specify user group derivation and multi-org features
- ISC-41 through ISC-45: Planning document Section 4 specifies all non-functional requirements
- ISC-46 through ISC-49: Planning document Sections 5-6 provide architecture diagram and full tech stack
- ISC-50 through ISC-52: Planning document Sections 13, 14, 16 cover testing, migration, and staging
- ISC-A-1: New system uses Postgres; Sheets only referenced for migration source
- ISC-A-2: All secrets via environment variables or encrypted DB storage
- ISC-A-3: Every table has tenant_id with RLS; multi-org from day one

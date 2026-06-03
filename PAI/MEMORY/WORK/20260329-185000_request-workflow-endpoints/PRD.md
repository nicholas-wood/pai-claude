---
task: Build request submission and workflow action endpoints
slug: 20260329-185000_request-workflow-endpoints
effort: advanced
phase: complete
progress: 30/30
mode: interactive
started: 2026-03-29T18:50:00+11:00
updated: 2026-03-29T18:50:00+11:00
---

## Context

Building the core request workflow: create requests, determine payment, Stripe integration, workflow actions (approve/reject/hold/resume/program/set-pickup/issue/cancel), listing/detail, and audit logging. This is the business logic heart of AccessBuddy.

## Criteria

### Audit Logging
- [ ] ISC-1: Audit helper creates append-only log entries with actor/entity/action
- [ ] ISC-2: All state changes recorded with from_state and to_state

### Request Creation
- [ ] ISC-3: POST endpoint creates request with validation
- [ ] ISC-4: Payment determination uses club config (exempt categories + types)
- [ ] ISC-5: Auto-approval applied for qualifying request types
- [ ] ISC-6: Audit entry created on submission

### Stripe Integration
- [ ] ISC-7: Stripe package installed and configured
- [ ] ISC-8: Payment intent created when payment required
- [ ] ISC-9: Webhook handler processes payment_intent.succeeded
- [ ] ISC-10: Request advances to awaiting_approval on payment

### Request Listing
- [ ] ISC-11: GET list endpoint with status filter for admins
- [ ] ISC-12: GET list endpoint returns only own requests for members
- [ ] ISC-13: GET detail endpoint with audit trail

### Workflow Actions
- [ ] ISC-14: POST approve endpoint with permission check
- [ ] ISC-15: POST reject endpoint with mandatory reason
- [ ] ISC-16: POST hold endpoint with mandatory reason
- [ ] ISC-17: POST resume endpoint restores previous state
- [ ] ISC-18: POST program endpoint with serial number
- [ ] ISC-19: POST set-pickup endpoint with location ID
- [ ] ISC-20: POST issue endpoint creates credential record
- [ ] ISC-21: POST cancel endpoint with mandatory reason
- [ ] ISC-22: All actions validate state machine transitions
- [ ] ISC-23: All actions create audit entries

### Member Self-Service
- [ ] ISC-24: POST report-lost endpoint for member's own credential
- [ ] ISC-25: POST report-damaged endpoint for member's own credential

### Tests
- [ ] ISC-26: Payment determination logic tested
- [ ] ISC-27: Auto-approval logic tested
- [ ] ISC-28: Workflow action validation tested
- [ ] ISC-29: Audit entry creation tested
- [ ] ISC-30: Request creation validation tested

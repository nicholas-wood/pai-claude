---
task: Implement F9 Renewal Attestation for AccessBuddy
slug: 20260331-120000_f9-renewal-attestation-accessbuddy
effort: advanced
phase: verify
progress: 30/30
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:00:01-05:00
---

## Context

Implement F9: Renewal Attestation for AccessBuddy. Currently the renewal endpoint directly updates membership season AND credential expiry dates. The new flow splits this: renewal creates an attestation request and sends an email with a magic link. The member confirms which credentials they still have via the attestation page, and only then are credential expiry dates updated. Credentials marked as lost trigger replacement requests. An admin force-renew bypass is also needed.

The attestation_requests table already exists. Schema and shared validation types are already defined. The email template exists. This is purely implementation work across API routes, a public page, cron modification, and admin UI.

### Risks
- attestation_requests is NOT in the RLS tables list, so withTenant will still set context but no DB-level policy enforces it. Queries must include explicit tenantId filters.
- Token-based endpoints are public (no auth) - must validate token expiry and status carefully.
- The lost credential flow on attestation submission creates fobRequests which ARE RLS-protected, so that insert needs to happen within withTenant.

### Plan
1. Modify renew endpoint: remove credential expiry update, create attestation_request, send email
2. Create force-renew endpoint: old behavior + mark pending attestations as completed
3. Create attestation GET/POST endpoints: token-based, no auth
4. Create public attestation page: client component with checkboxes
5. Modify daily cron: expire pending attestations past tokenExpiresAt
6. Add attestation section to admin member detail page

## Criteria

- [x] ISC-1: Renew endpoint creates attestation_request record with random token
- [x] ISC-2: Renew endpoint sets tokenExpiresAt from tenant attestationTokenExpiryDays
- [x] ISC-3: Renew endpoint sends attestation email via sendTemplatedEmail
- [x] ISC-4: Renew endpoint updates membership season and status to active
- [x] ISC-5: Renew endpoint does NOT update credential expiry dates
- [x] ISC-6: Renew endpoint returns attestationSent and attestationId
- [x] ISC-7: Force-renew endpoint requires renew permission
- [x] ISC-8: Force-renew endpoint validates body with forceRenewSchema
- [x] ISC-9: Force-renew endpoint updates membership season and credential expiry
- [x] ISC-10: Force-renew endpoint marks pending attestation as completed
- [x] ISC-11: Force-renew endpoint creates audit entry with bypass reason
- [x] ISC-12: Attestation GET endpoint looks up attestation by token
- [x] ISC-13: Attestation GET validates token not expired and status pending
- [x] ISC-14: Attestation GET returns credentials with type name and access level
- [x] ISC-15: Attestation GET returns member name and club name
- [x] ISC-16: Attestation GET requires no authentication
- [x] ISC-17: Attestation POST validates token not expired and status pending
- [x] ISC-18: Attestation POST validates body with attestationResponseSchema
- [x] ISC-19: Attestation POST updates attestation status to completed
- [x] ISC-20: Attestation POST updates expiresAt for confirmed credentials
- [x] ISC-21: Attestation POST creates lost replacement request for unconfirmed
- [x] ISC-22: Attestation POST creates audit entry
- [x] ISC-23: Public attestation page fetches data on mount
- [x] ISC-24: Attestation page shows credential checkboxes defaulting to checked
- [x] ISC-25: Attestation page shows optional note field per credential
- [x] ISC-26: Attestation page submits to POST endpoint and shows success
- [x] ISC-27: Daily cron expires pending attestations past tokenExpiresAt
- [x] ISC-28: Admin member detail page shows pending attestation section
- [x] ISC-29: Admin member detail page shows force renew button
- [x] ISC-30: Admin member detail page shows completed attestation history

## Decisions

## Verification

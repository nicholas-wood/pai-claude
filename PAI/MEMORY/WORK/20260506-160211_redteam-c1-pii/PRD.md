---
task: Patch redteam C1 PII findings F2.1 F2.5 F2.6 F12.1
slug: 20260506-160211_redteam-c1-pii
effort: advanced
phase: complete
progress: 26/26
mode: interactive
started: 2026-05-06T16:02:11Z
updated: 2026-05-06T16:02:11Z
---

## Context

Patch four redteam findings from `docs/REDTEAM_FINDINGS.md` on the lifesaveroncall API:

- **F2.1 (CRITICAL)** `GET /v1/callouts/:id/paged-responders` leaks `full_name` with no `canSeeIdentity` gate.
- **F2.5 (CRITICAL)** `GET /v1/callouts/:id/co-responders` returns `full_name`+`mobile` to any caller.
- **F2.6 (CRITICAL)** `GET /v1/dispatch-candidates` returns members with `current_availability != 'available'`.
- **F12.1 (HIGH)** FR-5.6 audit-log entry on PII reveal is never written.

Working in worktree `/Users/nicholaswood/Documents/workspace/lifesaveroncall-wt/c1-pii` on branch `fix/redteam-c1-pii` already at `67d9738`. Logical chunks committed separately, no push.

### Plan

- **F2.1**: rewrite `paged-responders` handler. Hydrate viewer (firebase uid + linked member_id), look up `view_member_pii`, fetch viewer's active-incident locations + member's latest location ping, run `canSeeIdentity` per row. Emit `pseudonymous_id` only when `revealed=false`; omit `full_name` and `member_id`.
- **F2.5**: rewrite `co-responders` handler. Gate caller via three eligibility checks: active dispatcher on the callout, accepted-status responder on the callout (own linked.member_id), or `view_member_pii`. 403 `NOT_PARTICIPANT` if none. Suppress `mobile` unless caller has `view_member_pii`.
- **F2.6**: add `AND m.current_availability = 'available'` to dispatch-candidates WHERE clause; drop `current_availability` from SELECT and response.
- **F12.1**: extend `AuditAction` union with `view_member_pii_reveal`. In each PII-reveal-capable handler, after the response is built, if any reveal was via `rule === 5` (or via `view_member_pii` participant override path on co-responders), emit ONE `recordAudit` per request with payload `{ endpoint, callout_id?, revealed_member_ids: [...] }` plus ip_address + user_agent. Apply to: `responders.ts` (rule-5 only), `paged-responders` (rule-5), `co-responders` (when reveal was via the role override path).
- Tests: extend `responders.test.ts` paged-responders + co-responders with 401 auth gate; add unit-style test for a new `coResponderEligibility` pure helper.

### Risks

- TypeScript Env widening: callouts.ts Env doesn't include `firebase`/`linked`; widen with optional fields.
- Per-request audit emission must be cheap — no N+1; collect ids in route then single insert.
- AU lint may flag any prose I add; keep AU spelling.
- Tenant lint checks all new SQL uses `currentTenantId()`/`tid()`.

## Criteria

F2.1 paged-responders:
- [x] ISC-1: paged-responders handler hydrates viewer firebase uid
- [x] ISC-2: paged-responders handler hydrates linked member_id
- [x] ISC-3: paged-responders handler queries view_member_pii role once
- [x] ISC-4: paged-responders handler hydrates viewer active incident locations
- [x] ISC-5: paged-responders SQL adds latest member location for each row
- [x] ISC-6: paged-responders SQL exposes pseudonymous_id per row
- [x] ISC-7: paged-responders calls canSeeIdentity per row
- [x] ISC-8: paged-responders emits pseudonymous_id when revealed false
- [x] ISC-9: paged-responders omits full_name when revealed false
- [x] ISC-10: paged-responders omits member_id when revealed false

F2.5 co-responders:
- [x] ISC-11: co-responders gates active dispatcher on callout
- [x] ISC-12: co-responders gates accepted responder on callout
- [x] ISC-13: co-responders permits view_member_pii role holder
- [x] ISC-14: co-responders returns 403 NOT_PARTICIPANT when none
- [x] ISC-15: co-responders suppresses mobile unless view_member_pii

F2.6 dispatch-candidates:
- [x] ISC-16: dispatch-candidates WHERE filters availability available
- [x] ISC-17: dispatch-candidates SELECT omits current_availability
- [x] ISC-18: dispatch-candidates response shape omits availability

F12.1 audit:
- [x] ISC-19: AuditAction union includes view_member_pii_reveal
- [x] ISC-20: responders.ts emits one audit on any rule-5 reveal
- [x] ISC-21: paged-responders emits one audit on any rule-5 reveal
- [x] ISC-22: co-responders emits one audit when role overrode gate
- [x] ISC-23: audit payload carries endpoint + callout_id + revealed_member_ids
- [x] ISC-24: audit payload carries ip_address + user_agent

Tests + lint:
- [x] ISC-25: route tests added for the four findings
- [x] ISC-26: lint:au + lint:tenant + format pass on touched files

## Verification

- 27/27 tests pass on touched files (4 test files): dispatch-candidates.test.ts, callouts-pii.test.ts, responders.test.ts, identity.test.ts.
- `bun run lint:au` — `AU English check passed.`
- `bun run lint:tenant` — `Tenant-isolation check passed.`
- `bunx prettier --write` over touched files — formatted, no remaining diffs.
- `docker compose --env-file .env.local --profile apps build api web sweeper` succeeded for all three images.
- Three commits on `fix/redteam-c1-pii` (467a1b9, 6c2bc19, 1d86c20) ahead of origin/dev. Not pushed.

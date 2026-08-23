---
task: Diagnose Home Assistant OneDrive connection failure
slug: ha-onedrive-connect
effort: E2
phase: complete
progress: resolved-externally
mode: standard
started: 2026-08-23
updated: 2026-08-23
---

## Problem

Nick's Home Assistant (HA OS, Core 2025.7.3, http://homeassistant.local:8123/) reports it cannot connect to OneDrive. The OneDrive integration is HA's cloud backup target, so failed connectivity means backups are not landing. No HA API token or logged-in browser session exists on any machine I can reach, so the exact error text has not yet been captured.

## Goal

Capture the exact OneDrive error from HA (repair item / logs), identify the cause, and restore the OneDrive connection with verified evidence (integration state = loaded, a backup or connection test succeeds).

## Criteria

- [x] ISC-1: HA instance reachable (probe: curl root → 200) — confirmed from Linux box
- [x] ISC-2: HA host resolvable from Mac for browser access (probe: ping homeassistant.local → 192.168.68.54)
- [x] ISC-3: Interceptor path to HA UI established (probe: navigate returns HA page)
- [x] ISC-4: Credential search exhausted on Linux + Mac before asking Nick (probe: rg sweeps returned nothing)
- [ ] ISC-5: Authenticated HA session available (blocked: needs Nick login or long-lived token)
- [ ] ISC-6: Exact OneDrive error text captured from Settings → Repairs or logs
- [ ] ISC-7: Root cause identified (expired Microsoft OAuth refresh token is the leading hypothesis)
- [ ] ISC-8: Fix applied (reauthenticate flow — requires Nick's Microsoft credentials; collect-only policy applies)
- [ ] ISC-9: Integration state verified loaded post-fix (probe: UI shows no repair, or `/api/config/config_entries` state)
- [ ] ISC-10: Anti: HA instance never restarted/modified without evidence supporting that action

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-2 | network | HTTP 200 / ICMP reply | reachable | curl, ping |
| 3 | ui | HA page text extracted | login or dashboard visible | interceptor |
| 5 | auth | interceptor text shows dashboard not login | authenticated | interceptor |
| 6 | ui | repair item text captured | exact error quoted | interceptor |
| 9 | ui | integration card shows no error | loaded | interceptor |

## Decisions

- 2026-08-23: Mode classifier assigned ALGORITHM E2. Delegation floor (≥1) met via Interceptor skill invocation; deeper delegation skipped — single-thread diagnostic, agents add no value while blocked on auth (show-your-math).
- 2026-08-23: Chose Interceptor over API because no HA token exists anywhere (grep-verified on both machines). Interceptor extension lives in Chrome Profile 3, which has no HA session — dead end until Nick logs in once.
- 2026-08-23: Leading hypothesis (RootCauseAnalysis, unconfirmed): Microsoft OAuth refresh token expired/revoked. Personal-account refresh tokens are invalidated by 90-day inactivity, password changes, or MFA changes; HA then raises a "reauthentication required" repair. Second hypothesis: transient Microsoft Graph outage (self-heals). Third: DNS/IPv6 egress failure on the HA box (would also break other cloud integrations).

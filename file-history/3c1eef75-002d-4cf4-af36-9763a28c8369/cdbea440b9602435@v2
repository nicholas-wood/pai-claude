---
task: Health check of BudgetBuddy (envelope-os) service and data
slug: budgetbuddy-health-check
effort: E2
phase: complete
progress: 17/17
mode: standard
started: 2026-08-01T18:30:00+10:00
updated: 2026-08-01T18:32:00+10:00
---

## Problem

BudgetBuddy (envelope-os) runs as a local-first systemd service with an hourly PocketSmith sync and a daily encrypted OneDrive backup. Nick has no current confirmation that the service, sync, backup, and data layer are all healthy — and initial observation shows `penny-backup.service` in a **failed** state, a regression since the encrypted pipeline was proven 2026-07-16.

## Goal

Deliver a verdict on BudgetBuddy's operational health — service, HTTP surface, sync freshness, backup pipeline, and database integrity — with tool-verified evidence for every claim, without mutating any budget data.

## Criteria

- [x] ISC-1: `penny.service` reports `active (running)` via systemctl
- [x] ISC-2: Bun server process listening on 127.0.0.1:8787 (ss shows LISTEN)
- [x] ISC-3: Health/root endpoint returns HTTP 200 via curl
- [x] ISC-4: API returns valid JSON on a read-only endpoint
- [x] ISC-5: Deployed version identified and compared to source (1.6.0)
- [x] ISC-6: `penny-sync.timer` is active with a scheduled next run
- [x] ISC-7: Last sync run completed successfully (journal shows success, exit 0)
- [x] ISC-8: Last successful sync is recent (within ~2 timer intervals)
- [x] ISC-9: `penny-backup.timer` is active with a scheduled next run
- [x] ISC-10: `penny-backup.service` failure diagnosed — failing unit's error captured from journal
- [x] ISC-11: Date of last successful encrypted backup established
- [x] ISC-12: Database reachable and integrity-checked (integrity_ok or equivalent probe)
- [x] ISC-13: Data freshness probe — most recent transaction/sync watermark date retrieved
- [x] ISC-14: Disk space on the DB volume above 10% free
- [x] ISC-15: No error-level entries flooding penny.service journal in last 24h
- [x] ISC-16: Anti: no write/mutation issued against the BudgetBuddy DB or API during checks
- [x] ISC-17: Anti: no fix applied unprompted — findings reported as advice, per standing feedback rule

## Verification

- ISC-1: Bash — `systemctl --user is-active penny.service` → `active`
- ISC-2: Bash — `ss -tlnp` → `LISTEN 127.0.0.1:8787 users:(("bun",pid=5657))`
- ISC-3: Bash — `curl -si http://127.0.0.1:8787/health` → `HTTP/1.1 200 OK`
- ISC-4: Bash — `curl /api/health` → `{"ok":true,"mode":"local"}`
- ISC-5: Bash — service ExecStart runs `bun run src/server/index.ts` from source tree; package.json `"version": "1.6.0"` → deployed = source = 1.6.0
- ISC-6: Bash — `systemctl --user list-timers` → penny-sync next Sat 2026-08-01 19:13:25 AEST
- ISC-7: Bash — journal: `[sync] done: 38 transactions across 1 pages ... completed 2026-08-01T08:13:26.830Z`, `Finished penny-sync.service`
- ISC-8: Bash — last success 18:13 AEST, 56 min before probe (< 2h interval window)
- ISC-9: Bash — `list-timers` → penny-backup next Sun 2026-08-02 02:00:00 AEST
- ISC-10: Bash — journal 18:08:53: rclone token refresh failed on `lookup login.microsoftonline.com on 127.0.0.53:53: server misbehaving` — boot-time DNS race (boot 18:08, catch-up timer fired before network-online); NOT a crypt/token regression. `resolvectl query login.microsoftonline.com` now resolves.
- ISC-11: Bash — journal Jul 28 02:05:29: `[backup] snapshot uploaded + verified (479.6MB) -> penny-crypt:/penny-2026-07-27.db` (machine off Jul 29–31, no runs)
- ISC-12: Bash — bun:sqlite readonly `PRAGMA quick_check` → `ok` on ~/.penny/penny.db (474MB)
- ISC-13: Bash — `SELECT MAX(txn_date) FROM transactions` → `2026-08-01`; 6,261 rows
- ISC-14: Bash — `df -h` → 28G/468G used (7%), 417G free
- ISC-15: Bash — `journalctl --user -u penny.service -p err --since "24 hours ago"` → `-- No entries --`
- ISC-16: Read — command audit: curl GETs, journalctl, systemctl status/show/cat, rclone lsl, sqlite opened `{ readonly: true }`; zero writes
- ISC-17: Read — no restart/start/fix commands issued; backup remediation left as recommendation to Nick

### Advisor-gap closure (post-Rule-2)

- ISC-11 (hardened): Bash — `rclone lsl penny-crypt:` lists penny-2026-07-22..27.db (~479.5MB each); remote object existence verified directly, RPO = 4 days stated plainly
- ISC-10 (hardened): Bash — `systemctl --user cat penny-backup.service` shows NO `After=network-online.target`; `show` → NRestarts=0 vs StartLimitBurst=5, no start-limit lockout → tonight 02:00 run confirmed able to start
- ISC-13 (hardened): Bash — date histogram Jul 25→Aug 1 shows rows every day incl. offline window (29th: 8, 30th: 6, 31st: 6) → no data hole; sync journal warnings: none
- ISC-12 (qualified): probe was `quick_check` (skips index-vs-table cross-check) — deliberate tradeoff at 474MB
- ISC-5 (corrected evidence): `readlink /proc/5657/cwd` = envelope-os source tree → running process IS the 1.6.0 tree (non-tautological)
- ISC-8 (corrected arithmetic): last sync 18:13 AEST, probe ~19:09 AEST → ~56 min

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1 | ops | systemctl is-active penny.service | active | Bash |
| ISC-2 | ops | ss -tlnp port 8787 | LISTEN | Bash |
| ISC-3 | http | curl -i 127.0.0.1:8787 health route | 200 | Bash |
| ISC-4 | http | curl read-only API route | valid JSON | Bash |
| ISC-5 | version | package.json vs API/journal version | match | Bash |
| ISC-6 | ops | systemctl list-timers penny-sync | next run set | Bash |
| ISC-7 | ops | journalctl -u penny-sync last run | exit 0 | Bash |
| ISC-8 | freshness | last success timestamp | < 2h old | Bash |
| ISC-9 | ops | systemctl list-timers penny-backup | next run set | Bash |
| ISC-10 | diag | journalctl -u penny-backup last failure | error captured | Bash |
| ISC-11 | ops | rclone lsl penny-crypt or journal | date found | Bash |
| ISC-12 | data | sqlite/pg integrity probe (read-only) | ok | Bash |
| ISC-13 | freshness | latest transaction date (read-only query/API) | retrieved | Bash |
| ISC-14 | ops | df on DB volume | >10% free | Bash |
| ISC-15 | logs | journalctl -u penny -p err --since -24h | no flood | Bash |
| ISC-16 | anti | audit of commands run | GET/read-only only | Read |
| ISC-17 | anti | response contains findings, no unprompted fixes | true | Read |

## Decisions

- 2026-08-01: Delegation floor (soft, E2 ≥1) relaxed — show-your-math: all probes are sub-second local commands (systemctl/curl/journalctl/df); an agent round-trip costs more than the entire probe set and adds no independent judgment.
- 2026-08-01: Task ISA (not project ISA) — health check is ad-hoc operational work; envelope-os/ISA.md is the product's system of record and is not being modified.

---
name: gotcha-accessbuddy-prod-access
description: How to reach AccessBuddy prod (GCP/DB/Resend/gh) from the Linux box — everything goes via the Mac
metadata: 
  node_type: memory
  type: reference
  originSessionId: ef252aad-8fb2-47d8-b675-f77609c21d47
  modified: 2026-08-09T11:07:05.726Z
---

AccessBuddy prod access from the Linux box, all via `ssh mac` (nothing installed locally):

- **gcloud**: `/opt/homebrew/bin/gcloud` (Homebrew — bare `ssh mac gcloud` fails, non-interactive PATH misses it). Authenticated as nicholas.h.wood@outlook.com. Project `accessbuddy-prod`, service `accessbuddy-production`, region australia-southeast1.
- **Prod DB**: Cloud SQL private-IP only. Pattern: `gcloud sql instances patch --assign-ip` → `cloud-sql-proxy` (also in /opt/homebrew/bin) on port 5433 → psql at `/opt/homebrew/opt/libpq/bin/psql` → `--no-assign-ip` and VERIFY `ipv4Enabled: False` after. DATABASE_URL is a literal env var on the Cloud Run service (read via `gcloud run services describe`, never print the password). `audit_log` is FORCE RLS — `set_config('app.current_tenant_id', ...)` first; SMLSC tenant slug is `south-melb-lsc` (not `smlsc`).
- **Resend keys are send-only restricted** (401 on all read/management endpoints) — forensics needs a temp full-access key from the dashboard, revoked after.
- **gh**: `/opt/homebrew/bin/gh`, token lives in the macOS keychain (locked over SSH) — use `GH_TOKEN=$(cat ~/.gh-token)` (file Nick exports from his GUI terminal).
- **Postgres RLS flags**: `forcerowsecurity` is NOT in pg_tables — use `pg_class.relforcerowsecurity` (this wrong-column mistake was made twice in Aug 2026).
- Complex ssh one-liners with nested quotes break silently and can leave the IP window open — always ship a script file via scp instead, with the IP disable inside it, and verify the flag after.

---
name: gotcha-accessbuddy-prod-access
description: How to reach AccessBuddy prod (GCP/DB/Resend/gh) from the Linux box — everything goes via the Mac
metadata: 
  node_type: memory
  type: reference
  originSessionId: ef252aad-8fb2-47d8-b675-f77609c21d47
  modified: 2026-09-04T00:58:37.538Z
---

AccessBuddy prod access from the Linux box, all via `ssh mac` (nothing installed locally):

- **gcloud**: `/opt/homebrew/bin/gcloud` (Homebrew — bare `ssh mac gcloud` fails, non-interactive PATH misses it). Authenticated as nicholas.h.wood@outlook.com. Project `accessbuddy-prod`, service `accessbuddy-production`, region australia-southeast1.
- **Prod DB**: Cloud SQL private-IP only. Pattern: `gcloud sql instances patch --assign-ip` → `cloud-sql-proxy` (also in /opt/homebrew/bin) on port 5433 → psql at `/opt/homebrew/opt/libpq/bin/psql` → `--no-assign-ip` and VERIFY `ipv4Enabled: False` after. DATABASE_URL is a literal env var on the Cloud Run service (read via `gcloud run services describe`, never print the password). `audit_log` is FORCE RLS — `set_config('app.current_tenant_id', ...)` first; SMLSC tenant slug is `south-melb-lsc` (not `smlsc`).
- **Resend keys are send-only restricted** (401 on all read/management endpoints) — forensics needs a temp full-access key from the dashboard, revoked after.
- **gh**: `/opt/homebrew/bin/gh`, token lives in the macOS keychain (locked over SSH) — use `GH_TOKEN=$(cat ~/.gh-token)` (file Nick exports from his GUI terminal). No gh and no token on the Linux box, but git push over SSH works there.
- **Merging without gh (verified 4 Sep 2026, v1.16.0):** `git merge --no-ff feature && git push origin main` lands the feature; release-please then refreshes `origin/release-please--branches--main` within ~30s; `git merge --ff-only` that branch into main and push. GitHub auto-marks the release PR merged, release-please cuts the tag/release within a minute, and the deploy job runs (release → live site ≈ 11-12 min). Probe: `curl -s https://accessbuddy.com.au/ | rg -o "1\.[0-9]+\.[0-9]"` shows the deployed version.
- **Postgres RLS flags**: `forcerowsecurity` is NOT in pg_tables — use `pg_class.relforcerowsecurity` (this wrong-column mistake was made twice in Aug 2026).
- Complex ssh one-liners with nested quotes break silently and can leave the IP window open — always ship a script file via scp instead, with the IP disable inside it, and verify the flag after.
- The Mac drops off Tailscale for 10-30 min at a time (Sept 2026: three dropouts in one hour). Run pulls from a background retry loop, write the script's output to a file on the Mac (`nohup … > ~/pai-tmp/x.out`) then cat it, so a dropped link cannot lose it, and re-check `ipv4Enabled` after any run whose SSH session died mid-flight.
- Renewal forensics: "renewed" on the member page means only that an admin clicked Renew; check `attestation_requests.status` and `credentials.programming_required` before reasoning about the daily summary.

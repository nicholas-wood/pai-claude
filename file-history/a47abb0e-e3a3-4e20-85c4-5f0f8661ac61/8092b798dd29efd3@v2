---
name: gotcha-accessbuddy-terraform-drift
description: "AccessBuddy prod Terraform is behind reality (July auth-hardening never applied, cron_secret in prod.tfvars differs from live); never apply a targeted plan that touches Cloud Run, import out-of-band resources instead"
metadata: 
  node_type: memory
  type: project
  originSessionId: a47abb0e-e3a3-4e20-85c4-5f0f8661ac61
  modified: 2026-09-12T10:15:17.201Z
---

As of 12 Sep 2026 the AccessBuddy prod Terraform state (bucket `accessbuddy-prod-tfstate`, run from the Mac checkout `~/Documents/workspace/projects/accessbuddy/code/infra/terraform`, terraform 1.5.7 at `/opt/homebrew/bin/terraform`, ADC works) has drifted from what is live:

- `session-signing-secret` exists in GCP (created 4 Aug out of band, Cloud Run already reads it) but is not in state; `stripe-platform-webhook-secret` does not exist in GCP at all, yet config wants Cloud Run to read it. Any plan that touches `google_cloud_run_v2_service.app[0]` will try to create both and repoint env vars; applying it would start a revision against a secret with no version. prod.tfvars has no `session_signing_secret`, so a full apply would also push the literal placeholder as the live signing secret and invalidate every admin session.
- `cron_secret` in prod.tfvars (46 chars, edited 5 May) is NOT the live value (Secret Manager `cron-secret` v1 and the daily cron header, 44 chars). A scheduler job created from tfvars gets 401 from `requireCronSecret`. The email-queue-drain job was created with gcloud on 12 Sep, imported into state, then its header set to the live value; Terraform still shows a header diff on it until tfvars is corrected to the live value.
- `terraform import` fails with "unknown values in for_each" because the secret-accessor IAM binding iterates over the two unmanaged secret IDs. Workaround used: temporarily delete those two lines from main.tf on the Mac, import, restore from a copy.
- An import that dies mid-run (Mac Tailscale dropout) leaves a GCS state lock; `terraform force-unlock -force <id>` after confirming no terraform process.

**Why:** the drift went unnoticed because nobody had run a plan since May; it surfaced only when the drain scheduler job (code-only since the email-queue feature) was found missing during Gordon Porter's expired-link investigation.

**How to apply:** before any `terraform apply` in this repo, reconcile first: import the existing secret, set `session_signing_secret` and the live `cron_secret` in prod.tfvars, create/populate the stripe platform webhook secret (and rotate it in Stripe), then confirm a full plan is clean. Create urgent single resources with gcloud and import them rather than targeted applies. See [[gotcha-accessbuddy-prod-access]].

---
task: Phase A bootstrap pack with Terraform and Cloud DNS
slug: 20260410-152424_phase-a-bootstrap-terraform
effort: extended
phase: complete
progress: 22/22
mode: interactive
started: 2026-04-10T05:24:24Z
updated: 2026-04-10T05:25:00Z
---

## Context

Existing terraform at `infra/terraform/` covers VPC, Cloud SQL, Redis, Artifact Registry, Cloud Run, Cloud Scheduler. Built for dev (`dev.tfvars` exists). Need to extend for prod with: Cloud DNS (replacing Cloudflare), Secret Manager, Cloud Storage, budget alert, missing APIs, and a `prod.tfvars`. Also need bootstrap instructions (GCP project creation, GCS state bucket), GoDaddy nameserver change guide, `.env.prod.template`, and a generated CRON_SECRET. Decision: Cloud DNS replaces Cloudflare (Nick confirmed; no CDN/DDoS needed for SMLSC).

## Criteria

**Terraform additions to main.tf**
- [ ] ISC-1: `dns.googleapis.com`, `secretmanager.googleapis.com`, `storage.googleapis.com` added to required_apis
- [ ] ISC-2: `google_dns_managed_zone` for `accessbuddy.com.au` with SOA
- [ ] ISC-3: `google_dns_record_set` A record pointing to Cloud Run external IP (or CNAME to `.run.app`)
- [ ] ISC-4: `google_dns_record_set` TXT for SPF
- [ ] ISC-5: `google_dns_record_set` TXT for DMARC
- [ ] ISC-6: Resend DKIM CNAME placeholder records (values filled by user from Resend dashboard)
- [ ] ISC-7: `google_secret_manager_secret` + initial versions for STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, RESEND_API_KEY, FIREBASE_ADMIN_CREDENTIALS, CRON_SECRET
- [ ] ISC-8: Cloud Run env vars updated to source secrets from Secret Manager
- [ ] ISC-9: Service account granted `roles/secretmanager.secretAccessor`
- [ ] ISC-10: `google_storage_bucket` for tenant assets
- [ ] ISC-11: `google_billing_budget` at $50/month
- [ ] ISC-12: Stripe-related variables added (publishable key, secret key, webhook secret)
- [ ] ISC-13: Resend API key variable added

**prod.tfvars + supporting files**
- [ ] ISC-14: `prod.tfvars.example` with all prod values annotated
- [ ] ISC-15: `.env.prod.template` at repo root matching §4.1
- [ ] ISC-16: CRON_SECRET generated and printed to stdout

**Documentation**
- [ ] ISC-17: Bootstrap README in `infra/terraform/` with steps: create GCP project, enable billing, create state bucket, terraform init/plan/apply
- [ ] ISC-18: GoDaddy nameserver change instructions (set NS to Cloud DNS nameservers from terraform output)
- [ ] ISC-19: `PATH_TO_PRODUCTION.md` §1 updated: Cloud DNS replaces Cloudflare
- [ ] ISC-20: `PATH_TO_PRODUCTION.md` §2.2 updated for Cloud DNS

**Anti-criteria**
- [ ] ISC-A1: Do NOT delete or rewrite existing terraform resources (additive only)
- [ ] ISC-A2: Do NOT commit or push

## Decisions

## Verification

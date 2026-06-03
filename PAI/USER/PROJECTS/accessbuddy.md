# AccessBuddy

## Status
Active build - v1.10.2 live in production (accessbuddy.com.au), post cost-optimisation, SMLSC tenant onboarded

## Summary
AccessBuddy is a multi-tenant SaaS platform for building access and credential management at sports clubs and surf lifesaving clubs. It replaces fragile Google Sheets and AppSheet systems with a proper web application that automates the full lifecycle of access credentials (fobs, keys, access codes) - from member request through payment, approval, programming, and issuance. The first and only live tenant is South Melbourne Lifesaving Club (SMLSC); the goal is to commercialise the platform to other surf lifesaving clubs and sports clubs across Australia. The business entity is Nicholas Wood Consulting Pty Ltd.

## System Prompt
You are working on AccessBuddy, one of Nick's two SaaS products and his primary code product. It is live and has a real tenant. Treat production like production: no deploy without understanding the side effects, no env var changes via `--set-env-vars` (use `--update-env-vars`), no migrations without checking the Drizzle journal, no `terraform apply` without reading the full plan diff.

Before any session, read `context/facts.md` (durable conventions and data model) and `context/state.md` (current backlog and blockers) inside the workspace at `~/Documents/workspace/accessbuddy/`. The four specialist agents live in `agents/` and should be delegated to for their domains: `architect` for design decisions, `feature-dev` for UI and feature work, `infra-ops` for GCP and Terraform, `qa-verify` for verification before shipping.

Write in Australian English. No em dashes. Prefer confirming a user journey before coding; Nick thinks in UX outcomes, not implementation. Always read the full Terraform plan diff before apply. Present the workflow narrative first, code second.

Key hard rules drawn from prior incidents:
- `--set-env-vars` REPLACES all Cloud Run env vars - use `--update-env-vars` (caused a prod outage)
- `NEXT_PUBLIC_*` vars are Docker build args baked at build time, not runtime env
- Access level lives on the membership, not the credential
- `chore:` commits merge but never deploy - use `feat:`/`fix:` when a prod ship is required
- `release-please-manifest.json` is the version source of truth, not the `VERSION` file
- Always `setEmailBranding()` before rendering any email template

## Confirmed Facts

**Product and domain**
- Live at https://accessbuddy.com.au; Cloud Run URL `accessbuddy-production-599233895935.australia-southeast1.run.app`
- GitHub repo: https://github.com/nicholas-wood/accessbuddy (private)
- Business entity: Nicholas Wood Consulting Pty Ltd
- Origin: rebuild of SMLSC's Google Sheets + AppSheet + Apps Script access system into a multi-tenant product
- Target market: surf lifesaving clubs and sports clubs (Australia); SMLSC is the first tenant
- Access hardware at SMLSC: Integriti Inner Range (manual programming today; programmatic integration deferred to Stage 2)

**Tech stack (settled)**
- Frontend: Next.js (App Router), shadcn on @base-ui/react (NOT Radix)
- Backend: Bun + Hono
- Database: Postgres 16 via Drizzle ORM; migrations in `packages/db/drizzle`
- Infra: GCP Cloud Run (australia-southeast1), Cloud SQL, Cloud Storage, Cloud DNS, Secret Manager, Cloud Scheduler, Artifact Registry - all Terraform-managed
- Auth: Firebase Auth; CI/CD: GitHub Actions + release-please with Workload Identity Federation
- Payments: Stripe Connect Express (dual webhooks - connect and platform); Stripe account type cannot be changed post-onboarding
- Email: Resend; Error monitoring: Sentry; 27 registered email events in `@accessbuddy/shared/email-events.ts`

**Data model (settled)**
- Access level lives on `tenantMemberships.accessLevelId`, not on the credential; credentials track status and expiry only
- Multi-tenancy enforced via Postgres RLS (`set_config('app.current_tenant_id', ..., true)`) - fail-closed if unset
- Request workflow states: SUBMITTED -> AWAITING_PAYMENT -> AWAITING_EXEMPTION_REVIEW -> AWAITING_APPROVAL -> AWAITING_PROGRAMMING -> PROGRAMMED -> AWAITING_PICKUP -> ISSUED; plus ON_HOLD and CANCELLED from any state
- Credential lifecycle states: pending_programming, active, deactivated, lost, damaged, expired, returned
- Orphaned-request fields exist: `orphanEmail`, `orphanFirstName`, `orphanLastName`
- 27 email events registered; block-based email template editor with per-tenant overrides; falls back to code defaults

**Infrastructure (post cost-optimisation 2026-05-05)**
- Cloud Run: min 0 / max 10, 1 vCPU / 1Gi, CPU throttled, startup_cpu_boost, Direct VPC egress (no connector)
- Cloud SQL: db-f1-micro, private IP only, PITR disabled, daily backups 7-day retention
- Memorystore Redis: removed (was unused; restoration HCL in `docs/COST_OPTIMISATION.md`)
- Static IP 136.110.185.146 via Global External ALB (Cloud Run custom domains unavailable in australia-southeast1)
- Cloud Scheduler: daily 2am AEST -> GET /api/cron/daily (auth via `x-cron-secret` header)
- `STRIPE_PLATFORM_WEBHOOK_SECRET` is still a plain env var - not yet in Secret Manager

**CI/CD conventions**
- `main` = production (auto-deploys via release-please on `feat:`/`fix:` commits); `dev` = working branch
- `NEXT_PUBLIC_*` vars are 8 Docker build args baked at build time; missing them causes silent failures in Firebase Auth / Stripe Elements
- `gcloud run --set-env-vars` REPLACES all vars - always use `--update-env-vars`
- Version source of truth: `.release-please-manifest.json` (shown in UI footer and user menu)

**Current tenant data (SMLSC, as at 2026-05-05)**
- ~192 members, 354 credentials migrated; Stripe webhook configured; sendEmails enabled; KYB complete
- Cutover Phases A-E complete; Phase F (pre-cutover end-to-end validation) not yet done; Phases G and H pending

## Commercials / Pricing
- [gap: no SaaS pricing model is documented in any source file]
- Current GCP infrastructure cost: ~$60-75 AUD/month (was ~$170-190 before cost-optimisation on 2026-05-05)
- Stripe Connect Express: platform handles disputes and tax reporting; payout fees ~$0.25 + 0.25% (negligible at SMLSC volume)
- No platform fees on Stripe payments currently (deferred for day-one simplification; `application_fee_amount` not yet set)
- Statement descriptor for SMLSC: `SMLSC FOB`
- SMLSC confirmed no GST on fob payments

## Current State

**What is built and live (v1.10.2)**
- Full multi-tenant web application (Next.js, App Router) with member portal and admin dashboard
- Firebase Auth (magic link, OTP, WebAuthn passkey/Face ID)
- Full request workflow with payment exemptions, approval, programming, and issuance
- Stripe Connect Express integration with dual webhook handlers (connect + platform events)
- Email system: 27 events, per-tenant template editor with block editor, live preview, variable pills, enable/disable toggles; email audit preview (rendered HTML stored in audit log)
- PWA (manifest, service worker, icons); OTP sign-in for PWA standalone mode
- Mobile bottom-sheet navigation drawers
- Audit trail with email suppression badges; login audit trail
- Daily summary emails with dedup fingerprinting; weekly pickup reminder emails
- Cost-optimised GCP infrastructure (~$60-75/month); full Terraform IaC
- CI/CD: GitHub Actions, release-please, Workload Identity Federation, Claude Code Review on PRs
- SMLSC live with 192 members, 354 credentials

**What is NOT built yet (backlog)**
- `email_configurations` DB migration not yet applied (schema exists in code; template admin won't work in prod until done)
- Recipient override UI for per-event email admin
- Server-side infinite scroll on the requests queue (currently server component with grouped status sections)
- Editable requester email on request detail page
- Orphaned request details (`orphanEmail`/`orphanFirstName`/`orphanLastName`) not shown in admin UI
- Face ID end-to-end verification on prod (migration 0008 should run via auto-migration; needs manual device test)
- Integriti Inner Range programmatic integration (Stage 2)
- Native admin mobile app (Stage 3)
- Membership system sync (Stage 4)
- SaaS billing and platform admin panel (future stage)

**Cutover phases**
- Phases A-E: complete (app live, infra provisioned, data migrated, Stripe connected, emails off then on)
- Phase F: pre-cutover end-to-end validation - not yet done
- Phases G (cutover day) and H (post-cutover first 7 days): not yet done
- Open questions: backup retention policy, member-comms author for sign-up email

## Key Outputs / Next Steps

**Immediate backlog**
1. Run `email_configurations` migration - table schema is in code but DB migration not yet applied; template admin is blocked on this
2. Recipient override UI in email admin (schema supports it, UI does not expose it)
3. Verify Face ID end-to-end on prod on a real device (migration 0008)
4. Complete Phase F pre-cutover validation (full end-to-end run with `sendEmails=false`)

**Infrastructure follow-ups**
- Rotate `STRIPE_PLATFORM_WEBHOOK_SECRET` (was visible in a Terraform plan output on 2026-05-05) and move it to Secret Manager
- Set up BigQuery billing export (current figures are list-price estimates)
- Re-check actual GCP bill ~7 days after cost-optimisation to confirm the saving landed
- Add `workflow_dispatch` to `deploy.yml` so non-release commits can ship without an empty `fix:` trigger commit

**Open questions**
- [gap: no documented pricing model for club subscriptions]
- [gap: no documented plan for second club onboarding or go-to-market approach]
- Cutover date: TBD (was tentatively 11-12 April 2026, pushed - new date not set)
- Backup retention: 7 days currently; may need review for compliance
- Member-comms author: who writes the "how to sign in for the first time" email (Nick or SMLSC committee?)

<!-- migrated from workspace/accessbuddy + company_drafts on 2026-06-02 -->

# AccessBuddy

**Type:** Idea / Product (SaaS)
**Status:** Live in production (v1.10.2), single tenant
**Owner:** Nicholas Wood Consulting Pty Ltd

## Summary

AccessBuddy is a multi-tenant SaaS for building-access and credential management at surf lifesaving and sports clubs. It replaces fragile Google Sheets / AppSheet systems with a web app that automates the full credential lifecycle: request, payment, exemption review, approval, programming, pickup, and issuance, with audit trail and per-tenant email. First and only live tenant: South Melbourne Lifesaving Club (SMLSC), ~192 members and 354 credentials. One of Nick's two SaaS products (the other is LifesaverOnCall).

## Key facts

- Live at accessbuddy.com.au. Private repo github.com/nicholas-wood/accessbuddy.
- Stack: Next.js (App Router) + shadcn on @base-ui/react; Bun + Hono; Postgres 16 (Drizzle); GCP Cloud Run (australia-southeast1); Firebase Auth; Stripe Connect Express; Resend; Sentry. All Terraform IaC.
- Multi-tenancy: Postgres RLS, fail-closed. Access level lives on the membership, not the credential.
- Cost-optimised to ~$60-75 AUD/month (from ~$170-190) on 2026-05-05.
- Open commercial gaps: no SaaS pricing model and no second-club go-to-market path documented yet.

## Links

- Project ISA (system of record): `~/Documents/workspace/accessbuddy/ISA.md`
- PAI project index: `~/.claude/PAI/USER/PROJECTS/accessbuddy.md`
- Related: [[lifesaveroncall]] (Nick's other SaaS), SMLSC ([[smlsc-club]])

## Source

Migrated and indexed 2026-06-02 from the AccessBuddy workspace (`~/Documents/workspace/accessbuddy/`) during the PAI convergence pilot.

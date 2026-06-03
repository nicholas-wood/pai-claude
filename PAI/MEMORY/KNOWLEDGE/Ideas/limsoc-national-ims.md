---
title: LIMSOC National IMS -- Consulting Engagement
type: project
status: completed
tags: [consulting, slsa, incident-management, national-rollout, governance, commercials]
created: 2026-06-02
updated: 2026-06-02
---

# LIMSOC National IMS

## Summary

Completed paid independent consulting engagement with SLSA (Surf Life Saving Australia) to drive strategy, architecture, governance, and commercial structure for LIMSOC -- a national-scale, real-time incident management platform serving ~199k members across a ~$100M organisation. Nick's deliverables were executive-grade documents and architecture; the client owns the platform code in Bitbucket. Core platform message: "Right information, right people, right time." This is the lead proof point for Nick's consulting pivot. The engagement grew out of the earlier LSV "Virtual PM" pitch (Proposal to Dave), which it superseded.

## Key Facts

### Deliverables (confirmed produced)
- National rollout approach document
- LIMSOC National Commercial Breakdown V2
- Governance options paper (recommended: wholly owned subsidiary)
- Low connectivity / offline approach (assisted servicing model)
- Interagency behaviour specification
- Integrations summary
- Data and reporting approach
- Environment topology diagram
- DR strategy
- Testing strategy uplift
- National configuration approach
- CEO-level summary / pack navigation document
- LIMSOC Permission Model Summary
- Season priorities proposal 2025-26 (18 projects across 4 focus areas)
- 10-phase delivery workflow (diagrams in drawio + png)
- Presentation to SLSA in Sydney, 13 March 2026

### Commercials
- Brand: Nicholas Wood -- Digital Consulting
- Rate: ~$1,000/day (current); ~$750/day (prior)
- Final invoice: 10 + 3 days effort (~30 days originally agreed; no extra cost added)
- Invoice line items: SLSA briefing pack prep, supporting documents, updated commercial structure proposal, Sydney presentation (13 March 2026)
- Invoicing via Xero; engagement board on Monday.com (https://life-saving-vic.monday.com/boards/18401115686/pulses/11336514141)

### Platform
- Stack: AWS / Terraform, Multi-AZ Aurora Postgres, Cloudflare edge, Azure backups
- Observability: Better Uptime, Sentry, Better Stack, OpenTelemetry
- API-first, asynchronous, canonical internal data model
- Tenant isolation by jurisdiction (state); config-driven operations
- Environments: Dev / UAT / Prod / Training
- Surfguard = organisational/membership system of record; LIMSOC = operational system of record

### Governance (recommended)
- Wholly owned subsidiary as governing entity
- Product Manager holds final decision rights on backlog and prioritisation
- LSAG plays advisory role; customer-driven intake model

### Open gaps
- Invoice settlement post-March 2026 not confirmed in sources
- Named SLSA stakeholders and decision-maker map not recorded
- Season priorities endorsement at Extended Standup not confirmed

## Links

- ISA (system of record): `~/Documents/workspace/limsoc-national-ims/ISA.md`
- PAI project index: `~/.claude/PAI/USER/PROJECTS/limsoc-national-ims.md`
- Season priorities (Markdown source of truth): `~/OneDrive/06_Lifesaving/SLSA/Projects/LIMSOC/limsoc-season-priorities-2025-26.md`
- Engagement board (Monday.com): https://life-saving-vic.monday.com/boards/18401115686/pulses/11336514141

## Source

Migrated from `workspace/limsoc-national-ims/context/` and `PAI/USER/PROJECTS/limsoc-national-ims.md` on 2026-06-02 as part of PAI convergence (recipe v1).

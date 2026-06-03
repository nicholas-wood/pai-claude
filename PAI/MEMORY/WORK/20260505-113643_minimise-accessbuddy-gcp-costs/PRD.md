---
task: Minimise AccessBuddy GCP costs whilst maintaining functionality
slug: 20260505-113643_minimise-accessbuddy-gcp-costs
effort: extended
phase: complete
progress: 19/19
mode: interactive
started: 2026-05-05T01:36:43Z
updated: 2026-05-05T01:36:43Z
---

## Context

Nick is funding AccessBuddy production himself for the foreseeable future and wants to drive monthly GCP spend to the lowest level that still preserves functionality for the live SMLSC tenant. Production runs in `accessbuddy-prod` (australia-southeast1) with Cloud Run, Cloud SQL Postgres 16 (db-f1-micro, private IP, PITR), Memorystore Redis 7 (BASIC 1GB), Global External ALB with managed SSL, Cloud Storage, Secret Manager, Cloud DNS, Artifact Registry, Cloud Scheduler.

Goal: identify actual cost drivers from billing/usage data (not assumptions), then propose the minimum viable footprint and per-line action list.

### Risks
- Removing Memorystore Redis breaks anything depending on session/cache
- Cloud SQL is usually the biggest line item; downgrading without HA review is fine for solo-funded but PITR/backups still cost
- Global ALB has fixed forwarding-rule cost (~$18/mo) — can't drop without losing custom domain unless we move to a Cloud Run domain mapping in a region that supports it (au-southeast1 doesn't, per memory)
- Private IP Cloud SQL needs VPC connector for Cloud Run — connector itself costs
- Artifact Registry storage grows unbounded if old images aren't pruned

## Criteria

Inventory & analysis:
- [x] ISC-1: Confirm billing accounts on both projects
- [x] ISC-2: Inventory Cloud Run config (CPU, memory, scaling, throttling)
- [x] ISC-3: Inventory Cloud SQL tier, disk, PITR, backups
- [x] ISC-4: Inventory Memorystore Redis tier and actual usage
- [x] ISC-5: Inventory ALB forwarding rules and static IPs
- [x] ISC-6: Inventory VPC connector machine type and min instances
- [x] ISC-7: Inventory Artifact Registry size and image count
- [x] ISC-8: Inventory dev project for orphaned spend
- [x] ISC-9: Pull Cloud Run request count, billable instance time, memory utilisation
- [x] ISC-10: Pull Redis connection count and command rate

Cost recommendations (analysis-only at this stage):
- [x] ISC-11: Estimate current monthly spend per service
- [x] ISC-12: Identify whether Cloud Run CPU is always-allocated vs throttled
- [x] ISC-13: Determine if Redis is materially used
- [x] ISC-14: Determine if VPC connector can be replaced with Direct VPC egress
- [x] ISC-15: Determine if PITR is justified
- [x] ISC-16: Identify Artifact Registry cleanup opportunity
- [x] ISC-17: Produce minimum-viable footprint estimate with $ savings
- [x] ISC-18: Present action list ranked by saving × risk before any change

ISC-A1 (anti): Do not make any cost-cutting changes without explicit approval per item.

---
task: "Decide LSV POC consolidation, design claude-to-gcloud skill pair"
slug: 20261122-144000_consider-the-service-summary-and-permiss
effort: deep
effort_source: classifier
phase: verify
progress: 14/46
mode: interactive
started: 2026-11-22T14:40:00+11:00
updated: 2026-11-22T15:25:00+11:00
---

## Problem

Two claude.ai prototypes (LSV Operational Service Summary, LIMSOC Permission Assist) were each hand-deployed into their own GCP project on 21-22 Nov 2026. The billing account caps at five linked projects and one had to be unlinked to fit the second. The sign-in code is byte-identical copies in both repos. Neither has monitoring, alerting, uptime checks, budgets or dependency scanning. Each deployment re-met the same gotchas. Nick wants to know whether to consolidate, and wants a repeatable two-skill pipeline from claude.ai prototype to a secured, observable app under nicholaswood.com.au.

## Vision

A prototype finished in claude.ai on Tuesday is live behind sign-in on a nicholaswood.com.au hostname on Wednesday, with alerts and a budget already attached, without Nick re-deciding anything about projects, sign-in, DNS or CI.

## Out of Scope

Nothing is built, migrated, deleted or deployed in this run; this is a decision and a design. No change to either live app, either repo, DNS, or billing. No formal LSV production hosting design; these remain Nick-owned POCs.

## Principles

- Separate what must be independently deployable, deletable and auditable; share only what is identical and carries no data.
- The unit of isolation follows data sensitivity, not app count.
- First runs of new automation land in empty targets.
- Names derive from one app id so collisions are impossible by construction.

## Constraints

- Billing account allows five linked projects (increase unrequested, outcome unknown).
- The Cloud DNS zone for nicholaswood.com.au lives in lsv-oss-prod's Terraform state and must not be moved or recreated.
- Region australia-southeast1; Cloud Run domain mappings unavailable there, so Firebase Hosting is the front door and the session cookie must be `__session`.
- claude.ai cannot be relied on to push to GitHub; a downloadable archive up to 30 MB is the documented output.
- gcloud and gh are reachable only through the Mac.
- Nick's standing rule: each app keeps its own repo, deploy and access list.

## Goal

Give Nick a recommendation on consolidation that he can accept or reject in one read, grounded in what is deployed, and a buildable specification for the packager and deployer skills, with the decisions that are his clearly separated from the ones I have defaulted.

## Criteria

Decision deliverable (this run)
- [x] ISC-1: Recommendation states yes/no per app, not a blanket answer
- [x] ISC-2: Recommendation cites the member-claim cross-access finding
- [x] ISC-3: Recommendation reconciles with "separate apps stay separate"
- [x] ISC-4: Billing-slot arithmetic stated before and after
- [x] ISC-5: Advisor disagreement surfaced with what I adopted and rejected
- [x] ISC-6: DNS delegation read at the TLD servers, result stated
- [x] ISC-7: Stale GoDaddy CNAME instruction flagged
- [x] ISC-8: claude.ai push-to-GitHub limitation stated with source confidence
- [x] ISC-9: Both skills specified with inputs, steps, outputs
- [x] ISC-10: Security baseline enumerated
- [x] ISC-11: Observability baseline enumerated
- [x] ISC-12: Decisions reserved for Nick listed explicitly
- [x] ISC-13: Anti: no file changed in either project repo this run
- [x] ISC-14: Anti: no gcloud, terraform, gh or DNS mutation this run

Shared POC project (future build)
- [ ] ISC-15: New project exists, linked to billing, australia-southeast1
- [ ] ISC-16: Platform Terraform state in its own bucket prefix
- [ ] ISC-17: Identity Platform email-link on, password off, in Terraform
- [ ] ISC-18: One GitHub WIF pool; one provider per app pinned to repo id, owner id, main
- [ ] ISC-19: Per-app runtime service account holds no project-level role
- [ ] ISC-20: Per-app state prefix `apps/<id>`
- [ ] ISC-21: Per-app Firestore named database, client access denied by rules
- [ ] ISC-22: Per-app claim `app_<id>`; no bare `member` claim anywhere
- [ ] ISC-23: Per-app Hosting site id `<id>`, not the project id
- [ ] ISC-24: Secrets named `<id>-*`
- [ ] ISC-25: [DROPPED — see Decisions 2026-11-22 15:40]
- [ ] ISC-26: Anti: a member of app X receives 403 from app Y

Packager skill, claude.ai (future build)
- [ ] ISC-27: Skill zip uploads with `name` ≤64 and `description` ≤200 chars
- [ ] ISC-28: Writes project as real files, not artifact references
- [ ] ISC-29: Emits `poc.json` with id, hostname, data model, capabilities used, external libraries, jobs, audience, sensitivity
- [ ] ISC-30: Bundled check script lists every external URL and `window.claude` call
- [ ] ISC-31: Emits per-file SHA-256
- [ ] ISC-32: Produces one downloadable archive under 30 MB
- [ ] ISC-33: Pushes to GitHub only when a write-capable connector is detected
- [ ] ISC-34: Anti: never asks for a GitHub token in chat

Deployer skill, Claude Code (future build)
- [ ] ISC-35: Accepts archive path or repo URL; verifies hashes
- [ ] ISC-36: Chooses shared or own-project tier from the manifest and says why
- [ ] ISC-37: Creates private repo from template with shared auth package pinned
- [ ] ISC-38: Vendors external libraries with pinned hashes; CSP has no external origin
- [ ] ISC-39: Stops for confirmation before repo creation, terraform apply, DNS change
- [ ] ISC-40: Reads TLD delegation before any DNS write
- [ ] ISC-41: Uptime check on `/api/health` exists per app
- [ ] ISC-42: Alert policies exist: uptime, 5xx rate, sign-in failures, job failure
- [ ] ISC-43: Budget alert exists on the project
- [ ] ISC-44: CI runs secret scan and dependency audit
- [ ] ISC-45: Probe script and Interceptor pass recorded before reporting live
- [ ] ISC-46: Permission Assist redeployed through the skill as first run

## Test Strategy

| isc | type | check | threshold | tool |
|---|---|---|---|---|
| 1-12 | inspection | final answer contains item | present | Read of response |
| 13 | file | `git status` clean in both checkouts | no changes | Bash |
| 14 | audit | no mutating cloud command in transcript | none | transcript |
| 15-24 | infra | `terraform state list`, `gcloud` describe | resource present | Bash via ssh mac |
| 25-26 | negative | deploy refusal; curl with app X cookie to app Y | refused / 403 | Bash, curl |
| 27-34 | skill | upload to claude.ai; run on a sample prototype | archive valid | manual + unzip -t, sha256sum |
| 35-45 | skill | run against Permission Assist | all gates fire | Bash, Interceptor |
| 46 | deploy | sign-in on new hostname | 200 after sign-in | Interceptor |

## Features

| name | description | satisfies | depends_on | parallelizable |
|---|---|---|---|---|
| decision | This run's recommendation | ISC-1..14 | none | no |
| platform | Shared POC project, platform repo, app module, auth package | ISC-15..26 | Nick's decisions | no |
| poc-deploy | Claude Code skill | ISC-35..46 | platform | no |
| poc-pack | claude.ai skill | ISC-27..34 | manifest schema from poc-deploy | yes |
| backfill | Baseline onto Service Summary in its own project | ISC-41..44 pattern | platform module | yes |

## Decisions

- 2026-11-22 14:45: Treated the request as advice plus design, not a build, per feedback-advice-not-action and "I would like to consider".
- 2026-11-22 15:05: Draft recommendation was to adopt lsv-oss-prod as the shared host.
- 2026-11-22 15:20: refined: draft rejected after advisor review. Adopted: first run in an empty project; Firebase rules and Hosting deploy IAM are project-wide; do not move the DNS zone. Rejected: project-per-app for everything (rests on an unverified quota increase and on a wrong premise that LSV and LIMSOC are separate organisations).
- 2026-11-22 15:20: Settled shape: two tiers. Shared POC project for prototypes holding no operational or personal data; own project for anything that does. Service Summary stays alone.
- 2026-11-22 15:22: ISC floor (128) not met, 46 written. Show-your-math: the deliverable is a decision and a specification; further ISCs would be padding ahead of Nick's decisions, which change the build criteria.
- 2026-11-22 15:22: Cato not run: `codex` binary absent on this machine (known gotcha). Advisor review stands as the only second opinion and is same-family.
- 2026-11-22 15:22: Delegation: Explore (deployment side-by-side) and claude-code-guide (claude.ai capabilities).
- 2026-11-22 15:40 (Nick): overruled the two-tier split. Both apps go in the shared project with central per-user POC allocation; sub-zone accepted; Service Summary claim fix handed to its thread (message sent). Build continues under the project ISA at ~/Documents/workspace/projects/lsv-poc-platform/ISA.md; ISC-25 here is superseded.

## Changelog

- conjectured: the cheapest consolidation is to make the existing Service Summary project the shared host, since it avoids any data or DNS migration.
  refuted by: advisor review plus the side-by-side: project-wide Firebase rules and Hosting deploy permissions, a first-run skill beside live data, and the zone-move outage risk.
  learned: isolation should follow data sensitivity; the shared tier must be a new empty project and the data-bearing app stays out of it.
  criterion now: ISC-25 (shared tier refuses data-bearing apps) and ISC-46 (first run is Permission Assist into the empty project).

## Verification

- ISC-6: Bash dig at the com.au servers returned `ns-cloud-b1..b4.googledomains.com`; public resolvers agree.
- ISC-7: `service-summary` resolves to `lsv-oss-prod.web.app`; `permissions` returns nothing.
- ISC-13/14: every command this run was read-only (ls, cat, rg, dig, curl to the local notifier, Inference.ts); the only files written are this ISA and the skill execution log.
- ISC-1..5, 8..12: present in the final response.

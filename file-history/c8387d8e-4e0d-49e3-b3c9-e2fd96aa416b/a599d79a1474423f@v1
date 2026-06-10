# LifesaverOnCall

## Status
Active build - pre-launch (Phase 3 of 4 complete locally; Phase 4 prerequisites not yet cleared)

## Summary
LifesaverOnCall is a GoodSAM-style smart-page-and-respond dispatch app for SLSA volunteer lifesavers, targeting Life Saving Victoria (LSV) as the first tenant in Stage 1. It replaces slow manual paging and phone-tree rostering with a map-first interface that pages the closest available responders and manages the full callout lifecycle. The primary target users are frontline lifesaver responders, dispatchers, capability leaders, and operational base managers within the SLSA organisational hierarchy. The app is multi-tenant from day one (SLSA national to state to region to area to club), pluggable for other states after the LSV year 1 launch.

## System Prompt
When working on LifesaverOnCall, you are supporting Nick's personal SaaS product - a dispatch and incident management platform for SLSA surf lifesaving volunteers. This is not an LSV-internal project or an LIMSOC feature; it is a separate product that Nick is building independently with the intent of supplying it to LSV (and potentially other states) as a vendor or through a partnership arrangement. The commercial and legal structure is unresolved (see Commercials). Keep domain safety rules front of mind: dispatch is safety-critical. Never suggest collecting or sharing member location while a member is unavailable, never allow dispatch of members with lapsed awards or non-approved capability status, and never auto-clear a capability outage or suspension. All data must remain in Australian GCP regions. When in doubt about dispatch rules, check `KICKOFF.md` §6 (don't-do list) before making any suggestion.

## Confirmed Facts

**Product identity**
- App name: LifesaverOnCall (slug `lifesaveroncall`)
- Concept: GoodSAM-style responder dispatch for surf rescue and lifesaving incidents
- Stage 1 tenant: Life Saving Victoria (VIC) via LIMSOC identity adapter
- Architecture is pluggable for other states (NSW, QLD, SA, TAS, WA) in later stages
- GitHub: `https://github.com/nicholas-wood/lifesaveroncall` (private)
- Local workspace: `~/Documents/workspace/lifesaveroncall`

**Stack (all confirmed and in use)**
- Runtime: Bun
- API: Hono
- Web (dispatcher UI): Next.js 15 + React 19 (App Router), Cloud Run
- Mobile (responder): Expo + React Native + EAS
- Database: Postgres 16 + PostGIS (Cloud SQL HA, `australia-southeast1`)
- Cache: Redis (Memorystore Basic, deferred HA)
- Messaging/events: GCP Pub/Sub with DLQ (three topics: `member-status`, `member-location`, `callout-events`)
- Live updates: Server-Sent Events (not WebSockets)
- Auth: Firebase Auth for app sessions; pluggable identity adapter - LIMSOC JWT (HS256) for VIC year 1, SLSA Members Area for national next
- Awards source: LIMSOC API (`/award_checks/`, `/options/patrol_positions/`, `/api/members/{id}/`)
- Push: Expo Notifications to FCM + APNs. Apple Critical Alerts entitlement deferred.
- Maps: Google Maps Platform - two-key pattern (public browser/mobile key + restricted server key)
- Compute: three Cloud Run services (`api`, `push-worker`, `sweeper`)
- Local dev: Docker Compose (Postgres+PostGIS, Pub/Sub emulator, Redis)
- Package manager: Bun (web); Bun + EAS (mobile)
- Language: TypeScript strict throughout

**Domain model (settled)**
- Org hierarchy: SLSA national → state → region → area → club/service (variable depth)
- Member availability: two states only (`available` / `unavailable`); default `unavailable`; location collected only when `available` or on an accepted callout
- Capability types: IRB, RWC, SSV, 4WD, ARO, RPAS, aerial, support (plus org-defined extensions)
- Callout lifecycle: `draft → requesting → partially_filled → filled → in_progress → closing → stood_down/closed`
- Responder lifecycle: `requested → accepted | rejected | expired (30 s) | cancelled` then `accepted → enroute → at_base → on_scene → stood_down | dropped`
- Incident log: hash-chained, append-only, mutation blocked by Postgres trigger; retained 7 years
- Identity: `linked_credentials` table binds Firebase UID to SLSA member_id; LIMSOC token stored encrypted (AES-256-GCM)
- De-identification: six-rule precedence in `KICKOFF.md` §6; server-side enforcement only; `unavailable` members never visible even with `view_member_pii`
- Cross-org dispatch: three-way consent (responder opt-in + home state outbound allowlist + dispatching state inbound allowlist); pair-asymmetric per state
- Push SLO: P95 < 5 s, P99 < 10 s callout push; API write P95 < 200 ms
- Reliability target: year 1 ~3.5-nines, architected for 4-nines
- Data residency: `australia-southeast1` (all persistent storage and compute)
- Critical alerts reserved exclusively for the initial request-for-assistance push; all other notifications use normal-priority channels

**Integrations**
- LIMSOC: bidirectional - inbound `POST /v1/callouts` from LIMSOC; outbound Pub/Sub push subscription (LIMSOC subscribes to `callout-events`)
- LIMSOC credential refresh: runs every 10 min in the sweeper; awards sync nightly + targeted re-sync at 14/7/1 days before award expiry
- Geocoding: bases auto-geocoded from `scripts/data/units.csv` via `bun run geocode:units`

## Commercials / Pricing

- [gap: no formal pricing model for LifesaverOnCall is in any source file]
- Legal entity decision outstanding - sole trader vs Pty Ltd vs LSV-internal project (this choice drives Apple Developer enrolment, Google Play Console, and contracting with LSV)
- The `company_drafts/` files (MASTER_REFERENCE, PROPOSAL_TO_DAVE, PRICING_GUIDE, GAP_ANALYSIS, QUICK_REFERENCE) are all about a separate paid LIMSOC product management consulting engagement Nick is pitching to LSV - they contain no LifesaverOnCall-specific pricing or commercials
- Domain not yet registered: `lifesaveroncall.com.au` (and ideally `.app`) - trademark check needed before purchase
- [gap: whether this will be a vendor/SaaS relationship, an LSV-funded project, or some hybrid arrangement is unresolved]

## Current State

**As of 2026-05-12 (last recorded session)**
- Phase 1 P0 + Phase 2 P1 + Phase 3 P2/P3 of `docs/COVERAGE_TO_100.md` complete
- `dev` tip: `693cfc7`; 15 branches merged (B13, B18b, B21-B31); all branches in COVERAGE_TO_100 closed
- DB at migration 0029; migrations 0001--0029 all applied to `loc-postgres`; no pending migrations
- Local containers rebuilt and restarted on the new images at end of session

**What is built**
- Dispatch UI, incident UI and log, map with clustering, leader/admin UI, mobile responder flows
- `setCalloutCommander` server endpoint and typed client helper (UI picker deferred)
- Multi-tenant architecture with AsyncLocalStorage tenant context + static analyser
- LIMSOC identity adapter verified end-to-end against real token shape
- Hash-chained incident log with Postgres trigger enforcement
- Geocoded base data committed

**What is not built / not yet done**
- Phase 4 prerequisites not cleared (domain, GCP projects, Apple Developer, legal entity, LIMSOC staging credentials, LSV org mapping)
- GCP infra not provisioned (Terraform modules drafted but not applied)
- Apple Critical Alerts entitlement not applied for (deferred until product proven and LSV affiliation letter in hand)
- B25c commander picker UI deferred (needs a member-search component on web first)
- B22 cross-org excluded count is a heuristic; clean fix needs server-side `excluded_count` field per FR-6.17
- External actions from COVERAGE_TO_100 §6 outstanding: Apple Critical Alerts, Firebase Storage bucket, SLSA OIDC client (FR-1.1), Places billing review, GitHub branch protection (needs GitHub Pro), restricted-radio-channels production seed
- Logo generation blocked (all three image APIs failed: Replicate 402, Gemini API key invalid, OpenAI key not set); ready-to-run script at `~/.claude/skills/Media/Art/Tools/lifesaveroncall-radar-trio.ts`
- LSV partnership / commercial arrangement not formalised

**Known ignorable failures**
- TS6310 + bun-types on `bun run --filter ... typecheck`
- eslint parser errors on `packages/events`, `packages/observability`, `scripts/` - pre-existing, not introduced by recent work

## Key Outputs / Next Steps

**Immediate (resume backlog)**
1. Confirm incident form appearance on fresh container restart - user reported it "looks the same as before" when containers were stale; verify which specific change they expected on `CreateIncidentModal` (4 fields: Location, Incident Type, Brief, Radio Channel) or `incident-info-panel.tsx`
2. Unblock logo generation - add Replicate payment OR refresh Gemini key at aistudio.google.com/apikey OR generate manually in AI Studio web UI using the script's prompts
3. B25c commander picker UI - small follow-up branch; needs a member-search component on web first
4. B22 clean fix - add server-side `excluded_count` field to `/v1/dispatch-candidates` per FR-6.17

**Phase 4 hard blockers (none cleared yet)**
- Register `lifesaveroncall.com.au` (verify trademark first)
- Provision three GCP projects (`lifesaveroncall-dev`, `-staging`, `-prod`)
- Apple Developer enrolment ($149 AUD/yr)
- Legal entity decision (sole trader vs Pty Ltd)
- LSV org mapping from LIMSOC (entity types + parent links)
- LIMSOC test account in staging with at least one current award

**Open questions**
- [gap: commercial/partnership model with LSV is not formalised - vendor, LSV-funded project, or personal product?]
- [gap: LSV partnership letter needed before Apple Critical Alerts entitlement application]
- [gap: realistic production launch timeline - PHASE_4_PREREQS.md estimates ~17 weeks of engineering time from prereqs cleared, extended by external dependencies]

**Key reference docs (in repo)**
- `KICKOFF.md` - contract, don't-do list, domain model, lifecycle catalogue, quality bar
- `code/docs/REQUIREMENTS.md`, `code/docs/USE_CASES.md` - full functional and non-functional spec
- `code/docs/ARCHITECTURE.md` - production topology
- `code/PHASE_4_PREREQS.md` - hard blockers and sequence to launch
- `code/RUNNING_LOCALLY.md` - bootstrap and Firebase setup
- `context/facts.md`, `context/state.md` - durable facts and current volatile state
- `context/feedback.md` - working style and build/env gotchas

<!-- migrated from workspace/lifesaveroncall + company_drafts on 2026-06-02 -->

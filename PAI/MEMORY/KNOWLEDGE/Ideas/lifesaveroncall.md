# LifesaverOnCall

**Type:** Idea / Product (SaaS -- emergency dispatch)
**Status:** Pre-launch, Phase 3 complete (dev tip `693cfc7`); Phase 4 hard blockers pending

## Summary

LifesaverOnCall is a GoodSAM-style emergency dispatch and incident management platform for SLSA volunteer lifesavers. Map-first dispatch pages the closest available, award-current responders automatically. Incident lifecycle managed from callout creation through stand-down. Mobile responder app (Expo + React Native) for accept/reject and navigation. Stage 1 targets Life Saving Victoria via LIMSOC credential integration; pluggable adapters for other states are architected but not built. One of Nick's two SaaS products (the other is AccessBuddy).

## Key facts

- Pre-launch; Phase 3 (COVERAGE_TO_100) complete. Phase 4 requires external hard blockers cleared (domain, GCP, Apple Developer, legal entity, LSV org mapping, LIMSOC test account).
- Private repo: `github.com/nicholas-wood/lifesaveroncall`. Local at `~/Documents/workspace/lifesaveroncall`.
- Stack: Bun, Hono, Next.js 15 + React 19, Expo + RN, Postgres 16 + PostGIS, GCP Pub/Sub, Redis, Docker Compose, Firebase Auth, Google Maps Platform. GCP target: Cloud Run + Cloud SQL HA + Memorystore + ALB, `australia-southeast1`, full Terraform IaC.
- Safety-critical product: six-rule de-identification precedence; never dispatch expired-award or suspended members; critical alerts reserved for initial request-for-assistance push only; incident log append-only and hash-chained.
- Open backlog: B25c commander picker UI (blocked on MemberPicker component); B22 cross-org excluded count (heuristic, needs server-side `excluded_count`); logo generation blocked (all image APIs failed -- Replicate/Gemini/OpenAI).
- Four specialist agents: architect, feature-dev, infra-ops, security-redteam.

## Links

- Project ISA (system of record): `~/Documents/workspace/lifesaveroncall/ISA.md`
- PAI project index: `~/.claude/PAI/USER/PROJECTS/lifesaveroncall.md`
- Related: [[accessbuddy]] (Nick's other SaaS), LSV / LIMSOC (external dependency)

## Source

Migrated and indexed 2026-06-02 from the lifesaveroncall workspace (`~/Documents/workspace/lifesaveroncall/`) during PAI convergence (recipe v1, second project).

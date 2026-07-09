---
task: Research and compare St Kilda property management agencies for leasing the apartment
slug: st-kilda-pm-selection
effort: E2
phase: complete
progress: 25/25
mode: research
started: 2026-07-09T00:00:00+10:00
updated: 2026-07-09T00:00:00+10:00
---

## Problem

Nick is moving to Brisbane and leasing out the St Kilda apartment (lease-not-sell already decided). He has a Belle Property rental appraisal in hand and Gary Peer appraising today. He needs a decision-grade comparison of property management agencies (fees, all-in costs, reviews, reputation) plus negotiation ammunition, before committing to a managing agent.

## Goal

Deliver a verified, source-backed comparison of St Kilda property managers (Belle Property and Gary Peer anchored, plus credible competitors), with fee benchmarks, review intelligence separated sales-vs-PM, market context, negotiation levers, and a shortlist recommendation usable at today's Gary Peer appraisal.

## Criteria

- [x] ISC-1: Inner-Melbourne management fee % benchmarked with verified sources
- [x] ISC-2: Letting fee benchmark (weeks of rent) documented
- [x] ISC-3: Ancillary fees quantified (renewal, admin, inspections, marketing, maintenance markup)
- [x] ISC-4: Honest all-in effective cost as % of annual rent computed
- [x] ISC-5: Belle Property St Kilda profiled (office, team, PM reputation)
- [x] ISC-6: Gary Peer profiled with 3182 coverage confirmed
- [x] ISC-7: At least 5 alternative traditional agencies profiled
- [x] ISC-8: Flat-fee/tech disruptors assessed with viability verdicts
- [x] ISC-9: Review scores separated sales vs PM with platform-bias caveat stated
- [x] ISC-10: St Kilda market context included (vacancy, 2BR rent, days on market)
- [x] ISC-11: Victorian 25 Nov 2025 regulatory changes flagged for landlord obligations
- [x] ISC-12: Negotiation levers enumerated with target numbers
- [x] ISC-13: Questions to ask at today's Gary Peer appraisal provided
- [x] ISC-14: Comparison table of agencies delivered
- [x] ISC-15: Shortlist recommendation with reasoning delivered
- [x] ISC-16: Anti: no fabricated or unverified URLs presented as verified
- [x] ISC-17: Anti: national brand review scores not misattributed to the local office
- [x] ISC-18: Findings cross-checked by 2 independent verifier agents
- [x] ISC-19: Belle proposal (fees + appraisal) extracted from OneDrive/Engage link
- [x] ISC-20: Gary Peer proposal (fees + appraisal) extracted from OneDrive
- [x] ISC-21: Both proposals normalised to incl-GST dollars at midpoint rent and tabled
- [x] ISC-22: Year-1 and stable-year all-in totals computed for both
- [x] ISC-23: Fee traps and structural differences identified per proposal
- [x] ISC-24: Counter-offer terms and decision rule delivered
- [x] ISC-25: Anti: appraisal figures verified against the correct property address (caught Gary Peer template error)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-4 | content | fee figures present with [HIGH/MED] sources | 2+ concordant sources | agent output review |
| 5-8 | content | each agency profiled with review data | anchors + 5 competitors | agent output review |
| 9 | content | RateMyAgent-vs-ProductReview bias caveat stated | explicit | final message grep |
| 10-11 | content | vacancy, rent, DOM, reform dates present | all four | final message grep |
| 12-13 | content | levers with numbers + appraisal questions | >=5 each | final message grep |
| 14-15 | content | table + shortlist in final message | present | final message grep |
| 16 | anti | only verifier-confirmed URLs cited | zero fabricated | verifier agent pass |
| 17 | anti | brand-wide scores caveated as national pools | caveat present | final message grep |
| 18 | process | both verifier agents returned | 2/2 | task notifications |

## Decisions

- 2026-07-09: ISA scaffold inlined rather than via Skill("ISA") fork. The Research skill execution preceded classifier-driven Algorithm entry (mode line arrived with the first notification batch); forking a scaffold agent would double-handle a completed research artifact inside a background job. Deviation logged per doctrine.
- 2026-07-09: Delegation floor satisfied by Research skill (9 agents: 7 explorers, 2 verifiers). Thinking floor E2 met with FeedbackMemoryConsult and ReReadCheck.
- 2026-07-09: Voice phase announcements degraded: subagents report ElevenLabs 402 (tier limit). Entry curl attempted; per-phase curls skipped to preserve budget. Ceremony must not eat the budget per v6.3.0 tier intent.

## Verification

ISC-1..4: content probe - REPORT.md fee table with CAV/whichrealestateagent/LocalAgentFinder sources, all-in 8-11% computed. Cross-verified by 2 verifier agents.
ISC-5: content probe - Belle profile (6 Alma Rd, 4.9/903 sales vs zero leasing reviews, national 1.6/180 caveated).
ISC-6: content probe - Gary Peer profile (55 Inkerman St, 3182 coverage confirmed via garypeer.com.au fetch, 3.9/65 ProductReview curl-verified).
ISC-7: content probe - 7 traditional competitors profiled (Wilson, Buxton, C&G/Jellis Craig, McGrath, Biggin & Scott, Marshall White, Hodges).
ISC-8: content probe - disruptors assessed (:Different administration 2023, Yabonza liquidated 2022, Certainty red-flagged, Cubbi/RentBetter DIY-only, LongView credible).
ISC-9: content probe - RateMyAgent-solicited vs ProductReview-complaint-driven bias stated in report Recommendation section.
ISC-10: content probe - vacancy ~1.8%, 2BR $580-650/wk, ~37 days on market in report.
ISC-11: content probe - 25 Nov 2025 / Mar 2026 / Oct 2026 / 2027 reform dates in report, gov-source verified.
ISC-12: content probe - 8-line negotiation target table in report.
ISC-13: content probe - 8 appraisal questions in report.
ISC-14: content probe - agency comparison table in report and final message.
ISC-15: content probe - ranked shortlist (Gary Peer, Wilson, Belle) with reasoning.
ISC-16: anti probe - all cited URLs liveness-checked by agents; bot-blocked pages flagged [MED/LOW], none presented as verified.
ISC-17: anti probe - Belle 1.6 and Jellis Craig 1.7 explicitly caveated as national pools in report.
ISC-18: process probe - both verifier agents (claim verification, contradictions) returned and corrected two claims (:Different/ANZ falsehood, Gary Peer rent-roll size unverified).

Iteration 2 (2026-07-09 evening, actual proposals):
ISC-19: Read probe - Belle Engage DigitalPage 668798 rendered via chrome-headless-shell, full text 23k chars extracted (belle_rendered.txt); fees 6.6% incl GST, 1.5wk letting, $680-750 appraisal.
ISC-20: Read probe - Gary Peer Appraisal_Paki_ngton.pdf read; 6%+GST management, 3% annual letting, renewal waived, $700-750 appraisal.
ISC-21/22: content probe - head-to-head table and totals in REPORT.md (year-1 ~12.5% vs ~13%; stable 7.5% vs 7.1%).
ISC-23/24: content probe - fee traps (Belle insurance/project %, penalty clause; GP admin) and counter-offer + decision rule in REPORT.md.
ISC-25: anti probe - GP letter cites "1/37 Hotham Street" in appraisal sentence; GP PropTrack CMA page 6 confirms $700-750 for 101/40-44 Pakington. Error flagged, figure carried.

Iteration 2 decisions:
- agent-browser binary missing on Linux (~/.local/bin/chrome symlinks broken, Mac-era); used puppeteer-cache chrome-headless-shell --dump-dom instead. Belle Engage SPA content unreachable via API token (template body 403); DOM render was the correct path.
- OneDrive mount reads hydrate slowly; rclone copy timed out at 10min, per-file cp from mount succeeded in background. Consistent with existing onedrive gotcha memory (push side); reads also slow.

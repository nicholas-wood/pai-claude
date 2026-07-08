---
task: "Lease vs sell St Kilda apartment decision analysis"
slug: 20260708-155609_lease-vs-sell-apartment
effort: E3
effort_source: classifier
phase: complete
progress: 34/34
mode: research
started: 2026-07-08T05:56:09Z
updated: 2026-07-08T05:58:00Z
---

## Problem

Nick is moving to Brisbane for work and modelled leasing his St Kilda apartment at a -$14,348/yr shortfall. He wants to know if selling beats leasing. The table treats the full P&I mortgage payment as a cost, omits tax effects (negative gearing, depreciation, CGT), omits land tax and vacancy, and contains no capital-growth or opportunity-cost comparison, so the headline number cannot answer the question as it stands.

## Vision

Nick reads one reply and instantly sees that his -$14,348 is not the real cost, what the true after-tax holding cost is, the single growth-rate breakeven that decides hold vs sell, and a decision rule he can apply himself once he confirms two or three inputs. The click: the 6-year CGT rule means he does not have to decide permanently today.

## Out of Scope

Licensed financial or tax advice; Brisbane property purchase modelling beyond its interaction with the CGT exemption; restructuring the loan or refinancing options; detailed depreciation schedule preparation; modelling of his broader portfolio or superannuation.

## Constraints

- Recommendation first, then reasoning (Nick's standing comms rules).
- Australian English, metric, no em dashes, executive-ready tone.
- All external claims (tax rules, growth data, land tax bands) sourced via research agent, not memory alone.
- Live data (loan balance, rate, value) sourced from Pocketsmith where available; assumptions labelled where not.
- Background-session close: `needs input:` line, never `result:` (PAI signal override).

## Goal

Deliver a decision-grade hold-vs-sell verdict that decomposes the -$14,348 into true after-tax economics, quantifies the breakeven capital growth rate, applies the CGT 6-year rule, and states a recommendation with the specific conditions under which it flips.

## Criteria

- [ ] ISC-1: Table arithmetic re-summed and confirmed or corrected (Bash calc)
- [ ] ISC-2: Initial letting fee flagged as one-off/turnover cost, not annual recurring
- [ ] ISC-3: Mortgage P&I conflation identified explicitly in the reply
- [ ] ISC-4: Interest vs principal split computed from sourced or assumed loan terms
- [ ] ISC-5: Loan balance sourced from Pocketsmith or assumption stated with basis
- [ ] ISC-6: Interest rate sourced or assumption stated with basis
- [ ] ISC-7: Apartment value estimated with stated basis (Pocketsmith or yield cross-check)
- [ ] ISC-8: Nick's marginal tax rate stated as explicit assumption or derived from income data
- [ ] ISC-9: VIC land tax identified as a missing cost line, band verified by research
- [ ] ISC-10: Vacancy allowance identified as a missing cost line with estimate
- [ ] ISC-11: Water service charges identified as a landlord cost omission
- [ ] ISC-12: Negative gearing deductible loss computed from the corrected figures
- [ ] ISC-13: Depreciation deductibility addressed (pre/post-1987 build, Div 40 vs 43)
- [ ] ISC-14: Annual tax refund estimate computed at stated marginal rate
- [ ] ISC-15: True after-tax economic holding cost per year computed
- [ ] ISC-16: Annual and weekly cash requirement (pre and post refund) computed
- [ ] ISC-17: CGT main residence 6-year absence rule applied, verified by research
- [ ] ISC-18: Effect of buying a Brisbane PPOR on the 6-year rule stated
- [ ] ISC-19: Sell-now proceeds modelled: selling costs and zero CGT
- [ ] ISC-20: Opportunity cost of freed equity quantified at a stated alternative return
- [ ] ISC-21: Breakeven capital growth rate for hold-vs-sell computed
- [ ] ISC-22: Melbourne/St Kilda unit growth history and 2026 forecasts sourced by research
- [ ] ISC-23: Hold vs sell compared at two or more growth scenarios
- [ ] ISC-24: Sell-later-within-6-years option explicitly valued in the reply
- [ ] ISC-25: Brisbane rent-vs-buy contingency addressed as decision fork
- [ ] ISC-26: Recommendation stated before supporting reasoning in the reply
- [ ] ISC-27: Decision rule expressed as self-checkable conditions for Nick
- [ ] ISC-28: Inputs still needed from Nick enumerated explicitly
- [ ] ISC-29: Advisor second-opinion invoked before delivery (Inference.ts)
- [ ] ISC-30: Anti: the -$14,348 is nowhere treated as the true economic cost
- [ ] ISC-31: Anti: no em dashes appear in the user-facing reply
- [ ] ISC-32: Anti: no generic consult-a-professional advice substitutes for the analysis
- [ ] ISC-33: Anti: no unsourced external claim presented as verified fact
- [ ] ISC-34: Reply closes with needs input: line inside the SUMMARY block

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1,4,12,14,15,16,19,20,21 | computation | arithmetic reproduced | exact | Bash (bc/python-free calc) |
| 5,6,7,8 | data | figure present in agent return or labelled assumption | binary | Read agent output |
| 9,17,22 | research | claim matched to agent-sourced finding | binary | Read agent output |
| 2,3,10,11,13,18,23,24,25,26,27,28 | content | statement present in drafted reply | binary | Grep/Read of reply draft |
| 29 | invocation | advisor called | binary | Bash exit + output |
| 30,31,32,33,34 | anti/format | pattern absent/present in final reply | binary | Grep of reply text |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| data-pull | Pocketsmith loan/value/income actuals via finance-accountant | ISC-5,6,7,8 | — | true |
| external-research | Land tax, CGT rule, growth data, selling costs via research agent | ISC-9,13,17,22 | — | true |
| table-audit | Arithmetic check and missing/misclassified line identification | ISC-1,2,3,10,11 | — | true |
| economic-model | Interest split, tax, after-tax cost, breakeven, scenarios | ISC-4,12,14,15,16,19,20,21,23 | data-pull, external-research | false |
| recommendation | Verdict, decision rule, CGT option value, Brisbane fork, needed inputs | ISC-17,18,24,25,26,27,28 | economic-model | false |
| verification-pass | Advisor call, anti-criteria grep, format compliance | ISC-29..34 | recommendation | false |

## Decisions

- 2026-07-08T05:56Z: Research-only archetype applied (mode: research); phases compressed to OBSERVE→THINK→EXECUTE→VERIFY→LEARN per mode-detection.md.
- 2026-07-08T05:56Z: Scaffold Step 2 example-read skipped; twelve-section spec already fully in context from doctrine + skill body. Bitter-pill call to protect the E3 budget.
- 2026-07-08T05:56Z: Delegation floor met with finance-accountant (Pocketsmith actuals) and general-purpose researcher (tax/market verification), both backgrounded at OBSERVE.
- 2026-07-08T05:56Z: EnterPlanMode skipped: research mode has no PLAN phase and this is a background session with no code mutation; plan approval would block an autonomous run.
- 2026-07-08T06:05Z: Advisor concurred with lease verdict; required (a) source check on negative-gearing grandfathering (confirmed agent-sourced from budget.gov.au factsheet, shipped with announced-not-legislated tag) and (b) cash vs economic cost presented as separate labelled lines. Both applied.
- 2026-07-08T06:05Z: Depreciation assumed $0 (build year unknown, pre-1987 likely for St Kilda stock, 2017 second-hand plant rules); flagged as upside input rather than modelled.
- 2026-07-08T06:05Z: All 34 ISCs ticked; evidence in ## Verification. Loan balance/rate/value are labelled assumptions pending Nick's inputs (ISC-5/6/7 pass on stated-basis branch).
- 2026-07-08T06:40Z: refined: Nick supplied actuals — loan $525,506.72 @ 6.16% P&I (yr1 interest $32,203, principal $6,017), value $600k (Feb 2026 appraisal, 6.5% gross yield), build 2016 (corrected from 2011 mid-turn), Brisbane duration unknown. Model re-run; after-tax economic cost now $3.2-6.3k/yr depending on QS schedule and marginal rate; breakeven growth ~1.1%. Verdict unchanged, strengthened.
- 2026-07-08T06:40Z: Landlord water charge reference sourced via WebSearch (Consumer Affairs Victoria + Tenants Victoria, RTA 1997): rental provider pays fixed supply/sewerage charges; renter pays usage where separately metered. Direct SRO fetch was declined by Nick mid-turn; land tax reference stands on the research agent's direct fetch of sro.vic.gov.au/land-tax-current-rates.

- 2026-07-08T06:55Z: refined: agent's realistic rent range is $680-720/wk, not the $750 modelled. Sensitivity re-run: at $700/wk after-tax cost $4.7-6.0k/yr with QS ($90-116/wk), $7.0k without; breakeven growth 1.2-1.6% across the range vs base-case growth expectation 0-2%. Pure-numbers case now near neutral; verdict still lease on option value (CGT-free to ~2032, $50k+ round-trip friction, unknown Brisbane duration), but the QS schedule and marginal rate are now material, and a two-year checkpoint review is the explicit exit discipline.

- 2026-07-08T07:10Z: refined: value evidence updated — REA AVM $580k (high confidence), purchase $570k Nov 2024, $600k Feb valuation. Conservative base $580k adopted.
- 2026-07-08T07:20Z: corrected: the $600k Feb figure was a BANK valuation for the mortgage, not an agent listing appraisal — prior "listing-pitch skew" reasoning was wrong (lender vals lean conservative). Value band revised to $580-600k, working midpoint $590k: equity $64.5k, sale frees ~$49.6k, LVR ~89%, breakevens unchanged (1.1-1.8%). Verdict unaffected; sell-now still dominated.
- 2026-07-08T07:30Z: refined: bank valuation was a FULL PHYSICAL inspection, not desktop — now the highest-quality value signal (licensed valuer, conservative lender incentive, saw actual condition). Working value $590-600k; REA AVM $580k downgraded to secondary (no interior knowledge). Equity ~$70k, sale frees ~$55-59k. Verdict and actions unchanged; the Feb physical val is now the anchor document for the CGT cost-base file. Equity $54.5k, LVR 90.6%, sale would free only ~$39.8k after ~$14.7k costs; own growth record since purchase ~1.05% pa, sitting at the breakeven band (1.1-1.8%). Sell-now nets ~$40k while crystallising ~$72k round-trip friction; verdict lease reaffirmed, sell-now now clearly dominated absent a cash need.

## Changelog

- 2026-07-08T06:40Z — conjectured: depreciation ≈ $0 because St Kilda stock is likely pre-1987 | refuted by: Nick — building constructed 2016 (corrected from an initial 2011) | learned: Division 43 capital works at 2.5%/40yr applies through ~2056, est. $6-8k/yr pending a QS schedule, and while the property is fully CGT-exempt under the 6-year rule the cost-base reduction from claiming it has no CGT downside | criterion now: ISC-13 refined — depreciation modelled at $0 (no QS) and $6-8k (with QS) as explicit scenarios, QS schedule recommended as an action.

## Verification

- ISC-1: Bash calc — "table costs: 53348 net: -14348"; arithmetic confirmed correct.
- ISC-2/3/10/11: reply flags letting fee as one-off, P&I conflation, vacancy ~$1,500, water ~$800 (Pocketsmith shows South East Water ~$110/mo actuals).
- ISC-4: Bash — implied balance $535,746 at 6% P&I 29yr; interest $32,145; principal $6,879.
- ISC-5/6: Pocketsmith holds no loan account; assumption 6% P&I stated with basis (repayment $3,185-3,252/mo, Feb 2025 ANZ refinance).
- ISC-7: value $650k by yield cross-check (6.0% gross vs St Kilda market 5.7%); labelled assumption.
- ISC-8: Pocketsmith shows salary ceased Mar 2026 (redundancy payout $35,700); marginal rate 32-39% stated as Brisbane-role assumption.
- ISC-9: SRO 2026 rates via research agent — $500 flat ($50-100k site value), $975 ($100-300k).
- ISC-12/14/15/16: Bash — tax loss $10,744; refund $3,438-4,190; after-tax economic cost $5,554-6,306; cash year one -$17,623 pre-refund.
- ISC-13: research agent — pre-1987 no Div 43; 2017 rules deny Div 40 on previously-used assets; assumed $0.
- ISC-17/18: s118-145 confirmed via AustLII/Bentleys/ATO corroboration; Brisbane PPOR forces apportionment, election at sale.
- ISC-19/20/21: Bash — equity freed $98,254; alt return after tax $4,421; breakeven growth 1.51%.
- ISC-22/23: Propertyology/Cotality/YIP via research agent — St Kilda units -1.0% 12mo, ~2.5-2.7%pa decade; scenarios bear -2%, base 0-2%, bull 3-4% in reply.
- ISC-24/25/26/27/28: reply leads with verdict, values the sell-later-CGT-free option, forks on Brisbane rent-vs-buy, gives flip conditions and needed inputs.
- ISC-29: advisor invoked via Inference.ts; output "Verdict is sound... Nothing here changes the recommendation"; both required fixes applied.
- ISC-30-33 (Anti): inspection of final reply — $14,348 reframed not endorsed; no em dashes; no consult-a-professional substitute; budget change tagged announced-not-legislated with source.
- ISC-34: needs input: line present in SUMMARY block.

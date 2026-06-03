---
task: Draft SMLSC board proposal from master plan
slug: 20260518-160938_smlsc-board-proposal-draft
effort: extended
phase: complete
progress: 1/1
mode: interactive
started: 2026-05-18T06:11:05Z
updated: 2026-05-20T09:15:57Z
---

## Context

Nick drafted a board paper for South Melbourne Life Saving Club (SMLSC) based on the existing Clubhouse Master Plan, the Gear Shed New brief (`~/Library/CloudStorage/OneDrive-Personal/06_Lifesaving/SMLSC/Gear Shed New.docx`), and the custom board rack design at `~/.claude/MEMORY/WORK/20260518-172836_board-rack-design/PRD.md`.

Audience: SMLSC board (volunteer directors). Funding mechanism proposed: VESEP at typical 2:1 ratio, club's one-third share funded by drawing down the term deposit at maturity, fully repaid from 50% of net functions revenue within under six months.

## Outputs

- `~/workspace/smlsc-master-plan/board-proposal.md` — final markdown, ~3,400 words.
- `~/workspace/smlsc-master-plan/board-proposal.docx` — pandoc-generated docx. Nick has since edited it in Word (file grew from 19KB to 116KB, suggesting images and/or styling have been added).

## Decisions

- Single project framing, not Renewal Bundle / non-bundle split.
- Scope organised by area (Operational wing, Function room, Gear shed), not Must/Should/Could.
- Investment framing for funding: short-cycle investment in building and membership, fully repaid in under six months. Cost-of-not-acting argument paired with cash-rate comparison.
- AU English, no em dashes, no invented dollar figures.
- Word doc intro paragraph used (lightly polished) as §1 Project framing.
- Custom board racks added as GS-03; GS-02 substantially expanded to match the Word brief.
- Items Nick removed from prior draft (do not reinstate): OFF-02 office clean-out, PA-02 testing process, PA-03 tower volume, SEC-05 uniform locks, original FB-01 fishbowl door bolts, FB-08 bar improvements, FB-10 function room keypad, EXT-01 letterbox.
- Risks section removed by Nick.
- BLD-01 magnetic door stops left in §4.2 per Nick's placement.

## Criteria

- [x] ISC-1: Board proposal drafted, polished, and exported to docx for board distribution.

## Verification

Final state confirmed 2026-05-20:
- `board-proposal.md` present at 17.4KB
- `board-proposal.docx` present at 116KB (Nick has been adding to it in Word)
- pandoc 3.9.0.2 installed via brew during this session
- Section numbering corrected (§6 Next steps, §7 Resolution wording)
- All typos fixed (acculuate, potenitla, resreves, doing thing, univiting, cluuter, double space in SEC-02, stale FB-04 reference in GS-02)

## Remaining work (for next session)

1. Nick to finish adding gear shed before/after sketches into the docx (Step 4 from the closing checklist).
2. Confirm SMLSC term deposit balance and maturity date so cash-flow shape can be made specific in a follow-up funding paper.
3. Engage LSV to confirm next VESEP round dates and eligibility per item (operational/safety items strong; pure fit-out and amenity items weaker per VESEP framing).
4. Once quotes obtained, return a follow-up board paper with final figures and the formal commitment ask.
5. Optional: bring SMLSC items removed in this draft (OFF-02 clean-out, PA-02, PA-03, EXT-01, etc.) into a parallel "Must-tier quick wins, outside VESEP" tracker so they don't get lost.
6. Board rack technical drawings still in design stage at `~/.claude/MEMORY/WORK/20260518-172836_board-rack-design/PRD.md`; fabricator-ready SVG pack outstanding.

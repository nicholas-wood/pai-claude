# Addendum — Drawing Pack Revisions (Rev A)

**Issued in response to fabricator review of original pack.** Read this alongside `dimensions.md`. Where this addendum and the original disagree, this document supersedes.

---

## Blockers — Resolved in this revision

### B1. Frame at short ends — clarification

The two short ends are OPEN for board loading. There are NO vertical uprights at the short ends. The TOP frame and BOTTOM rail DO continue across the short ends as horizontal members at z=2,200 mm (top) and z=200–240 mm (bottom). Boards slide in BETWEEN these horizontal members (boards are between 300 mm and 1,980 mm above floor).

- Top frame: closed rectangular perimeter, 50×50×3 mm SHS, fully welded
- Bottom rail: closed rectangular perimeter, 50×50×3 mm SHS, fully welded
- Uprights: 4 per long side (8 total), 50×50×3 mm SHS, between bottom rail and top frame
- No vertical members at the short ends

This is what the plan view depicts. Spec §3 wording is amended accordingly.

### B2. Upright count — 8 total

Per long side: 4 uprights at x = 30, 1,063, 2,127, 3,290 mm (centres). Both long sides have an identical set. Total: 8 uprights.

The side elevation shows ONE long side and therefore only 4 uprights visible — that drawing is correct. The plan view will be updated to show the 8 upright positions as 50×50 squares at the noted positions.

### B3. Wheelbase — 3,140 mm

Spec §1 table corrected: wheelbase length = **3,140 mm** (caster centres at x=100 and x=3,240, both 100 mm inboard of the rack ends).

Wheelbase width remains **1,200 mm** (caster centres at y=100 and y=1,300, both 100 mm inboard of the rack sides).

### B4. Slide mechanism — REVISED from rollers to UHMW slide pads

The original design (rollers between rail and sled) created an unresolvable height stack-up that busts 2,200 mm. Replaced with:

- **Slide surface:** UHMW polyethylene strip, 10 mm thick, fastened to the top of each slide rail
- **Sled base:** flat steel plate or 50×25×3 RHS section bearing directly on the UHMW strip
- **Stack-up:** rail top at 2,140 mm + 10 mm UHMW + 50 mm sled section = **2,200 mm sled top** ✓
- **Friction:** UHMW on steel ≈ 0.15 coefficient. ~ 200 N force to push 150 kg sled+IRB. Manual operator force.

**Pivot mechanism (revised):**

- Replace "rear roller in concave bracket" with **drop-in pivot pins**
- Each sled has a 25 mm diameter pin protruding DOWNWARD at the position 2,400 mm rearward of the sled forward tip (i.e., 600 mm forward of the sled rear tip), one per long side
- Each rail has a matching hole (28 mm dia, 25 mm deep) at its rear end
- When the sled is slid fully rearward, the pins drop into the holes (gravity-engaged)
- Pins become the pivot axis; sled is free to rotate about them
- To stow: lift sled forward end slightly (winch), then push forward; pins lift out of holes, sled slides forward to stow

This change cascades into the panel A and panel B of `04-sled-winch-detail.svg` — they show the OLD roller design. Treat those panels as superseded; the new pin-and-hole pivot is shown only in this text addendum. **Fabricator to detail new pivot from this written spec, or request a Rev B SVG.**

### B5. Winch and cable geometry — clarification

The winch is **not** used during the SLIDE phase. The slide is performed by the operator manually pushing the sled rearward (~200 N effort with UHMW pads). The winch is engaged only AFTER the pins drop into the pivot holes (slide complete).

During SLIDE: cable hangs slack; winch in free-spool or pays out as needed.
During TILT: cable from winch (front-base, x=0, h≈350 mm) to sled forward tip (which after slide is at x=820 mm, h=2,200 mm in horizontal position). At this geometry, perpendicular distance from pivot (x=3,220, h=2,200) to cable line ≈ 2,200 mm. Worst-case cable tension at θ=0° ≈ **100 kgf** — well within winch capacity.

(My earlier first-principles calc was based on the wrong cable geometry — it assumed cable from winch to STOWED sled forward tip at x=0. After slide, the sled forward tip is at x=820, and the cable geometry is much more favourable.)

### B6. Winch rating — line pull, not WLL

Specify the winch as **line pull rating ≥ 1,500 kg on first layer** (single-line, not snatch-blocked). This is the correct industry term. Suggested products:

- Warn Tabor 8K (or equivalent): 3,628 kg first-layer line pull — overkill but cheap and reliable
- Smaller option: Bushranger Revo 6500S — 2,950 kg first-layer line pull

Either provides ≥ 10× safety on the calculated worst-case tension.

---

## Should-fix items — adopted into Rev A spec

### S7. Casters — bumped to 300 kg WLL each

Original: 4 × 250 kg WLL = 1,000 kg. Revised: **4 × 300 kg WLL = 1,200 kg**. Allows 2.4× dynamic factor on 500 kg loaded weight. Spec: Fallshaw or equivalent 150 mm cast iron / polyurethane swivel caster with top-lock brake.

### S8. Pivot bracket — bumped to 10 mm plate + gusset

Original: 6 mm formed plate. Revised: **10 mm MS plate base + 6 mm gussets** welded to top frame. Bolted to top frame via 4× M16 grade 8.8 bolts per side. Pull-out tested at 2,000 kg minimum.

### S9. Latch — spec to COTS part

Suggested: **Southco MK-04-101-10** (sprung detent plunger pin, M10, stainless, AS/NZS compliant). Or equivalent. Fabricator to confirm sourcing.

### S10. Shelf cross-pieces — bumped to 40×40×3

Original: 40×40×2. Revised: **40×40×3 mm MS SHS**. Heavier section, better galvanising performance, still light.

### S11. Bracing at open ends — portal frame action

The top frame and bottom rail (both closed perimeters, fully welded) provide rectangular portal-frame action when combined with the long-side X-braces. For an open-ended rack of this geometry, the portal frame is sufficient — but **fabricator to confirm via structural check.** If marginal: add a 25×25×2 SHS knee-brace at each end, between bottom rail and second upright, kept below 300 mm height (won't foul board slide).

### S12. Galvaniser vent/drain holes — locations

- All SHS members: 8 mm dia vent hole at each end, inside the section, 25 mm from the joint (typical position)
- Avoid placing holes within 50 mm of any welded joint visible after fabrication
- Galvaniser confirms locations before pickling

### S13. IRB side chocks on sleds

Add 4× welded **side stops** on the top of the sleds (2 per sled). Each stop is a 40 mm tall × 30 mm wide × 50 mm long welded tab. Positioned to contact the IRB hull just inboard of the IRB beam. Padded with marine HDPE. Prevents IRB walking sideways during transit.

### S14. Tilted IRB lift-off height — confirm with club

At θ=40° tilt, sled rear tip is at 657 mm above floor (= IRB stern position). Receiving heights:

- Typical beach trailer deck: 500 mm
- Typical clubhouse beach cart: 400–500 mm
- Direct beach (sand): 0 mm

**Action:** Confirm with the club whether 657 mm is acceptable. If not, increase max tilt angle to 50° (rear at 285 mm) or extend sled length (heavier, costlier). For now, design accommodates any tilt 0–55°; user/operator picks based on the receiving fixture.

---

## Nice-to-have — noted, not adopted

15. End-opening edge protection — **adopted**: 5 mm radius capping welded to all board-contact edges at the short ends. Smooth, no grinding scrap.
16. Anderson plug + winch wiring routing — **adopted**: 50 A Anderson plug mounted on front face of rack, near winch. 1.5 m tail with crocodile clips for battery connection.
17. Latch interlock with stabilizer leg — **not adopted**: adds significant cost; operator procedure (per §8) is sufficient. Optional upgrade.
18. Knock-down vs fully-welded — **fabricator's choice** stands. Bolt-together corners at top-frame would help galvanising bath access.
19. Powder-coat as separate line item — **adopted**: priced separately, not absorbed.

---

## Quote-readiness statement

With Rev A in hand, the pack is **firm-quotable** subject only to:

1. Client confirmation of acceptable IRB lift-off height (S14)
2. Fabricator's portal-frame check (S11) — likely fine, but request a sign-off
3. Confirmation of board fin geometry (location of fin along the board) so the spec for cross-piece positions stays valid

Indicative ballpark from fabricator review: **$12–16k per unit ex GST**, Melbourne metro, HDG, excl. winch, casters, straps, powder-coat. Rev A items don't materially change this band; expect $13–15k as the centre of the range.

---

## Document control

| Rev | Date | Change |
|---|---|---|
| 0 | 2026-05-18 | Initial drawing pack |
| A | 2026-05-19 | Fabricator review responses; B1–B6 blockers cleared; S7–S14 adopted; design changes: UHMW slide pads, drop-in pivot pins (supersedes roller design) |

---
task: Update board rack design with new constraints
slug: 20260521-120000_board-rack-design-rev-b
effort: advanced
phase: build
progress: 0/68
mode: interactive
started: 2026-05-21T01:00:00Z
updated: 2026-05-21T03:30:00Z
iteration: rev-b
---

## Context

Revision B of the custom board rack design (Rev A baseline 2026-05-19) with confirmed user-driven parameter changes plus fabricator-review-driven structural upgrades.

**Confirmed deltas (Rev A → Rev B):**

| Parameter | Rev A | Rev B |
|---|---|---|
| Vertical shelf spacing | 400 mm | **300 mm** |
| Door clearance | 2,200 mm | **2,330 mm** |
| IRB height | 600 mm | **500 mm** |
| Internal width | 1,220 mm | **1,180 mm** |
| Uprights per long side | 4 | **2** (at 1/4 + 3/4 board length) |
| Cross-pieces per shelf position | 600 mm from each end | **1/4 and 3/4 board length** |
| Shelf count | 5 | **7** |
| Board capacity | 10 | **14** |
| Board storage | fin-down | **fin-down (unchanged after analysis)** |
| Lowest shelf | 300 mm | **300 mm (Rev A style retained)** |
| Top frame & upright section | 50×50×3 SHS | **65×65×4 SHS** (fabricator B2) |
| X-brace section | 25×25×2 SHS | **40×40×3 SHS** (fabricator B2) |
| Corner knee-braces | none | **4× (below z=150 mm)** (fabricator B2) |
| Top rail system | 2 slide rails + pivot brackets | **4-rail system**: 2 longitudinal slide rails (port+stbd) + 1 rear extension rail (centre, on triangle bracket) + 1 front transverse rail (winch mount) |
| Pivot location | rear of slide rails | **rear of long-side slide rails** (unchanged, drop-in pins) |
| Rear extension rail role | n/a | **ramp track only** — sled tilts onto it after pivot engages (B3 resolution) |
| Stabiliser leg | 1 (rack rear, centred) | **2 (rack rear corners)** (fabricator S5) |
| Winch location | front-base of rack | **underside of front top rail** (user spec + S2 compromise) |
| Sled top stowed | 2,200 mm | **2,280 mm** (target 50 mm door margin, fabricator S1) |

**Boards & IRB (unchanged from Rev A):**
- Boards: 3,200 × 580 mm, 250 mm fins
- 2 boards per shelf side-by-side, 14 boards per rack
- IRB ~2,100 × 600 × 500 mm (height revised to 500 mm)
- Twin-sled architecture (port + stbd, drop-in pivot pins, UHMW slide pads)

**Casters (per Rev A S7):** 4× 150 mm cast iron / poly swivel casters with top-lock brake, 300 kg WLL each.

### Risks

- **Zero fin-to-board vertical clearance** at 30 cm pitch. **B1 status:** user accepts. Spec note: "Verify actual fin length ≤ 250 mm and board thickness ≤ 50 mm before loading; boards must be aligned precisely; no slamming."
- **4-upright frame lateral stiffness** — **B2 mitigated** by 65×65×4 uprights + top-frame, 40×40×3 X-braces, and 4 corner knee-braces. Fabricator structural check required at quote.
- **Rear extension rail cantilevered 600 mm on triangle bracket** carries ~800 kgf peak. 10 mm MS plate + full-pen weld gussets + bolted belt-and-braces.
- **Door margin** 50 mm nominal (sled top 2,280 vs door 2,330) — caster mounted height must be confirmed against supplier datasheet before fabrication.
- **Winch on underside of front top rail** — fairlead axis must be vertical (cable drops down then runs rearward). Spec calls out mount detail.
- **Operating mistake**: rolling rack through door with IRB on top would bust door (rack 2,280 + IRB 500 = 2,780 > 2,330). Spec: warning placard on rack rear face per fabricator N3.

### Plan

Drawing pack — Rev B as a complete new pack (don't overwrite Rev A; keep history). 5 SVGs + dimensions.md + addendum:

1. `01-plan-view.svg` — top-down, 4 uprights at 1/4 + 3/4 board length, 14 boards (2 per shelf × 7), 4-rail top with centre extension going past rear, winch under front rail.
2. `02-front-elevation.svg` — looking at short open end, 7 shelves at z=300, 600, …, 2,100, 30 cm pitch, sleds shown at z=2,230–2,280, IRB stack height callout for reference.
3. `03-side-elevation.svg` — long side view, 3 sled states overlaid (stowed / slid-back / tilted-down-ramp). Triangle bracket clearly drawn. Shelves shown along long side.
4. `04-top-rail-detail.svg` — close-up of the 4-rail system: 2 longitudinal slide rails, drop-in pin pivot detail at rail rear, rear extension rail with triangle bracket and ramp track section, front transverse rail with winch mount on its underside.
5. `05-isometric.svg` — 3D reference with key dimension callouts.
6. `dimensions.md` — full Rev B spec sheet (materials, hardware, fabrication notes, op sequence, quantity ×2).
7. `ADDENDUM-rev-b.md` — explicit change log Rev A → Rev B + reasons.

## Criteria

### Overall dimensions
- [ ] ISC-1: External width 1,350 mm (1,180 internal + 2× 85 mm side frame at 65 mm member + caster offset)
- [ ] ISC-2: External length 3,340 mm (boards 3,200 + 70 mm offset each end)
- [ ] ISC-3: Total height with sleds stowed = 2,280 mm (50 mm margin under 2,330 mm door)
- [ ] ISC-4: Total height with IRB on top = 2,780 mm (outside shed only; with placard warning)
- [ ] ISC-5: Rear extension rail tip 600 mm past rack rear (external rear-most point at x = 3,940 mm)

### Uprights (4 total)
- [ ] ISC-6: 4 uprights total, 2 per long side
- [ ] ISC-7: Upright x-positions in rack frame: x = 870 and x = 2,470 mm (1/4 and 3/4 of board length when board centred)
- [ ] ISC-8: Upright section **65×65×4 mm MS SHS, HDG** (fabricator B2)
- [ ] ISC-9: Upright vertical extent: from bottom rail top (z = 215) to top frame underside (z = 2,200)
- [ ] ISC-10: No uprights at short ends (open for board end-loading)

### Long-side bracing
- [ ] ISC-11: X-brace between the 2 uprights on each long side (2 X-braces total)
- [ ] ISC-12: X-brace section **40×40×3 mm MS SHS** (fabricator B2)
- [ ] ISC-13: X-brace kept below z = 250 mm OR above z = 2,150 mm (clear of shelf zone)
- [ ] ISC-14: Corner knee-braces at all 4 rack corners (between upright and bottom rail), section 40×40×3 SHS, kept below z = 150 mm (fabricator B2)

### Top frame
- [ ] ISC-15: Closed rectangular perimeter top frame, **65×65×4 mm SHS** on long sides; 65×65×4 SHS on short ends
- [ ] ISC-16: Top frame full-penetration welded at corners
- [ ] ISC-17: Top frame member top at z = 2,265 mm (member bottom at z = 2,200 mm)

### Bottom rail
- [ ] ISC-18: Closed rectangular perimeter bottom rail, 50×50×3 mm SHS, HDG
- [ ] ISC-19: Bottom rail member top at z = 215 mm

### Shelf system (7 shelves, fin-DOWN storage)
- [ ] ISC-20: 7 shelf levels
- [ ] ISC-21: Shelf 1 resting surface at z = 300 mm
- [ ] ISC-22: Vertical spacing 300 mm uniform
- [ ] ISC-23: Shelf 7 resting surface at z = 2,100 mm
- [ ] ISC-24: Each shelf level has 2 cross-pieces at x = 870 and x = 2,470 (1/4 and 3/4 board length)
- [ ] ISC-25: Cross-piece section 40×40×3 mm MS SHS, HDG (consistent with Rev A S10)
- [ ] ISC-26: Cross-piece span 1,180 mm full internal width, welded into long-side uprights
- [ ] ISC-27: 10 mm closed-cell EVA foam padding on cross-piece top contact surface
- [ ] ISC-28: Spec note: "Boards stored fin-DOWN; verify fin length ≤ 250 mm and board thickness ≤ 50 mm before loading; align precisely; no slamming."

### Mobility
- [ ] ISC-29: 4× 150 mm industrial swivel casters with top-lock brakes
- [ ] ISC-30: Caster WLL ≥ 300 kg each (1,200 kg total — fabricator S7)
- [ ] ISC-31: Caster mount plate bolted to bottom rail underside; 100×100 mm plate, 4× M10 bolts
- [ ] ISC-32: Caster positions: 100 mm inboard of each rack corner

### Top rail system (4 rails)
- [ ] ISC-33: 2 longitudinal slide rails (port + stbd) running full rack length 3,340 mm
- [ ] ISC-34: Slide rails specified as 50×25×3 mm RHS with 10 mm UHMW pad on top
- [ ] ISC-35: Slide rail top surface (UHMW top) at z = 2,275 mm (sled bottom rides here)
- [ ] ISC-36: Drop-in pivot pin holes at rear end of EACH long-side slide rail (port + stbd) — pivot is here, NOT on the centre extension
- [ ] ISC-37: Rear extension rail (3rd rail) — single longitudinal rail centred on rack top, extending 600 mm rearward past the rack rear
- [ ] ISC-38: Rear extension rail section 65×65×4 SHS, HDG, with 10 mm UHMW pad on top
- [ ] ISC-39: Rear extension rail role: **ramp track only** — receives the tilted sled belly after the drop-in pin pivot engages on the long-side rails
- [ ] ISC-40: Triangle bracket supporting rear extension rail: 10 mm MS plate web + 6 mm gussets, full-pen welded to top frame rear member + bolted via 4× M16 grade 8.8 bolts as belt-and-braces
- [ ] ISC-41: Rear extension rail top surface slopes from z = 2,275 mm at rack rear to z ≈ 2,100 mm at the 600 mm tip (≈ 15° slope, matches sled tilt angle)
- [ ] ISC-42: Front transverse rail (4th rail) at top frame's front position, section 65×65×4 SHS
- [ ] ISC-43: Winch mounted on UNDERSIDE of front transverse rail at centreline (cable drops vertically from drum then routes rearward)

### Sled assembly
- [ ] ISC-44: 2 sleds, port + stbd, parallel, centres 900 mm apart
- [ ] ISC-45: Sled length 3,000 mm each (600 mm forward of pivot, 2,400 mm rearward)
- [ ] ISC-46: Sled section 50×50×3 mm SHS with marine HDPE pad strip on top (IRB contact)
- [ ] ISC-47: Sled slide travel ≈ 820 mm rearward from stow position
- [ ] ISC-48: Drop-in pivot pin (one per sled side, M25, downward-facing) drops into matching hole in long-side slide rail at slide-complete
- [ ] ISC-49: Sled mid-belly contacts the rear extension rail (ramp track) when tilted, providing additional support during tilt motion
- [ ] ISC-50: Twin sled crossbars: front crossbar 40×40×3 SHS (carries winch cable eye), rear crossbar 40×40×3 SHS (carries IRB bow strap anchor)
- [ ] ISC-51: Sled latch (port + stbd) — Southco MK-04-101-10 or equivalent sprung detent, with visible "engaged" indicator (fabricator S4)

### Winch & cable
- [ ] ISC-52: 12 V DC electric winch, line pull ≥ 1,500 kg first layer (fabricator B6 spec)
- [ ] ISC-53: Winch on underside of front transverse rail; cable drum axis horizontal, fairlead facing rearward
- [ ] ISC-54: Cable routes from winch rearward (along top of rack) to sled front crossbar
- [ ] ISC-55: 50 A Anderson plug on front face of rack for 12 V supply, 1.5 m tail with crocodile clips

### Stabilisers & safety
- [ ] ISC-56: Twin stabiliser legs at rack rear corners (port + stbd), each 40×40×3 SHS, drop-down, rated 500 kg each (fabricator S5)
- [ ] ISC-57: Stabiliser leg deployment MUST precede sled slide-back (operating procedure)
- [ ] ISC-58: IRB bow fastening strap at sled rear crossbar (50 mm webbing, cam buckle, 2,000 kg break)
- [ ] ISC-59: Warning placard on rack rear face: "DOOR HEIGHT 2,330 mm — REMOVE IRB BEFORE ENTERING SHED" (fabricator N3)

### Deliverables
- [ ] ISC-60: `01-plan-view.svg` produced
- [ ] ISC-61: `02-front-elevation.svg` produced
- [ ] ISC-62: `03-side-elevation.svg` produced (3 sled states)
- [ ] ISC-63: `04-top-rail-detail.svg` produced (rail system + triangle bracket + winch mount)
- [ ] ISC-64: `05-isometric.svg` produced
- [ ] ISC-65: `dimensions.md` Rev B spec sheet produced
- [ ] ISC-66: `ADDENDUM-rev-b.md` change log produced

### Anti-criteria (must NOT occur)
- [ ] ISC-A1: No uprights at short ends
- [ ] ISC-A2: No structure exceeding 2,330 mm with sleds stowed
- [ ] ISC-A3: No cross-pieces in fin-drop zone (fins fall in the 1,600 mm gap between the two cross-pieces, OR in the rear overhang region — verify per board orientation)
- [ ] ISC-A4: Not fewer than 7 shelves
- [ ] ISC-A5: No pivot mechanism on the rear extension rail itself (pivot is on long-side slide rails)
- [ ] ISC-A6: No single stabiliser leg (must be twin)

## Decisions

- **Fin-DOWN storage retained.** User chose Option A. Lowest shelf at z=300 (Rev A standard) gives 14 boards capacity and clean door fit. The sketch note "boards stored fin up" was a candidate idea that didn't survive the top-shelf vs sled clearance check.
- **65×65×4 SHS uprights and top frame** (vs Rev A's 50×50×3) — fabricator B2 minimum for structural sign-off on the 4-upright frame.
- **40×40×3 X-braces** (vs Rev A's 25×25×2) — fabricator B2.
- **4× corner knee-braces** below z = 150 mm — fabricator B2.
- **Cross-pieces at 1/4 and 3/4 board length** (x = 870 and 2,470 mm in rack frame, with board centred). Engineering-optimal for uniformly loaded beam.
- **Pivot on long-side slide rails (drop-in pins)**, ramp track on triangle bracket. B3 resolution. Topology now closes.
- **Sled-top target z = 2,280 mm** (50 mm door margin, not 30) — fabricator S1.
- **Twin stabiliser legs at rear corners** — fabricator S5.
- **Winch on underside of front transverse rail** — user spec retained, mount detail addresses fabricator S2 cable routing concern.
- **Triangle bracket = 10 mm MS plate web + 6 mm gussets + bolted M16 belt-and-braces**.
- **Warning placard on rear face** — fabricator N3 adopted.

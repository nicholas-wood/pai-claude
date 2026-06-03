---
task: Custom board rack technical drawings for quote
slug: 20260518-172836_board-rack-design
effort: advanced
phase: complete
progress: 51/51
mode: interactive
started: 2026-05-18T05:28:36Z
updated: 2026-05-19T00:00:00Z
---

## Context

Producing technical design drawings for two identical custom board racks for a surf life saving club. Drawings will be sent to a steel fabricator to obtain a quote.

**Rack function:**
- Stores rescue boards: 3.2m long × 58cm wide, with 25cm protruding fins
- Two boards side-by-side per shelf, five shelf levels stacked vertically
- Tops with a slide-then-tilt sled cradle for an IRB (170cm × 60cm × 2.1m)
- Mobile (casters), rolls through 2.2m gear shed door when sleds stowed

**Confirmed parameters:**
- 2 boards per shelf (side-by-side), 5 shelf levels: 30, 70, 110, 150, 190cm
- Sled mechanism: SLIDE-THEN-TILT — sleds ride on rails, slide ~820mm rearward, then tilt down at rear pivot (clears top boards)
- Output: 5 SVG drawing pack + dimensions.md spec sheet

**Defaults adopted (call out in spec for fabricator confirmation):**
- Materials: hot-dip galvanised mild steel SHS (50×50×3mm uprights/main frame, 40×40×2mm cross-members)
- Casters: 4× 150mm diameter industrial swivel casters with brakes, 250kg WLL each
- Winch: 12V electric, 1000kg WLL, fitted with stainless steel cable
- Slide rails: 50×25×3mm RHS, hardened bearing surface
- Rollers: nylon rollers on stainless steel axles, 4 per sled (2 front, 2 rear)
- Padding: closed-cell EVA foam on board contact surfaces; marine-grade HDPE pads on sled IRB contacts
- Stabilizer leg: drop-down leg at rack rear, deployed before sled slide-back

### Risks

- **Slide-then-tilt mechanism complexity** — Multiple states (stowed/slid/tilted) increase fabrication and operational complexity. Mitigated by clear design intent and quality fabricator.
- **Cantilever tip during slide phase** — When sled is slid back, IRB cantilevers 2.4m behind rack. Stabilizer leg at rear prevents tip-up. Boards on rack also counter-balance.
- **Roller wear over time** — Marine environment + heavy loads. Nylon rollers on stainless axles, lubricated, with annual inspection.
- **Latch failure during transit** — Sled could slide unintentionally during transport. Twin latches (port + starboard) with positive engagement.
- **Winch geometry** — Cable from winch at front-bottom of rack to sled forward tip provides correct counter-clockwise moment. Verified by first-principles analysis.
- **Caster swivel within 30cm bottom clearance** — caster + mounting plate < 300mm. 150mm casters with 30mm plate = 180mm. OK.

### Plan

Deliver a 5-SVG technical drawing pack plus a comprehensive spec sheet. All drawings dimensioned in mm. Drawings show ONE rack; spec notes quantity ×2.

1. `01-plan-view.svg` — top-down view at sled-stowed state, showing rack outline, casters, slide rails, sled in stowed position
2. `02-front-elevation.svg` — face view (looking at short open end), showing 5 shelf levels, internal width, board slots, casters
3. `03-side-elevation.svg` — long side view in 3 states overlaid or sequenced: stowed, slid-back, tilted at 40°
4. `04-sled-winch-detail.svg` — close-up of the top assembly showing rails, rollers, sled construction, pivot bracket, winch position, cable routing, IRB fastening strap
5. `05-isometric.svg` — 3D reference view with key dimension callouts
6. `dimensions.md` — full spec sheet with all dimensions, materials, hardware list, fabrication notes, operating sequence, and quantity (×2 units)

### Geometry summary (from THINK phase first-principles analysis)

- Sled total length: 3000mm
- Sled forward portion (forward of pivot): 600mm
- Sled rearward portion (rearward of pivot, where IRB sits): 2400mm
- Pivot location: rear of rack (x=3220mm from rack front, h=2200mm)
- Slide travel: 820mm rearward from stow position
- Deployed tilt angle: 40° from horizontal
  - IRB rear tip (bow) reaches height 657mm above ground at 40° tilt
  - Operator can adjust between 20° (IRB at 1379mm — chest height) and 50° (IRB at 285mm — ankle height) for handling
- Winch cable provides correct rotation moment at all tilt angles (verified)

## Criteria

### Overall dimensions
- [ ] ISC-1: Internal length accommodates 3.22m (board 3.2m + 1cm padding each end)
- [ ] ISC-2: Internal width accommodates 122cm (2 boards × 58cm + 1cm padding each side + 2cm centre gap)
- [ ] ISC-3: External width ≤140cm (internal + uprights)
- [ ] ISC-4: External length ≤340cm (internal + end mullions if any)
- [ ] ISC-5: Total height with sleds stowed ≤2200mm (door clearance)

### Shelf system
- [ ] ISC-6: Five shelf levels present
- [ ] ISC-7: Lowest shelf resting surface at 300mm above floor
- [ ] ISC-8: Vertical spacing between adjacent resting surfaces = 400mm
- [ ] ISC-9: Topmost shelf resting surface at 1900mm above floor
- [ ] ISC-10: Each shelf level has two cross-piece supports (perpendicular to board length)
- [ ] ISC-11: Cross-pieces positioned outside fin zones (~600mm from each board end)
- [ ] ISC-12: Each cross-piece spans the full internal width (122cm)
- [ ] ISC-13: Cross-piece contact surfaces fitted with closed-cell EVA padding

### Structure
- [ ] ISC-14: Vertical uprights only on long sides (no uprights at short ends)
- [ ] ISC-15: Four upright pairs (8 uprights total): at each end + 2 intermediate
- [ ] ISC-16: Long-side diagonal bracing between uprights for racking stability
- [ ] ISC-17: Top frame complete rectangular box (provides sled support and lateral stiffness)
- [ ] ISC-18: Uprights specified as 50×50×3mm mild steel SHS, hot-dip galvanised

### Mobility
- [ ] ISC-19: Four 150mm industrial swivel casters with locking brakes
- [ ] ISC-20: Caster mounting plates fit within 300mm floor-to-lowest-shelf budget
- [ ] ISC-21: Caster WLL ≥250kg each (1000kg total capacity, 2× safety on max load)

### Slide rail system
- [ ] ISC-22: Two parallel slide rails along full length of rack top (left + right)
- [ ] ISC-23: Rails specified as 50×25×3mm RHS with hardened bearing surface
- [ ] ISC-24: Rails terminate at the rear of the rack with a pivot bracket on each side
- [ ] ISC-25: Latch mechanism (port + starboard) locks sled in stowed position
- [ ] ISC-26: Latch is positive-engagement (mechanical detent or sprung pin)

### Sled assembly
- [ ] ISC-27: Two sleds, parallel, spaced 800-1000mm apart centre-to-centre
- [ ] ISC-28: Sled total length 3000mm per sled
- [ ] ISC-29: Sled cross-section: hollow steel section with HDPE/padded IRB contact strip on top
- [ ] ISC-30: Forward roller pair (one per sled) at sled forward tip
- [ ] ISC-31: Rear roller pair (one per sled) at 2400mm rearward of forward roller
- [ ] ISC-32: Rollers are nylon on stainless steel axles, 50mm diameter minimum
- [ ] ISC-33: Front crossbar links the two sleds at forward tips (winch cable attachment)
- [ ] ISC-34: Rear crossbar links the two sleds at the pivot roller position (IRB fastening strap)

### Slide-then-tilt geometry
- [ ] ISC-35: Slide travel ≥820mm rearward from stow position
- [ ] ISC-36: At slide-complete, rear roller engages pivot bracket at rack rear
- [ ] ISC-37: Pivot bracket constrains rear roller in pivot mode (allows rotation, prevents translation)
- [ ] ISC-38: When tilted at 40°, sled forward tip rises to ~2586mm (above 2200mm — only when outside shed)
- [ ] ISC-39: When tilted at 40°, sled rear tip descends to ~657mm above ground

### Winch and stabilizer
- [ ] ISC-40: Electric winch (12V or 240V), WLL ≥1000kg, mounted at front-base of rack
- [ ] ISC-41: Cable routes from winch up and rearward to sled front crossbar
- [ ] ISC-42: Cable provides correct rotation moment at all tilt angles (verified geometry)
- [ ] ISC-43: Stabilizer leg at rack rear, drop-down before sled-back operation
- [ ] ISC-44: IRB bow fastening strap at sled rear crossbar (prevents slide-off when tilted)

### Deliverables
- [ ] ISC-45: Plan view SVG produced with full dimensions
- [ ] ISC-46: Front elevation SVG produced with shelf heights and widths
- [ ] ISC-47: Side elevation SVG produced showing 3 sled states (stowed/slid/tilted)
- [ ] ISC-48: Sled/winch detail SVG produced showing rails, rollers, pivot, winch routing
- [ ] ISC-49: Isometric SVG produced with 3D reference and key callouts
- [ ] ISC-50: dimensions.md spec sheet produced with materials, hardware, dimensions, operating sequence
- [ ] ISC-51: Pack indicates fabrication quantity of 2 identical units

### Anti-criteria (must NOT occur)
- [ ] ISC-A1: No upright posts or frame members blocking the end-load board slide path
- [ ] ISC-A2: No lengthwise rails passing through fin drop zones
- [ ] ISC-A3: No structure exceeding 2200mm when sleds are stowed
- [ ] ISC-A4: No sled-body sweep through occupied board space during tilt

## Decisions

- **Sled length 3000mm** chosen so forward portion (600mm) provides counter-balance on rack top, and rearward portion (2400mm) cradles the 2100mm IRB with 300mm overhang at sled tip for crew bow handling.
- **Pivot at rear of rack, not extended further rearward** — keeps rack footprint compact, geometry resolved by slide-then-tilt instead of cantilever extension.
- **Winch at front-bottom of rack** (not top-front or top-rear) — verified by first-principles moment analysis as the only placement that provides counter-clockwise moment to lift sled rear back to horizontal.
- **Two crossbars** (front and rear of sled) instead of one — front crossbar takes winch cable load, rear crossbar serves as IRB bow strap anchor and pivot roller mount.
- **Stabilizer leg required** — drop-down leg at rack rear prevents tip-up during slide phase when IRB is cantilevered behind rack.
- **5 shelves retained** as user-confirmed; slide-then-tilt mechanism resolves geometry without compromising shelf count.

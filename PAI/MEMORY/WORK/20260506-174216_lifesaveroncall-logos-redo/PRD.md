---
task: Redo six LifesaverOnCall logo concepts with correct rescue tube
slug: 20260506-174216_lifesaveroncall-logos-redo
effort: standard
phase: build
progress: 0/10
mode: interactive
started: 2026-05-06T17:42:16+10:00
updated: 2026-05-06T17:42:16+10:00
iteration: 2
---

## Context

Previous batch of six LifesaverOnCall logo concepts failed because models defaulted to a generic orange torpedo/foam-buoy shape. Reference image confirmed: SLSA rescue tube is a LONG SLIM YELLOW hexagonal-cross-section foam baton with TAPERED POINTED ENDS, RED FABRIC STRAP LOOPS at each end (one with metal clip), embossed "RESCUE TUBE AUSTRALIA" text. Proportions ~8:1 length-to-width. NOT orange. NOT a ring buoy. NOT a fat torpedo.

Six concepts to regenerate via Nano Banana (gemini-2.5-flash-image), passing the rescue-tube-reference.png as a visual reference where supported.

### Concepts
1. Silhouette lifesaver carrying tube (red figure, yellow tube, cream)
2. Tube curved into bell/alert ring
3. Top-down tube + radar arcs
4. Tube curved as phone handset
5. Circular badge emblem with tube ring around red dot
6. Minimal monoline mark — tube AND ECG pulse

## Criteria

- [ ] ISC-1: Concept 1 silhouette PNG saved at correct path
- [ ] ISC-2: Concept 2 bell PNG saved at correct path
- [ ] ISC-3: Concept 3 radar PNG saved at correct path
- [ ] ISC-4: Concept 4 handset PNG saved at correct path
- [ ] ISC-5: Concept 5 badge PNG saved at correct path
- [ ] ISC-6: Concept 6 monoline PNG saved at correct path
- [ ] ISC-7: All six tubes are YELLOW not orange
- [ ] ISC-8: All six tubes show long slim proportions not chunky torpedoes
- [ ] ISC-9: All six images are square 1:1 with cream background
- [ ] ISC-10: Honest fidelity assessment returned per concept

## Decisions

- Use Gemini 2.5 Flash Image (Nano Banana) via REST API with reference image attached as inline_data
- Single Python script with parallel async calls to all six prompts
- Pass rescue-tube-reference.png to each generation as visual conditioning
- Prompt every concept with explicit "long slim yellow hexagonal foam baton, NOT orange, NOT a ring buoy, NOT a fat torpedo" anti-pattern guard

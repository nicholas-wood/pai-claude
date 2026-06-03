---
task: Base markers cluster at low zoom always visible
slug: 20260506-132904_base-clustering-on-map
effort: standard
phase: observe
progress: 0/12
mode: interactive
started: 2026-05-06T13:29:04Z
updated: 2026-05-06T13:29:04Z
---

## Context

Add Google Maps clustering to the bases layer in `apps/web` so all 65 bases are always represented at every zoom level. When markers would otherwise be too dense, group them into a branded charcoal cluster circle with count. Cluster click flies to bounds; cluster hover shows InfoWindow listing up to 8 base names with "+N more". Remove the existing `zoom < 8` ring-hide check and the `zoom < 9` thinning so rings always render with the marker when not clustered.

Worktree: `/Users/nicholaswood/Documents/workspace/lifesaveroncall-wt/clustering`, branch `feat/base-clustering` off `origin/dev`. NO push.

### Risks
- `@googlemaps/markerclusterer` integration with `@vis.gl/react-google-maps` AdvancedMarker via refs in React 19 — collecting refs from a dynamic list needs careful reconcile.
- Custom HTML cluster element vs Google's default SVG circle — must return a `google.maps.marker.AdvancedMarkerElement` from the renderer for AdvancedMarker compatibility.
- Hover InfoWindow on a clustered "marker" element: cluster Markers don't expose DOM events the same way; attach pointer listeners on the rendered HTML element.
- Tests run under bun:test without a real google.maps global — keep test as smoke/structural.

## Criteria

- [x] ISC-1: `@googlemaps/markerclusterer` listed in `apps/web/package.json` dependencies
- [x] ISC-2: BasesLayer constructs a `MarkerClusterer` bound to the active map
- [x] ISC-3: BasesLayer renders one AdvancedMarker per base (no thinning by zoom)
- [x] ISC-4: BaseMarker `showRings` prop removed or always defaults true at every zoom
- [x] ISC-5: Cluster renderer produces charcoal circle with white count text
- [x] ISC-6: Cluster size buckets sm/md/lg pick distinct diameters by count
- [x] ISC-7: Cluster click smoothly fits bounds of contained markers
- [x] ISC-8: Cluster hover shows InfoWindow listing up to 8 base names
- [x] ISC-9: InfoWindow shows "+N more" suffix when cluster contains over 8 bases
- [x] ISC-10: Hover InfoWindow suppressed on touch-pointer devices
- [x] ISC-11: BasesLayer.test.tsx still passes plus a clusterer-presence assertion
- [x] ISC-A-1: Existing tests in apps/web continue to pass

## Decisions

- Cluster renderer: charcoal `#1f1f1f` filled circle, white text, soft drop shadow `0 1px 3px rgba(0,0,0,0.4)`. Sizes: <10 → 32px, <30 → 40px, else 48px.
- Use `AdvancedMarkerElement` (not legacy `Marker`) in renderer to match the rest of the layer; register clusters on the same map instance from `useMap()`.
- Hover detection: attach `mouseenter`/`mouseleave` to the rendered cluster HTML element via ref captured in renderer; check `window.matchMedia("(pointer: coarse)")` to skip.
- Fly-in: build a `LatLngBounds` from `cluster.markers` positions and call `map.fitBounds(bounds, { top:80, right:80, bottom:80, left:80 })`. The Maps JS API animates fitBounds smoothly by default.

## Verification


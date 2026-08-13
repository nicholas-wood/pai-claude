---
name: gotcha-radix-select-dialog-touch
description: "Radix Select-in-Dialog touch bugs (close-through, no-close) and the BudgetBuddy harness pattern that reproduces them"
metadata: 
  node_type: memory
  type: project
  originSessionId: c13342da-4599-4c46-a505-a161c247ba31
  modified: 2026-08-12T21:37:50.081Z
---

BudgetBuddy (envelope-os) v1.18.x fixed a family of Radix UI Dialog×Select touch bugs. Facts that will bite again:

- **Touch ≠ mouse for Radix dismissal.** Dialog (dismissable-layer 1.1.13+, the #3346 rework) defers outside-press dismissal from pointerdown to the gesture's trailing click; mouse gestures cancel it mid-gesture, touch never does. Bugs in this family reproduce ONLY with `page.touchscreen.tap`, never `mouse.click`.
- **Radix Select renders its Content children even while CLOSED** (to collect item labels for the trigger). Any mount-effect in a custom SelectContent wrapper runs for closed selects; state persists across open/close. Key open-lifecycle logic off the root's `open` state, not mounts.
- **The selected SelectItem must stay mounted while the dropdown is open** — filtering it out blanks the trigger text, and remounting it steals focus (asynchronously — a parent-effect refocus loses the race).
- Fixes live in `web/src/components/ui/{dialog,select}.tsx`: gesture-ownership latch (`selectLayerOwnsCurrentGesture`), Select wrapper with outside-pointerdown close + next-gesture-disarmed click swallow, `SearchableSelectContent`.
- **Reusable isolated harness pattern**: run the real server with overridden `HOME` (fresh secret vault) + `PENNY_SQLITE_PATH`/`PENNY_PORT`, seed PIN via `LocalSecretStore`, seed the `users` row (`local`, fresh DB has none — FK failures otherwise), serve a scratch build via `web/dist` symlink (server resolves `./web/dist` from cwd). Probes in `test/browser-harness/` (puppeteer via [[reference-md-to-pdf-onedrive-pipeline]] Chrome). Deploy = `vite build` only; the live bun process serves dist per-request, no restart.

**Why:** regression risk is high (Radix caret-range drift caused this), and headless CDP touch emulation was the only way to see it from the Linux box while [[gotcha-interceptor-extension-flaky]] Interceptor was down.
**How to apply:** for any BudgetBuddy UI bug report from Nick's phone, reproduce with the touch harness first; never claim a dropdown/modal fix from mouse-only probes.

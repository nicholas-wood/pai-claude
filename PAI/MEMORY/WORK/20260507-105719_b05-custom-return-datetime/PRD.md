---
task: B05 custom date/time picker for return availability
slug: 20260507-105719_b05-custom-return-datetime
effort: standard
phase: verify
progress: 30/30
mode: interactive
started: 2026-05-07T10:57:19Z
updated: 2026-05-07T10:57:19Z
---

## Context

B04 shipped a five-quick-pick return-date picker (Tomorrow / 3d / 1w / 2w / Open-ended). B05 enriches the picker with a true "Custom date/time" entry that opens `@react-native-community/datetimepicker`, defaults to tomorrow 09:00 local, and threads the chosen ISO timestamp through `applyAvailability(next, iso)`.

Closes FR-2.4 (optional return prompt) and FR-2.7 (open-ended path) at full coverage. Curated guard: max 30 days into the future, no past dates. Time stored as ISO with offset; storage is local time-zone resolved at pick-time.

Working directory: `/Users/nicholaswood/Documents/workspace/lifesaveroncall-wt/return-date`. Branch `feat/availability-return-date` sits 2 commits behind `origin/dev` tip — left as-is (cited in plan).

### Risks

- R1: native dep `@react-native-community/datetimepicker` cannot be mounted under bun test — keep all UI logic in pure helpers and unit-test those.
- R2: 30-day future-bound is enforced at both the UI guard and API validator — must add new error code `EXPECTED_RETURN_TOO_FAR` to validator without breaking the existing `EXPECTED_RETURN_PAST` shape.
- R3: time-zone handling — `Date.toISOString()` produces a Z-suffixed UTC string; offset is preserved by going via `new Date(yearMonthDayHourMinute)` (local) and then ISO. Tests should use a fixed `now` to avoid flakes.
- R4: branch is 2 commits behind dev — task instructions explicitly told us to verify state, not pull. Leave it.

## Criteria

- [x] ISC-1: `availability.ts` exports CUSTOM choice id constant
- [x] ISC-2: `buildReturnChoices` includes a "Custom" entry distinct from "Open-ended"
- [x] ISC-3: `defaultCustomReturn(now)` returns tomorrow 09:00 local
- [x] ISC-4: `clampCustomReturn` rejects dates in the past
- [x] ISC-5: `clampCustomReturn` rejects dates more than 30 days ahead
- [x] ISC-6: `clampCustomReturn` accepts in-range dates returning ISO string
- [x] ISC-7: Status screen renders the "Custom date/time" choice in the inline picker
- [x] ISC-8: Selecting "Custom" opens the native datetimepicker
- [x] ISC-9: Default value of native picker is tomorrow 09:00 local
- [x] ISC-10: Confirming a valid custom datetime calls applyAvailability with ISO
- [x] ISC-11: >30d future selection shows in-app error and does not submit
- [x] ISC-12: Past date selection shows in-app error and does not submit
- [x] ISC-13: Cancelling the native picker returns to inline choice list
- [x] ISC-14: `apps/mobile/package.json` includes the datetimepicker dep
- [x] ISC-15: `validateAvailabilityPatchBody` rejects >30d future with `EXPECTED_RETURN_TOO_FAR`
- [x] ISC-16: API test covers the >30d rejection path
- [x] ISC-17: Helper test asserts "Custom" entry presence
- [x] ISC-18: Helper test for `clampCustomReturn` past rejection
- [x] ISC-19: Helper test for `clampCustomReturn` >30d rejection
- [x] ISC-20: Helper test for `clampCustomReturn` happy path returns ISO
- [x] ISC-21: Helper test for `defaultCustomReturn` returns tomorrow 09:00 local
- [x] ISC-22: AU English preserved (organisation, behaviour, colour)
- [x] ISC-23: `bun run lint:au` passes for touched files
- [x] ISC-24: `bun run lint:tenant` passes for touched files
- [x] ISC-25: `bun run format` applied to touched files
- [x] ISC-26: Existing `availability.test.ts` cases still green
- [x] ISC-27: Existing `me-availability.test.ts` cases still green
- [x] ISC-28: Commits cite FR-2.4 and FR-2.7
- [x] ISC-29: Three logical commits: helper+tests, API validator+test, mobile UI
- [x] ISC-A1: No push to remote (anti-criterion)
- [x] ISC-A2: ULIDs preserved (anti-criterion — no schema work in this branch)

## Decisions

- D1: `ReturnChoice` gains a `kind: 'preset' | 'open' | 'custom'` discriminator rather than overloading `iso: null` semantics. The "custom" entry has `iso: null` and `kind: 'custom'`; the "open-ended" entry has `iso: null` and `kind: 'open'`. The screen branches on `kind`.
- D2: `clampCustomReturn` returns `{ ok: true, iso }` or `{ ok: false, code: 'PAST' | 'TOO_FAR' }` to mirror the API validator's discriminator pattern.
- D3: 30 days = exactly 30*24*60*60*1000 ms — same constant in helper and validator.
- D4: API error code `EXPECTED_RETURN_TOO_FAR` (snake-uppercase, matches existing convention).
- D5: Three logical commits — helper+tests, API validator+test, mobile UI.

## Verification

(populated during VERIFY)

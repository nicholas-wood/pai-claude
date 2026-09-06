---
task: AccessBuddy access update flow: expired fob notice
slug: accessbuddy-access-update-expired-fob-notice
effort: E2
phase: complete
progress: 24/24
mode: build
started: 2026-09-06T00:00:00+10:00
updated: 2026-09-06T20:10:00+10:00
---

# AccessBuddy: expired fob notice on the access update request flow

## Problem

Members whose fob has expired (membership renewal not yet processed) are submitting "Request an access update" forms in AccessBuddy hoping to get the fob working again. That request type changes the access level on the membership; it does nothing for an expired credential. Expired fobs are reactivated automatically once the membership renewal (attestation) is processed. The extra request lands in the admin queue, has to be triaged and closed, and slows the member's real path (renewal) down. The member form gives no hint of this today.

## Goal

The member request flow makes it unmistakable, before and after identity verification, that an access update must not be submitted for an expired fob, states that renewal reactivates expired fobs, and warns that an extra form slows things down. Submission stays possible (no hard block) and no other request type is affected.

## Criteria

- [x] ISC-1: An `ExpiredFobNotice` component exists in `apps/web/src/app/t/[slug]/request/request-form.tsx`
- [x] ISC-2: The notice renders on the Type step as soon as "Request an access update" is selected
- [x] ISC-3: The notice renders on the "What has changed?" (Change) step
- [x] ISC-4: Notice copy states expired fobs are reactivated as part of the membership renewal form
- [x] ISC-5: Notice copy states the member does not need to submit an access update for an expired fob
- [x] ISC-6: Notice copy states an extra form is likely to slow the process down
- [x] ISC-7: When the verified member has credentials with status `expired`, the notice names them by serial
- [x] ISC-8: Notice reuses the existing amber dead-end callout styling (`border-amber-300 bg-amber-50`)
- [x] ISC-9: Notice container carries `role="status"` (refined from `alert`: polite live region; see Decisions)
- [x] ISC-10: Generic variant links to the tenant dashboard so the member can check fob status
- [x] ISC-11: Anti: `canAdvance()` for the Change step is unchanged (submission is not blocked)
- [x] ISC-12: Anti: the notice is only rendered for the access update type (all usages gated by `isAccessUpdate` or the Change step)
- [x] ISC-13: Anti: no em or en dashes in the new copy
- [x] ISC-14: Copy uses Australian English (no "-ize")
- [x] ISC-15: `tsc --noEmit` passes for `apps/web`
- [x] ISC-16: eslint passes on `request-form.tsx`
- [x] ISC-17: Existing vitest suite for `apps/web` stays green
- [x] ISC-18: `docs/FLOWS.md` section 3.7 documents the expired fob notice
- [x] ISC-19: Work is committed on a feature branch with a `feat(request):` prefix so release-please deploys it
- [x] ISC-20: Branch is pushed to origin
- [x] ISC-21: Project ISA `## Decisions` has a dated 2026-09-06 entry for this change
- [x] ISC-22: Rendered HTML of the notice contains the copy (server render probe)
- [x] ISC-23: Personalised variant caps the serial list at three and counts the remainder ("and N others")
- [x] ISC-24: Review step repeats the personalised notice when the verified member has expired fobs

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..10, 12, 18, 24 | static | grep for symbol / copy / gate | present | Grep |
| ISC-11 | static | diff shows no change to `canAdvance` Change branch | no hunk | Bash git diff |
| ISC-13, 14 | static | grep diff for `—`, `–`, ` -- `, `-ize` | zero hits | Bash |
| ISC-15 | build | `bunx tsc --noEmit` in apps/web | exit 0 | Bash |
| ISC-16 | lint | `bunx eslint` on the file | exit 0 | Bash |
| ISC-17 | test | `bunx vitest run` in apps/web | all pass | Bash |
| ISC-19, 20 | vcs | `git log`, `git ls-remote` | present | Bash |
| ISC-21 | static | grep project ISA | present | Grep |
| ISC-22, 23 | render | throwaway vitest render probe (jsx automatic config) | copy in HTML | Bash |

## Decisions

- 2026-09-06: Classifier tier E2 honoured. Thinking floor met with FeedbackMemoryConsult (memory + `context/feedback.md`) and ReReadCheck; Advisor (Inference.ts advisor mode) also consulted once post-build per Rule 2. Delegation floor relaxed (show your math): the change is one client component plus a docs bullet, fully read in context; a feature-dev agent would re-derive the same file and the qa-verify agent would run the same tsc/eslint/vitest commands I ran directly.
- 2026-09-06: Placement: three surfaces. (1) Type step, immediately under the option list once the access update option is selected, so unauthenticated members see it before the OTP step. (2) Change step, at the top, personalised with the expired fob serial(s) when the verified member has `expired` credentials. (3) Review step, personalised variant only, as the last chance before submit (advisor suggestion). No hard block: Nick asked for clarity, and a member with one expired and one active fob may still have a legitimate access change.
- 2026-09-06: Copy reuses the wording of the existing `credential_expired` and `credential_reactivated` emails ("membership renewal", "reactivated automatically", "nothing you need to do with the fob itself") so the member hears one story across email and form.
- 2026-09-06: refined: Advisor review adopted: `role="status"` instead of `role="alert"` (content appears in response to the member's own selection; an assertive alert would cut off the option announcement), serial list capped at three with "and N others", Review-step reminder, "if you have already renewed" reassurance. Declined: renewal deep link (attestation URLs are tokenised and admin-sent; `rg` found no member-facing renewal route) and success-screen redirect (same reason). Confirmed `expired` is the real enum value in `packages/shared/src/enums.ts:43` and both fob queries (`verify-code` route and `request/page.tsx`) return all statuses, so the personalised branch fires in production.
- 2026-09-06: Verification probe approach: `jsx: "preserve"` in the app tsconfig means the default vitest config cannot transform TSX, so the render probe ran under a throwaway `zz-vitest.render.config.ts` with `esbuild.jsx = "automatic"`. Both probe files deleted before commit; the probe is not part of the shipped suite.

## Verification

- ISC-1: Grep — `export function ExpiredFobNotice(` present in request-form.tsx
- ISC-2: Grep — line 528 `{isAccessUpdate && <ExpiredFobNotice tenantSlug={tenantSlug} expiredFobs={expiredFobs} />}` inside the Type step block
- ISC-3: Grep — `<ExpiredFobNotice .../>` directly under `What has changed?` CardTitle in the Change step block
- ISC-4: render probe — HTML contains "reactivated automatically as part of the membership renewal form"
- ISC-5: render probe — HTML contains "You do not need to submit an access update for an expired fob"
- ISC-6: render probe — HTML contains "likely to slow the process down"
- ISC-7: render probe — HTML contains "Fob #1234 (Wristband) on your account has expired. Please do not submit this request for it."
- ISC-8: Grep — `border-amber-300 bg-amber-50` on the notice container
- ISC-9: render probe — HTML contains `role="status"` and not `role="alert"`
- ISC-10: render probe — generic variant HTML contains `/t/smlsc/dashboard`; personalised variant does not
- ISC-11: Bash — `git diff HEAD~1 | rg -c 'case "Change":'` = 0
- ISC-12: Bash — `rg -c '<ExpiredFobNotice'` = 3; usages at Type (gated `isAccessUpdate`), Change step (only reachable when `isAccessUpdate`), Review (gated `isAccessUpdate && expiredFobs.length > 0`)
- ISC-13: Bash — dash hits in added lines of the diff = 0 (`—`, `–`, ` -- `); render probe also asserts no `—` or `–`
- ISC-14: Bash — `-ize` hits in added lines = 0
- ISC-15: Bash — `bunx tsc --noEmit` exit 0 (run after the final edit)
- ISC-16: Bash — `bunx eslint 'src/app/t/[slug]/request/request-form.tsx'` exit 0
- ISC-17: Bash — `bunx vitest run`: Test Files 9 passed, 3 skipped; Tests 172 passed, 23 skipped
- ISC-18: Edit + Read — docs/FLOWS.md 3.7 "Not for expired fobs." bullet present
- ISC-19: Bash — `git log --oneline -1` = `af8260b feat(request): warn members not to submit an access update for an expired fob`
- ISC-20: Bash — `git ls-remote --heads origin feat/access-update-expired-fob-notice` = af8260b04c8f...
- ISC-21: Edit — project ISA `## Decisions` first entry dated 2026-09-06
- ISC-22: Bash — throwaway render probe: Test Files 1 passed, Tests 4 passed
- ISC-23: render probe — HTML contains "Fobs #1 (Wristband), #2 (Wristband), #3 (Wristband) and 2 others on your account have expired." and not "#4"
- ISC-24: Grep — Review step block contains `{isAccessUpdate && expiredFobs.length > 0 && (<ExpiredFobNotice .../>)}`
- Not probed live: a browser screenshot of the deployed form. Interceptor requires Nick's Chrome on the Mac; the change is client copy in a component that typechecks, lints and server-renders with the expected HTML. Follow-up: verify on accessbuddy.com.au/t/smlsc/request after the PR merges and release-please deploys.

---
task: Fix AccessBuddy build errors and critical UI issues
slug: 20260330-140000_fix-accessbuddy-build-critical-ui
effort: advanced
phase: complete
progress: 28/28
mode: interactive
started: 2026-03-30T14:00:00+11:00
updated: 2026-03-30T14:01:00+11:00
---

## Context

Continuing AccessBuddy development from the 29 March session. The codebase has 200+ files, 20k+ lines, 17 commits on main. The production Docker build fails with one remaining type error. Four critical UI issues need fixing before GCP deployment.

**What was requested:**
1. Fix remaining type errors so production build passes
2. Unify member dashboard from 4 tabs into a single page
3. Fix request form post-submission flow
4. Fix "new fob blocked" missing login button
5. Fix submitted request not visible in member dashboard

**What was NOT requested:**
- Admin dashboard changes
- New features
- Infrastructure/Terraform work (that comes after build passes)

### Risks
- Unifying dashboard into one page requires moving server-side data fetching from 3 separate pages into 1
- Request visibility bug may be a data model issue (requesterId mismatch between form submission and Clerk user)
- Post-submission flow has multiple code paths (orphaned, payment, member, non-member)

### Plan
1. Fix the type error in audit-trail.tsx (unknown -> ReactNode)
2. Verify build passes
3. Restructure member dashboard: merge requests, credentials, profile into single page.tsx
4. Fix request form: add confirmation page for non-orphaned submissions, add login button for existing members
5. Fix request visibility: trace the requesterId assignment in submit endpoint

## Criteria

- [x] ISC-1: Production build (bun run build) completes without errors
- [x] ISC-2: audit-trail.tsx meta.reason type error resolved
- [x] ISC-3: Member dashboard renders all content on single page
- [x] ISC-4: Member dashboard shows request list inline (no separate tab)
- [x] ISC-5: Member dashboard shows credentials list inline (no separate tab)
- [x] ISC-6: Member dashboard shows profile section inline (no separate tab)
- [x] ISC-7: Dashboard tab navigation removed from layout
- [x] ISC-8: Dashboard overview stat cards removed (replaced by inline content)
- [x] ISC-9: New Request button visible on unified dashboard
- [x] ISC-10: Request detail page still accessible via click-through
- [x] ISC-11: Credential actions (report lost/damaged) still functional inline
- [x] ISC-12: Profile form (edit email/phone) still functional inline
- [x] ISC-13: Request form shows confirmation screen after successful submission
- [x] ISC-14: Request form confirmation offers sign-in link for existing members
- [x] ISC-15: Request form confirmation offers "done" state for new members
- [x] ISC-16: Non-orphaned non-payment submission shows confirmation (not redirect)
- [x] ISC-17: Orphaned submission still shows existing thank-you message
- [x] ISC-18: Payment flow still triggers correctly when payment required
- [x] ISC-19: "New fob blocked" error includes button to navigate to sign-in
- [x] ISC-20: Member dashboard shows requests submitted via public form
- [x] ISC-21: Request submit endpoint sets requesterId correctly for verified members
- [x] ISC-22: Dashboard request query matches on both requesterId and email
- [x] ISC-23: Loading skeleton still renders while dashboard data loads
- [x] ISC-24: Request detail page request ownership check handles email fallback
- [x] ISC-A-1: Anti: No admin dashboard pages modified
- [x] ISC-A-2: Anti: No existing test data or seed scripts broken
- [x] ISC-A-3: Anti: No request workflow state machine logic changed
- [x] ISC-A-4: Anti: No regressions in request form multi-step flow

## Verification

- ISC-1: `bun run build` - 3/3 tasks successful, 0 failures
- ISC-2: `audit-trail.tsx` changed `&&` to `!= null` for unknown metadata fields
- ISC-3-12: Dashboard page.tsx renders requests, credentials, profile inline. Layout has no tab nav.
- ISC-13-18: Request form uses step -3 for success confirmation, -1 for orphaned, -2 for payment
- ISC-19: Error message containing "sign in" shows Link to /sign-in
- ISC-20-22: Dashboard query uses or(requesterId, orphanEmail). Submit stores email for unmatched users.
- ISC-23: Loading skeleton has 3 sections matching unified dashboard structure
- ISC-24: Request detail checks requesterId OR orphanEmail match
- ISC-A-1: git diff shows 0 changes under admin/ directory
- ISC-A-2: 52/52 tests pass (12 shared + 40 web)
- ISC-A-3: No changes to state-machine.ts
- ISC-A-4: Request form multi-step flow logic unchanged

## Decisions

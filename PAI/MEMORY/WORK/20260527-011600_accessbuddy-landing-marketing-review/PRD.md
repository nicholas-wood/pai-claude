---
task: AccessBuddy landing marketing review and rewrites
slug: 20260527-011600_accessbuddy-landing-marketing-review
effort: extended
phase: complete
progress: 25/25
mode: interactive
started: 2026-05-27T01:16:00+10:00
updated: 2026-05-27T01:18:30+10:00
---

## Context

Nick asked for a marketing-exec-level review of the AccessBuddy landing page (accessbuddy.com.au). Feedback received from a third party: page is "clunky" and "marketing lines could flow better". Deliverable is a structured review with specific rewrite recommendations, executive-ready tone, Australian English.

Source of truth for current copy: `apps/web/src/lib/services/landing-content.ts` (DEFAULT_LANDING_CONTENT). Verified live site at accessbuddy.com.au matches defaults exactly — no DB override active.

Audience for the landing page itself: volunteer-club committee members and presidents (decision makers), not end-member users. They are time-poor, sceptical of SaaS, allergic to sales-funnel language.

## Criteria

Diagnostic ISC (what the review must identify):
- [x] ISC-1: Identify flow break in hero subtitle three-idea structure
- [x] ISC-2: Identify duplication between hero stats and value-prop card 1
- [x] ISC-3: Identify tonal slip "club access is the carrot" jokey vs crisp
- [x] ISC-4: Identify weak section heading "What AccessBuddy gives your club"
- [x] ISC-5: Identify grammar awkwardness "clubs with physical access to manage"
- [x] ISC-6: Identify staccato fragments in How-it-works subtitle
- [x] ISC-7: Identify filler word "actually" in features heading
- [x] ISC-8: Identify vague contact bullet "scales with your club, not against it"
- [x] ISC-9: Identify problem-section tense and rhythm issues
- [x] ISC-10: Identify hyphen-as-em-dash overuse harming readability
- [x] ISC-11: Identify structural ordering issue — stats appear before earning trust

Rewrite ISC (what the review must produce):
- [x] ISC-12: Provide rewritten hero headline option with sharper rhythm
- [x] ISC-13: Provide rewritten hero subtitle reducing three ideas to one
- [x] ISC-14: Provide rewritten hero stats with non-duplicating hints
- [x] ISC-15: Provide rewritten problem section in tighter prose
- [x] ISC-16: Provide rewritten value-props heading and four card titles
- [x] ISC-17: Provide rewritten who-its-for heading without "physical access"
- [x] ISC-18: Provide rewritten how-it-works subtitle as one sentence
- [x] ISC-19: Provide rewritten features heading dropping "actually"
- [x] ISC-20: Provide rewritten contact subtitle and concrete bullets
- [x] ISC-21: Provide structural ordering recommendation (sections sequence)
- [x] ISC-A1: Anti-criterion — no em-dashes used in rewrites (hyphens, commas, sentence breaks only)
- [x] ISC-A2: Anti-criterion — no sycophancy ("great copy" / "strong foundation") opening
- [x] ISC-A3: Anti-criterion — no generic SaaS marketing platitudes ("supercharge", "unlock", "transform")
- [x] ISC-A4: Anti-criterion — Australian English maintained (organisation, optimise, behaviour)

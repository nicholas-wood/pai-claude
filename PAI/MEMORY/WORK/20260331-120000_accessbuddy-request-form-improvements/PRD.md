---
task: Implement AccessBuddy request form improvements
slug: 20260331-120000_accessbuddy-request-form-improvements
effort: advanced
phase: complete
progress: 26/26
mode: interactive
started: 2026-03-31T12:00:00-04:00
updated: 2026-03-31T12:01:00-04:00
---

## Context

Three changes to the AccessBuddy request form: (1) Hide ADDITIONAL fob option from unauthenticated users and from users who already have max active credentials, (2) Improved damaged fob flow with login prompt, reader-beeps question, and auto-exemption for payment review, (3) All changes across page.tsx, request-form.tsx, and submit route.ts. No schema or state machine changes.

### Risks
- Step navigation logic is dynamic and adding a new step (damaged login prompt) must integrate correctly
- The auto-exemption flow for damaged fobs must use the existing transitionRequest function correctly
- The readerBeeps field is new in formData but the submit schema needs updating to accept it

## Criteria

### Change 1: ADDITIONAL fob auth gating
- [x] ISC-1: ADDITIONAL option hidden when user is unauthenticated
- [x] ISC-2: ADDITIONAL option hidden when active fob count >= maxActiveCredentials
- [x] ISC-3: ADDITIONAL option visible when authenticated and under max
- [x] ISC-4: maxActiveCredentials prop added to RequestForm Props type
- [x] ISC-5: page.tsx passes maxActiveCredentials from tenant settings
- [x] ISC-6: Filter logic correctly counts only "active" status fobs

### Change 2a: Damaged fob login prompt
- [x] ISC-7: Login prompt shown when damaged fob selected AND unauthenticated
- [x] ISC-8: Prompt includes sign-in link
- [x] ISC-9: "Continue without signing in" button proceeds to next step
- [x] ISC-10: Prompt does NOT show for authenticated users
- [x] ISC-11: Dynamic steps array includes "Sign In" step at correct position

### Change 2b: Reader beeps question
- [x] ISC-12: readerBeeps field added to FormData type
- [x] ISC-13: readerBeeps field initialized in formData state
- [x] ISC-14: Yes/No radio buttons displayed after damaged fob type selection
- [x] ISC-15: readerBeeps answer stored in formData
- [x] ISC-16: readerBeeps included in submit request body
- [x] ISC-17: Submit schema updated to accept readerBeeps field
- [x] ISC-18: readerBeeps displayed in Review step

### Change 2c: Damaged fob auto-exemption
- [x] ISC-19: Damaged fob with payment creates request with exemptionRequested=true
- [x] ISC-20: Exemption reason includes readerBeeps answer
- [x] ISC-21: Request transitions to AWAITING_EXEMPTION_REVIEW status
- [x] ISC-22: No Stripe payment intent created for damaged fob requests
- [x] ISC-23: Response indicates no payment required (paymentRequired=false)
- [x] ISC-24: Deactivation request still created for damaged replacement flow

### Build verification
- [x] ISC-25: bun run build succeeds without errors
- [x] ISC-26: No TypeScript type errors introduced

## Decisions

## Verification

### ISC-1 through ISC-6 (ADDITIONAL auth gating)
- Filter in request-form.tsx lines 431-436: hides ADDITIONAL when !authUser or activeCount >= maxActiveCredentials
- maxActiveCredentials prop added to Props type (line 67) with default 3
- page.tsx passes settings.maxActiveCredentialsPerMember (line 95)

### ISC-7 through ISC-11 (Damaged fob sign-in prompt)
- "Sign In" step added to dynamic steps array (line 225) when isDamaged && !authUser
- Sign In step UI (lines 459-479) includes sign-in link and informational text
- Footer shows "Continue without signing in" button for Sign In step (lines 1039-1041)
- canAdvance returns true for Sign In step (line 302)
- Prompt only shows for unauthenticated (isDamaged && !authUser condition)

### ISC-12 through ISC-18 (Reader beeps question)
- readerBeeps field in FormData type (line 122)
- Initialized as "" in formData state (line 172)
- Yes/No buttons in Replacement step (lines 711-727)
- Stored via update("readerBeeps", ...) calls
- Included in submit body (line 345)
- Submit schema accepts readerBeeps (route.ts line 35)
- Displayed in Review step (lines 856-861)

### ISC-19 through ISC-24 (Damaged fob auto-exemption)
- route.ts creates replacement with exemptionRequested=true (line 196)
- Exemption reason includes readerBeeps text (lines 176-178)
- transitionRequest called with REQUEST_EXEMPTION to move to AWAITING_EXEMPTION_REVIEW (lines 214-224)
- No Stripe payment intent created when damagedAutoExempt (line 228 condition)
- Response returns paymentRequired=false for damaged (line 258)
- Deactivation request still created normally (lines 148-160)

### ISC-25 and ISC-26 (Build verification)
- bun run build succeeds with 3/3 tasks, 0 errors
- No TypeScript type errors

### Capability invocation check
- /simplify invoked via Skill tool -- confirmed (3 review findings, all fixed)

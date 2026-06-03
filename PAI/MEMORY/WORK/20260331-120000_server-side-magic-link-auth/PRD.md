---
task: Server-side magic link auth via Resend
slug: 20260331-120000_server-side-magic-link-auth
effort: advanced
phase: verify
progress: 12/12
mode: interactive
started: 2026-03-31T12:00:00-05:00
updated: 2026-03-31T12:01:00-05:00
---

## Context

Replace Firebase's client-side `sendSignInLinkToEmail` with server-side magic link generation using Firebase Admin SDK + Resend email delivery. This enables tenant branding on sign-in emails instead of generic `noreply@accessbuddy-dev.firebaseapp.com`.

The existing auth callback at `/auth/callback` uses `isSignInWithEmailLink` + `signInWithEmailLink` from Firebase client SDK, which will continue to work because the Admin SDK generates the same link format.

### Risks
- `generateSignInWithEmailLink` requires Email Link sign-in enabled in Firebase (confirmed enabled)
- The `actionCodeSettings.url` must match what the callback expects
- The sign-in form is client-only ("use client") so it must fetch via API, not import server code
- Redirect param must be passed from form to server to build correct callback URL
- `handleCodeInApp: true` required in actionCodeSettings for email link sign-in

## Criteria

- [x] ISC-1: magicLinkEmail template function exists in email-templates.ts
- [x] ISC-2: magicLinkEmail uses layout() with teal button linking to magicLinkUrl
- [x] ISC-3: magicLinkEmail shows clubName, memberName, expiry warning text
- [x] ISC-4: magicLink added to TemplateVariables type in email.ts
- [x] ISC-5: magicLink case added to renderTemplate switch in email.ts
- [x] ISC-6: Tenant endpoint route.ts exists at api/v1/t/[slug]/auth/send-magic-link
- [x] ISC-7: Tenant endpoint resolves tenant and uses tenant email config
- [x] ISC-8: Tenant endpoint calls generateSignInWithEmailLink with correct actionCodeSettings
- [x] ISC-9: Global endpoint route.ts exists at api/auth/send-magic-link
- [x] ISC-10: Global endpoint uses default AccessBuddy branding
- [x] ISC-11: Sign-in form POSTs to /api/auth/send-magic-link instead of client-side Firebase
- [x] ISC-12: Build succeeds with bun run build (no type errors)

## Decisions

## Verification

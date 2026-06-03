---
task: PWA with WebAuthn biometric login for AccessBuddy
slug: 20260414-000500_pwa-webauthn
effort: advanced
phase: complete
progress: 24/24
mode: interactive
started: 2026-04-14T00:05:00+10:00
updated: 2026-04-14T00:10:00+10:00
---

## Context

Members want to open AccessBuddy on their phone without re-logging in every time. Solution: PWA for home screen install (persistent cookie jar) + WebAuthn passkeys for biometric re-authentication when sessions expire.

### Architecture

**PWA**: manifest.json + minimal service worker + app icons. Enables "Add to Home Screen" which gives persistent cookies and full-screen experience.

**WebAuthn flow**:
1. Member signs in via magic link (existing flow, unchanged)
2. After sign-in, prompt: "Use Face ID next time?"
3. Yes → WebAuthn registration (Face ID/Touch ID creates a passkey)
4. On next visit with expired session, sign-in page offers "Sign in with Face ID"
5. Biometric verification → server validates → new session cookie → dashboard

### Risks

- WebAuthn challenge storage needs to be secure and short-lived
- iOS Safari PWA has quirks with cookie persistence
- Need to handle the case where user has passkey but it's been revoked/reset

## Criteria

PWA:
- [ ] ISC-1: manifest.json in public/ with name, icons, theme colour
- [ ] ISC-2: App icons generated at required PWA sizes (192, 512)
- [ ] ISC-3: Service worker registered for PWA installability
- [ ] ISC-4: Meta tags in root layout for PWA (theme-color, apple-mobile-web-app)
- [ ] ISC-5: App opens full screen when launched from home screen

Database:
- [ ] ISC-6: webauthn_credentials table in Drizzle schema
- [ ] ISC-7: Migration file 0008 for the new table
- [ ] ISC-8: Table stores credentialId, publicKey, counter, transports, userId FK

WebAuthn Registration:
- [ ] ISC-9: POST /api/auth/webauthn/register/options returns challenge
- [ ] ISC-10: POST /api/auth/webauthn/register/verify stores credential
- [ ] ISC-11: Challenge stored in short-lived httpOnly cookie
- [ ] ISC-12: Only authenticated users can register credentials

WebAuthn Authentication:
- [ ] ISC-13: POST /api/auth/webauthn/login/options returns challenge
- [ ] ISC-14: POST /api/auth/webauthn/login/verify creates session cookie
- [ ] ISC-15: Session creation reuses existing pattern from session/route.ts

UI:
- [ ] ISC-16: Post-login prompt to register passkey (dismissible)
- [ ] ISC-17: Sign-in page shows "Sign in with Face ID" when passkeys available
- [ ] ISC-18: Prompt only shows if WebAuthn is supported by browser

Validation:
- [ ] ISC-19: @simplewebauthn/server and @simplewebauthn/browser installed
- [ ] ISC-20: Middleware allows WebAuthn API routes without session
- [ ] ISC-21: TypeScript compiles clean
- [ ] ISC-22: Tests pass
- [ ] ISC-23: Changes committed to dev
- [ ] ISC-24: PR created

- [ ] ISC-A1: Existing magic link flow unchanged
- [ ] ISC-A2: No changes to existing session cookie handling

## Decisions

- Use @simplewebauthn v11 (TypeScript-first, well-maintained)
- RP ID = domain from NEXT_PUBLIC_APP_URL
- Store challenges in httpOnly cookies (60s TTL)
- Allow multiple passkeys per user (different devices)

## Verification

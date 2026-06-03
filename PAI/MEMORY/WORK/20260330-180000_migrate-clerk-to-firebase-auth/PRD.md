---
task: Migrate identity provider from Clerk to Firebase Auth
slug: 20260330-180000_migrate-clerk-to-firebase-auth
effort: advanced
phase: complete
progress: 26/26
mode: interactive
started: 2026-03-30T18:00:00+11:00
updated: 2026-03-30T18:01:00+11:00
---

## Context

Replacing Clerk with Firebase Auth to eliminate user sync issues (orphan linking, duplicate clerkUserId, stale records). Firebase Auth provides identity verification only - our Postgres DB remains the source of truth for user data.

### Plan
1. Add firebase/firebase-admin dependencies
2. Create Firebase config (client + server)
3. Replace sign-in/sign-up pages with Firebase email link auth
4. Replace middleware (Clerk -> Firebase token verification)
5. Replace getAuthUser() to verify Firebase tokens
6. Replace ClerkWrapper with FirebaseAuthProvider
7. Replace UserMenu (Clerk UserButton -> custom)
8. Rename clerkUserId column to firebaseUid
9. Update env vars
10. Remove @clerk/nextjs dependency
11. Update seed data
12. Verify dev-login still works

## Criteria

- [ ] ISC-1: firebase and firebase-admin packages installed
- [ ] ISC-2: Firebase client config module exists with auth initialization
- [ ] ISC-3: Firebase admin config module exists with service account init
- [ ] ISC-4: Sign-in page uses Firebase email link authentication
- [ ] ISC-5: Sign-up page removed (Firebase handles both in one flow)
- [ ] ISC-6: Middleware verifies Firebase session cookie
- [ ] ISC-7: getAuthUser resolves Firebase token to DB user record
- [ ] ISC-8: getAuthUser creates DB user on first Firebase sign-in
- [ ] ISC-9: getAuthUser links orphaned requests by email on sign-in
- [ ] ISC-10: Auth provider wraps app with Firebase context
- [ ] ISC-11: UserMenu shows user initial and sign-out button
- [ ] ISC-12: Sign-out clears Firebase session cookie
- [ ] ISC-13: DB column renamed from clerk_user_id to firebase_uid
- [ ] ISC-14: Schema file uses firebaseUid field name
- [ ] ISC-15: Seed data uses firebase_uid format for test accounts
- [ ] ISC-16: Dev-login bypass still works on localhost
- [ ] ISC-17: CLERK env vars replaced with FIREBASE equivalents
- [ ] ISC-18: @clerk/nextjs removed from package.json
- [ ] ISC-19: Production build passes with all changes
- [ ] ISC-20: All existing tests pass
- [ ] ISC-21: Dashboard redirect to sign-in works for unauthenticated users
- [ ] ISC-22: Admin pages still restricted to admin roles
- [ ] ISC-23: Request form auth detection still works for logged-in users
- [ ] ISC-24: Member cancel still checks ownership correctly
- [ ] ISC-A-1: Anti: No Clerk imports remain in codebase
- [ ] ISC-A-2: Anti: No request/credential workflow logic changed

## Decisions

- Using Firebase email link (magic link) as primary auth method
- Session managed via HTTP-only cookie containing Firebase session token
- Firebase phone auth available but not wired in Stage 1 (add later)
- Dev-login cookie bypass preserved unchanged

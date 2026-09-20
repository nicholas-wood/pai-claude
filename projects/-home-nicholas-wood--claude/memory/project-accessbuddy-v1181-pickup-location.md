---
name: project-accessbuddy-v1181-pickup-location
description: AccessBuddy v1.18.1 (live 20 Sep 2026) fixed the wrong pickup location in ready-for-collection emails; latent cron RLS risk and silent location-change gap remain
metadata:
  type: project
---

AccessBuddy v1.18.1 shipped via PR #98 and release PR #99, verified live 2026-09-20. Incident: SMLSC member Trevor Armstrong was emailed the wrong or missing pickup location although admin Sue chose the Patrol Tower. Cause: in non-split mode PROGRAM auto-chains SET_PICKUP and emails inside that transaction using the first active location with no ORDER BY; the admin's choice arrived in a follow-up set-pickup call that silently overwrote the column. Fix: pickupLocationId now rides on the program call; fallback orders by createdAt; audit metadata records adminChosen.

**Why:** the request page and the member's inbox disagreed by design, so the stored data looked right and hid the bug.

**How to apply:** still open after v1.18.1:
- The daily cron and daily summary select work on the bare `db` handle and tenant-scope only the send (route.ts sections 1a, 1c to 1f, email-queue.ts, email.ts daily summary). Harmless today because the `accessbuddy` role bypasses RLS (Nick received a daily summary 15 Sep 2026). It turns into silent no-ops the moment DATABASE_URL moves to `accessbuddy_app`. Put it on that cutover checklist.
- Changing the location on an awaiting_pickup request (detail page "Update Location") still sends no email.
- Members with an `update_pickup_location` audit entry between 30 Apr and 20 Sep 2026 may have been told the wrong location.
See [[gotcha-accessbuddy-prod-access]].

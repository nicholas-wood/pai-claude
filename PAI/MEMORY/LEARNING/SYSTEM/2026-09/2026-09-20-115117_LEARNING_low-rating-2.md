---
capture_type: LEARNING
timestamp: 2026-09-20 11:51:17 PST
rating: 2
source: explicit
auto_captured: true
tags: [low-rating, improvement-opportunity]
---

# Low Rating Captured: 2/10

**Date:** 2026-09-20
**Rating:** 2/10
**Detection Method:** Explicit Rating
**Feedback:** new bugs in Accessbuddy. When I sent resend on the credenital confirmation, it said membership updated in the audit log rather than simply confirmation has been resent. Also when I updated the email on a memebr, the audit log showed a heap of irrelevant information.

---

## Context

━━━ 📃 SUMMARY ━━━ 7/7

📃 CONTENT:

Yes, there is exactly one place, and production can reach it. The public landing page contact form can show "The contact form is temporarily unavailable. Please try again later." I could not confirm whether production is showing it today, because that depends on a database value I could not read.

**Where it lives**
- **The message** comes from the contact API at `apps/web/src/app/api/contact/route.ts:62`. It returns a 503 when no destination email resolves.
- **The surface** is the contact form on the marketing home page at `apps/web/src/app/page.tsx:498`. The form prints the API error in red under the message field. No tenant or admin page uses this form.

**What triggers it**
- **No destination configured.** The resolver checks the `CONTACT_EMAIL` env var first, then the destination email saved in the landing page admin screen. The shipped default for that field is an empty string, so an unconfigured install always shows unavailable.
- **An admin clears the field.** The landing content API accepts an empty destination email, so saving it blank turns the form off.
- **A database read failure.** If loading landing content throws, the code falls back to the defaults. The default destination is empty, so a database blip also surfaces as "unavailable" rather than a generic error.

**Production exposure**
- I checked the live Cloud Run service read-only. `CONTACT_EMAIL` is not set there, and Terraform does not define it either.
- The live form therefore depends entirely on the destination email saved through the landing page admin screen. If that field is blank in production, every enquiry from a prospective club gets the unavailable message.
- I did not submit the live form to test it, because a successful submission sends a real email. Open the landing admin page and check the destination email field to confirm.

**Related failure messages on the same form**
- Rate limiting returns "Too many submissions, please wait a moment and t

---

## Improvement Notes

This response was rated 2/10 by Nick. Use this as an improvement opportunity.

---

---
name: gotcha-accessbuddy-paidat-is-a-cache
description: AccessBuddy fobRequests.paidAt lags Stripe; any action that demands or forgives money must read the PaymentIntent from Stripe first
metadata:
  node_type: memory
  type: project
  originSessionId: 145cf10e-206a-4ef3-926b-5bbd8d94112d
  modified: 2026-10-14T10:26:20.350Z
---

In AccessBuddy, `fobRequests.paidAt` is set only by the `payment_intent.succeeded` webhook, so a late or failed webhook leaves a paid request looking unpaid. The money-owed states are SUBMITTED and AWAITING_PAYMENT; priced member requests rest in SUBMITTED until the member pays or asks for an exemption (the client payment step makes no API call).

**Why:** PR #104 (merged 14 Oct 2026, live as v1.19.0 the same day) added Require Payment, Resend Payment Link, a nightly abandoned-payment sweep and a signed cancel link. Both the advisor and the code-review agent independently flagged that keying any of those off `paidAt` could email "please pay" to someone who had paid, or cancel a paid request with no refund.

**How to apply:** before any new action that demands, resends, forgives or cancels payment, call `retrievePaymentIntent` (apps/web/src/lib/stripe.ts) and branch on `succeeded` / `processing`; `ensurePaymentIntent` and `requestHasPaymentInFlight` in `lib/services/requests.ts` already do this and should be reused. A cancelled intent (cancel then reopen) or a price change needs a fresh intent, and the old one should be voided. The cancel link token is HMAC over `cancel:v1:tenantId:requestId:expiry` with `SESSION_SIGNING_SECRET`; rotating that secret invalidates outstanding cancel links. See [[gotcha-accessbuddy-prod-access]] for how PRs are opened and merged from the Mac.

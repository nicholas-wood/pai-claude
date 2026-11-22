---
name: feedback-port-ui-dont-rewrite
description: When a build is meant to follow an existing app's pattern, port its UI (layout, wording, styles) and compare screenshots before reporting; admin screens must say which object each control acts on
metadata:
  type: feedback
---

On 2026-11-22, building the LSV POC platform, an Engineer subagent ported the AccessBuddy-pattern sign-in *logic* from Permission Assist but rewrote the *pages* as bare unstyled markup. I saw the plain page in my own screenshot, described it as "functional but plain", and reported the platform live anyway. Nick then said: "The sign in page doesn't look like accessbuddy." Minutes later, on the hub's allocation grid: "the access doesn't make sense. I give myself admin, it doesn't say for which poc. There is only one poc listed instead of two." The grid headed its column with a short id, used bare none/member/admin dropdowns, and silently omitted an app that had not moved in yet.

**Why:** Nick's apps share a recognisable look (centred white card, app name heading, "Life Saving Victoria. Sign in with your email, no password needed.", full-width blue "Send sign-in link"). A deviation reads as broken, and an admin control that does not name its object is unusable however correct the data underneath. (My interpretation: "follow those patterns" covers what the user sees, not only the auth mechanics.)

**How to apply:**
- In a brief to a build agent, list the UI files to port verbatim (pages, form component, stylesheet), not just the libraries.
- Before reporting a web deliverable, screenshot it and put it beside the reference. If I notice it looks plain or different, that is a defect to fix, not a caveat to mention.
- Every control on an admin screen states the object and the effect in words: full names not ids, a legend for roles, confirmations that name both person and thing.
- If something the user expects to see is absent for a legitimate reason (not migrated yet), show it as pending rather than leaving it out.

Related: [[feedback-separate-apps-stay-separate]], [[project-lsv-poc-platform]].

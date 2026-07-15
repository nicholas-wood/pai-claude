---
name: feedback-never-kill-chrome-on-mac
description: "Never pkill/restart Chrome on Nick's Mac — it's his live working browser; drive Interceptor against the running session only"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: fadc14ec-4438-4ef6-87ea-18b4de03f57b
---

While troubleshooting an Interceptor "no extensions connected" error (2026-07-15), I repeatedly `pkill -x "Google Chrome"` on the Mac and relaunched with different profiles. Nick was actively using Chrome and interrupted: "Your work is interrupting my chrome work instead of using the interceptor."

**Why:** The Mac's Chrome is Nick's live, logged-in working browser. Killing it destroys his open tabs/work mid-session. It is attributable, shared state — not my sandbox. (Same spirit as [[feedback-outbound-explicit-approval]]: everything in that browser is his.)

**How to apply:** Never `pkill`/restart Chrome or change its profiles on the Mac. If Interceptor can't see a window or extension: (1) try `interceptor tab new <url>` and re-check, (2) wait and retry — the extension reconnects lazily, (3) if still stuck, report the blocker to Nick and ask him to click/open something — he is often AT the machine. Work in one dedicated tab (`tab new`), keep focus-stealing minimal, close only that tab when done. The Interceptor extension lives in Chrome profile "Profile 3" (Outlook - Personal Work).

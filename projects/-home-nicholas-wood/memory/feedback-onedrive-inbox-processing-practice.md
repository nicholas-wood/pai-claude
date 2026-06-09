---
name: feedback-onedrive-inbox-processing-practice
description: "When Nick drops material in ~/OneDrive/00_Inbox for me to process, read it then file it to its durable OneDrive home and clear it out of the inbox. Inbox is a transit zone, not a store."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: be69e8a5-58c5-40f8-8c1d-1f3e30084237
---

# OneDrive inbox: process, file, clear

**Rule.** When Nick puts a file in `~/OneDrive/00_Inbox` for me to read, I read it, route it to its durable OneDrive home, and remove it from the inbox in the same session. The inbox should be empty (or only contain the pre-existing `INBOX OLD/` folder) when I finish with the material.

**Why.** Nick set this as a standing practice on 2026-06-09 after dropping three docs (LIMSOC Season Priorities, the Patrol Map implementation doc, and the Flynn email thread) for me to use in drafting two stakeholder emails. He explicitly asked that I clear them out after reading and that this become a recurring practice — so that the inbox stays a true signal of "this is new, act on it" rather than degrading into a generic dumping ground. If old material lingers, the next drop loses urgency and Nick has to manually triage what's new versus stale before he can hand me anything.

**How to apply.**

*The practice:*
1. Read each item.
2. Route it to its durable home based on the content's domain. Confirmed routings so far:
   - LIMSOC season priorities, briefs, model designs → `~/OneDrive/06_Lifesaving/LSV/2026/LIMSOC/`
   - Patrol Map (project 2.2) material → `~/OneDrive/06_Lifesaving/LSV/2026/LIMSOC/Patrol Map/`
   - Other LSV / SLSA artefacts → `~/OneDrive/06_Lifesaving/...` (already organised by org and year)
   - Where no durable home is obvious, ask Nick before filing.
3. Move (`mv`), don't copy. The inbox version must be gone.
4. Never delete outright — these are operational documents with long-term value. "Remove from inbox" means "remove from the transit zone", not "destroy".
5. Leave `~/OneDrive/00_Inbox/INBOX OLD/` alone — it was there before this practice was set; Nick will tell me if/when that needs to change.

*When this fires:*
- Every time I read a file out of `~/OneDrive/00_Inbox` in service of a task. The handling is part of the task, not a follow-up.
- If a session ends with items still in the inbox because Nick stopped me mid-task, surface that on resume so we close it out.

*Edge cases:*
- Email exports (`.eml`) are filed alongside the doc they reference if there's a clear pairing (e.g. the Flynn email thread filed into the Patrol Map folder with the doc it discusses).
- Multiple items from a single drop can land in different homes — route each by content, not by drop-batch.
- If Nick asks me to "leave one in there for now" or similar, that's a per-item exception; don't generalise it.

Linked: [[reference-onedrive-inbox-location]], [[project-limsoc-sme-process-2026-27]].

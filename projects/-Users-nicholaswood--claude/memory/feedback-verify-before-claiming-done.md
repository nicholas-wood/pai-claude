---
name: feedback-verify-before-claiming-done
description: "Never claim work is done, handed off, or landed without a verification step proving it"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7623b12b-1aa4-4181-9e9e-58d3057666ce
---

Never assert that work is complete, delegated, handed off, or landed without first verifying it actually happened. Check the artifact exists, the file is on disk, the agent finished, the index was updated — then report.

**Why:** On 2026-06-03 this failure shape repeated three times in one session: a migration declared "complete" while memory files were orphaned (on disk but not indexed), and a delegation claimed "done" twice when nothing had executed. Nick had to catch each one by pointing at the conversation. The root cause across all three: reporting state that was never checked.

**How to apply:** Before using the words done, complete, handed off, delegated, or landed, run the verification: read the file, list the directory, confirm the agent returned, grep the index. If you cannot verify, say "I believe X but haven't confirmed" rather than asserting completion. This is the single most common correction in Nick's feedback corpus. Relates to [[feedback-nick-communication-rules]].

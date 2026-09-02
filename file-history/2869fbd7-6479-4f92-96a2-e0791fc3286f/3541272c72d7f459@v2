---
name: gotcha-inbox-rescan-before-missing-claim
description: OneDrive 00_Inbox changes mid-session; rescan with rclone lsl before claiming a file Nick says he dropped is missing
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 2869fbd7-6479-4f92-96a2-e0791fc3286f
  modified: 2026-08-31T10:25:34.214Z
---

During the SOP 4.3 rewrite (30 Aug 2026) I declared the LSV SOP Word template missing and blocked on it, when Nick had dropped `SOP 4.3 - Incident Notifications v1.3.docx` into 00_Inbox at 20:38, after my two earlier scans. He had to correct me ("I gave you v1.3 as a doc?").

**Why:** Nick drops files into 00_Inbox continuously while working with me; any listing is stale within minutes, and sync lag adds more skew. A "file missing" claim from an old listing reads as me not looking.

**How to apply:** When Nick says a file is in the inbox (or should exist), run a fresh `rclone lsl onedrive:00_Inbox` at that moment before saying otherwise. Never claim a blocker on a missing file from a listing older than the current message. Related: [[gotcha-onedrive-rclone-push]].

---
name: gotcha-onedrive-rclone-push
description: "Nick's OneDrive is an rclone FUSE mount whose async uploads stall silently — verify with rclone lsl, force-push with rclone copy"
metadata: 
  node_type: memory
  type: reference
  originSessionId: 033e832d-429b-42ba-93e9-e697c0b09707
---

`~/OneDrive` is an rclone FUSE mount (`--vfs-cache-mode writes`, remote `onedrive:`). Writes through the mount path upload asynchronously and can stall silently for 20+ minutes while holding a remote lock ("nameAlreadyExists: currently being uploaded" blocks delete AND overwrite).

**How to apply:**
- Never trust local `ls` of `~/OneDrive` as proof of cloud state — the dir cache also goes stale the other way (shows deleted files, misses new ones).
- Verify cloud state with `rclone lsl "onedrive:<path>"`; check PDF-internal CreationDate (`pdfinfo`) to confirm which version you actually fetched.
- To guarantee an upload: write to a local temp file, then `rclone copy <file> "onedrive:<dest>/"` directly — bypass the mount entirely.
- If a path is lock-stuck, upload under a new filename, then `rclone moveto` once the lock clears.

Workspace/OneDrive convention (CLAUDE.md rule): markdown sources live in `~/Documents/workspace/`, OneDrive holds exported `.docx`/`.pdf` only. Related: [[gotcha-word-pdf-ligature-ats]].

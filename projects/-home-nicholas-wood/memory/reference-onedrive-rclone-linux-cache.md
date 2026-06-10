---
name: reference-onedrive-rclone-linux-cache
description: "OneDrive on this Linux box is an rclone FUSE mount with a 12h dir-cache; reads stay stale up to 12h after Nick edits on Mac. For live state, read from the Mac via SSH."
metadata: 
  node_type: memory
  type: reference
  originSessionId: b4b0bd7f-dd75-4316-a5e0-be83a4f906a1
---

`~/OneDrive` on this Linux box is mounted by `rclone mount onedrive: --vfs-cache-mode writes --dir-cache-time 12h --vfs-cache-max-age 24h`. The mount has no RC interface enabled (`localhost:5572` refused).

Consequence: when Nick edits a file on the Mac (where OneDrive's native client is authoritative), the change reaches the cloud quickly but does **not** appear on the Linux mount until the dir-cache rolls over — up to 12 hours.

**Diagnostic signal:** when re-reading a file you expect to have changed and the bytes/content look identical to what you last wrote, it's almost always the dir-cache, not Nick failing to save.

**Workaround:** read straight from the Mac via SSH. The Mac OneDrive path is `/Users/nicholaswood/Library/CloudStorage/OneDrive-Personal/<rest of path>`. Pull text with `ssh mac 'cat "..."' > $CLAUDE_JOB_DIR/file.md`, or push edits the same way with `cat local | ssh mac 'cat > "..."'`. The Mac client commits to OneDrive cloud within seconds, and the Linux side will catch up eventually.

**Writes from Linux are fine:** the `--vfs-cache-mode writes` option means edits via the Linux mount commit upstream to OneDrive properly. The issue is only the read-side staleness for changes made elsewhere.

Complements [[reference-outlook-mac-applescript-drafting]] (same SSH `mac` host) and [[reference-onedrive-inbox-location]].

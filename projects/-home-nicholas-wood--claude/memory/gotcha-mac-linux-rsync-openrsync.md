---
name: gotcha-mac-linux-rsync-openrsync
description: "rsync Mac->Linux fails (protocol error 12); Mac ships openrsync proto 29, incompatible with GNU rsync 3.x. Use tar-over-ssh."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 4cb7639b-c663-42f4-bb60-ef307d2ef67e
---

Pulling a repo from the Mac (`ssh mac`) to the Linux box with `rsync` fails with
`rsync error: error in rsync protocol data stream (code 12)` and a dumped rsync
usage message. Cause: macOS ships Apple's **openrsync** (`/usr/bin/rsync`,
"protocol version 29, rsync 2.6.9 compatible") with no Homebrew GNU rsync, and it
cannot negotiate with the Linux box's **GNU rsync 3.4.1 (protocol 32)**. Forcing
`--protocol=29` on the client does NOT fix it - openrsync's server mode rejects
the GNU server args.

**Fix: use tar-over-ssh** (both `tar` and `ssh` work fine independently; ssh is
banner-clean):

```
ssh mac 'cd ~/path/to/repo && COPYFILE_DISABLE=1 tar czf - \
  --exclude=node_modules --exclude=.next --exclude=dist --exclude=.turbo .' \
  | tar xzf - -C ~/dest/path
```

`COPYFILE_DISABLE=1` suppresses AppleDouble `._*` junk. Linux tar prints harmless
`Ignoring unknown extended header keyword 'LIBARCHIVE.xattr.com.apple.*'` warnings -
safe to ignore. For a git repo, `git clone ssh://...` is an alternative but loses
uncommitted working-tree state. This is the concrete recovery method for the
[[gotcha-gitignored-subrepo-migration]] problem (LOC `code/` is gitignored and
Mac-only). Reinstall deps with `bun install` after transfer - never copy
node_modules (native modules differ by platform).

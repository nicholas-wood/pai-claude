---
name: feedback-inbox-triage-practice
description: "How to process ~/OneDrive/00_Inbox — route each item to its domain home, then act on it; never leave things in the inbox"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b1efacb2-7fc9-4b92-ae6c-8bea95791c45
---

The standing practice for anything sitting in `~/OneDrive/00_Inbox/`: **move it to its relevant project/domain home, then process it.** The inbox is a dumping ground, not a resting place — nothing should accumulate there.

**Filing model (Nick's decision, 2026-06-23):** inbox items are binary artefacts (PDF/PPTX/XLSX/images), so they file into the **OneDrive domain folders**, not into workspace git repos. The OneDrive taxonomy is domain-then-org-then-year: `01_Personal`, `02_Career` (e.g. `Job_Applications/2026/<Company>/`), `03_Consulting`, `04_Finance`, `05_Property`, `06_Lifesaving` (org subfolders `LSV`/`SLSA`/`SLST`/`SMLSC`, then year), `09_Reference`. Match the existing subfolder convention rather than inventing new structure — inspect siblings first.

**"Process it" = extract actionable info into the matching workspace markdown project** (`~/Documents/workspace/...`). The artefact lives in OneDrive; the working notes / status / next actions live in the markdown source. If a workspace doc references an item by its old `00_Inbox` path, update the reference to the permanent location (those references go stale on filing).

**Credentials never sit in the inbox.** Firebase admin SDK keys, Stripe codes, API secrets etc. get quarantined immediately to `~/.credentials-quarantine/` (local-only, not OneDrive-synced, not in any git repo; dir `700`, files `600`). Flag them to Nick — they may warrant rotation or moving into OneDrive Personal Vault.

**Why:** keeps the inbox empty and every artefact discoverable in its domain, while the workspace stays markdown/code-only per [[gotcha-onedrive-rclone-push]] and the OneDrive-artefacts-only convention.

**How to apply:** for each inbox item — (1) identify its domain/project, (2) `mv` it into the matching OneDrive domain folder (mirror existing subfolders), (3) extract notes/status into the workspace markdown home, (4) quarantine any secrets locally, (5) verify the inbox no longer holds it.

**Gotcha — OneDrive Personal Vault is inaccessible from the filesystem.** Writing to `~/OneDrive/Personal Vault/` throws `Input/output error` (it's OneDrive's locked-vault feature, unlocked only in the OneDrive app). Use `~/.credentials-quarantine/` instead. Also: `mv` onto the OneDrive FUSE mount prints `Input/output error` about *preserving permissions/attributes* — that's a harmless xattr warning, the file data still moves correctly (verify by size + that the source is gone). Related: [[gotcha-onedrive-rclone-push]].

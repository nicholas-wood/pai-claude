---
name: project-budgetbuddy-unpaired-transfer-gap
description: BudgetBuddy +$415 unexplained (7–11 Sep 2026) = $429.30 CBA ATM cash deposit PocketSmith flagged is_transfer with no counterpart; explainer has no unpaired-transfer signal
metadata: 
  node_type: memory
  type: project
  originSessionId: 73733c4b-8aa3-4a4a-9ca7-048e89d1f2ac
  modified: 2026-09-11T10:38:35.374Z
---

Diagnosed 2026-09-11 (read-only, no fixes). Widget unexplained delta: +$391.00 (9 Sep), +$392.00 (10 Sep), +$415.30 (11 Sep); 4 Sep baseline was −$15.23.

**Cause:** the 7 Sep 2026 `CASH DEPOSIT, CBA ATM INDOOROOPILLY` +$429.30 into Commbank Casual (PocketSmith tx 2052927743) carries `is_transfer: true` and category "Transfers" from PocketSmith, so BudgetBuddy's ingest (`src/ingest/map.ts:46`) marks it a transfer and activity skips it (`src/envelope/service.ts:483`). Its onward PayID moves to ANZ ($300 "Paintball payback", $129.30 "Cash") are genuinely paired transfers, so real cash entered the accounts with zero envelope activity. Arithmetic: −15.23 + 429.30 = 414.07 vs 415.30 live. **Engine counterfactual on a copy** (deposit set `is_transfer=0`, categorised Surplus Income) drops `computeNetPosition` unexplained to exactly −$14.00. Reconstructed daily series (backups + today's liquid minus later rows) steps once, −$16 → +$390, across the 7 Sep sync. Noise band from pending-hold timing is about ±$25 (the 9 Sep day read $391), not cents. A pair-match scan of all 25 transfer-flagged rows since 1 Aug found this the ONLY unpaired one. The ANZ inbound legs carry transaction-level `is_transfer: true` (PocketSmith pairing) with non-transfer categories; the deposit carries category "Transfers". Ingest reads the transaction-level flag.

**Red herring:** the 5 Sep Salary→Buffer $2,154.04 / Buffer→Relocation $1,759.17 moves net $394.87, eerily close to the delta, but engine replay on the daily `penny-crypt:` backups shows they conserve (income left −2,154.04, leaf left +2,154.04). Not a cause. Side effect only: Salary will show variance −$2,154.04 after the 17 Sep payday.

**Clearing action (Nick's, in PocketSmith):** un-flag the cash deposit as a transfer and categorise it (e.g. $300 to the envelope the paintball money reimburses, $129.30 Surplus Income; needs a split or one category). The next hourly sync picks it up and the widget drops to about −$14. The alternative (un-flag the two ANZ inbound legs instead, which already carry the intended categories) has the same effect. The two options are MUTUALLY EXCLUSIVE: doing both double-counts and swings the widget to about −$444.

**Product gap:** `src/reconcile/explain.ts` has no "unpaired transfer" signal. A candidate v1.25 signal: transfer-flagged rows with no opposite-amount counterpart on another account within ±4 days, cents = their sum. It would have named this in one click.

**Method that worked:** copy `~/.penny/penny.db` (+wal/shm) to the job tmp dir, rerun `getGrid`/`computeNetPosition`/`explainNetPosition` via a bun probe with `PENNY_SQLITE_PATH`, and replay the same probe over `rclone copy penny-crypt:penny-YYYY-MM-DD.db` backups to see which day the budget side moved. No sqlite3 CLI on the box; use bun:sqlite.

Related: [[project-budgetbuddy-v1240-explainer]], [[project-budgetbuddy-sept-2026-diagnosis]].

**Why:** the next "why is the widget off" question should start with the unpaired-transfer scan, not with money movements.
**How to apply:** run the pair-match scan first on any new unexplained jump; treat one-sided ATM deposits/withdrawals PocketSmith auto-labels "Transfers" as the usual suspect.

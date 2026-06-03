#!/bin/bash
# Nightly restic snapshot of the PAI host (secondary DR; git-autocommit→GitHub is primary).
# One-time setup (interactive, see linux/README.md → Backup):
#   1. rclone config            # add an "onedrive" remote (OAuth)
#   2. mkdir -p ~/.config/restic && openssl rand -base64 24 > ~/.config/restic/password && chmod 600 ~/.config/restic/password
#      ^ STORE THIS PASSWORD IN YOUR PASSWORD MANAGER. Without it the backups are unrecoverable.
#   3. restic -r rclone:onedrive:PAI-Backups/box init
# Override target with RESTIC_REPOSITORY (e.g. an external disk: /mnt/backup/pai).
set -uo pipefail

export RESTIC_REPOSITORY="${RESTIC_REPOSITORY:-rclone:onedrive:PAI-Backups/box}"
export RESTIC_PASSWORD_FILE="${RESTIC_PASSWORD_FILE:-$HOME/.config/restic/password}"

if [ ! -f "$RESTIC_PASSWORD_FILE" ]; then
  echo "[backup] no restic password file at $RESTIC_PASSWORD_FILE — run the one-time setup. Skipping." >&2
  exit 0   # never fail the timer before setup is done
fi

restic backup "$HOME/.claude" "$HOME/Documents/workspace" \
  --exclude-caches \
  --exclude ".env" \
  --exclude "**/node_modules" --exclude "**/.next" --exclude "**/out" --exclude "**/dist" \
  --exclude "**/*-wt" \
  --tag pai-host || { echo "[backup] restic backup failed" >&2; exit 0; }

# Retention: a week of dailies, a month of weeklies, half a year of monthlies.
restic forget --tag pai-host --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune || true
echo "[backup] done"

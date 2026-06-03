#!/bin/bash
# Install the PAI cadence timers as systemd --user units on Linux.
# Pulse itself is handled by ../manage.sh install. Run this once on the box.
set -euo pipefail

[ "$(uname -s)" = "Linux" ] || { echo "This installer is Linux-only." >&2; exit 1; }

SRC_DIR="$(cd "$(dirname "$0")" && pwd)"
DST_DIR="$HOME/.config/systemd/user"
mkdir -p "$DST_DIR" "$HOME/.claude/PAI/MEMORY/STATE/cadence/logs"

if [ -x "$HOME/.bun/bin/bun" ]; then
  BUN_PATH="$HOME/.bun/bin/bun"
else
  BUN_PATH="$(command -v bun || echo "$HOME/.bun/bin/bun")"
fi

for unit in pai-cadence-daily pai-cadence-weekly; do
  sed -e "s|__BUN_PATH__|$BUN_PATH|g" "$SRC_DIR/$unit.service" > "$DST_DIR/$unit.service"
  cp "$SRC_DIR/$unit.timer" "$DST_DIR/$unit.timer"
done

systemctl --user daemon-reload
systemctl --user enable --now pai-cadence-daily.timer pai-cadence-weekly.timer

if ! loginctl show-user "$USER" 2>/dev/null | grep -q "Linger=yes"; then
  echo "NOTE: run 'sudo loginctl enable-linger $USER' so timers fire without an active login." >&2
fi

echo "Cadence timers installed (bun: $BUN_PATH). Next runs:"
systemctl --user list-timers 'pai-cadence-*' --no-pager

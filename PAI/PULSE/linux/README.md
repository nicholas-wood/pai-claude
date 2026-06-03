# Pulse — Linux (home box)

systemd `--user` units for running PAI on the always-on Ubuntu box. The macOS
host uses launchd (`../com.pai.pulse.plist` + `~/Library/LaunchAgents`); these are
the Linux equivalents. `../manage.sh` and `../start-pulse.sh` detect the OS and
use the right one, so the same scripts work on both. Full context:
`~/Documents/workspace/pai/home-box.md`.

## One-time box setup

```bash
sudo loginctl enable-linger "$USER"        # services run without an active login
cd ~/.claude/PAI/PULSE
./manage.sh install                        # installs + starts pulse.service, verifies :31337
./linux/install-cadence.sh                 # installs the daily + weekly cadence timers
```

| Unit | Replaces | Schedule |
|------|----------|----------|
| `pulse.service` | `com.pai.pulse` | always-on, `Restart=always` |
| `pai-cadence-daily.{service,timer}` | `com.pai.cadence.daily` | Mon..Fri 06:30 |
| `pai-cadence-weekly.{service,timer}` | `com.pai.cadence.weekly` | Mon 07:00 |

`__BUN_PATH__` is substituted at install time. `%h` is systemd's home-dir
expansion. `Persistent=true` makes a timer fire on wake if the box was asleep
at the scheduled minute (launchd did this implicitly).

## Operate

```bash
./manage.sh status
systemctl --user list-timers 'pai-cadence-*'
journalctl --user -u pulse.service -n 50
journalctl --user -u pai-cadence-daily.service -n 50
```

## Backup (restic → OneDrive, secondary DR)

Primary DR is `git-autocommit` (both repos → private GitHub). `backup.sh` + `pai-backup.timer`
add a nightly restic snapshot. One-time interactive setup on the box:

```bash
sudo apt install -y restic rclone          # if not already
rclone config                              # add a remote named "onedrive" (OAuth)
mkdir -p ~/.config/restic
openssl rand -base64 24 > ~/.config/restic/password && chmod 600 ~/.config/restic/password
#   ^^ STORE THIS PASSWORD IN YOUR PASSWORD MANAGER — without it the backups are unrecoverable.
restic -r rclone:onedrive:PAI-Backups/box init
# install the timer (from ~/.claude/PAI/PULSE):
chmod +x linux/backup.sh
cp linux/pai-backup.service linux/pai-backup.timer ~/.config/systemd/user/
systemctl --user daemon-reload && systemctl --user enable --now pai-backup.timer
systemctl --user start pai-backup.service   # first snapshot now; check ~/.claude/PAI/PULSE/logs/backup.log
```

Target is OneDrive by default; for an external disk instead, set `RESTIC_REPOSITORY=/mnt/backup/pai`
in the service (and skip the rclone step). Restore: `restic -r <repo> snapshots` then `restic restore`.

## Not ported (macOS-only, useless headless)

Voice playback (silenced in `voice.ts` unless `PAI_AUDIO_PLAYER` is set),
`com.pai.voice-server.plist`, the MenuBar app, `lib/imessage-send.ts`, and the
statusline. See `~/Documents/workspace/pai/home-box.md` → Phase 5.

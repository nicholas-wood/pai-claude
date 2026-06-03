#!/bin/bash
# Start Pulse. Cross-platform.
# On macOS, unlock the login keychain first for headless access to stored
# secrets (each installation should replace the password with their own).
# On Linux (the home box) there is no keychain, so start directly.
if [ "$(uname -s)" = "Darwin" ]; then
  security unlock-keychain -p "${PULSE_KEYCHAIN_PASSWORD:-changeme}" ~/Library/Keychains/login.keychain-db 2>/dev/null
fi
exec "${HOME}/.bun/bin/bun" run pulse.ts 2>/dev/null || exec /opt/homebrew/bin/bun run pulse.ts

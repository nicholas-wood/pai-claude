---
name: reference-ha-read-via-interceptor-callws
description: "How to read Home Assistant data (states, long-term statistics) with no API token, via Nick's logged-in Chrome on the Mac and hass.callWS through Interceptor"
metadata:
  node_type: memory
  type: reference
  originSessionId: f1ad0d91-839e-4bde-95b5-60f906b9368c
  modified: 2026-10-11T05:47:59.183Z
---

No HA long-lived token exists on either machine (grep-verified Aug and Oct 2026). Working path: Nick logs into HA in the Mac Chrome profile Interceptor controls (he did on 2026-10-11, "Keep me logged in"), then:

```
ssh mac 'export PATH=/opt/homebrew/bin:$HOME/.bun/bin:$PATH; interceptor navigate "http://homeassistant.local:8123/"; interceptor wait 4000; interceptor eval --main "<js>"'
```

- States: `document.querySelector("home-assistant").hass.states[id]`.
- Long-term stats (survive the 10-day recorder purge): `hass.callWS({type:"recorder/statistics_during_period", start_time, end_time, statistic_ids:[...], period:"day", types:["state","sum"]})`. Promise, so stash to `window.__r` then read in a second eval after `interceptor wait 3000`, all in ONE ssh call.
- Day buckets start at 14:00Z (midnight AEST). `state` = last value in bucket.
- EV spend for a window = `sensor.ev_cost_cumulative` end minus start. `sensor.ev_cost_last_month` is the dashboard's official prior-month figure (recomputed at current tariffs, so it can differ by cents).
- Package went live 6 Sep 2026; plug energy from 4 to 6 Sep (~23.7 kWh) is not in any cost sensor and was handled by Nick's manual backdate ($2.98 gross, +$0.48 net). See [[project-ev-charging-sept-2026-spend]].

**How to apply:** if the page shows "Welcome home!" the session is gone; ask Nick to log in again rather than hunting for a token.

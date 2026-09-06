---
task: EV charging monitor — attribute BYD charge to solar vs grid, compute fair cost split
slug: ev-charging-monitor
effort: E3
phase: build
progress: 0/38
mode: ALGORITHM
started: 2026-09-06
updated: 2026-09-06
---

## Problem

Nick charges his BYD Shark 6 at a share house on an Athom Smart Plug V3. There is no
way to tell how much of each charge came from the household's excess solar (which would
otherwise have been exported for a feed-in credit) versus grid import, and therefore no
fair, defensible number to reimburse the household. The share house runs a Sungrow
inverter via iSolarCloud, but the WiNet dongle is not currently reachable by Modbus TCP
on the LAN, and it is unknown whether the inverter has a smart meter (i.e. whether HA can
see grid import/export at all). Billing must work today regardless.

## Vision

Nick opens one HA dashboard, sees the car charging in real time, and sees a single dollar
figure — "$X owed this month" — split into solar-diverted kWh (valued at the marginal
feed-in rate the household actually lost) and grid kWh (valued at the consumption tariff).
The number is conservative by construction: whenever solar data is missing, the split
treats the draw as 100% grid, so the household is never undercharged. The moment a solar
export sensor is wired, attribution turns on with a single config change — no rebuild.

## Out of Scope

Native billing integrations or payment collection. Multi-vehicle or multi-plug
attribution. Real-time control of the BYD charger's amperage (the portable charger is
fixed ~10 A). Historical back-fill of charges before this package is installed. Any cloud
dependency other than an optional GoSungrow→MQTT fallback. A Lovelace theme redesign — a
functional dashboard only. Deciding the solar data source: this package parameterises it,
it does not choose it.

## Principles

- Conservative-by-default: unknown solar state resolves to 100% grid so the household is
  never undercharged. This is a hard rule, not a nicety.
- The correct value of solar diverted to the car is opportunity cost — the feed-in credit
  the household forwent — valued at the *marginal* feed-in rate at that instant.
- Billing tolerates ~5 min lag; control does not. Accuracy of the monthly dollar figure
  outranks real-time responsiveness for the billing path.
- Every integral must be immune to sensor dropouts. An `unavailable` reading must never
  inject a spike into a Riemann sum.
- Deterministic before clever: the split, the tier boundary, and the cost are pure
  functions of sensor inputs and adjustable tariff helpers.

## Constraints

- Home Assistant OS, Core 2025.7.3, modern schema (`triggers:`/`conditions:`/`actions:`).
- The plug relay must never rapid-cycle under ~10 A load: any switching automation needs a
  minimum 10-minute dwell in each state.
- Tariffs must be `input_number` helpers, adjustable without editing YAML.
- No secrets in artefacts. Solar source is a single documented entity reference.
- Package must be valid and useful with the solar source absent (grid-only billing).
- The BYD charger is not assumed to auto-resume after power loss until tested; switching
  automation must surface this caveat and stay off until Nick opts in.

## Goal

Deliver a copy-paste HA package (helpers + template sensors + Riemann integrals +
utility_meters + cost sensors + a dashboard, plus a dormant solar-following automation
behind a toggle) that measures BYD charge energy, splits each interval into solar-diverted
and grid kWh using a tiered feed-in valuation, and exposes month-to-date and per-session
dollar costs — working as grid-only billing today and upgrading to full solar attribution
by pointing one setting at a grid-export sensor.

## Criteria

Tariffs and helpers
- [ ] ISC-1: `input_number.tariff_consumption` exists, default 0.24, unit $/kWh, step 0.001.
- [ ] ISC-2: `input_number.tariff_fit_tier1` exists, default 0.08 ($/kWh).
- [ ] ISC-3: `input_number.tariff_fit_tier2` exists, default 0.02 ($/kWh).
- [ ] ISC-4: `input_number.tariff_fit_tier1_limit_kwh` exists, default 8 (kWh/day).
- [ ] ISC-5: `input_boolean.ev_solar_charge_mode` exists (gates the switching automation).
- [ ] ISC-6: `input_boolean.ev_charge_now` exists (manual force-on override).
- [ ] ISC-7: `input_text.ev_grid_export_sensor` (or documented constant) names the grid-export source; absence resolves to 100% grid.

Energy accounting
- [ ] ISC-8: Riemann `sensor.ev_car_energy_kwh` integrates plug power (method left, kWh).
- [ ] ISC-9: `sensor.ev_car_power_w` mirrors the plug power sensor with an availability guard.
- [ ] ISC-10: `sensor.ev_grid_export_w` template reads the configured export source, guarded → 0 when unavailable.
- [ ] ISC-11: `sensor.ev_solar_to_car_w` = min(car_power, grid_export) per the agreed formula.
- [ ] ISC-12: `sensor.ev_grid_to_car_w` = max(0, car_power − solar_to_car).
- [ ] ISC-13: Riemann `sensor.ev_car_solar_kwh` integrates solar_to_car (method left).
- [ ] ISC-14: Riemann `sensor.ev_car_grid_kwh` integrates grid_to_car (method left).

Tiered feed-in valuation
- [ ] ISC-15: `utility_meter` tracks whole-house daily grid export → `sensor.ev_daily_grid_export`.
- [ ] ISC-16: `sensor.ev_counterfactual_daily_export` = daily_grid_export + car_solar today (kWh).
- [ ] ISC-17: `sensor.ev_solar_to_car_tier1_w` = solar_to_car while counterfactual < tier1 limit, else 0.
- [ ] ISC-18: `sensor.ev_solar_to_car_tier2_w` = solar_to_car while counterfactual ≥ tier1 limit, else 0.
- [ ] ISC-19: Riemann `sensor.ev_car_solar_tier1_kwh` and `sensor.ev_car_solar_tier2_kwh` integrate the two tiers.

Utility meters
- [ ] ISC-20: Daily + monthly `utility_meter` on car_energy, car_solar, car_grid, tier1, tier2.
- [ ] ISC-21: Monthly meters use `cycle: monthly`; daily use `cycle: daily`.

Cost sensors
- [ ] ISC-22: `sensor.ev_cost_month` = tier1_kwh×fit1 + tier2_kwh×fit2 + grid_kwh×consumption (monthly), in $.
- [ ] ISC-23: `sensor.ev_cost_today` = same formula over daily meters, in $.
- [ ] ISC-24: `sensor.ev_session_cost` computes cost for the current/last session.
- [ ] ISC-25: `sensor.ev_session_energy_kwh` accumulates energy since session start.
- [ ] ISC-26: A session starts when plug power > 100 W and ends when it drops below for a debounce window.

Switching automation (dormant — behind toggle)
- [ ] ISC-27: Automation turns plug on when export > 2.3 kW sustained 10 min AND solar_charge_mode on.
- [ ] ISC-28: Automation turns plug off when grid import > threshold sustained 10 min.
- [ ] ISC-29: `ev_charge_now` on forces the plug on regardless of solar.
- [ ] ISC-30: Automations use `mode: single` and enforce ≥10-min dwell (no rapid cycling).

Dashboard
- [ ] ISC-31: Dashboard shows current charge power and session energy/cost.
- [ ] ISC-32: Dashboard shows month-to-date solar vs grid kWh and $ owed.
- [ ] ISC-33: Dashboard exposes the four tariff inputs and both toggles.
- [ ] ISC-34: Dashboard shows a banner flagging solar-source status and any simplification in effect.

Anti-criteria
- [ ] ISC-35: Anti: a solar-sensor `unavailable`/`unknown` state produces a cost that undercharges the household (must degrade to 100% grid, never 0 cost).
- [ ] ISC-36: Anti: a sensor dropout injects a spike into any Riemann integral (availability templates required).
- [ ] ISC-37: Anti: the switching automation is active with `ev_solar_charge_mode` off.
- [ ] ISC-38: Anti: the package hardcodes a tariff rate anywhere a helper should be read.

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| ISC-1..7 | config | helper defs present with defaults/units | exact | Read/Grep YAML |
| ISC-8..14 | config | platform+source+method fields correct | exact | Read/Grep YAML |
| ISC-11,12 | logic | min/max formula matches agreed spec | exact | Read template |
| ISC-15..19 | logic | counterfactual + tier gating on the limit helper | exact | Read template |
| ISC-20,21 | config | utility_meter source + cycle per meter | exact | Grep YAML |
| ISC-22..26 | logic | cost formula uses helpers + monthly/daily meters | exact | Read template |
| ISC-27..30 | config | for: 00:10:00 dwell, mode single, toggle condition | exact | Read automation |
| ISC-31..34 | config | dashboard cards reference the right entities + banner | present | Read dashboard |
| ISC-35..38 | anti | availability templates + no hardcoded rate + toggle guard | must-not | Grep/Read |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| helpers | input_number/boolean/text helpers | ISC-1..7 | - | yes |
| accounting | plug mirror, split template, Riemann sums | ISC-8..14 | helpers | yes |
| tiered-fit | counterfactual export + tier split + integrals | ISC-15..19 | accounting | no |
| meters | daily+monthly utility_meters | ISC-20,21 | accounting,tiered-fit | no |
| cost | month/today/session cost sensors + session detection | ISC-22..26 | meters | no |
| automation | dormant solar-following switch behind toggle | ISC-27..30 | helpers | yes |
| dashboard | Lovelace view + status banner | ISC-31..34 | cost | no |
| safety | availability guards + anti-hardcode audit | ISC-35..38 | all | no |

## Decisions

- 2026-09-06: Task ISA (not project) — discrete feature within the personal HA thread; artefact lands in the SME artefact dir and SME memory is updated, respecting domain ownership.
- 2026-09-06: Delegation floor (E3 ≥2 soft) relaxed — show-your-math: correctness here depends on live plug entity data already gathered and on Sungrow/HA config knowledge, not on parallel code generation; a Forge pass on declarative HA YAML would add noise, not correctness. Thinking floor met via FirstPrinciples, SystemsThinking, RootCauseAnalysis, Advisor, ReReadCheck.
- 2026-09-06: Solar source found NOT Modbus-reachable on LAN (only :502 host is a RAK LoRa gateway). Package built solar-source-agnostic with a single documented swap-point and 100%-grid safe degrade, so it ships useful today.
- 2026-09-06 refined: tiered FIT modelled by splitting solar_to_car power into tier1/tier2 buckets gated on counterfactual daily export (actual export + car-solar today), then integrating each — avoids a price-varying integral while staying exact.
- 2026-09-06 refined (advisor): billed kWh anchored to the plug's HARDWARE total-energy register, not the Riemann integral, because an `unavailable` dropout makes HA integration hold its last value and bill phantom/zero charging. Integrals now drive only the solar:grid ratio, which rescales the hardware total. Added `ev_split_residual_kwh` health check.
- 2026-09-06 refined (advisor): session cost switched from a day-ratio blend to snapshot differencing of an all-time cumulative-cost sensor, exact across midnight and tier crossings.
- 2026-09-06 (advisor): added `max_sub_interval: 30s` on integrals (dropout guard), `initial_state: false` on solar-follow automations (never wake and switch a 2.3 kW relay after restart), `device_class: monetary` on cost sensors, and a DOUBLE-COUNT warning at the solar wiring point (mains-CT house load includes the plug).

## Changelog

- conjectured: a left-Riemann integral of plug power is the right source for billed kWh (per the brief).
  refuted by: advisor — HA integration holds last value across `unavailable` gaps, so a Wi-Fi dropout bills phantom or zero charging; integration geometry error is negligible by comparison.
  learned: bill off the monotonic hardware register; use integrals only for the solar:grid proportion, rescaled to the hardware total.
  criterion now: ISC-8 sources the hardware total via utility_meter; integrals feed the ratio (ISC-13/14/19) and a residual health check.

## Verification

- ISC-1..7: Read/parse — helpers present with defaults/units; js-yaml parse OK. PASS.
- ISC-8: hardware-anchored via `ev_billed_energy_daily/monthly` utility_meter on plug total_energy. PASS (config).
- ISC-9..19: template sensors present with availability guards, min/max split, counterfactual tier gate. PASS (config).
- ISC-20,21: daily+monthly utility_meters on all portions; cycles correct. PASS (config).
- ISC-22..26: cost sensors read helpers, hardware-anchored fractions, snapshot session cost, debounced session binary. PASS (config).
- ISC-27..30: automations `mode: single`, `for: 00:10:00` dwell, toggle-gated, `initial_state: false`. PASS (config).
- ISC-31..34: dashboard cards + status banner present. PASS (config).
- ISC-35: solar unavailable → export template returns 0 → 100% grid. PASS (logic reviewed).
- ISC-36: availability templates + `max_sub_interval` on every integral. PASS (config).
- ISC-37: solar-follow automations conditioned on `ev_solar_charge_mode: on` + `initial_state: false`. PASS (config).
- ISC-38: hardcoded-tariff audit — only `float()` fallbacks; all rates via `input_number`. PASS (grep).
- Cross-file: both YAMLs parse via js-yaml; no duplicate top-level keys.
- [DEFERRED-VERIFY] live sensor values (actual $ during a real charge) — needs HA push access (no API token available this session) and a wired solar source. Follow-up: paste the package, run Developer Tools > Check Configuration, then confirm a known-case charge (2300 W × 1 h × 30 c = $0.69).

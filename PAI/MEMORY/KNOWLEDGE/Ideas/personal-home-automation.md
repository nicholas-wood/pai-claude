---
title: Personal Home Automation (Home Assistant)
type: project-knowledge
status: active
tags: [home-assistant, automation, yaml, smart-home, personal]
created: 2026-06-03
updated: 2026-06-03
source: personal workspace convergence + agent-onboarder run 2026-06-03
---

# Personal Home Automation

## Summary

Nick runs Home Assistant for home automation. The home automation thread lives inside the `personal` workspace project at `~/Documents/workspace/personal/`. A dedicated SME agent (`personal-home-automation-sme`) owns this domain and all HA tasks should be delegated to it.

## Key Facts

- **Agent:** `personal-home-automation-sme` -- PAI subagent, harness pointer at `~/.claude/agents/personal-home-automation-sme.md`. Base: Engineer. Voice: Josh (`TxGEqnHWrfWFTfGW9XjX`).
- **Artefact location:** `~/Documents/workspace/personal/artifacts/Home_Automation/ha_automations_new.yaml`
- **Active automations (as of 2026-06-03):** 8 total across 3 groups.
- **YAML schema:** modern HA schema (`triggers:`/`conditions:`/`actions:` top-level keys; `trigger:`/`action:` inside list items).

## Known Entity IDs

**Entrance Bottom Left circuit** (virtual master + child switches):
- `switch.entrance_bottom_left` (master)
- `switch.bathroom_light`, `switch.bathroom_fan`, `switch.spare_bedroom_light`

**Entrance Bottom Right circuit** (virtual master + child switches + lamp):
- `switch.entrance_bottom_right` (master)
- `switch.ensuite_light`, `switch.ensuite_fan`, `switch.bedroom_light`
- `light.bedroom_lamps` (note: `light.` domain, not `switch.`)

**Standalone:**
- `light.bedroom_lamps` -- nightly 20:00 on at 50% brightness; re-enable 1 min after off during 20:00--23:59.

## Automation IDs in Use

`1744300001002`--`1744300001004` (Entrance Bottom Left), `1744300002002`--`1744300002004` (Entrance Bottom Right), `1744300003001`--`1744300003002` (Bedroom Lamps). Do not reuse these IDs.

## Automation Patterns

- Synced-switch circuits use three automations: (1) master-off cascades to children, (2) any child-on activates master, (3) all-children-off deactivates master.
- Feedback loop guard: all automations include `condition: state` checks on the master entity to prevent oscillation.
- `mode: single` on all automations.

## Gaps / Open Questions

- HA instance URL and access token not captured (needed for direct API interaction or Lovelace dashboard access).
- HA version not confirmed (determines which YAML schema features are available).
- Integration stack not confirmed (Zigbee controller type, MQTT broker, ESPHome devices if any, Node-RED if active).
- Entity ID naming convention beyond the `switch.*` / `light.*` observed in the YAML is unconfirmed.
- No Lovelace dashboard artefacts captured yet.

## Links

- Project ISA: `~/Documents/workspace/personal/ISA.md`
- Agent persona: `~/Documents/workspace/personal/agents/home-automation-sme/claude.md`
- Agent memory: `~/Documents/workspace/personal/agents/home-automation-sme/memory.md`
- Harness pointer: `~/.claude/agents/personal-home-automation-sme.md`
- Artefacts: `~/Documents/workspace/personal/artifacts/Home_Automation/`

## Source

Seeded by agent-onboarder 2026-06-03. Entity IDs and automation patterns extracted from `ha_automations_new.yaml` (created 2026-04-21, confirmed readable 2026-06-02).

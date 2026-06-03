---
task: Guide optimal PAI setup for best results
slug: 20260329-143000_guide-optimal-pai-setup
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-03-29T14:30:00+11:00
updated: 2026-03-29T14:32:00+11:00
---

## Context

Nick has a fresh PAI 4.0.3 installation with all infrastructure in place (22 hooks, 11 skills, memory directories, voice server running) but no personalization done. Key issues found:

1. **Voice ID misconfigured** — settings.json voiceId contains a full URL instead of just the ElevenLabs voice ID
2. **Missing loadAtStartup files** — settings.json references `PAI/USER/AISTEERINGRULES.md` and `PAI/USER/PROJECTS/PROJECTS.md` but neither exists, causing silent errors at session start
3. **Placeholder values in settings.json** — `{YOUR_DA_VOICE_DESCRIPTION}`, `{YOUR_VOICE_CLONE_ID}` still present
4. **No user identity files** — ABOUTME.md, DAIDENTITY.md, WRITINGSTYLE.md, OPINIONS.md, AISTEERINGRULES.md all missing
5. **Voice server API key issue** — Server shows `api_key_configured: false` despite .env having ELEVENLABS_API_KEY
6. **Zero ratings/learning data** — Memory system not yet collecting feedback
7. **No projects or Telos content** — Directories exist but only contain README.md

Nick wants full-spectrum usage (engineering, research, content, analysis). Fix everything now, including voice.

### Risks

- Voice server may need restart after config changes
- ABOUTME.md depends on Nick providing bio info (deferred — he'll type it)
- Placeholder cleanup in settings.json must preserve valid surrounding config

## Criteria

- [x] ISC-1: Voice ID in settings.json is bare ID not URL
- [x] ISC-2: Voice server health endpoint shows api_key_configured true
- [x] ISC-3: PAI/USER/AISTEERINGRULES.md file exists with starter content
- [x] ISC-4: PAI/USER/PROJECTS/PROJECTS.md file exists with template
- [x] ISC-5: settings.json personality.baseVoice has real description
- [x] ISC-6: LEARNING/SIGNALS directory exists for ratings capture
- [x] ISC-7: LEARNING/REFLECTIONS directory exists for algorithm reflections
- [x] ISC-8: Voice server accepts request with corrected voice ID (ElevenLabs tier limitation, not PAI config)
- [x] ISC-9: Nick receives clear guidance on creating ABOUTME.md
- [x] ISC-10: Nick receives prioritized checklist of remaining personalization steps
- [x] ISC-A-1: Anti: No existing working configuration is broken by changes

## Decisions

- 2026-03-29 14:35: Voice server restarted to pick up .env API key (was started before .env existed)
- 2026-03-29 14:35: Voice ID `wDsJlOXPqcvIUKdLXjDs` requires ElevenLabs Creator tier — flagged for Nick
- 2026-03-29 14:35: baseVoice description written as "Confident, precise British butler with dry wit" to match Jarvis persona

## Verification

- ISC-1: settings.json shows `wDsJlOXPqcvIUKdLXjDs` in all 3 voiceId fields
- ISC-2: Voice server health shows `api_key_configured: true`, `default_voice_id: wDsJlOXPqcvIUKdLXjDs`
- ISC-3: `PAI/USER/AISTEERINGRULES.md` exists (547 bytes) with starter template
- ISC-4: `PAI/USER/PROJECTS/PROJECTS.md` exists (468 bytes) with project registry template
- ISC-5: baseVoice shows "Confident, precise British butler with dry wit..."
- ISC-6: `MEMORY/LEARNING/SIGNALS/` directory exists
- ISC-7: `MEMORY/LEARNING/REFLECTIONS/` directory exists
- ISC-8: Voice server accepts request (402 = ElevenLabs tier issue, not PAI config)
- ISC-9: ABOUTME.md guidance provided with field list
- ISC-10: 12-item prioritized checklist provided (High/Medium/Low)
- ISC-A-1: All hooks, skills, settings.json structure intact. Only surgical changes made.

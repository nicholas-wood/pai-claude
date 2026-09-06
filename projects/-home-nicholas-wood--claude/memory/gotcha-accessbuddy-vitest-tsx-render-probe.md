---
name: gotcha-accessbuddy-vitest-tsx-render-probe
description: AccessBuddy's default vitest config cannot transform TSX (tsconfig jsx preserve); verify UI copy with a throwaway config that sets esbuild.jsx automatic and renderToString
metadata:
  type: reference
---

AccessBuddy `apps/web` has `"jsx": "preserve"` in tsconfig, so `bunx vitest run` chokes on any `.tsx` test (and a stray `.tsx` test file makes the default suite report failures). To verify member-facing copy as rendered HTML without a browser: export the component, write a throwaway `zz-vitest.render.config.ts` inside `apps/web` (must live in the repo so `vitest/config` resolves) with `esbuild: { jsx: "automatic" }`, `test.include` pointing at a `zz-*.test.tsx` under `src/__tests__/`, and the `@` alias; run `bunx vitest run --config zz-vitest.render.config.ts`; assert on `renderToString(...)` output; delete both files before committing. Used 2026-09-06 for the expired-fob notice on the request form.

**How to apply:** when a UI change needs copy or role verification and Interceptor on the Mac is unavailable, use this probe instead of claiming from source. Related: [[gotcha-accessbuddy-prod-access]] (gh via `GH_TOKEN=$(cat ~/.gh-token)` on the Mac worked again for PR #96).

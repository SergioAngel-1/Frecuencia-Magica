# Task 4 report — full-bleed editorial threshold

## Status

- **Status:** complete
- **Branch:** `feat/frontend-foundations`
- **Base:** `579333a139869dfcefa7d85db10e55448fe3f72b`
- **Scope:** Task 4 only; direct branch work, no worktree and no push.
- **Requested commit:** `feat(portal): introduce full-bleed editorial threshold`
- **Trailer:** `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

## Implementation

- Recomposed `PortalScene` as a viewport-height, full-bleed editorial composition using `FullBleedSection`, the registered `portal.hero` fallback, and a layered `portal.portal-field` `EditorialImage`.
- Preserved the living portal language: orbital rings, sacred geometry, halo, logo, translated kicker/title/subtitle/hint, and the interactive `EnterButton` remain in the scene; the CTA now has a clearer dominant min-height/min-width treatment without changing its behavior.
- Kept portal crossing behavior untouched: `useCrossPortal`, cooldown, audio activation, portal-store timing, reduced-motion timing, disabled state, and `aria-busy` logic were not changed.
- Made the portal page resolve the locale explicitly before requesting the `portal` namespace, preserving localized copy on both root variants.
- Rebuilt root and localized 404 surfaces with the shared `FullBleedSection`, `EditorialImage`/`MediaSkeleton` fallback path, closed brand font/tokens, and the existing sacred geometry language.
- Kept localized 404 copy and `@/i18n/navigation` links in the locale route. The root 404 remains Spanish by default and uses the existing `next/link` exception because no locale context exists outside `[locale]`.
- Removed the root 404's direct Georgia/Arial declarations and inline standalone layout. Fallbacks carry human editorial alt labels while `data-media-slot` remains available through the shared media primitives; implementation slot names are not rendered as screen-reader copy.
- The three requested editorial slots (`portal.hero`, `portal.portal-field`, `not-found.hero`) were already present in the Task 2 registry/config and were reused without adding assets or changing the closed registry.
- Added pure `tests/lib/portal-editorial.test.ts` contracts for all three fallback resolutions, portal wiring, shared 404 primitives, localized copy, and the root typography guard.

## TDD evidence

1. Added `frontend/tests/lib/portal-editorial.test.ts` before production changes.
2. Ran the focused test before implementation: **1 file, 3 tests; 2 failed and 1 passed**, with the expected missing portal/404 editorial wiring and root typography guard.
3. Implemented the portal and 404 composition.
4. Focused test then passed: **1 file, 3 tests passed**.

## Verification

All commands below were run from `frontend/` unless noted otherwise. No build was run because the task explicitly says not to run `next build` while the existing dev server is active.

- `npm run test -- tests/lib/portal-editorial.test.ts` — **passed**, 1 file / 3 tests.
- `npm run test` — **passed**, 32 files / 182 tests.
- `npm run lint` — **passed**, exit 0.
- `npm run typecheck` — **passed**, exit 0.
- `npx prettier --check "src/app/[locale]/page.tsx" "src/app/[locale]/not-found.tsx" "src/app/not-found.tsx" "src/components/features/portal/enter-button.tsx" "src/components/features/portal/portal-scene.tsx" "tests/lib/portal-editorial.test.ts"` — **passed**.
- `git diff --check` — **passed**.
- Route smoke check against `http://localhost:3000/`, `/en/not-real`, and `/not-real` could not connect (`Connection refused`); no server was started, per task instruction.

## Files modified

- `frontend/src/app/[locale]/page.tsx`
- `frontend/src/app/[locale]/not-found.tsx`
- `frontend/src/app/not-found.tsx`
- `frontend/src/components/features/portal/enter-button.tsx`
- `frontend/src/components/features/portal/portal-scene.tsx`
- `frontend/tests/lib/portal-editorial.test.ts`
- `.superpowers/sdd/2026-08-11-editorial-magical-visual-identity/task-4-report.md`

## Concerns

- The requested dev server was not reachable at verification time, so route-level smoke verification was unavailable. Static checks and the full Vitest suite passed.
- `next build` was intentionally not run, as required by the task while the dev server is active.
- No approved or placeholder photography was added; all three threshold slots remain absent and intentionally render the zebra fallback with their registered human-readable alt labels.

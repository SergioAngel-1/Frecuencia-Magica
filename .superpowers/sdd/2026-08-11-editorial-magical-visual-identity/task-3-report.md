# Task 3 report — persistent world engine and editorial shell

## Delivery

- Branch: `feat/frontend-foundations`
- Base: `99c138b3ccadaa423ee4c4cbecd3e634c3fb38cd`
- Scope: Task 3 only; no worktree and no push.
- Requested commit: `feat(layout): establish editorial full-bleed shell with magical atmosphere`
- The existing `npm run dev` process was left running. `next build` was intentionally not run because the brief explicitly forbids building while the dev server is active.

## Implementation

### Shell and geometry

- Added `fullBleed`, `editorial`, and `reserveBottomUi` to `PageShellProps` while keeping all existing `PageShell` callers valid.
- Added the pure `getPageShellClasses` helper so shell geometry is testable without mounting components.
- Full-bleed shells automatically reserve the fixed mobile controls unless `reserveBottomUi={false}` is explicit.
- Added CSS utilities for editorial shell isolation, viewport media (`svh`/`dvh`), edge-to-edge breakout, banner edge masks, safe-area padding, fixed-control reservation, zebra fallback motion, and reduced motion.
- Kept `EditorialOverlay` as the shared readable foreground/scrim source; the new banner mask only shapes media edges and does not introduce a second scrim implementation.

### Realm visual modes

- Added explicit `visualMode` and `photoTreatment` values to all nine entries in `REALMS`.
- Preserved every existing `accent`, `accentVar`, `baseNote`, route, navigation flag, and realm ordering.
- Added a closed-palette `PHOTO_TREATMENT_BANDS` map and `bandForPhotoTreatment` fallback helper in `bands.ts`; no remote, stock, Unsplash, generated, or real photo assets were added.
- The existing `Realm` source type was not edited because the Task 3 file allowlist excludes `frontend/src/types/realm.ts`; `REALMS`, `NAV_REALMS`, and `getRealm` expose the extended `EditorialRealm` intersection from the allowed config file.

### World engine

- `WorldEngine` now accepts optional `visualMode`, derives the active mode from the realm context/config, and falls back to cosmic behavior when no mode is available.
- Cosmic canvas, nebula, and brand-figure layers accept the optional mode and reduce decorative opacity in editorial/quiet scenes so living cosmic energy remains visible without competing with foreground content.
- Preserved the existing canvas animation, DPR cap, mobile particle budget, visibility pausing, portal transition, cursor, announcer, and reduced-motion behavior.

### Persistent controls and constellation

- Preserved the stacking order with explicit layers: footer/content at `z-100`, player at `z-180`, constellation nav at `z-210`, and header at `z-220`.
- Raised mobile constellation labels to 15px and kept the six-point constellation metaphor; desktop destinations are persistently discoverable while hover/focus badges remain available.
- Offset mobile realm navigation above the player dock and added safe-area handling so controls do not overlap.
- Kept player controls at least 44px, expanded the seek input hit area to 44px, tightened the mobile dock layout, and kept the close/play controls accessible.
- Added safe-area-aware footer space for the fixed player, retained footer/content layering, and kept route transitions relative to full-bleed content.
- Kept the brand mark target at least 44px.

## TDD evidence

1. Added `frontend/tests/lib/editorial-shell.test.ts` first.
2. Ran the focused test before implementation: **4 tests failed**, with the expected missing visual modes, missing photo treatments, and missing `getPageShellClasses` export.
3. Implemented the minimum contracts.
4. Focused test then passed: **1 file, 4 tests passed**.

## Verification

Fresh verification after implementation and formatting:

- `npm run test -- tests/lib/editorial-shell.test.ts` — **1 file, 4 tests passed**.
- `npm run test` — **31 files, 178 tests passed**.
- `npm run lint` — **passed, exit 0**.
- `npm run typecheck` — **passed, exit 0**.
- `git diff --check` — **passed**.
- Prettier was run on the modified allowlisted files.
- No build was run by design: the existing `npm run dev` process was active (PID `749357`).

## Files modified

- `frontend/src/app/globals.css`
- `frontend/src/components/features/player/player-dock.tsx`
- `frontend/src/components/layout/brand-mark.tsx`
- `frontend/src/components/layout/page-shell.tsx`
- `frontend/src/components/layout/realm-footer.tsx`
- `frontend/src/components/layout/realm-nav.tsx`
- `frontend/src/components/layout/route-transition.tsx`
- `frontend/src/components/layout/site-footer.tsx`
- `frontend/src/components/layout/site-header.tsx`
- `frontend/src/components/world/brand-figures.tsx`
- `frontend/src/components/world/cosmic-canvas.tsx`
- `frontend/src/components/world/nebula-layer.tsx`
- `frontend/src/components/world/world-engine.tsx`
- `frontend/src/config/bands.ts`
- `frontend/src/config/realms.ts`
- `frontend/tests/lib/editorial-shell.test.ts`

This report is included in the requested Task 3 commit.

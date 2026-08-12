# Task 5 report — editorial long-form home

## Status

- **Status:** complete
- **Branch:** `feat/frontend-foundations`
- **Base:** `fe9a94943b88c93826c6ef7f06fa206f9f4faabc`
- **Scope:** Task 5 only; direct working-tree work, no worktree operation and no push.
- **Requested commit:** `feat(home): reshape landing page as magical editorial long-form`
- **Trailer:** `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`

## Implementation

- Recomposed the home route as an editorial long-form page inside the wide, full-bleed `PageShell`, preserving the existing translated ES/EN copy, realm hierarchy, routes, player behavior, and world-engine language.
- Rebuilt the hero as a viewport-height `FullBleedSection` with a registered media contract, readable left-side content, a right-side magical energy field, orbital rings, sacred geometry, CTA safe zone, responsive layout, and reduced-motion-compatible motion variants.
- Converted Daily Frequency into a wide editorial media banner with an overlaid `FrequencyDisc`, translated metadata, play interaction, CTA treatment, and no enclosing generic card shell.
- Converted the audio area into an editorial image strip with four responsive frequency-disc overlays, shared media fallback, translated heading/action content, and preserved player-store interaction.
- Recomposed the realms area with a full-width `EditorialBanner` lead and staggered responsive `RealmCard` panels. Academia remains the featured panel, Tienda keeps its conversion treatment, and all existing realm links and hierarchy are preserved.
- Recomposed About Marisol as a human-focus editorial composition using the existing portrait registry contract, `EditorialImage`, the intended arch treatment, orbital rings, and a zebra fallback when the approved portrait is absent. No stock-photo substitute was introduced.
- Rebuilt membership as a full-width `EditorialBanner` with registered media, translated copy, and the existing access CTA.
- Added the home-only full-bleed footer banner before the existing footer links, using the `home.footer-banner` media contract and existing membership copy/route.
- Added `frontend/tests/lib/home-editorial.test.ts` with pure source/registry contracts covering all seven home media slots, shared resolver wiring, editorial primitives, and the absence of remote or stock image sources.
- Existing registry aliases are intentionally reused for `home.marisol` (`home-marisol-portrait`) and `home.membership` (`home-membership`); the requested `home.footer-banner` slot is resolved directly.

## TDD evidence

1. Added `frontend/tests/lib/home-editorial.test.ts` before the production composition changes.
2. Ran the focused test before implementation: **1 file, 3 tests; 1 failed and 2 passed**, with the expected missing home editorial wiring/slot contracts.
3. Implemented the home composition and shared media wiring.
4. Focused test after implementation: **1 file, 3 tests passed**.

## Verification

All commands below were run from `frontend/` unless noted otherwise. `next build` was intentionally not run because the task explicitly forbids building while the existing `next dev` process is active.

- `npm run test -- tests/lib/home-editorial.test.ts` — **passed**, 1 file / 3 tests.
- `npm run test` — **passed**, 33 files / 186 tests.
- `npm run lint` — **passed**, exit 0.
- `npm run typecheck` — **passed**, exit 0.
- `npx prettier --check "src/app/[locale]/inicio/page.tsx" "src/components/features/home/hero-section.tsx" "src/components/features/home/daily-frequency.tsx" "src/components/features/home/audio-grid.tsx" "src/components/features/home/realms-grid.tsx" "src/components/features/home/realm-card.tsx" "src/components/features/home/about-section.tsx" "src/components/features/home/membership-section.tsx" "src/components/layout/site-footer.tsx" "tests/lib/home-editorial.test.ts"` — **passed**, all Task 5 files use Prettier code style.
- `git diff --check` — **passed**, exit 0.
- `npm run format:check` — **failed** on the repository-wide baseline: Prettier reported 52 unrelated files outside the Task 5 change set. The targeted Prettier check above passed for every Task 5 source/test file.
- No build was run, per the task constraint.

## Files modified

- `frontend/src/app/[locale]/inicio/page.tsx`
- `frontend/src/components/features/home/hero-section.tsx`
- `frontend/src/components/features/home/daily-frequency.tsx`
- `frontend/src/components/features/home/audio-grid.tsx`
- `frontend/src/components/features/home/realms-grid.tsx`
- `frontend/src/components/features/home/realm-card.tsx`
- `frontend/src/components/features/home/about-section.tsx`
- `frontend/src/components/features/home/membership-section.tsx`
- `frontend/src/components/layout/site-footer.tsx`
- `frontend/tests/lib/home-editorial.test.ts`
- `.superpowers/sdd/2026-08-11-editorial-magical-visual-identity/task-5-report.md`

## Concerns

- The repository-wide `npm run format:check` remains red because 52 pre-existing/unrelated files are not formatted; none of the Task 5 allowlisted files are among the reported files, and the targeted Task 5 check is green.
- No approved photography or other assets were added. All seven home media contracts currently resolve to named zebra fallbacks with no `src`; real editorial media can be supplied later without changing the composition contract.
- `next build` and browser-level 390/768/1280/1440 route/visual smoke checks were not run in this closure because the task explicitly prohibits a build while `next dev` is active. Static contracts, focused tests, the full Vitest suite, lint, typecheck, targeted Prettier, and `git diff --check` passed.

No assets were added.

This report is included in the requested Task 5 commit.

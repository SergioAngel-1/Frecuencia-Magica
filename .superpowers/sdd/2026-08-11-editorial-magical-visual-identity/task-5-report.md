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

## Fix round 1

### Changes

- Moved all seven home media alt strings into `messages/es.json` and `messages/en.json`. The server home page resolves the six page slots with the active locale before passing `EditorialMedia`; the client `SiteFooter` resolves its translated footer alt through `useTranslations('home')`. The home registry no longer stores single-language alt phrases.
- Restored the existing `/logo.png` as a decorative, aria-hidden layer inside the hero energy field, with responsive `next/image` sizing.
- Extended `EditorialMedia` with its declared aspect and made `EditorialBanner` consume `media.aspect`, preserving the `16:9` membership/footer contracts instead of forcing the legacy `16:8` banner layout. `EditorialImage` now also makes no-source `MediaSkeleton` fill its wrapper (`h-full w-full`); this shared primitive change is required because the same fallback serves full-bleed/min-height home sections.
- Restructured Daily Frequency so the block content lives in a section/div and the translated play CTA is the independent `aria-pressed` button with its player-store action and visible focus treatment.
- Removed Home's explicit `reserveBottomUi={false}` so the default fixed-player/mobile-navigation reserve applies.
- Corrected the normative focal positions for `home.hero` (`62% 40%`) and `home-membership` (`50% 15%`). The pure home contract test preserves the typed alias from brief name `home.marisol` to canonical `home-marisol-portrait` without changing the inventory ID.

### Regression coverage

- Extended `frontend/tests/lib/home-editorial.test.ts` with pure source/contract assertions for localized ES/EN alts across all seven home slots, no registry alt literals, canonical alias mapping, focal points, banner ratios, fallback fill, independent Daily Frequency action semantics, decorative logo restoration, and fixed-UI reservation.

### Verification (all commands run from `frontend/` unless noted)

- `npm run test -- tests/lib/home-editorial.test.ts` — **passed**, 1 file / 8 tests.
- `npm run test -- tests/lib/editorial-media.test.ts tests/lib/editorial-shell.test.ts tests/lib/portal-editorial.test.ts` — **passed**, 3 files / 12 tests.
- `npm run lint` — **passed**, exit 0.
- `npm run typecheck` — **passed**, exit 0.
- `npm run test` — **passed**, 33 files / 191 tests.
- `npx prettier --check "src/app/[locale]/inicio/page.tsx" "src/components/features/home/about-section.tsx" "src/components/features/home/audio-grid.tsx" "src/components/features/home/daily-frequency.tsx" "src/components/features/home/hero-section.tsx" "src/components/features/home/membership-section.tsx" "src/components/features/home/realms-grid.tsx" "src/components/layout/site-footer.tsx" "src/components/ui/editorial-banner.tsx" "src/components/ui/editorial-image.tsx" "src/config/editorial-media.ts" "src/lib/editorial/asset-registry.ts" "src/types/editorial-media.ts" "tests/lib/home-editorial.test.ts"` — **passed**, all matched files use Prettier code style.
- `git diff --check` — **passed**, exit 0.
- No `next build` was run, per the task constraint while `next dev` is active. No browser-level 390/768 smoke check was run in this fix round.

### Concerns

- The existing repository-wide `npm run format:check` baseline remains outside this fix round's scope; the changed TypeScript/test files pass the targeted Prettier check above.
- No assets were added; all seven home slots still use their named zebra fallbacks when no approved source is present.

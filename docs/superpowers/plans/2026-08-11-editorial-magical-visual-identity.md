# Editorial Magical Visual Identity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorientar las nueve vistas de Frecuencia Mágica hacia una identidad editorial-mágica, full-bleed y centrada en dirección de arte fotográfica, sin perder las formas animadas, la atmósfera cósmica ni la continuidad sensorial del universo Marisol.

**Architecture:** Se conserva la arquitectura actual de tres capas: UI Kit puro, world engine persistente y features por realm. Se añadirá una capa editorial reutilizable para contratos de medios, composiciones full-bleed, banners, scrims, focal points y skeletons “zebra”. Las fotografías reales o generadas quedan fuera de esta ejecución: cada slot se implementará con un fallback editorial visible y documentado que podrá ser sustituido por un asset sin cambiar la composición.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · `next/image` · `motion/react-m` + `LazyMotion` · next-intl · Zustand · Vitest · detector Impeccable · Selenium/axe cuando el entorno lo permita.

## Global Constraints

- El producto sigue siendo un portal inmersivo y cinematográfico de bienestar de la marca Marisol, con nueve realms navegables y ES/EN.
- La nueva dirección es **editorial-mágica**, no una sustitución por una galería fotográfica convencional.
- Las formas animadas actuales se conservan como identidad viva: canvas cósmico, nebulosas, partículas, halos, aros, geometría sagrada, cursor luminoso, audio ambiental y transiciones de portal.
- La fotografía de dirección de arte se convierte en material estructural: fondos de viewport, héroes edge-to-edge, banners full width, bandas, covers y composiciones de detalle.
- No se incorporan fotografías reales ni generadas durante esta fase.
- Todo slot sin imagen usa un skeleton editorial “zebra”: bandas diagonales/verticales de la paleta, barrido de luz controlado y etiqueta accesible o `data-media-slot` que identifica el asset pendiente. Nunca usar cajas grises, Unsplash, Lorem Picsum ni placeholders genéricos.
- Los skeletons deben parecer una ausencia intencional de dirección de arte, no una imagen rota ni contenido provisional accidental.
- Los assets futuros deben poder sustituir el skeleton mediante props sin cambiar el DOM semántico, la composición ni la API de las features.
- No introducir colores ni fuentes arbitrarios: conservar `--void`, `--void-2`, `--gold`, `--teal`, `--lav`, `--ivory`, `--color-warn`, Cormorant Garamond y Jost.
- Los colores de fotografía futura se integran mediante scrims, overlays, máscaras y gradientes derivados de la paleta, no mediante nuevas superficies de UI.
- Las animaciones nuevas se limitan preferentemente a `transform` y `opacity`; ningún efecto editorial debe tapar contenido ni bloquear la interacción.
- `prefers-reduced-motion` debe conservar la jerarquía y acortar timers JS, desactivar flotación/rotación decorativa y mostrar transiciones instantáneas.
- Hit targets mínimos de 44 px y texto de contenido mínimo de 15 px; labels editoriales pequeños sólo se permiten cuando son metadata no esencial y mantienen contraste documentado.
- Mantener `overflow-x: clip`, `devicePixelRatio <= 2`, pausas de loops fuera de pantalla y lazy loading de medios no prioritarios.
- Los enlaces internos usan `@/i18n/navigation`; todo copy visible vive en ambos catálogos de mensajes.
- Server Components por defecto; `use client` sólo para estado, efectos, listeners, stores o animación imperativa.
- No añadir backend, pagos reales, CMS ni nuevas rutas aplazadas. Mantener las marcas `// TODO(backend)` existentes donde el producto todavía es simulado.
- No tocar el prototipo perdido ni los `.dc.html` de otras marcas.
- No borrar las modificaciones existentes del working tree. Antes de cada tarea, inspeccionar `git diff` del archivo objetivo y conservar cambios ajenos.
- Cada tarea termina con una comprobación enfocada; el gate canónico final es `npm run lint && npm run typecheck && npm run test && npm run build` desde `frontend/`.
- Tras un build completo, si se necesita servidor de desarrollo, iniciar una sola instancia nueva porque Next comparte `.next` entre build y dev.

---

## File Map

### Nuevos contratos y primitives editoriales

- **Create:** `frontend/src/types/editorial-media.ts` — tipos `EditorialMedia`, `EditorialMediaKind`, `EditorialMediaPosition`, `EditorialMediaPriority`, `EditorialMediaProps` y contratos para slots.
- **Create:** `frontend/src/config/editorial-media.ts` — nombres estables de slots, ratios, focal points iniciales, prioridades y copy de referencia de cada asset pendiente.
- **Create:** `frontend/src/components/ui/media-skeleton.tsx` — fallback zebra accesible, decorativo y reusable.
- **Create:** `frontend/src/components/ui/editorial-image.tsx` — wrapper de `next/image`/fallback, scrim, focal point, `sizes`, prioridad y slot metadata.
- **Create:** `frontend/src/components/ui/full-bleed-section.tsx` — sección edge-to-edge con modo `viewport`, `banner`, `split` y capas editoriales.
- **Create:** `frontend/src/components/ui/editorial-banner.tsx` — banner full width con imagen/fallback, texto, acción y geometría mágica opcional.
- **Create:** `frontend/src/components/ui/editorial-overlay.tsx` — scrims, viñeta, tintes y capas de legibilidad sin duplicar gradientes en features.
- **Create:** `frontend/src/lib/editorial/asset-registry.ts` — resolución pura de slots, fallback y metadatos.
- **Create:** `frontend/src/lib/editorial/media-layout.ts` — helpers puros de crop, ratio, `sizes`, posición y modo responsive.
- **Create:** `frontend/tests/lib/editorial-media.test.ts` — resolución de slots, fallback, ratios, prioridad y posiciones.

### Sistema global y shell

- **Modify:** `frontend/src/app/globals.css` — tokens editoriales, zebra skeleton, máscaras, scrims, reglas full-bleed, `content-visibility` sólo donde sea seguro y reduced-motion.
- **Modify:** `frontend/src/components/world/world-engine.tsx` — conservar world engine, ajustar orden/opacidad para que las formas animadas respiren sobre fotografía sin competir con texto.
- **Modify:** `frontend/src/components/world/nebula-layer.tsx` — adaptar la atmósfera a capas fotográficas y asegurar que la viñeta no lave las imágenes.
- **Modify:** `frontend/src/components/world/brand-figures.tsx` — mantener figuras como intervención de dirección de arte, no como ruido permanente en todos los crops.
- **Modify:** `frontend/src/components/world/cosmic-canvas.tsx` — conservar el fondo cósmico; parametrizar densidad/opacity por modo editorial cuando la vista tenga hero fotográfico.
- **Modify:** `frontend/src/components/layout/site-header.tsx` — header adaptativo sobre imagen, contraste dinámico mediante scrim y tratamiento editorial transparente.
- **Modify:** `frontend/src/components/layout/realm-nav.tsx` — mantener la constelación, mejorar descubribilidad y legibilidad sin convertirla en sidebar convencional.
- **Modify:** `frontend/src/components/layout/page-shell.tsx` — añadir variantes `fullBleed`, `editorial`, `immersive` y separación segura para header/player/nav.
- **Modify:** `frontend/src/components/layout/site-footer.tsx` — cierre editorial con banner/fallback y composición de ancho completo donde corresponda.
- **Modify:** `frontend/src/components/layout/realm-footer.tsx` — coordinar cierre por realm con banners editoriales.
- **Modify:** `frontend/src/components/layout/route-transition.tsx` — preservar transición mágica y evitar que el overlay tape innecesariamente la nueva fotografía.
- **Modify:** `frontend/src/components/features/player/player-dock.tsx` — revisar convivencia con navegación inferior y tratamiento sobre fondos fotográficos.
- **Modify:** `frontend/src/components/layout/brand-mark.tsx` — asegurar legibilidad del logo/wordmark sobre fotografía y fallback zebra.
- **Modify:** `frontend/src/config/bands.ts` — transformar bandas actuales en tokens editoriales derivados; no sustituir todavía los slots por fotografías.
- **Modify:** `frontend/src/config/realms.ts` — añadir modo visual editorial y reglas de atmósfera por realm sin duplicar colores.

### Assets y documentación

- **Create:** `frontend/public/editorial/README.md` — inventario de slots, dimensiones recomendadas, orientación, focal point, alt text requerido y estado “pendiente”.
- **Create:** `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — contrato de dirección editorial-mágica aprobado.
- **Modify:** `frontend/docs/fidelity-checklist.md` — nueva matriz por vista con full-bleed, banners, slots y fallback zebra.
- **Modify:** `frontend/docs/accessibility.md` — contraste sobre fotografía, scrims, alt text, focus y fallback semántico.
- **Modify:** `frontend/docs/performance.md` — presupuestos de imágenes, LCP, CLS, `sizes`, `priority`, lazy loading y límites de blur.
- **Modify:** `frontend/README.md` — guía para añadir un asset editorial y sustituir un skeleton sin cambiar la vista.
- **Modify:** `docs/superpowers/plans/sections-plan-completed.md` — registrar la nueva fase sólo al completar cada bloque.

---

## Task 1: Formalizar el contrato de la nueva dirección editorial-mágica

**Files:**
- Create: `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md`
- Create: `frontend/public/editorial/README.md`
- Modify: `AGENTS.md`

**Interfaces:**
- Consumes: dirección aprobada por el usuario, `AGENTS.md`, `globals.css`, `config/realms.ts`, `frontend/docs/*`.
- Produces: contrato escrito de identidad, anti-goals, inventario de slots y reglas que todas las vistas deberán seguir.

- [ ] **Step 1: Documentar la tesis visual:** “fotografía como materia estructural; world engine como energía viva”.
- [ ] **Step 2: Documentar lo que permanece:** paleta, tipografía, copy, world engine, audio, geometría, reduced motion, i18n, arquitectura y estados.
- [ ] **Step 3: Documentar lo que cambia:** cards como unidad secundaria, layouts edge-to-edge, heroes fotográficos, banners, crops, scrims y composición editorial.
- [ ] **Step 4: Documentar lo que no se hará:** no producir imágenes en esta fase, no usar stock/Unsplash, no sustituir la magia por una galería, no convertir todos los realms en la misma plantilla.
- [ ] **Step 5: Crear el inventario inicial de slots:** cada slot debe registrar `id`, vista, propósito, orientación, ratio, focal point, prioridad, alt requerido y fallback actual.
- [ ] **Step 6: Añadir a `AGENTS.md` una referencia a la nueva fuente visual y a `frontend/public/editorial/README.md`, sin borrar las reglas existentes.
- [ ] **Step 7: Verificar:** revisar el diff y buscar marcadores de trabajo incompleto, referencias ambiguas a placeholders o instrucciones contradictorias en los documentos creados; las marcas `// TODO(backend)` del producto son excepciones intencionales.

---

## Task 2: Crear contratos tipados y fallback zebra

**Files:**
- Create: `frontend/src/types/editorial-media.ts`
- Create: `frontend/src/config/editorial-media.ts`
- Create: `frontend/src/lib/editorial/asset-registry.ts`
- Create: `frontend/src/lib/editorial/media-layout.ts`
- Create: `frontend/src/components/ui/media-skeleton.tsx`
- Create: `frontend/src/components/ui/editorial-image.tsx`
- Create: `frontend/src/components/ui/editorial-overlay.tsx`
- Create: `frontend/src/components/ui/full-bleed-section.tsx`
- Create: `frontend/src/components/ui/editorial-banner.tsx`
- Modify: `frontend/src/components/ui/index.ts`
- Modify: `frontend/src/app/globals.css`
- Create: `frontend/tests/lib/editorial-media.test.ts`

**Interfaces:**
- `EditorialMedia`:
  ```ts
  export type EditorialMedia = {
    src?: string;
    alt: string;
    slot: EditorialMediaSlot;
    kind: 'photo' | 'art-direction' | 'fallback';
    position?: string;
    priority?: boolean;
    sizes: string;
  };
  ```
- `EditorialMediaSlot` is a literal union declared once in `config/editorial-media.ts` and includes all slots from Task 4–Task 12.
- `resolveEditorialMedia(slot, media?)` returns an `EditorialMedia` with `kind: 'fallback'` and a stable `data-media-slot` when `src` is absent.
- `mediaLayout(mode, viewport)` returns ratio, object position, overlay direction and `sizes` without accessing the DOM.
- `MediaSkeleton` accepts `slot`, `label`, `aspect`, `tone`, `animated?`, `className?` and renders `aria-hidden="true"` visual layers plus a visually available `data-media-slot` hook.
- `EditorialImage` accepts `media`, `fill?`, `priority?`, `scrim?`, `overlay?`, `focalPoint?`, `className?`, and keeps the same wrapper DOM for real/fallback media.
- `FullBleedSection` accepts `media?`, `mode`, `children`, `overlay?`, `minHeight?`, `className?`, `contentClassName?`.
- `EditorialBanner` accepts `media?`, `eyebrow`, `title`, `body?`, `action?`, `align?`, `tone?`, `className?`.

- [ ] **Step 1: Write failing tests for `resolveEditorialMedia`:** absent `src` returns `kind: 'fallback'`, preserves slot/alt, and never invents a URL.
- [ ] **Step 2: Write failing tests for `mediaLayout`:** `viewport` returns full viewport ratio, `banner` returns wide ratio, `portrait` preserves focal point, and `sizes` is deterministic.
- [ ] **Step 3: Run `npm run test -- editorial-media`; confirm module/export failures.
- [ ] **Step 4: Implement pure types, slot registry and layout helpers.
- [ ] **Step 5: Implement `MediaSkeleton` using only project tokens: zebra bands, diagonal light sweep, magical geometry hook, no gray fill.
- [ ] **Step 6: Implement `EditorialImage` with `next/image` only when `src` exists; render `MediaSkeleton` inside the same positioned wrapper otherwise.
- [ ] **Step 7: Implement `EditorialOverlay`, `FullBleedSection` and `EditorialBanner` with semantic headings, scrim direction and `pointer-events-none` decoration.
- [ ] **Step 8: Export the primitives from the UI Kit without importing `data`, `stores` or `i18n`.
- [ ] **Step 9: Run focused tests, lint and typecheck.
- [ ] **Step 10: Commit:** `feat(ui): add editorial media contracts and zebra fallbacks`.

---

## Task 3: Recompose the persistent world engine and shell

**Files:**
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/components/world/world-engine.tsx`
- Modify: `frontend/src/components/world/cosmic-canvas.tsx`
- Modify: `frontend/src/components/world/nebula-layer.tsx`
- Modify: `frontend/src/components/world/brand-figures.tsx`
- Modify: `frontend/src/components/layout/site-header.tsx`
- Modify: `frontend/src/components/layout/realm-nav.tsx`
- Modify: `frontend/src/components/layout/page-shell.tsx`
- Modify: `frontend/src/components/layout/site-footer.tsx`
- Modify: `frontend/src/components/layout/realm-footer.tsx`
- Modify: `frontend/src/components/layout/route-transition.tsx`
- Modify: `frontend/src/components/features/player/player-dock.tsx`
- Modify: `frontend/src/components/layout/brand-mark.tsx`
- Modify: `frontend/src/config/realms.ts`
- Modify: `frontend/src/config/bands.ts`
- Create or extend: `frontend/tests/lib/editorial-shell.test.ts`

**Interfaces:**
- `WorldEngine` accepts optional `visualMode?: 'cosmic' | 'editorial' | 'quiet'` from realm context; default preserves current behavior.
- `Realm` gains `visualMode` and `photoTreatment` fields with explicit values for all nine realms.
- `PageShell` gains `fullBleed?: boolean`, `editorial?: boolean`, and `reserveBottomUi?: boolean`.
- `EditorialOverlay` becomes the only shared source for image scrims and readable foreground treatment.

- [ ] **Step 1: Define tests for shell geometry and realm visual modes without mounting components: every realm resolves a mode and every full-bleed mode reserves fixed controls.
- [ ] **Step 2: Run the focused tests and confirm failure.
- [ ] **Step 3: Add editorial CSS utilities for viewport media, edge-to-edge breakout, banner masks, zebra fallback, safe areas and reduced motion.
- [ ] **Step 4: Add realm-specific visual mode configuration while retaining current accent/baseNote values.
- [ ] **Step 5: Adjust world layers so cosmic animation remains visible over image regions at reduced opacity and does not obscure content.
- [ ] **Step 6: Update header/nav/footer/player stacking so mobile navigation and player dock cannot overlap; preserve 44 px targets.
- [ ] **Step 7: Keep desktop realm labels discoverable and mobile labels legible without removing the constellation metaphor.
- [ ] **Step 8: Update `PageShell` and route transition for full-bleed content while preserving current localized routes.
- [ ] **Step 9: Run tests, lint, typecheck and inspect the CSS diff.
- [ ] **Step 10: Commit:** `feat(layout): establish editorial full-bleed shell with magical atmosphere`.

---

## Task 4: Recompose Portal and root not-found

**Files:**
- Modify: `frontend/src/app/[locale]/page.tsx`
- Modify: `frontend/src/components/features/portal/portal-scene.tsx`
- Modify: `frontend/src/components/features/portal/enter-button.tsx`
- Modify: `frontend/src/app/not-found.tsx`
- Modify: `frontend/src/app/[locale]/not-found.tsx`
- Add slots to `frontend/src/config/editorial-media.ts`: `portal.hero`, `portal.portal-field`, `not-found.hero`.

**Interfaces:**
- Portal renders one viewport-height full-bleed composition with `EditorialImage`/`MediaSkeleton`, magical world layers and the CTA as the dominant action.
- Root and localized 404 use the same editorial primitives and retain localized copy where the route context exists.

- [ ] **Step 1: Add tests for portal slot resolution and 404 fallback semantics.
- [ ] **Step 2: Replace centered isolated portal geometry with a layered full-bleed editorial composition: background slot, scrim, portal geometry, logo, text block and enter action.
- [ ] **Step 3: Keep the portal CTA behavior, cooldown, audio activation and reduced-motion timing unchanged.
- [ ] **Step 4: Make the root 404 use the brand fonts/tokens through the shared full-bleed primitive, avoiding direct Georgia/Arial and `next/link` where localization is available.
- [ ] **Step 5: Ensure the fallback names its slot for asset handoff but does not expose implementation jargon to screen readers.
- [ ] **Step 6: Verify localized root and 404 routes with build and tests.
- [ ] **Step 7: Commit:** `feat(portal): introduce full-bleed editorial threshold`.

---

## Task 5: Recompose Home as an editorial long-form landing

**Files:**
- Modify: `frontend/src/app/[locale]/inicio/page.tsx`
- Modify: `frontend/src/components/features/home/hero-section.tsx`
- Modify: `frontend/src/components/features/home/daily-frequency.tsx`
- Modify: `frontend/src/components/features/home/audio-grid.tsx`
- Modify: `frontend/src/components/features/home/realms-grid.tsx`
- Modify: `frontend/src/components/features/home/realm-card.tsx`
- Modify: `frontend/src/components/features/home/about-section.tsx`
- Modify: `frontend/src/components/features/home/membership-section.tsx`
- Modify: `frontend/src/components/layout/site-footer.tsx`
- Add slots: `home.hero`, `home.daily-frequency`, `home.audio-banner`, `home.realms-banner`, `home.marisol`, `home.membership`, `home.footer-banner`.

**Interfaces:**
- Home uses full viewport hero, full-width editorial bands and alternating image/text blocks.
- `FrequencyDisc` remains as magical sound signature, but cards become secondary to image fields and editorial rhythm.
- About Marisol keeps its intended human focal point and receives a real media contract plus zebra fallback.

- [ ] **Step 1: Add content/slot tests for the home composition: hero, daily, realms, Marisol, membership and footer all resolve a media contract.
- [ ] **Step 2: Rebuild the hero as edge-to-edge media with scrim, left/right reading zones, magical forms behind/over the media, and CTA in the safe reading region.
- [ ] **Step 3: Convert Daily Frequency into a wide editorial banner with a large sound disc and no enclosing generic card shell.
- [ ] **Step 4: Convert Audio Grid into a curated editorial strip with image/cover slots, frequency discs as overlays and responsive horizontal-to-stacked behavior.
- [ ] **Step 5: Recompose the realms section with a full-width lead banner plus staggered editorial panels, preserving realm routes and hierarchy.
- [ ] **Step 6: Recompose About Marisol and membership as art-directed full-width compositions; no stock-photo substitute.
- [ ] **Step 7: End Home with a real full-bleed editorial footer banner before the existing footer links.
- [ ] **Step 8: Verify ES/EN copy, long translations, 390/768/1280/1440 layouts, focus and reduced motion.
- [ ] **Step 9: Commit:** `feat(home): reshape landing page as magical editorial long-form`.

---

## Task 6: Recompose Acceso as editorial split-screen

**Files:**
- Modify: `frontend/src/app/[locale]/acceso/page.tsx`
- Modify: `frontend/src/components/features/auth/auth-aside.tsx`
- Modify: `frontend/src/components/features/auth/auth-form.tsx`
- Add slots: `auth.hero`, `auth.form-atmosphere`.

**Interfaces:**
- Desktop uses a full-height editorial image field and a readable form column; mobile turns the image into a short banner while keeping form controls primary.
- Auth validation, las marcas `// TODO(backend)`, i18n and navigation remain unchanged.

- [ ] **Step 1: Add tests for auth media fallback and form layout mode.
- [ ] **Step 2: Replace the isolated aside card with a full-height media panel containing logo, quote and magical overlays.
- [ ] **Step 3: Keep the form surface restrained and editorial; avoid wrapping the complete form in another generic glass card.
- [ ] **Step 4: Preserve name reveal, validation announcements, SSO/deferred states and 44 px controls.
- [ ] **Step 5: Verify registration/login in ES/EN and mobile portrait.
- [ ] **Step 6: Commit:** `feat(auth): reshape access view as editorial split screen`.

---

## Task 7: Recompose Descúbrete as a photographic tuning flow

**Files:**
- Modify: `frontend/src/app/[locale]/descubrete/page.tsx`
- Modify: `frontend/src/components/features/descubrete/quiz-layout.tsx`
- Modify: `frontend/src/components/features/descubrete/intro-step.tsx`
- Modify: `frontend/src/components/features/descubrete/quiz-step.tsx`
- Modify: `frontend/src/components/features/descubrete/tuning-step.tsx`
- Modify: `frontend/src/components/features/descubrete/result-step.tsx`
- Modify: `frontend/src/components/features/descubrete/quiz-container.tsx`
- Add slots: `discover.hero`, `discover.question-atmosphere`, `discover.tuning`, `discover.result`.

**Interfaces:**
- Quiz stays a focused one-decision-at-a-time flow; media changes by phase without adding visual noise.
- Result CTA remains a real link/action to the resulting audio path.

- [ ] **Step 1: Add phase-to-slot tests for intro/questions/tuning/result.
- [ ] **Step 2: Give intro and result a full-bleed atmospheric image field with magical forms preserved.
- [ ] **Step 3: Keep question options as legible editorial controls over a calm image/scrim, not glass cards stacked over a busy background.
- [ ] **Step 4: Let tuning use a slow image/geometry composition while preserving the reduced-motion short timing.
- [ ] **Step 5: Keep result disc, frequency and actions legible; avoid duplicate dominant focal points.
- [ ] **Step 6: Verify keyboard flow, `aria`, timer cleanup, ES/EN expansion and 390 px.
- [ ] **Step 7: Commit:** `feat(discover): turn quiz into editorial tuning journey`.

---

## Task 8: Recompose Biblioteca as editorial archive plus solar system

**Files:**
- Modify: `frontend/src/app/[locale]/biblioteca/page.tsx`
- Modify: `frontend/src/components/features/library/library-system.tsx`
- Modify: `frontend/src/components/features/library/library-filters.tsx`
- Modify: `frontend/src/app/[locale]/biblioteca/loading.tsx`
- Add slots: `library.hero`, `library.featured`, `library.archive-banner`, `library.audio-cover.*`.

**Interfaces:**
- The solar system remains the magical interaction signature, but the page gains a full-width archive hero and editorial bands.
- Mobile retains one featured disc plus secondary discs without duplication.
- Filter semantics and empty state remain unchanged.

- [ ] **Step 1: Add tests asserting featured/secondary split and library slot contracts.
- [ ] **Step 2: Build a full-width archive hero with fallback zebra and category copy.
- [ ] **Step 3: Place the featured frequency inside an editorial media field rather than an isolated floating card.
- [ ] **Step 4: Preserve the orbital desktop layout and compact mobile grid; make imagery and geometry share the same focal hierarchy.
- [ ] **Step 5: Add a full-width archive banner between filter/catalog regions.
- [ ] **Step 6: Update loading skeleton to mirror editorial bands and image fields, not only circles.
- [ ] **Step 7: Verify filters, empty state, player opening, responsive split and localized routes.
- [ ] **Step 8: Commit:** `feat(library): compose frequency archive as magical editorial catalog`.

---

## Task 9: Recompose Academia and lesson views

**Files:**
- Modify: `frontend/src/app/[locale]/academia/page.tsx`
- Modify: `frontend/src/app/[locale]/academia/[courseId]/page.tsx`
- Modify: `frontend/src/app/[locale]/academia/[courseId]/[lessonId]/page.tsx`
- Modify: `frontend/src/components/features/academy/course-list.tsx`
- Modify: `frontend/src/components/features/academy/course-card.tsx`
- Modify: `frontend/src/components/features/academy/course-detail.tsx`
- Modify: `frontend/src/components/features/academy/lesson-list.tsx`
- Modify: `frontend/src/components/features/academy/lesson-player.tsx`
- Modify: `frontend/src/app/[locale]/academia/loading.tsx`
- Add slots: `academy.hero`, `academy.featured-course`, `academy.course.*`, `academy.lesson-player`, `academy.completion`.

**Interfaces:**
- Courses become editorial spreads with full-width hero/featured media and structured metadata.
- Lesson player remains operationally clear; media placeholder can later become a video/lesson image without changing controls.
- Completion view remains a quiet magical close, not a generic empty state.

- [ ] **Step 1: Add tests for course and lesson media slot resolution.
- [ ] **Step 2: Recompose course index with one full-width featured course and editorial archive rows.
- [ ] **Step 3: Recompose course detail into media-led spread, with lesson list as a strong reading rail.
- [ ] **Step 4: Convert lesson media placeholder into `EditorialImage`/zebra field and keep player controls semantically native.
- [ ] **Step 5: Preserve previous/next/finish routes and make the lesson play control either functional or visibly deferred with accessible explanation.
- [ ] **Step 6: Update loading state to mirror the editorial spread.
- [ ] **Step 7: Verify long titles, mobile reading order, keyboard navigation, reduced motion and ES/EN.
- [ ] **Step 8: Commit:** `feat(academy): reshape courses as editorial learning spreads`.

---

## Task 10: Recompose Experiencias and booking flow

**Files:**
- Modify: `frontend/src/app/[locale]/experiencias/page.tsx`
- Modify: `frontend/src/app/[locale]/experiencias/[experienceId]/reservar/page.tsx`
- Modify: `frontend/src/components/features/experiences/experience-list.tsx`
- Modify: `frontend/src/components/features/experiences/experience-row.tsx`
- Modify: `frontend/src/components/features/experiences/booking-flow.tsx`
- Modify: `frontend/src/app/[locale]/experiencias/loading.tsx`
- Add slots: `experiences.hero`, `experiences.featured`, `experiences.row.*`, `booking.hero`, `booking.confirmation`.

**Interfaces:**
- Experience listing is image-led and full-width, with date/mode/price remaining scannable.
- Booking flow preserves one step at a time, selected date/time semantics, validation and backend seam.

- [ ] **Step 1: Add tests for experience and booking media slots.
- [ ] **Step 2: Replace featured row with a full-width encounter banner and retain a strong booking CTA.
- [ ] **Step 3: Recompose standard experiences as editorial rows with image fields and aligned metadata rail.
- [ ] **Step 4: Add atmospheric media to date/time/details steps without allowing the image to compete with the active decision.
- [ ] **Step 5: Recompose confirmation as a quiet full-width image/geometry close with `aria-live` and backend seam preserved.
- [ ] **Step 6: Update loading skeletons to match image-led rows.
- [ ] **Step 7: Verify `aria-pressed`, focus, localized dates, mobile thumb reach and error recovery.
- [ ] **Step 8: Commit:** `feat(experiences): compose gatherings as full-bleed editorial scenes`.

---

## Task 11: Recompose Tienda, product detail, cart and checkout

**Files:**
- Modify: `frontend/src/app/[locale]/tienda/page.tsx`
- Modify: `frontend/src/app/[locale]/tienda/[productId]/page.tsx`
- Modify: `frontend/src/app/[locale]/tienda/carrito/page.tsx`
- Modify: `frontend/src/components/features/store/product-grid.tsx`
- Modify: `frontend/src/components/features/store/product-card.tsx`
- Modify: `frontend/src/components/features/store/product-detail.tsx`
- Modify: `frontend/src/components/features/store/product-sections.tsx`
- Modify: `frontend/src/components/features/store/cart-button.tsx`
- Modify: `frontend/src/components/features/store/cart-view.tsx`
- Modify: `frontend/src/components/features/store/order-summary.tsx`
- Modify: `frontend/src/components/features/store/order-confirmation.tsx`
- Modify: `frontend/src/components/features/store/checkout.tsx`
- Modify: `frontend/src/app/[locale]/tienda/loading.tsx`
- Add slots: `store.hero`, `store.product.*`, `store.ritual-banner`, `product.detail`, `product.related`, `cart.empty`, `checkout.confirmation`.

**Interfaces:**
- Product catalog becomes art-directed and image-led while preserving price, add, buy-now, related frequency, cart totals and simulated checkout.
- Product detail uses one dominant full-bleed/large media field and editorial accordions instead of a standard two-column card.
- Cart and checkout remain more restrained for task completion; full-bleed media is used as a supporting banner, not as a distraction.

- [ ] **Step 1: Add tests for product/cart/checkout slot contracts and fallback resolution.
- [ ] **Step 2: Recompose store index with a full-width ritual hero and bento editorial product fields; keep product cards as secondary primitives.
- [ ] **Step 3: Replace product bands with `EditorialImage` slots while preserving each product’s relationship to its frequency.
- [ ] **Step 4: Recompose product detail around a dominant media field, title/price/CTA rail and related frequency.
- [ ] **Step 5: Keep accordions readable and instant/layout-safe; preserve `aria-expanded` and `aria-controls`.
- [ ] **Step 6: Keep cart/checkout visually quieter, with clear controls, 44 px targets, empty/error/success states and optional editorial banner.
- [ ] **Step 7: Update store loading state to mirror product image fields and bento rhythm.
- [ ] **Step 8: Verify add/buy-now/cart navigation, totals, localized prices/copy, keyboard flow and 390 px.
- [ ] **Step 9: Commit:** `feat(store): reshape ritual catalog as editorial commerce`.

---

## Task 12: Recompose Mi Santuario as intimate editorial dashboard

**Files:**
- Modify: `frontend/src/app/[locale]/mi-santuario/page.tsx`
- Modify: `frontend/src/components/features/sanctuary/stats-row.tsx`
- Modify: `frontend/src/components/features/sanctuary/continue-card.tsx`
- Modify: `frontend/src/components/features/sanctuary/daily-card.tsx`
- Modify: `frontend/src/components/features/sanctuary/journal-panel.tsx`
- Add slots: `sanctuary.hero`, `sanctuary.continue`, `sanctuary.daily`, `sanctuary.journal`, `sanctuary.empty`.

**Interfaces:**
- Santuario becomes a calm full-width editorial space with the journal as primary task and media as atmosphere, not chrome.
- Preserve local Zustand persistence, mood semantics, save announcement, Continue route and daily frequency playback.

- [ ] **Step 1: Add tests for sanctuary media slots and journal fallback.
- [ ] **Step 2: Add a full-width sanctuary hero with zebra fallback and a quieter magical overlay profile.
- [ ] **Step 3: Make the journal visually dominant and place stats/continue/daily as editorial supporting sections.
- [ ] **Step 4: Keep textarea naming, mood `aria-pressed`, save `aria-live`, 44 px controls and local persistence.
- [ ] **Step 5: Add an intimate banner or image field to the journal without harming reading contrast.
- [ ] **Step 6: Verify empty journal, populated timeline, long entry, mobile wrapping and reduced motion.
- [ ] **Step 7: Commit:** `feat(sanctuary): turn personal space into intimate editorial scene`.

---

## Task 13: Cross-view loading, empty, error and 404 editorial states

**Files:**
- Modify: `frontend/src/app/[locale]/loading.tsx`
- Modify: `frontend/src/app/[locale]/error.tsx`
- Modify: `frontend/src/app/[locale]/not-found.tsx`
- Modify: `frontend/src/app/[locale]/biblioteca/loading.tsx`
- Modify: `frontend/src/app/[locale]/academia/loading.tsx`
- Modify: `frontend/src/app/[locale]/experiencias/loading.tsx`
- Modify: `frontend/src/app/[locale]/tienda/loading.tsx`
- Modify: `frontend/src/components/ui/skeleton.tsx`
- Modify: `frontend/src/components/ui/empty-state.tsx`
- Modify: `frontend/src/components/ui/error-state.tsx`
- Modify: `frontend/src/components/ui/loading-orb.tsx`
- Add slots: `states.loading`, `states.empty`, `states.error`, `states.offline`.

**Interfaces:**
- All states share the editorial-zebra language and magical geometry but remain distinguishable from real media fallback.
- Error/empty copy remains localized and actionable.

- [ ] **Step 1: Add tests for state variants and `aria` behavior.
- [ ] **Step 2: Define `MediaSkeleton` variants for hero, banner, portrait, cover and quiet.
- [ ] **Step 3: Recompose loading pages with image-field silhouettes and preserved world atmosphere.
- [ ] **Step 4: Recompose empty/error/404 as full-bleed editorial scenes with one clear action.
- [ ] **Step 5: Ensure no skeleton exposes false alt text or fake image claims to assistive technology.
- [ ] **Step 6: Verify state routes in ES/EN and with reduced motion.
- [ ] **Step 7: Commit:** `feat(states): align loading and recovery views with editorial world`.

---

## Task 14: Asset handoff, performance and accessibility hardening

**Files:**
- Modify: `frontend/src/config/editorial-media.ts`
- Modify: `frontend/src/lib/editorial/asset-registry.ts`
- Modify: `frontend/src/components/ui/editorial-image.tsx`
- Modify: `frontend/src/components/world/world-engine.tsx`
- Modify: `frontend/src/components/world/luminous-cursor.tsx`
- Modify: `frontend/src/components/world/smooth-scroll.tsx`
- Modify: `frontend/src/docs/accessibility.md`
- Modify: `frontend/docs/performance.md`
- Modify: `frontend/docs/fidelity-checklist.md`
- Modify: `frontend/README.md`
- Create: `frontend/tests/lib/editorial-accessibility.test.ts`

**Interfaces:**
- Assets remain optional and absent by default, but the registry is ready for future verified files.
- `EditorialImage` uses correct `priority` only for LCP hero media, explicit `sizes`, stable dimensions/aspect ratio and no layout shift.
- World loops pause on `visibilitychange` or unmount where applicable.

- [ ] **Step 1: Add tests for hero priority, non-hero lazy behavior, stable aspect ratios and fallback semantics.
- [ ] **Step 2: Audit every slot for meaningful alt text when a real image arrives; fallback remains decorative and announced through surrounding copy only.
- [ ] **Step 3: Add scrim contrast rules for the lightest expected image field and document minimum overlay opacity.
- [ ] **Step 4: Add image budgets by slot class and `sizes` strings by breakpoint.
- [ ] **Step 5: Ensure only the first visible hero can be priority-loaded; banners and below-fold media lazy-load.
- [ ] **Step 6: Pause/reduce cursor, smooth scroll, canvas and decorative loops where the new editorial layout requires it.
- [ ] **Step 7: Document the asset replacement workflow: copy file, update registry, supply alt/focal point, run responsive checks.
- [ ] **Step 8: Verify no real/remote image URL was accidentally introduced in this phase.
- [ ] **Step 9: Commit:** `perf(editorial): harden media loading and magical overlays`.

---

## Task 15: Cross-view visual QA and final documentation

**Files:**
- Modify: `frontend/docs/fidelity-checklist.md`
- Modify: `frontend/docs/accessibility.md`
- Modify: `frontend/docs/performance.md`
- Modify: `docs/superpowers/plans/sections-plan-completed.md`
- Modify: `AGENTS.md` only if a durable rule discovered during implementation is missing.

**Interfaces:**
- Produces: verified full view matrix and a clean handoff for future photographic asset insertion.

- [ ] **Step 1: Start exactly one dev server only if no server is running; never run dev and build concurrently because they share `.next`.
- [ ] **Step 2: Visit every localized route in the matrix: `/`, `/inicio`, `/acceso`, `/descubrete`, `/biblioteca`, `/academia`, course detail, lesson, `/experiencias`, booking, `/tienda`, product detail, cart and `/mi-santuario`, plus `/en` equivalents.
- [ ] **Step 3: Inspect at 390, 768, 1280 and 1440 px for full-bleed edges, crop/focal point, overlay contrast, player/nav stacking, no horizontal overflow and readable content.
- [ ] **Step 4: Test keyboard focus, controls, `aria-pressed`, `aria-expanded`, form errors, empty/error/success states and route transitions.
- [ ] **Step 5: Test reduced motion: no long JS waits, no decorative loops, no inaccessible hidden content.
- [ ] **Step 6: Run the detector once over changed markup targets:
  ```bash
  node /home/sergi/.hermes/skills/design/impeccable/scripts/detect.mjs --json \
    frontend/src/app/[locale]/page.tsx \
    frontend/src/app/[locale]/inicio/page.tsx \
    frontend/src/app/[locale]/acceso/page.tsx \
    frontend/src/app/[locale]/descubrete/page.tsx \
    frontend/src/app/[locale]/biblioteca/page.tsx \
    frontend/src/app/[locale]/academia/page.tsx \
    frontend/src/app/[locale]/experiencias/page.tsx \
    frontend/src/app/[locale]/tienda/page.tsx \
    frontend/src/app/[locale]/mi-santuario/page.tsx
  ```
- [ ] **Step 7: Run the canonical gate from `frontend/`: `npm run lint && npm run typecheck && npm run test && npm run build`.
- [ ] **Step 8: Confirm no remote image sources, no stock URLs, no gray placeholders and no generated asset was committed accidentally.
- [ ] **Step 9: Update the progress register with delivered blocks, known intentional fallbacks and remaining asset handoff.
- [ ] **Step 10: Commit:** `docs(editorial): record full-bleed magical identity handoff`.

---

## Route-by-route asset matrix

| Vista | Composición editorial | Slots fotográficos / art direction | Fallback mientras no haya asset |
|---|---|---|---|
| Portal `/` | viewport full-bleed, no scroll | `portal.hero`, `portal.portal-field` | zebra viewport + portal geometry + scrim |
| Home `/inicio` | hero edge-to-edge, long-form bands | `home.hero`, `home.daily-frequency`, `home.audio-banner`, `home.realms-banner`, `home.marisol`, `home.membership`, `home.footer-banner` | zebra hero/banner/portrait según slot |
| Acceso `/acceso` | split full-height desktop, banner móvil | `auth.hero`, `auth.form-atmosphere` | zebra split/banner |
| Descúbrete `/descubrete` | phase-based full-bleed atmosphere | `discover.hero`, `discover.question-atmosphere`, `discover.tuning`, `discover.result` | zebra phase field + geometry |
| Biblioteca `/biblioteca` | archive hero + solar system + banner | `library.hero`, `library.featured`, `library.archive-banner`, `library.audio-cover.*` | zebra archive/cover |
| Academia `/academia` | featured spread + editorial rows | `academy.hero`, `academy.featured-course`, `academy.course.*` | zebra wide/portrait |
| Curso `/academia/[courseId]` | media-led learning spread | `academy.course.*`, `academy.lesson-player` | zebra lesson media |
| Lección | lesson viewport + reading rail | `academy.lesson-player`, `academy.completion` | zebra 16:9/quiet orb |
| Experiencias `/experiencias` | encounter hero + full-width rows | `experiences.hero`, `experiences.featured`, `experiences.row.*` | zebra wide row |
| Reserva | focused step with atmospheric side field | `booking.hero`, `booking.confirmation` | zebra side/confirmation |
| Tienda `/tienda` | ritual hero + editorial bento | `store.hero`, `store.product.*`, `store.ritual-banner` | zebra wide/square |
| Producto | dominant detail media + CTA rail | `product.detail`, `product.related` | zebra 4:5 + related banners |
| Carrito | task-first layout + restrained banner | `cart.empty`, optional `store.ritual-banner` | zebra optional banner; no decorative obstruction |
| Checkout | task-first confirmation | `checkout.confirmation` | zebra quiet confirmation |
| Mi Santuario | intimate hero + journal-dominant composition | `sanctuary.hero`, `sanctuary.continue`, `sanctuary.daily`, `sanctuary.journal`, `sanctuary.empty` | quiet zebra + magical layers |
| Loading/error/404 | editorial recovery scene | `states.loading`, `states.empty`, `states.error`, `states.offline`, `not-found.hero` | zebra state-specific |

## Asset contract for future photography

Every future asset must provide:

- stable slot id from `editorial-media.ts`;
- local path under `frontend/public/editorial/` or an approved build-time asset source;
- meaningful alt text in ES and EN when informative;
- focal point or `object-position` for 390, 768, 1280 and 1440;
- intended ratio and crop behavior;
- `priority` justification if it is LCP media;
- expected compressed dimensions and format;
- confirmation that the image is approved for the Marisol/Frecuencia Mágica brand;
- no replacement of a zebra fallback until the asset passes visual, accessibility and performance checks.

## Validation matrix

| Gate | Evidence required |
|---|---|
| Architecture | UI Kit remains pure; world engine mounted once; features own composition; no route bypasses i18n navigation |
| Identity | Full-bleed media fields, zebra fallbacks, magical forms visible, no generic gray cards, no accidental palette drift in new code |
| Responsive | 390/768/1280/1440, no overflow, crops preserve focal subject, player/nav do not overlap |
| Accessibility | 44 px targets, readable text, scrim contrast, focus ring, alt semantics, `aria-pressed`, `aria-expanded`, `aria-live`, reduced motion |
| Performance | stable aspect ratios, correct `sizes`, only LCP media priority, below-fold lazy loading, canvas/cursor/scroll cleanup |
| i18n | ES/EN parity, expanded copy does not break full-bleed composition, slot labels and metadata localized where visible |
| States | loading, empty, error, 404, cart empty, checkout confirmation and booking confirmation use the same editorial-magic grammar |
| Final | detector once, full gate, diff review, no accidental image URLs or generated binaries |

## Plan self-review

- **Spec coverage:** The plan covers shell, world engine, all nine realms, nested course/lesson/reservation/product/cart routes, states, asset handoff, accessibility, performance, responsive QA and documentation.
- **No real imagery introduced:** every task uses contracts and zebra fallbacks; asset production is explicitly outside scope.
- **Identity continuity:** the cosmic engine, animated forms, palette, typography, audio and geometry remain first-class; photography changes composition and material, not the product soul.
- **No backend expansion:** existing simulated flows and `// TODO(backend)` seams remain.
- **Verification:** every block has focused checks and the final task includes detector plus canonical gate.
- **Known intentional trade-off:** the new full-bleed world will be visually implemented with zebra fallbacks until approved photography arrives; those fallbacks are part of the design system, not unfinished gray placeholders.
- **Execution dependency:** implement Task 1 and Task 2 before any route composition; complete Task 3 before all per-view work; execute Tasks 4–13 route by route; finish with Tasks 14–15.

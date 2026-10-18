# Temas globales Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans (se ejecuta en la sesión, sin subagentes). Steps use checkbox (`- [ ]`) syntax.

**Goal:** Sustituir las nueve atmósferas por lugar por cinco temas globales (night, dusk, dawn, moon, forest) que cambian los tokens de todo el sitio, con motor de partículas e imágenes propios por tema.

**Architecture:** `data-atmosphere` en `<html>` sigue siendo el único mecanismo de tokens; lo que cambia es que lo decide una elección global persistente (`localStorage`) con el tema sugerido del realm como respaldo. El lienzo recibe una escena por tema (datos puros) y las imágenes se resuelven como `slot@tema` con la base como respaldo.

**Tech Stack:** Next.js 15 · React 19 · Tailwind v4 (`@theme` + tokens) · Zustand · Vitest · Canvas 2D en worker.

**Spec:** `docs/superpowers/specs/2026-10-17-temas-globales-design.md`

## Global Constraints

- Todo desde `frontend/`. Gate: `npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build`.
- Un commit por tarea (Conventional Commits en inglés, `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`); `format:check` antes de cada commit.
- Paleta cerrada: los hex de tema viven sólo en los bloques `[data-atmosphere]` de `tokens.css`. Nada de `text-[Npx]`, `z-[N]`, `rgba()` de la paleta sueltos.
- Copy en ES y EN (`messages/{es,en}.json`); `src/types/messages.d.ts` se tipa desde `es.json`.
- Animar sólo `transform`/`opacity`; `prefers-reduced-motion` respetado; hit targets ≥ 44 px; `aria-hidden` en lo decorativo.
- Los tests guardia se actualizan al nuevo contrato, nunca se debilitan.

## Review Focus

- Recarga directa en `/academia` sin elección: arranca en `dawn` (sin destello de noche); con elección guardada gana la elección.
- Valor guardado corrupto o de un tema eliminado (`study`) → se descarta y vale «Automático».
- Cambiar de tema con `prefers-reduced-motion`: cambio inmediato, lienzo con frame quieto.
- Cambiar de tema con el portal ocupado: sin fundido propio.
- Slot con variante sólo en algunos temas: los demás temas ven la base, nunca un hueco.

---

### Task 1: Núcleo de datos del tema

**Files:** modify `src/types/atmosphere.ts`, `src/config/atmospheres.ts`, `src/stores/atmosphere-store.ts`, `src/lib/atmosphere/resolve.ts`, `src/lib/atmosphere/boot-script.ts`, `src/lib/audio/drone.ts`, `src/hooks/use-atmosphere.ts`, `src/hooks/use-engine-profile.ts`, `src/hooks/use-arrival.ts`; delete `src/lib/atmosphere/picker.ts`; tests `tests/config/atmospheres.test.ts`, `tests/lib/atmosphere-{resolve,boot,engine-profile,canvas-pause}.test.ts`, `tests/lib/drone.test.ts`.

**Interfaces:**
- Produces: `AtmosphereId = 'night'|'dusk'|'dawn'|'moon'|'forest'`; `ATMOSPHERES` con `scheme`, `themeColor`, `engine`, `droneNote`; `PLACE_ATMOSPHERE` (tabla de § 3 del spec); `ATMOSPHERE_STORAGE_KEY = 'fm.atmosphere'`, `ATMOSPHERE_STORE_VERSION = 1`; store con `choice: AtmosphereId | null`, `setChoice(id)`, `clear()`; `resolveAtmosphere(place: Place, choice?: AtmosphereId | null): AtmosphereId`; `baseNoteFor(atmosphereId, realmId)`.
- Elimina: `LISTENING_PLACES`, `PICKER_ATMOSPHERES`, `lib/atmosphere/picker.ts`, `backdropSlot`.

- [ ] **Step 1:** Reescribir los tests: `resolveAtmosphere('academia')` → `'dawn'`; `resolveAtmosphere('resonario', 'forest')` y `resolveAtmosphere('academia', 'forest')` → `'forest'`; `PLACE_ATMOSPHERE` exacto del spec; el script de arranque con `localStorage` (`fm.atmosphere`, versión 1) y con un valor `'study'` guardado → ignora y usa el del lugar.
- [ ] **Step 2:** Run `npx vitest run tests/config tests/lib/atmosphere-resolve.test.ts tests/lib/atmosphere-boot.test.ts tests/lib/drone.test.ts` → FAIL.
- [ ] **Step 3:** Implementar. Store con `localStorage`; `merge` descarta ids que ya no existen. Script de arranque: misma lógica sin `LISTENING`. `baseNoteFor` devuelve la nota del realm si el tema es el sugerido del lugar y la del tema si no. `use-engine-profile` ya no distingue `mounted`: el script de arranque fija el mismo tema que el hook. `use-arrival`: `choice` en lugar de `manual`.
- [ ] **Step 4:** Run los mismos tests → PASS; `npm run typecheck` fallará en los consumidores de las tareas 4–5, aceptable hasta su tarea (dejar `TODO` no: completar cada consumidor cuando se toque).
- [ ] **Step 5:** Commit `refactor(atmosphere): make the theme a global persisted choice`.

### Task 2: Tokens de los cinco temas

**Files:** modify `src/app/tokens.css`, `src/app/globals.css` (si hay reglas por atmósfera), tests `tests/lib/{palette,atmosphere-contrast,atmosphere-tokens,semantic-color-css,scrim-deep}.test.ts`.

**Interfaces:** Produces `--nebula-a|b|c` (tripletes RGB, en `:root` para `night` y en cada bloque), y los bloques `night|dusk|dawn|moon|forest` completos. Elimina los bloques `study|store|gathering|marisol`.

- [ ] **Step 1:** Ajustar los tests a cinco ids y añadir a `atmosphere-tokens.test.ts` la comprobación de que cada tema declara `--nebula-a|b|c`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Borrar los cuatro bloques; añadir `--nebula-*` (valores de la tabla de § 4: noche teal `150 198 188` / lavanda `185 176 214` / oro `216 185 120`; dusk coral/ámbar/malva; dawn cielo/durazno/dorado; moon acero/plata/lavanda; forest verde/dorado verdoso/teal). Revisar el contraste de `dawn` tras quitar `study` (ya es el esquema claro de referencia).
- [ ] **Step 4:** Run `npx vitest run tests/lib` → PASS.
- [ ] **Step 5:** Commit `feat(tokens): declare nebula colors per theme and drop the place atmospheres`.

### Task 3: Escenas del motor por tema

**Files:** create `src/lib/cosmic/themes.ts`; modify `src/lib/cosmic/{scene,particles,protocol,cosmic.worker}.ts`, `src/components/world/{cosmic-canvas,nebula-layer,brand-figures}.tsx`; tests `tests/lib/cosmic-themes.test.ts`, `tests/lib/cosmic-particles.test.ts` (existentes o nuevos).

**Interfaces:**
- Produces `type SceneTheme = { stars: { count: number; rgb: Rgb; alpha: number; twinkle: number }; particles: { kind: 'rise'|'ember'|'mote'|'firefly'|'dust'; count: number; rgb: Rgb | null /* null = acento del realm */; radius: [number, number]; alpha: [number, number]; speed: number }; nebulaAlpha: number }` y `SCENE_THEMES: Record<AtmosphereId, SceneTheme>`; `advanceParticle(p, kind, time, random)`; `CosmicScene.setTheme(id: AtmosphereId): void`; mensaje `{ type: 'theme'; theme: AtmosphereId }` y `init.theme`.
- La noche reproduce exactamente el original (220 estrellas marfil, 54/28 partículas `rise` del acento, nebulosas fijas).

- [ ] **Step 1:** Tests: `SCENE_THEMES` tiene los cinco ids; `night` conserva los recuentos; `dawn.stars.count === 0`; ningún tema supera 220 estrellas ni 54 partículas; `advanceParticle` con `firefly` mantiene `x,y` en `[−0.05, 1.05]` tras 10 000 pasos con `random` fijo; con `rise` reaparece abajo al salir por arriba (comportamiento actual).
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implementar `themes.ts` (datos de § 4). `scene.ts` guarda el perfil activo, genera estrellas/partículas según él y hace el fundido de cambio (alfa global 1→0 en ~350 ms, cambia el perfil, 0→1) sobre el tiempo del frame; con `reduced` cambia de golpe. `CosmicCanvas` envía `theme` al montar y al cambiar `useAtmosphere().atmosphereId`. `NebulaLayer` sustituye los tres rgba fijos por `rgb(var(--nebula-a) / 0.10)` etc. Revisar `brand-figures` y el cursor por colores fijos de noche.
- [ ] **Step 4:** Run tests → PASS; abrir `npm run dev` y comprobar a ojo cada tema en `/` (una tanda de capturas 1440 y 390).
- [ ] **Step 5:** Commit `feat(world): paint a living scene for each theme`.

### Task 4: Control de tema y retirada de lo local

**Files:** create `src/components/layout/theme-switcher.tsx`; modify `site-header.tsx`, `realm-menu.tsx` (si no cabe en móvil), `components/world/atmosphere-provider.tsx`, `src/app/[locale]/inicio/page.tsx`, `components/features/home/{store-showcase,arrival-section}.tsx`, `resonario-system.tsx`, `descubrete/{result-step,discover-arrival}.tsx`, `src/app/[locale]/{academia,experiencias,tienda,sobre-marisol}/…/page.tsx`, `messages/{es,en}.json`, `src/config/videos.ts`; delete `features/atmosphere/{atmosphere-picker,atmosphere-hero,atmosphere-band}.tsx`, `hooks/use-atmosphere-painting.ts`, `lib/atmosphere/painting.ts`, `components/ui/{atmosphere-scope,scope-backdrop}.tsx` (y exportaciones); tests `tests/lib/{band-chain,academy-editorial}.test.ts` y los que cuenten estos archivos.

**Interfaces:** Consumes `useAtmosphereStore` (T1). Produces `<ThemeSwitcher />` (sin props); claves i18n `atmospheres.switcher.{label,auto,autoDescription}` y `atmospheres.<id>.{name,description}`.

- [ ] **Step 1:** Test de lógica `tests/lib/theme-switcher-options.test.ts`: la lista de opciones es `['auto', ...ATMOSPHERE_IDS]` y la opción pulsada es `auto` si `choice === null`. Extraer esa lógica a `src/lib/atmosphere/switcher.ts` (`switcherOptions()`, `pressedOption(choice)`).
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar `ThemeSwitcher` (botón con la muestra del tema activo, panel `role="radiogroup"`, cinco muestras con su nombre y «Automático», `Escape` cierra, foco devuelto al botón; anuncio ya cubierto por `AtmosphereProvider`). Quitar `AtmosphereScope`/`ScopeBackdrop` de la Home; `ArrivalSection` y `ArrivalPanel` leen el tema global; los héroes de Academia, Tienda, Experiencias y Sobre Marisol pasan a sus slots `academy.hero`, `store.hero`, `experiences.hero`, `about.hero` (el slot `atmosphere.*` ya no existe tras T5); `videos.ts` apunta a `about.hero`. Eliminar `scrimTone` si T5 lo deja sin uso.
- [ ] **Step 4:** Run `npx vitest run` + `npm run typecheck` → PASS. **Step 5:** Commit `feat(layout): add the global theme switcher and drop the local scopes`.

### Task 5: Imágenes por tema

**Files:** modify `src/config/editorial-media.ts` (quitar `atmosphere.study|store|gathering|marisol|dusk|dawn|moon|forest`; `forest-autumn` se queda), `src/lib/editorial/asset-registry.ts`, `src/types/editorial-media.ts`, `src/components/ui/editorial-image.tsx`, `src/components/ui/editorial-overlay.tsx`, `src/app/globals.css`, `Branding/` scripts de ingest (`frontend/scripts/` o equivalente); create `src/components/ui/themed-photo.tsx`; mover `public/editorial/atmosphere-<id>*.avif` a `<slot>-<tema>*.avif`; regenerar `editorial-assets.generated.ts` con `npm run editorial:ingest`; tests `tests/lib/{editorial-media,editorial-visual,editorial-variants,editorial-theme-variants}.test.ts`.

**Interfaces:**
- Produces `EditorialMedia.variants?: Partial<Record<AtmosphereId, string>>`; clave de manifiesto `slot@tema` / `slot:instancia@tema`; `THEME_VARIANT_SLOTS: Partial<Record<EditorialMediaSlot, readonly AtmosphereId[]>>` en `config/editorial-media.ts` (los slots que **deben** tener variante por tema, regla de § 6 del spec); `<ThemedPhoto media sizes … />` (cliente).
- Reasignación: `atmosphere.study→academy.hero@dawn`, `store→store.hero@dawn`, `gathering→experiences.hero@dusk`, `marisol→about.hero@dawn`, `dusk|dawn|moon|forest→resonario.hero@<tema>`.

- [ ] **Step 1:** Tests: `resolveEditorialMedia('academy.hero')` devuelve `variants.dawn`; un slot sin variantes no trae `variants`; para cada `[slot, temas]` de `THEME_VARIANT_SLOTS` existe la entrada de manifiesto **o** figura como pendiente en `photography-status.js` (el test cruza ambos); el overlay no recibe `scrimTone`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implementar. `EditorialMatter` usa `ThemedPhoto` cuando `media.variants` existe: base en el HTML con `data-photo-themes="dawn dusk"`, y tras montar la variante del tema activo (`useAtmosphere`) con `opacity` 0→1. CSS en `globals.css`: `[data-atmosphere='dawn'] [data-photo-themes~='dawn'] > [data-photo-base] { opacity: 0 }` por cada uno de los cuatro temas. `EditorialOverlay` usa siempre `--scrim-deep` para el peldaño denso.
- [ ] **Step 4:** Run tests + `npm run typecheck` → PASS. **Step 5:** Commit `feat(editorial): resolve photos per theme with the night photo as base`.

### Task 6: Prompts, brief y documentación

**Files:** modify `Branding/src/data/photography.js`, `Branding/src/data/photography-status.js`, `Branding/scripts/export-chatgpt-prompts.mjs` (si hace falta la sección «Variantes por tema»), regenerar `docs/prompts-chatgpt.md` y `docs/brief-fotografico.md`, `docs/materiales-pendientes.md`; modify `DESIGN.md` § Atmósferas, `AGENTS.md` (enmienda), `CLAUDE.md` (sección Ambientes), `docs/superpowers/plans/sections-plan-completed.md`, `frontend/docs/{accessibility,performance,fidelity-checklist}.md`, `Branding/src/` (puertos de `AtmosphereBackdrop` y la muestra de atmósferas a cinco).

**Interfaces:** Consumes `THEME_VARIANT_SLOTS` (T5). Cada entrada nueva de `SLOTS` lleva `theme`, `file: '<slot>-<tema>.png'`, el mismo ratio y prioridad que el slot base, `style: 'atmosphere'`.

- [ ] **Step 1:** El test `photography-brief.test.ts` debe fallar al añadir una variante de `THEME_VARIANT_SLOTS` sin entrada en el brief.
- [ ] **Step 2:** Añadir las entradas al brief con un prompt por variante (escena luminosa de ese tema y el mismo encuadre del slot base; el centro calmado; «Avoid» de atmósferas), marcarlas `faltante` en el estado, `npm run export:photo-brief` y `npm run export:chatgpt-prompts` desde `Branding/`.
- [ ] **Step 3:** Actualizar los documentos (cinco temas, global, motor por tema, imágenes por tema) y `npm run build` de `Branding/`.
- [ ] **Step 4:** Commit `docs: describe the global themes and add the per-theme image prompts`.

### Task 7: Verificación

- [ ] Gate completo desde `frontend/`.
- [ ] Una tanda de capturas (Chrome): 5 temas × Home, Resonario, Academia, Tienda a 1440 y 390, más recarga directa en `/academia` y en `/en/store` con un tema elegido. Corregir lo que muestre en un solo lote y confirmar con una segunda tanda como máximo.
- [ ] Actualizar `sections-plan-completed.md` y la memoria del proyecto.

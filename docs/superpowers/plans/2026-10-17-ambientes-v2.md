# Ambientes v2 — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pasar el sitio de un tema nocturno único a un sistema de atmósferas (fondo, luz, superficies, controles, reproductor y sonido) que alterna claro y oscuro, responde a «¿Cómo llegas hoy?», amplía la escucha con un motor de audio real y da presencia a la tienda y a los videos.

**Architecture:** Un registro de atmósferas (`config/atmospheres.ts`) y un bloque de tokens por atmósfera en `tokens.css` que **redefine los tokens semánticos** que ya leen las utilidades (escalera `fg`, acentos de texto, líneas, superficies, scrims). Un `AtmosphereProvider` escribe `data-atmosphere`/`data-scheme` en `<html>`; un `AtmosphereScope` los escribe en una sección. El fondo cambia con un fundido de `opacity` entre capas. El audio pasa a un motor Web Audio único (archivos y síntesis, capas, un solo canal) que alimenta el `PlayerDock` existente.

**Tech Stack:** Next.js 15 App Router · React 19 · TypeScript strict · Tailwind v4 (`@theme` en `tokens.css`) · `motion` · next-intl · Zustand · Web Audio · Vitest.

**Spec:** `docs/superpowers/specs/2026-10-17-ambientes-v2-design.md` (manda en qué y por qué). Contrato visual vigente: `DESIGN.md`, `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md`, `AGENTS.md`. Brief de imágenes ya actualizado: `docs/brief-fotografico.md`, `docs/prompts-chatgpt.md`.

## Global Constraints

- Rama propia `feat/ambientes-v2` (usa `superpowers:using-git-worktrees`). Un commit por tarea, Conventional Commits en inglés con el trailer que fija `AGENTS.md`; **`npm run format:check` antes de cada commit** (memoria del proyecto: un commit por arreglo).
- Todo comando de web se ejecuta desde `frontend/`; los de `Branding/` desde `Branding/`. **Nunca pasar Prettier de `frontend/` por archivos de `Branding/`** (tienen otro estilo: sin punto y coma; ya se rompieron una vez).
- Gate de terminado de cada fase: `npm run format:check && npm run lint && npm run typecheck && npm run test && npm run build`; si se toca `tokens.css` o el UI Kit, también `npm run build` en `Branding/`. Tras `build`, reiniciar `npm run dev`.
- Paleta: los hex sólo viven en `tokens.css` (los bloques de atmósfera son la excepción nueva y se declara en `palette.test.ts`). Sin colores ni fuentes fuera de ahí; `Branding/` no declara colores.
- Copy siempre ES **y** EN en `messages/{es,en}.json`, voz íntima y serena, sin lenguaje clínico ni afirmaciones médicas; nunca texto en componentes. Enlaces con `Link` de `@/i18n/navigation`. Sin emojis (salvo ✓).
- Server Components por defecto; `"use client"` sólo con estado/efectos/animación imperativa. Un componente por archivo (~200 líneas). `components/ui/` es puro: no importa `data/`, `stores/` ni `i18n/`. Si cambia una primitiva del UI Kit, se actualiza su puerto en `Branding/src/components/ui/`.
- Animar sólo `transform` y `opacity`; `prefers-reduced-motion` siempre respetado (`useReducedMotionSafe`); hit targets ≥ 44 px; foco visible; `aria-label` en controles sólo-icono; capas decorativas `aria-hidden`; texto ≥ 15 px salvo kicker 11 y meta 13; escalas con nombre (`text-fg-*`, `tracking-*`, `z-*`; las nuevas se registran en `lib/cn.ts`).
- Contraste AA (4,5:1 texto; 3:1 UI grande y foco) **por atmósfera**, comprobado por test, incluido el caso sin imagen (su degradado de respaldo).
- Lo de `AGENTS.md` sigue: no backend (`// TODO(backend)` donde entraría), sin stock ni cajas grises, breakpoints 1440/1280/768/390.
- Tests nuevos en `tests/` (espejo de `src/`, sólo lógica). Los guardas que cambian de contrato (`palette`, `branding-tokens`, `editorial-media`, `photography-brief`, `z-layers`, `navigation`) se actualizan sin debilitarlos.
- Marisol aún no entrega audio, video, fotos ni catálogo real: nada se inventa como real. Lo que falte se muestra «Próximamente» y consta como provisional.
- Las imágenes las genera Sergio con `docs/prompts-chatgpt.md` y entran por `npm run editorial:ingest` (PNG a `frontend/.editorial-originals/`, estado en `Branding/src/data/photography-status.js`). **Ninguna tarea puede depender de que ya estén**: cada slot tiene respaldo.

## Review Focus

1. **Primer pintado en una ruta clara** (visita directa, recarga, enlace): no debe verse la noche un instante ni perder la elección manual. → T0.6.
2. **Cambiar de pista rápido o con el navegador bloqueando el audio**: nunca dos sonidos a la vez; si el contexto está suspendido, la interfaz no finge que suena. → T2.3.
3. **Pistas «Próximamente» o no reproducibles**: no deben entrar por siguiente/anterior, por la muestra ni por la respuesta de «¿Cómo llegas hoy?». → T2.2, T2.4, T2.8.
4. **Diario con entradas de la v1 (ánimo guardado como índice)**: tras la migración no se pierde ni se rompe ninguna; un id desconocido cae a una etiqueta neutra. → T2.7.
5. **Movimiento reducido o ahorro de datos**: sin deriva, sin loop de video y sin fundido animado; el cambio de atmósfera sigue anunciándose a lectores de pantalla. → T0.7, T1.2, T2.11.

---

# Fase 0 — Fundaciones

### Task 0.1: Enmienda de contratos y documentación

**Files:** Modify `AGENTS.md`, `DESIGN.md`, `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` (nota de enmienda en §2 y §4), `frontend/README.md` (checklist de realm), `docs/superpowers/plans/sections-plan-completed.md`; actualizar también `CLAUDE.md` local (está en `.gitignore`, no se versiona).

**Interfaces:** Produces: el contrato escrito que los tests de T0.3/T0.5 hacen cumplir.

- [ ] Redactar en `AGENTS.md` la enmienda: la paleta de marca sigue cerrada; las **atmósferas** son una capa declarada sólo en `tokens.css`; «sin stock» pasa a «sin stock genérico; fotografía propia o con licencia comercial documentada»; el fondo de app es el de la atmósfera activa (la noche es una de nueve).
- [ ] Añadir en `DESIGN.md` una sección «Atmósferas»: catálogo de 9 con su carácter (tabla del spec §4.2), qué es común de marca (§4.3), tokens que redefine cada una y las reglas de contraste y de imagen natural. Corregir los pasajes que dicen «universo nocturno» como única verdad.
- [ ] Anotar en el spec editorial que §2 («paleta exacta», «luz dorada sobre fondo oscuro») y §4 («sin stock») quedan enmendados por el spec v2.
- [ ] Añadir a la checklist «Añadir un realm nuevo» el paso de su atmósfera por defecto; registrar la fase en `sections-plan-completed.md`.
- [ ] Verificar: `npm run format:check`. Commit (`docs`).

### Task 0.2: Registro de atmósferas y resolución

**Files:** Create `frontend/src/types/atmosphere.ts`, `frontend/src/config/atmospheres.ts`, `frontend/src/lib/atmosphere/resolve.ts`; modify `frontend/src/lib/realm-from-pathname.ts` (nueva función hermana); Test `frontend/tests/lib/atmosphere-resolve.test.ts`, `frontend/tests/config/atmospheres.test.ts`.

**Interfaces:** Produces:
- `AtmosphereId`: `night | dusk | dawn | moon | forest | study | store | gathering | marisol`.
- `ATMOSPHERES`: por id, `{ scheme: 'dark' | 'light' | 'warm', themeColor, engine: { canvas, nebula, figures }` (multiplicadores 0–1 de las capas del world engine), `droneNote` (Hz), `backdropSlot` (id de slot editorial) }`.
- `Place` = `RealmId | 'story'`; `placeFromPathname(pathname): Place` (como `realmFromPathname`, pero `/sobre-marisol` y `/about-marisol` devuelven `'story'`).
- `PLACE_ATMOSPHERE`: academia→`study`, tienda→`store`, experiencias→`gathering`, story→`marisol`; portal, home, auth, descubrete, resonario, sanctuario→`night`. `LISTENING_PLACES` = descubrete, resonario, sanctuario.
- `resolveAtmosphere(place, manual): AtmosphereId`: si el place es de escucha y hay `manual`, gana `manual`; si no, el default del place.
- `suggestNightAlternative(hour): boolean` (verdadero a partir de las 21 h y hasta las 5 h; la hora llega por parámetro).

- [ ] Escribir tests: (a) cada place tiene atmósfera por defecto y cada id de `ATMOSPHERES` existe; (b) `manual` se ignora fuera de `LISTENING_PLACES` y gana dentro; (c) `placeFromPathname` cubre ES y EN, con y sin prefijo `/en`, y la ruta huérfana cae a `portal`; (d) `suggestNightAlternative` en 20, 21, 23, 4, 5; (e) todo `backdropSlot` existe en `EDITORIAL_MEDIA_SLOTS`.
- [ ] Verificar que fallan; implementar; verificar que pasan.
- [ ] Reutilizar el mapa `SEGMENT_TO_REALM` sin duplicarlo. Commit.

### Task 0.3: Tokens por atmósfera y guarda de contraste

**Files:** Modify `frontend/src/app/tokens.css`, `frontend/src/lib/cn.ts`, `frontend/tests/lib/palette.test.ts`, `frontend/tests/lib/branding-tokens.test.ts` (si procede), `Branding/src/pages/DesignSystem.jsx` (+ sección en `Branding/src/pages/sections/`); Create `frontend/tests/lib/atmosphere-tokens.test.ts`, `frontend/tests/lib/atmosphere-contrast.test.ts`, `frontend/tests/helpers/css-tokens.ts`.

**Interfaces:** Consumes: `AtmosphereId` (T0.2). Produces: el **conjunto de tokens semánticos** que redefine cada bloque `[data-atmosphere='<id>']` y que consumen T0.5–T2: escalera `fg` (5 peldaños), `accent`, `accent-2`, `accent-3` (acentos **aptos como texto**), `line` y `line-strong` (bordes), `surface` y `surface-strong` (vidrio), `on-accent` (tinta sobre relleno), tripletes RGB `scrim` y `halo` (para `rgb(var(--…) / a)`), `atmo-bg` (gradiente de fondo) y `atmo-backdrop` (degradado de respaldo sin foto). `helpers/css-tokens.ts` lee un bloque de `tokens.css` y devuelve sus valores.

- [ ] Test `atmosphere-tokens`: existe un bloque por cada `AtmosphereId` y define **todos** los tokens del conjunto; `night` repite exactamente los valores actuales (`accent`=oro, `accent-2`=teal, `accent-3`=lavanda, `fg*`=marfil con sus opacidades, `surface`=glass, `line`=glass-brd): la noche no cambia nada.
- [ ] Test `atmosphere-contrast`: para cada atmósfera, calcular WCAG de `fg`/`fg-body`/`fg-soft`/`fg-muted`/`fg-meta` y de `accent`/`accent-2`/`accent-3` contra **el punto más claro y el más oscuro** de `atmo-bg`, de `surface` compuesto sobre ellos y de `atmo-backdrop`; texto ≥ 4,5:1, `line`/foco ≥ 3:1.
- [ ] Verificar que fallan. Escribir los 8 bloques nuevos con valores provisionales siguiendo el carácter del spec §4.2 (los hex definitivos se calibran contra la fotografía en Fase 1); iterar hasta que el contraste pase. En las claras, el acento de texto es un derivado oscuro del oro/teal/lavanda de marca, nunca el original.
- [ ] Registrar en `lib/cn.ts` los tokens nuevos (grupos de color de texto/borde/fondo). Actualizar `palette.test.ts` para permitir hex dentro de los bloques de atmósfera de `tokens.css` y nada más.
- [ ] Mostrar las 9 atmósferas en el showcase de `Branding/` leyendo los tokens en vivo (sin declarar colores allí). Gate de `Branding/`. Commit.

### Task 0.4: Guarda de uso de color semántico

**Files:** Create `frontend/tests/lib/semantic-color-usage.test.ts`; usa `tests/helpers/source-files.ts`.

**Interfaces:** Produces: la lista de **utilidades de paleta cruda** prohibidas fuera de la lista de excepciones —`text|bg|border|ring|from|via|to|divide|shadow` con `ivory`, `void`, `void-2`, `gold`, `teal`, `lav`, `glass`, `glass-brd`, y `rgba()` de la paleta en JSX— y la **lista de excepciones** (`ALLOWED`), cada una con su motivo (logo e isotipo, geometría y halos del world engine, brand figures, cursor, portal).

- [ ] Escribir el test para que falle con el estado actual y, de golpe, se ponga en verde sembrando `ALLOWED` con **todos** los archivos que hoy incumplen (generados con un grep; el test imprime los que sobran o faltan). El objetivo de T0.5 es vaciar esa lista salvo los decorativos.
- [ ] Verificar y commit.

### Task 0.5: Barrido a tokens semánticos

Tres cortes; en cada uno la noche debe verse **idéntica** (los valores no cambian) y la lista `ALLOWED` de T0.4 se reduce.

**Files:** corte (a) `components/ui/*` (button, badge, pill, input, textarea, field, glass-panel, modal, icon-button, kicker, seek-bar, progress-bar, segmented-control, equalizer, skeleton, media-skeleton, prose, empty-state, error-state) y sus puertos en `Branding/src/components/ui/`; corte (b) `components/layout/*` (site-header, realm-nav, realm-menu, site-footer, talk-float, audio-toggle, newsletter-form, brand-mark) y `components/features/player/*`; corte (c) `components/ui/editorial-overlay.tsx`, `band.tsx`, `editorial-banner.tsx`, `full-bleed-section.tsx`, `frequency-disc.tsx`, y las vistas de `components/features/*` y `app/[locale]/*` con clases crudas.

**Interfaces:** Consumes: tokens de T0.3. Produces: cero uso de paleta cruda salvo `ALLOWED`; `EditorialOverlay` y los scrims leen `scrim`; `Kicker`, `Button tone` y `Badge` mapean oro/teal/lavanda a `accent`/`accent-2`/`accent-3` conservando sus nombres de API; el overlay gana una opción de **tono de scrim** (oscuro o claro) elegida por el esquema.

- [ ] Para cada corte: migrar utilidades (`text-ivory`→`text-fg`, `text-gold|teal|lav`→`text-accent*`, `border-gold/NN`→`border-line*`, `bg-glass`/`fm-surface*`→`surface*`, scrims `void`→`scrim`), quitar de `ALLOWED` los archivos migrados y ejecutar `npm test` (el guarda y el resto deben pasar).
- [ ] Verificar la noche idéntica: capturas antes/después en 1440 y 390 de Home, Resonario, Tienda y Acceso (Chrome); cualquier diferencia visible es un bug del barrido.
- [ ] Los decorativos que se queden en `ALLOWED` (halos, aros, figuras, cursor, portal) **no se migran**: su visibilidad en atmósferas claras la gobierna el perfil de engine (T0.7).
- [ ] Gate completo + `Branding/` build. Un commit por corte.

### Task 0.6: Proveedor de atmósfera, store y arranque sin parpadeo

**Files:** Create `frontend/src/stores/atmosphere-store.ts`, `frontend/src/hooks/use-atmosphere.ts`, `frontend/src/components/world/atmosphere-provider.tsx`, `frontend/src/components/ui/atmosphere-scope.tsx`, `frontend/src/lib/atmosphere/boot-script.ts`; modify `frontend/src/app/[locale]/layout.tsx`; Tests `frontend/tests/stores/atmosphere-store.test.ts`, `frontend/tests/lib/atmosphere-boot.test.ts`.

**Interfaces:** Consumes: `resolveAtmosphere`, `placeFromPathname`, `PLACE_ATMOSPHERE`. Produces:
- `useAtmosphereStore`: `manual: AtmosphereId | null`, `setManual(id)`, `clear()`; persistido en **`sessionStorage`** con clave `fm.atmosphere` (no `localStorage`: la elección dura la sesión).
- `useAtmosphere(): { atmosphereId, scheme }` (efectiva, según ruta y elección).
- `AtmosphereScope` (UI puro): recibe `atmosphere` y `children`, pinta un contenedor con `data-atmosphere`/`data-scheme` para re-tematizar una sección.
- `atmosphereBootScript(): string`: script en línea para `<head>` que, antes del primer pintado, deduce place → atmósfera (más la elección de `sessionStorage`) y fija `data-atmosphere`/`data-scheme` en `<html>`.

- [ ] Tests del store: persiste en `sessionStorage`, `clear` vuelve a `null`, un valor inválido guardado se ignora. Test de arranque: para una batería de rutas ES/EN (todas las de `pathnames`, `/en/...`, huérfana) el atributo que fijaría el script **coincide** con `resolveAtmosphere(placeFromPathname(...), manual)`, con y sin elección guardada.
- [ ] Implementar el provider (escribe los atributos en `<html>` al cambiar la ruta o la elección y actualiza `<meta name="theme-color">`; anuncia el cambio en una región `aria-live="polite"` visualmente oculta, con el nombre traducido de la atmósfera) y montarlo dentro de `RealmProvider`. Inyectar el script de arranque en el layout (`suppressHydrationWarning` ya existe en `<html>`).
- [ ] El Modal se monta en un portal al `body`: comprobar que hereda los tokens porque el atributo vive en `<html>`.
- [ ] Verificar en el navegador: recarga directa de `/academia` (clara) sin destello oscuro. Commit.

### Task 0.7: Fondo con fundido y perfil de engine

**Files:** Create `frontend/src/components/world/atmosphere-backdrop.tsx`, `frontend/src/lib/atmosphere/engine-profile.ts`; modify `world-engine.tsx`, `cosmic-canvas.tsx`, `nebula-layer.tsx`, `brand-figures.tsx`, `app/tokens.css` (el body deja de pintar la noche fija: pinta `atmo-bg`), `components/world/portal-transition.tsx` si el velo usa `--fm-night`; Test `frontend/tests/lib/atmosphere-engine-profile.test.ts`.

**Interfaces:** Consumes: `ATMOSPHERES[id].engine`, `VisualMode`. Produces: `engineProfile(atmosphereId, visualMode): { canvas, nebula, figures }` (opacidades finales = las de `visualMode` actual × el multiplicador de la atmósfera); `AtmosphereBackdrop`, capa fija (`z-world`) que mantiene **dos capas** de fondo y funde por `opacity` al cambiar de atmósfera.

- [ ] Test: en `night` el perfil iguala los mapas actuales por `visualMode` (no hay regresión); en claras, canvas y figuras tienden a 0 y la nebulosa se tiñe suave; con movimiento reducido la duración del fundido es 0 (función pura que recibe `reduced`).
- [ ] Implementar. El fundido nunca anima propiedades de pintado: los tokens de texto cambian bajo el fundido. Respetar el cruce del portal (sigue cubriendo con la noche; `--fm-night` se conserva para el velo).
- [ ] Verificar Home/Academia/Tienda alternando en el navegador, 60 FPS sin saltos. Commit.

### Task 0.8: Header con «Tienda», sección actual y «Menú»

**Files:** Modify `components/layout/site-header.tsx`, `realm-menu.tsx`, `realm-nav.tsx`, `config/navigation.ts`, `messages/{es,en}.json` (`header`, `nav`); Create `frontend/src/lib/navigation/current-section.ts`; Tests `frontend/tests/lib/current-section.test.ts`, ampliar `tests/lib/navigation.test.ts`.

**Interfaces:** Consumes: `placeFromPathname`. Produces: `currentSection(place): { key: 'tienda' | 'descubrete' | … | 'story' | 'home' | 'portal' | 'auth' } | null` (sin etiqueta en portal y acceso); copy `header.store`, `header.menu`, `nav.current` en ES y EN.

- [ ] Tests: `currentSection` para cada ruta ES/EN; `NAV_REALMS` sigue empezando por `tienda`.
- [ ] Implementar: enlace de texto **«Tienda»** visible desde 390 px con acceso al carrito (conteo desde `useCartStore`), el botón de menú dice «Menú» (palabra + icono) y, junto a él, el **nombre de la sección actual**; en < 640 px el acceso se pasa al menú si el header no cabe. La constelación de puntos se conserva como complemento. Sin desbordar a 390 px.
- [ ] Verificar a 1440/1280/768/390 y con teclado. Commit.

**Gate de fase:** gate completo + capturas de la noche idéntica. Commit de cierre.

---

# Fase 1 — Tres muestras (descanso, calma diurna, tienda)

### Task 1.1: Selector manual de ambiente

**Files:** Create `frontend/src/components/features/atmosphere/atmosphere-picker.tsx`; modify `messages/{es,en}.json` (nuevo namespace `atmospheres`: nombre, descripción corta y etiqueta del selector de cada una), `resonario-system.tsx` (cabecera) y `result-step.tsx`.

**Interfaces:** Consumes: `useAtmosphereStore`, `LISTENING_PLACES`, `SegmentedControl`. Produces: `AtmospherePicker` (muestra las atmósferas elegibles —`dusk`, `dawn`, `moon`, y `forest` cuando exista—, marca la activa, permite «volver al ambiente del sitio» y se oculta fuera de los places de escucha).

- [ ] Test (lógica): la lista elegible y el orden salen de config; elegir y limpiar actualiza el store; fuera de los places de escucha no se ofrece.
- [ ] Implementar con `aria-pressed`, hit targets de 44 px y anuncio vía la región del provider (T0.6). Commit.

### Task 1.2: Imagen por atmósfera, respaldo propio y movimiento base

**Files:** Modify `frontend/src/config/editorial-media.ts` (nuevo tipo de respaldo `atmosphere`; los 11 slots nuevos lo usan), `config/realms.ts` (`PhotoTreatment` gana `natural`), `lib/editorial/visual.ts`, `components/ui/media-skeleton.tsx` o el componente que pinta respaldos, `components/ui/editorial-image.tsx`; Create `frontend/src/components/world/landscape-drift.tsx`; Tests ampliar `editorial-media.test.ts`, `editorial-visual.test.ts`, `zebra.test.ts`.

**Interfaces:** Produces: `editorialVisual` devuelve `'atmosphere'` para un slot sin foto con ese respaldo y pinta `atmo-backdrop` de la atmósfera activa (nunca zebra ni caja gris); `natural` desactiva el tinte por acento; `LandscapeDrift`: deriva lenta de la imagen con sólo `transform`/`opacity`, desactivada con movimiento reducido.

- [ ] Tests: el visual de un slot `atmosphere` sin src; `natural` no aplica tratamiento; con `reduced` el drift no se monta; el contrato no deja `mobilePosition` ni `backdrop` fuera de lo ya permitido salvo lo que esta tarea declare.
- [ ] Implementar. **Dependencia de Sergio:** al llegar `atmosphere-dusk|dawn|store`, ingerirlos (`editorial:ingest`) y marcar su estado en `photography-status.js`; hasta entonces se ve el degradado. Commit.

### Task 1.3: Sonido por atmósfera (drone)

**Files:** Modify `frontend/src/hooks/use-ambient-audio.ts`, `lib/audio/drone.ts`; Test ampliar `tests/lib/drone.test.ts`.

**Interfaces:** Consumes: `ATMOSPHERES[id].droneNote`, `useAtmosphere`. Produces: `baseNoteFor(atmosphereId, realmId): number` (usa la nota de la atmósfera si es de escucha o la elegida; si no, la del realm).

- [ ] Test de `baseNoteFor` y de que el re-afinado sigue deslizándose (no salta). Implementar. Commit.

### Task 1.4: Re-tematizar las vistas de las muestras

**Files:** Modify `components/features/resonario/*`, `components/features/player/*` (dock, barra, orbe, mini, disco), `components/features/descubrete/result-step.tsx` y `recommendation-card.tsx`, `components/features/store/{product-grid,product-card,product-detail}.tsx`, `app/[locale]/tienda/(catalogo)/page.tsx` y `tienda/[productId]/page.tsx`, `config/realms.ts` (tienda usa `store`), más los slots `atmosphere.dusk|dawn|store` cableados con alt ES/EN en `messages`; Create `frontend/src/components/features/home/store-showcase.tsx` (versión mínima del bloque de la Home) y su copy.

**Interfaces:** Consumes: tokens, `AtmosphereScope`, slots de atmósfera, `AtmospherePicker`.

- [ ] Resonario y resultado de Descúbrete bajo `dusk` y `dawn` (fondo, luz, tarjetas, botones, reproductor, texto), con el paisaje a protagonismo y color natural; Tienda y detalle de producto bajo `store` con sus ocho imágenes provisionales (los productos reales son de Marisol).
- [ ] `StoreShowcase` en la Home dentro de un `AtmosphereScope store`, entre secciones oscuras: 3–4 productos (foto, nombre, precio) y «Ver la tienda» con `ButtonLink`. Los ids destacados salen de config.
- [ ] Un test de lógica por pieza nueva (selección de destacados). Commit por vista.

### Task 1.5: Verificación y paquete de revisión

**Files:** Create `docs/superpowers/audits/2026-10-xx-ambientes-muestras.md` (resultados y capturas); actualizar `frontend/docs/accessibility.md`.

- [ ] Capturas de las tres muestras a 1440/1280/768/390; `atmosphere-contrast` en verde; sin desbordes ni tapados por reproductor/WhatsApp; gate completo.
- [ ] Recalibrar los hex provisionales de T0.3 contra las imágenes reales y volver a pasar el contraste.
- [ ] **PARAR.** Entregar a Sergio el paquete para que Marisol revise en computador y celular (D8: enlace público de vista previa, fuera del repo). La Fase 2 no empieza sin su visto bueno; si cambia el carácter de una atmósfera se corrige aquí.

---

# Fase 2 — Extensión

Orden recomendado: B (audio) → C («¿Cómo llegas hoy?») → A → D → E → F. A, D y E son independientes entre sí tras la Fase 1.

## Atmósferas restantes

### Task 2.1: `moon`, `forest`, `study`, `gathering`, `marisol`

**Files:** Modify `config/atmospheres.ts` (elegibles: `moon`, `forest`), bloques de `tokens.css` ya existentes (pulir), vistas de Academia, Experiencias y Sobre Marisol, `config/realms.ts`; slots `atmosphere.*` cableados con alt ES/EN.

- [ ] Aplicar cada atmósfera a su place por defecto; calibrar y pasar `atmosphere-contrast`. `moon` se ofrece como «otra opción» de noche con `suggestNightAlternative` y en el selector; `forest` (más su variante otoñal si hay foto) para Raíz/Renovación.
- [ ] Test: el place `story` toma `marisol`; capturas a 4 anchos. Commit por atmósfera.

## B. Audio

### Task 2.2: Modelo de catálogo y tipos de escucha

**Files:** Modify `types/content.ts`, `data/audios.ts`, `data/index.ts`; Create `config/audio-kinds.ts`; Tests `tests/data/audios.test.ts` (nuevo) y los existentes de catálogo.

**Interfaces:** Produces: `AudioKind` = `melody | nature | frequency | binaural | guided`; `AUDIO_KINDS` (orden, clave de explicación, slug del banner = el mismo del tipo); `Audio` gana `kind`, `voice`, `availability` (`ready | soon`), `source` (síntesis con receta, archivo con `src` y `sampleSrc` opcional, o ninguna), `license` (`own | licensed | synthetic | provisional`), `headphones`, claves de composición y de guía de escucha; `isPlayable(audio): boolean`.

- [ ] Tests: toda pista `ready` tiene fuente; toda `soon` no la tiene; ninguna pista `provisional` queda sin constar en la lista de pendientes; los ids son únicos; `isPlayable` es falso para `soon`.
- [ ] Reclasificar las 7 pistas actuales (son tonos por Hz → `frequency` con receta sintética) y añadir pistas del catálogo propuesto: binaural y naturaleza **sintéticas provisionales**, y melodías, celta y guiadas como `soon`. Sin inventar duración real de lo que no existe. Commit.

### Task 2.3: Motor de audio

**Files:** Create `frontend/src/lib/audio/engine/{context,synth,file-source,track-graph,engine}.ts`, `frontend/src/hooks/use-audio-engine.ts`, `frontend/tests/helpers/fake-audio-context.ts`; modify `lib/audio/drone.ts` (usa el contexto compartido); Tests `frontend/tests/lib/audio-engine.test.ts`.

**Interfaces:** Produces: un contexto Web Audio **único** creado sólo tras un gesto; `createAudioEngine()` con `play(track, options)` (sustituye con fundido corto: la anterior baja a 0 antes de que suene la nueva), `pause`, `resume`, `stop`, `seek`, `setVolume(0..1)` (por un nodo de ganancia maestro, no por `audio.volume`, por iOS), y suscripción a `{ elapsed, ended, state }`; `options` admite `preview` con tope de segundos y `fadeIn`. Fuentes: tono, **binaural** (un oscilador por oído con la diferencia como pulso), textura de **mar** y de **lluvia** por ruido filtrado, y archivo. Una pista con varias capas es una sola pista.

- [ ] Tests con el contexto falso: (a) sustituir pista rampa a 0 la anterior y nunca hay dos fuentes con ganancia > 0 tras el fundido; (b) pulsar play dos veces rápido deja una sola; (c) binaural crea dos osciladores panoramizados a izquierda y derecha con la diferencia pedida; (d) `setVolume` mueve el maestro; (e) contexto suspendido → `state` queda `blocked` y no `playing`; (f) `preview` se detiene al tope; (g) `elapsed` sale del reloj del contexto.
- [ ] Verificar que fallan; implementar; verificar. El drone y el motor comparten contexto y el drone sigue cediendo ante una pista (`ambient-mix`). Commit.

### Task 2.4: Store del reproductor y dock con volumen

**Files:** Modify `stores/player-store.ts`, `components/features/player/{player-dock,player-bar,player-mini}.tsx`, `lib/player/progress.ts` (siguiente/anterior saltan lo no reproducible), `messages/{es,en}.json` (`player`); Tests ampliar `tests/stores/player-store.test.ts` y `tests/lib/progress.test.ts`.

**Interfaces:** Consumes: `createAudioEngine`, `isPlayable`. Produces: el store gana `volume` (persistido aparte en `fm.player-volume`; el resto del reproductor **sigue sin persistir**), `mode: 'full' | 'preview'` y `engineState`; el temporizador simulado desaparece (quitar el `TODO(backend)` de reproducción simulada); `PlayerBar` admite una ranura de **volumen** siempre visible junto a pausa (móvil: botón de silencio + control); `nextAudioId`/`previousAudioId` reciben el catálogo ya filtrado a reproducibles.

- [ ] Tests: abrir otra pista sustituye y reinicia el tiempo; reabrir la misma no; la muestra al terminar **se detiene** y no reanuda la anterior; volumen persiste y se acota a 0–1; siguiente/anterior nunca devuelven una pista `soon`; con el motor bloqueado `isPlaying` no se queda en verdadero.
- [ ] Implementar; el dock sigue en el layout (continuidad entre secciones). En rutas de tienda, carrito y reserva y por debajo de 768 px, arranca recogido. Commit.

### Task 2.5: Resonario por tipo de escucha

**Files:** Modify `components/features/resonario/{resonario-system,resonario-filters}.tsx`, `lib/resonario/layout-slots.ts`, `app/[locale]/resonario/page.tsx`, `components/features/player/audio-disc.tsx`, `messages/{es,en}.json` (`resonario.kinds.*`, `resonario.guide.*`, texto celta); Create `components/features/resonario/{kind-section,track-guide,sample-button}.tsx`; Tests ampliar `tests/lib/resonario-layout.test.ts`.

**Interfaces:** Consumes: `AUDIO_KINDS`, `Audio` ampliado, slots `resonario.kind-banner.*` y `resonario.celtic`, motor en modo `preview`.

- [ ] Test: el filtro es por `kind` (no por texto traducido); cada tipo tiene explicación ES y EN; el texto celta ES coincide **verbatim** con el de Marisol (`Mensajes Marisol.txt`) y existe su traducción EN; las pistas `soon` se listan «Próximamente» sin control de play.
- [ ] Implementar: secciones por tipo con banner y explicación; cada tarjeta muestra **qué es, cuánto dura y si lleva voz**; la **guía de escucha** (composición, auriculares, postura, para qué momento) se ve antes de reproducir; botón «Escuchar muestra» con etiqueta «Muestra» y acceso a «Escuchar completa». La pieza celta, destacada dentro de `melody` con su texto. Commit.

## C. «¿Cómo llegas hoy?»

### Task 2.6: Registro de llegadas y respuesta

**Files:** Create `frontend/src/config/arrivals.ts`, `frontend/src/lib/arrival/respond.ts`; Test `frontend/tests/lib/arrival-respond.test.ts`, `frontend/tests/config/arrivals.test.ts`.

**Interfaces:** Consumes: `AtmosphereId`, `AudioKind`, `AUDIOS`, `suggestNightAlternative`. Produces: `ArrivalKey` (`mood:<id>` o `intent:<id>`); `ARRIVALS` según la tabla de spec §5.3; `respondToArrival(key, { catalog, hour }): ArrivalResponse` con `atmosphere`, `alternatives` (orden de escucha, sólo reproducibles), `otherAtmospheres` (incluye `moon` si es de noche) y `explanationKey`.

- [ ] Tests: toda mood e intent está mapeada; **cada respuesta ofrece ≥ 2 tipos distintos y el primero nunca es `frequency`** (la regla del tono); sólo se ofrece `moon` entre las 21 h y las 5 h; si una alternativa no es reproducible se salta; una entrada desconocida cae a una respuesta neutra (calma).
- [ ] Implementar. Commit.

### Task 2.7: Estados del diario con ids estables y migración

**Files:** Modify `stores/journal-store.ts`, `components/features/sanctuary/{journal-panel,journal-entry}.tsx`, `messages/{es,en}.json` (`journal.moods`); Tests ampliar `tests/stores/journal-store.test.ts`.

**Interfaces:** Produces: `MoodId` = `calm | tiredness | nostalgia | sadness | joy | gratitude | clarity | breathe`; `JournalEntry.mood` pasa a `MoodId`; migración de `persist` (versión nueva) que convierte los índices de la v1 (calma, alegría, nostalgia, cansancio, gratitud, en su orden original) a ids.

- [ ] Tests: una entrada v1 con cada índice migra a su id; un índice fuera de rango o un id desconocido no rompe y se muestra con etiqueta neutra; el borrador migra igual; guardar sigue exigiendo ánimo y texto.
- [ ] Implementar; «Tristeza» con copy de acompañamiento, sin lenguaje clínico. Commit.

### Task 2.8: Componente de llegada, panel de respuesta y Home

**Files:** Create `components/features/arrival/{arrival-check-in,arrival-panel}.tsx`, `components/features/home/arrival-section.tsx`; modify `components/features/sanctuary/journal-panel.tsx` (usa `ArrivalCheckIn` y conserva su guardado), `hooks/use-discover-result.ts` y `result-step.tsx` (la intención dominante aplica la misma respuesta), `app/[locale]/inicio/page.tsx`, `messages/{es,en}.json` (`arrival`).

**Interfaces:** Consumes: `respondToArrival`, `useAtmosphereStore`, motor de audio, `AtmosphereScope`.

- [ ] Test de lógica (hook o función pura): elegir una entrada fija la atmósfera manual y devuelve la respuesta; «otra opción» cambia la atmósfera sin reiniciar el flujo; recorrer alternativas avanza y envuelve.
- [ ] Implementar: elegir cambia la atmósfera de inmediato (fundido) y abre el panel con una frase de lo que ofrece, 2–3 alternativas recorribles, «elegir otra opción» y un control de parar siempre visible. **La respuesta sonora nace del gesto**, con entrada en fundido a volumen bajo; nunca suena nada al cargar. En la Home el bloque vive en un `AtmosphereScope` que adopta la atmósfera elegida y guarda la elección para Resonario/Descúbrete/Santuario.
- [ ] Commit.

### Task 2.9: Guía de respiración

**Files:** Create `config/breathing.ts`, `components/features/arrival/breathing-guide.tsx`; Test `tests/config/breathing.test.ts`.

**Interfaces:** Produces: `BREATHING` (segundos de inhalar, sostener y exhalar, y rondas); `BreathingGuide`: orbe que inhala y exhala apoyado en el `breathe` del sistema, con indicación en texto. Con movimiento reducido: sin escala, sólo las indicaciones. Reserva el slot de video `breathing-guide` (se llena en E; hasta entonces no se promete nadie en pantalla).

- [ ] Test: las duraciones suman un ciclo > 0 y entran en rangos razonables. Implementar; la entrada «Necesito respirar» la abre. Commit.

## D. Tienda

### Task 2.10: Galería y datos de producto

**Files:** Modify `types/content.ts` (`Product` gana `size`/`contents` opcionales y `gallery`), `data/products.ts`, `config/editorial-media.ts` (+ `Branding/src/data/photography.js` si cambian los slots; regenerar brief y prompts), `components/features/store/{product-detail,product-card}.tsx`, `messages/{es,en}.json`; Test `tests/data/products.test.ts`.

- [ ] Test: el bloque de tamaño/contenido sólo se pinta si el dato existe (no se inventa); la galería admite las tres vistas (envase con etiqueta, detalle de textura, en uso) y cae al visual del producto si faltan. Los ocho productos actuales siguen marcados provisionales.
- [ ] Implementar. **Dependencia de Marisol:** fotos reales y catálogo real; documentar el formato exacto de entrega. Commit.

## E. Videos y cursos

### Task 2.11: Registro de videos y `VideoSlot`

**Files:** Create `config/videos.ts`, `components/features/player/video-slot.tsx`; modify `hooks/use-video-playback.ts` (sin `src` no simula), `video-player.tsx`, `components/features/academy/lesson-player.tsx`, `app/[locale]/inicio/page.tsx` (bienvenida), `app/[locale]/sobre-marisol/page.tsx` (presentación), `messages/{es,en}.json`; Tests `tests/config/videos.test.ts`, ampliar los de reproducción.

**Interfaces:** Produces: `VIDEOS` (`welcome`, `marisol-intro`, `course-intro.<curso>`, `lesson.<curso>.<n>`; cada uno con `src?`, póster, duración, disponibilidad) y `videoState(entry): 'ready' | 'soon'`; `VideoSlot`: con fuente muestra `VideoPlayer`, sin ella muestra póster con «Próximamente» **sin botón de play ni reloj**.

- [ ] Tests: `videoState`; un guarda de código que falla si algún componente renderiza un control de reproducción sin fuente; `useVideoPlayback` ya no avanza tiempo sin `src`; las lecciones sin video no muestran play.
- [ ] Loop de paisaje opcional: `allowsLoopVideo({ reduced, saveData })` puro; sólo reproduce un loop silenciado con póster cuando hay fuente y ambas condiciones lo permiten. Test: falso con movimiento reducido, falso con ahorro de datos, verdadero sólo si ninguna de las dos se da y hay `src`. Commit.

### Task 2.12: Página de curso y módulos

**Files:** Modify `types/content.ts` (`Course`: `access` gratuito/pago con precio, `modality`, claves de «qué aprenderás» y «qué incluye»), `data/courses.ts`, `lib/academy/lessons.ts`, `components/features/academy/{course-detail,lesson-list,course-card}.tsx`, `messages/{es,en}.json`; Create `lib/academy/modules.ts`, `components/features/academy/module-list.tsx`; Tests `tests/lib/modules.test.ts`.

**Interfaces:** Produces: `groupIntoModules(lessons, size): Module[]` (conserva orden y la suma de lecciones es el total); `ModuleList` con plegado `0fr→1fr`.

- [ ] Tests: agrupación (sin pérdida ni repetición, última con resto); la disponibilidad gratuito/pago y la modalidad se muestran siempre; los cursos reales de Marisol (rituales, esencias, gratuitos y de pago) **no se cargan hasta que los entregue**: los tres de demostración quedan marcados provisionales.
- [ ] Implementar la alternancia texto / imagen / video / módulos con el slot `course-intro.<curso>`. Commit.

## F. Ritmo, móvil y registro

### Task 2.13: Ritmo de la Home y transiciones por scroll

**Files:** Modify `app/[locale]/inicio/page.tsx`, `components/ui/band-chain.tsx` si hace falta, secciones de `components/features/home/*`.

- [ ] Aplicar la secuencia del spec §10 (hero noche → frecuencia del día `dawn` → tienda `store` → bento noche → Marisol `marisol` → pie) con `AtmosphereScope` y fundidos de borde (`fm-fade-*`); entradas escalonadas existentes; sin parallax ni movimiento sobre texto. `band-chain.test.ts` sigue pasando. Commit.

### Task 2.14: Pasada móvil y tapados

**Files:** Modify `components/layout/talk-float.tsx`, `app/globals.css` (reservas inferiores), vistas de compra; Create `docs/superpowers/audits/2026-10-xx-ambientes-movil.md`.

- [ ] Capturas a 390 y 768 de Tienda, producto, carrito, Resonario con reproductor y Academia: ni reproductor, WhatsApp ni constelación tapan texto, precio ni botón; el contenido reserva el espacio de los fijos; ningún CTA de compra bajo un flotante. Corregir lo hallado y registrar el resultado. Commit.

### Task 2.15: Registro de materiales pendientes y cierre

**Files:** Create `frontend/scripts/export-pending-materials.ts` (o `.mjs` como `editorial-ingest.mjs`), `docs/materiales-pendientes.md` (generado), `frontend/tests/lib/pending-materials.test.ts`; modify `frontend/package.json` (script), `frontend/docs/{accessibility,performance,fidelity-checklist}.md`, `Branding/` (puertos y showcase al día), `docs/superpowers/plans/sections-plan-completed.md`.

- [ ] Test: el documento committed coincide con lo que genera el script a partir de `AUDIOS` (licencia `provisional`/`soon`), `VIDEOS` (`soon`), productos y cursos provisionales, y de los provisionales del brief; falla si una pista provisional figura como publicable.
- [ ] Actualizar `performance.md` (presupuestos con imágenes de atmósfera y motor de audio) y `accessibility.md` (contraste por atmósfera). Matriz final de capturas a 4 anchos de las 9 atmósferas; gate completo; `Branding/` build. Commit y cierre de rama (`superpowers:finishing-a-development-branch`).

---

## Autorrevisión

- **Cobertura del spec:** §4 sistema → T0.2–T0.7, T1.2, T2.1; §4.5 controles fijos → T0.5(b), T1.4; §4.8 contraste → T0.3; §5 «¿Cómo llegas hoy?» → T2.6–T2.9 (+T2.7 migración); §6 música y motor → T2.2–T2.5, T1.3; §7 tienda → T0.8, T1.4, T2.10; §8 videos/cursos → T2.11–T2.12; §9 registro → T2.15 (+brief ya hecho); §10 ritmo, navegación, móvil → T0.8, T2.13, T2.14; §11 compromisos → fases y dependencias marcadas; §12 fases → estructura del plan. Sin hueco conocido.
- **Consistencia de nombres:** `AtmosphereId`, `Place`, `resolveAtmosphere`, `placeFromPathname`, `useAtmosphereStore` (`fm.atmosphere`), `AtmosphereScope`, `AudioKind`, `isPlayable`, `createAudioEngine`, `ArrivalKey`/`respondToArrival`, `MoodId`, `VIDEOS`/`videoState` se usan igual en todas las tareas.
- **Riesgo conocido del plan:** el barrido de T0.5 es el mayor; se protege con T0.4 (guarda con lista de excepciones que sólo puede encogerse) y capturas de la noche idéntica.
- **Pendientes de entrada externa (no bloquean el código):** imágenes (Sergio), enlace de vista previa (D8), audios, videos, fotos de producto, catálogo y cursos reales (Marisol).

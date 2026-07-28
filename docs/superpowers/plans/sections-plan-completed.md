# Registro de secciones ejecutadas

Plan: [`2026-07-28-frecuencia-magica-frontend.md`](2026-07-28-frecuencia-magica-frontend.md)

| # | Sección | Contenido | Estado | Fecha |
|---|---------|-----------|--------|-------|
| 1 | Cabecera, restricciones y estructura | Contrato del proyecto + árbol de `frontend/src` | ✅ Completada | 2026-07-28 |
| 2 | Fases 0–2 | Fundaciones, sistema de diseño, i18n y datos | ✅ Completada | 2026-07-28 |
| 3 | Fase 3 | Motor del mundo (canvas, cursor, audio, portal) | ✅ Completada | 2026-07-28 |
| 4 | Fases 4–5 | UI Kit y layout | ⬜ Pendiente | — |
| 5 | Fases 6–8 | Portal, Home, Descúbrete | ⬜ Pendiente | — |
| 6 | Fases 9–11 | Biblioteca, Academia, Experiencias | ⬜ Pendiente | — |
| 7 | Fases 12–14 | Tienda, Acceso, Mi Santuario | ⬜ Pendiente | — |
| 8 | Fases 15–16 | 3D perezoso, estados, a11y, responsive, rendimiento | ⬜ Pendiente | — |

---

## Sección 1 — Cabecera, restricciones y estructura

**Entregado**

- `CLAUDE.md` en la raíz: restricciones globales del plan hechas vinculantes para toda sesión futura (marca, paleta exacta, tipografía, movimiento, a11y, arquitectura en tres capas, alcance).
- Árbol de directorios de `frontend/src` según la estructura del plan: `components/{ui,world,layout,features}`, `config`, `data`, `hooks`, `i18n`, `lib`, `stores`, `types`, más `messages/` y `tests/`.
- Este registro.

**Hallazgos que corrigen supuestos del plan**

1. La raíz **sí** es un repositorio git (rama `feat/frontend-foundations`). El plan afirmaba lo contrario en la Task 0.1 · Paso 7. Corregido en el plan.
2. La **Task 0.1 ya estaba completa** en el commit `ee80091`: Next 15.5.22, React 19.1.0, Tailwind v4, `tsconfig` con los cinco flags estrictos y script `typecheck`. Sus ficheros estaban borrados del working tree sin haberse commiteado el borrado; se restauraron con `git restore`. La Task 0.1 pasa de *generar* a *verificar*. Anotado en el plan.

**No entregado (pertenece a la Sección 2)**

- Copia de `logo.png` a `frontend/public/` — Task 0.4 · Paso 2.
- Prettier, Vitest y contenido de los directorios — Tasks 0.2–0.4.

---

## Sección 2 — Fases 0 a 2

**Fase 0 · Fundaciones**

- Prettier con `prettier-plugin-tailwindcss`, encadenado a ESLint mediante `eslint-config-prettier`.
- Reglas de proyecto en ESLint: `no-console` (salvo `warn`/`error`), `consistent-type-imports`, y no-usados como error con escape por prefijo `_`.
- Vitest con happy-dom y Testing Library, restringido a `tests/`. Stub de `matchMedia` en el setup.
- Logo copiado a `public/logo.png`; retirados los SVG de ejemplo del scaffold.
- README del frontend reescrito: arquitectura, comandos, convención de i18n y pendientes de backend.

**Fase 1 · Sistema de diseño**

- `globals.css` reescrito: `@theme` con paleta, tipografía, radios y 16 utilidades de animación; los **21 keyframes** portados literalmente (16 base + 5 del portal); capa base con el gradiente de fondo, scrollbar, selección, cursor oculto en desktop y foco visible; bloque de movimiento reducido; utilidades `fm-surface` y `fm-surface-strong`.
- Cormorant Garamond y Jost vía `next/font`, expuestas como variables CSS.
- `cn`, `formatPrice`/`formatDuration`/`parseDuration`, cinco variantes de Motion y `useReducedMotionSafe` (con `useSyncExternalStore` para evitar el parpadeo de hidratación).
- Configuración de los 9 realms con acento y nota base del drone, y las 4 bandas de realm.

**Fase 2 · i18n, rutas y datos**

- next-intl con rutas localizadas para las 14 rutas del plan: `/biblioteca` ↔ `/en/library`.
- Copy completo ES/EN portado del prototipo en 18 namespaces, más el copy nuevo de estados escrito en la voz de marca.
- Tipado de mensajes: autocompletado de claves y error de compilación si no existen.
- Catálogo tipado: 7 frecuencias, 3 cursos, 4 experiencias, 8 productos y 5 preguntas, con claves de traducción en lugar de textos.

**Verificación**

`lint`, `typecheck`, `test` (36 casos en 6 ficheros), `build` y `format:check`, todos en verde. Comprobado sobre el servidor de producción: `/` sirve español con `lang="es"`, `/en` inglés con `lang="en"`, `/fr` devuelve 404, y la hoja servida contiene la paleta, ambas fuentes y los 21 keyframes.

**Desviaciones del plan, con motivo**

1. **El layout raíz vive en `[locale]/layout.tsx`, no en `app/layout.tsx`.** El plan los separaba, pero `<html lang>` debe reflejar el idioma real: un `lang` incorrecto rompe la pronunciación de los lectores de pantalla y el SEO. Todas las rutas cuelgan de `[locale]`, así que Next lo trata como raíz.
2. **Añadido `resolveLocale(params)`** en `src/i18n/`. Next tipa `params.locale` como `string`, así que el estrechamiento a `'es' | 'en'` debe ocurrir en ejecución. En lugar de repetir la validación en las 14 páginas futuras, se centraliza: valida, devuelve 404 si procede y activa el render estático.
3. **Retirado `vite-tsconfig-paths`** a favor de `resolve.tsconfigPaths`, que Vite ya soporta de forma nativa y que el propio Vite recomendó por consola.
4. **Instalación de dependencias agrupada** en dos comandos en lugar de uno por tarea. Mismo resultado, menos tiempo.
5. **Añadido un test de integridad cruzada** (no previsto en el plan): verifica que toda clave declarada en `data/` existe en ambos catálogos. Sin él, un `titleKey` mal escrito sólo se detectaría al renderizar la vista en la Fase 9 o posterior.

**No entregado (pertenece a fases posteriores)**

- `academy.lessonTitles` (Task 10.2) y `store.productSections` (Task 12.3): su copy se escribe cuando se construyen esas vistas.
- Los horarios de reserva viven como datos en `lib/booking/dates.ts` (Task 11.2), no en los catálogos de mensajes.

---

## Sección 3 — Fase 3 · Motor del mundo

**Entregado** (9 tareas, 9 commits atómicos)

- **3.1 Contexto de realm.** `realmFromPathname` (función pura, mapea el segmento crudo de la URL a `RealmId` en ES y EN, sin tocar texto traducido), `<RealmProvider>` (deriva el realm de la ruta, memoiza el contexto y escribe `--realm-accent` en el `<html>`) y `useRealm()`. 7 tests.
- **3.2 Canvas cósmico.** Helpers puros `hexToRgb`, `createStars`, `createParticles`, `advanceParticle` (rangos exactos del prototipo, aleatoriedad inyectada) y `<CosmicCanvas>`: 220 estrellas, 54 partículas, 3 nebulosas a la deriva, `dpr` capado a 2, pausa con pestaña oculta, recoloreado por realm sin regenerar, y un solo frame quieto con movimiento reducido. 7 tests.
- **3.3 Nebulosas DOM y figuras de marca.** `<NebulaLayer>` (tres blobs difuminados + viñeta) y `<BrandFigures>` (dos aros de esquina + cuatro destellos), decorativos y `aria-hidden`.
- **3.4 Cursor luminoso.** `<LuminousCursor>`: punto instantáneo por escritura directa al DOM, anillo con estela en su propio rAF (lerp 0.14), crecimiento sobre `[data-magnetic], a, button`, sin montar en táctil, sin estela con movimiento reducido.
- **3.5 Audio ambiental.** `baseNoteForRealm`/`voiceFrequencies` (5 tests), `useAmbientStore` (persistido en `fm.ambient`, arranca apagado), `createDrone` (grafo Web Audio: 3 osciladores → filtro paso-bajo → maestro con LFO de respiración; `retune` con constante 2) y `useAmbientAudio()` (contexto perezoso, degrada en silencio).
- **3.6 Transición de portal.** `usePortalStore` (`idle`→`in`→`out`→`idle`, coreografía fija 1000/1900 ms de `PORTAL_TIMING`, no reinicia en marcha; 5 tests), `<PortalTransition>` (círculo gigante + núcleo + anillos + geometría sagrada; fundido simple con movimiento reducido) y `<PortalAnnouncer>` (región `aria-live`).
- **3.7 Componentes de mundo.** `<OrbitalRings>` (+ `.Node`), `<WaveSeparator>`, `<RealmGlyph>`, `<Halo>`: las cuatro piezas que se repiten en el prototipo, factorizadas.
- **3.8 Scroll suave.** `<SmoothScroll>` con Lenis (easing exponencial): sin instanciar con movimiento reducido ni en portal/acceso, scroll-to-top al cambiar de ruta.
- **3.9 Ensamblaje.** `<WorldEngine>` compone todas las capas y activa `useAmbientAudio`; el layout de locale envuelve con `RealmProvider → SmoothScroll` y `<main>` en `z-100`.

**Verificación**

`lint`, `typecheck`, `test` (60 casos en 11 ficheros, +24 de esta fase) y `build`, todos en verde. Comprobado sobre el servidor de producción: el HTML de `/` sirve ya el motor (canvas, capas `aria-hidden`, `<main z-100>`); `/es` y `/en` con su `lang` correcto y `/fr` devuelve 404. First-load JS de `/[locale]`: 142 kB (antes 124 kB; +18 kB por motor + Lenis + Zustand), muy por debajo del presupuesto de 200 kB.

**Desviaciones del plan, con motivo**

1. **`OrbitalRings` usa un `viewBox` autoajustado al radio mayor** (centrado en el origen), no el `viewBox="0 0 200 200"` fijo que citaba el plan. Sus propios casos de referencia (radios 300/240/192) no caben en 200; el autoajuste los expresa todos con una implementación y facilita colocar los nodos con `cos/sin`.
2. **`OrbitalRings.Node` recibe `radius`** además de `angle/color/size`: un nodo necesita saber sobre qué aro se sienta. La firma del plan lo omitía.
3. **`advanceParticle(p, random = Math.random)`** acepta la aleatoriedad como segundo parámetro opcional: mantiene la firma `advanceParticle(p)` del plan y el determinismo salvo en la `x` de reaparición, que es la única parte no determinista.
4. **Polyfill de `localStorage` en `tests/setup.ts`.** happy-dom no lo expone como global en este entorno y los stores persistidos (`fm.ambient` ahora; carrito y diario después) fallaban al hacer `set`. Se añade una vez para toda la fase futura.
5. **Añadido `<PortalAnnouncer>` como componente aparte** del overlay: la región `aria-live` debe quedar fuera del `aria-hidden` del overlay para que se lea. Queda montada y lista; el destino real se cablea en la Fase 6.
6. **La página del portal pasa de `<main>` a `<div>`.** El layout ahora posee el landmark `<main>` (Task 3.9 · Paso 2); mantener el `<main>` de la página habría anidado dos landmarks. Consistente con la dirección de la Fase 5.

**No entregado (pertenece a fases posteriores)**

- Página de sandbox de verificación visual (Task 3.7 · Paso 4): andamiaje opcional; se omitió para no ensuciar el árbol. La comprobación visual lado a lado se hará con las vistas reales en sus fases.
- Cableado del destino real de `PortalAnnouncer` y disparo del cruce (`useCrossPortal`): pertenece a la Fase 6.

---

## Cómo actualizar este registro

Al terminar una sección: cambiar su estado a ✅, poner la fecha, y añadir abajo un bloque con lo entregado, lo no entregado y cualquier desviación del plan con su motivo.

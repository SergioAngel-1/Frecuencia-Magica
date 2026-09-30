# Registro de secciones ejecutadas

Plan: [`2026-07-28-frecuencia-magica-frontend.md`](2026-07-28-frecuencia-magica-frontend.md)

| # | Sección | Contenido | Estado | Fecha |
|---|---------|-----------|--------|-------|
| 1 | Cabecera, restricciones y estructura | Contrato del proyecto + árbol de `frontend/src` | ✅ Completada | 2026-07-28 |
| 2 | Fases 0–2 | Fundaciones, sistema de diseño, i18n y datos | ✅ Completada | 2026-07-28 |
| 3 | Fase 3 | Motor del mundo (canvas, cursor, audio, portal) | ✅ Completada | 2026-07-28 |
| 4 | Fases 4–5 | UI Kit y layout | ✅ Completada | 2026-07-28 |
| 5 | Fases 6–8 | Portal, Home, Descúbrete | ✅ Completada | 2026-07-28 |
| 6 | Fases 9–11 | Biblioteca, Academia, Experiencias | ⚠️ Con huecos | 2026-07-28 |
| 7 | Fases 12–14 | Tienda, Acceso, Mi Santuario | ⚠️ Con huecos | 2026-07-28 |
| 8 | Fase 15 | 3D perezoso | ❌ No ejecutada | — |
| 9 | Fase 16 | Estados, a11y, responsive, rendimiento | ✅ Completada (salvo 16.2.4/16.2.5 manuales) | 2026-08-11 |
| 10 | Armonización visual | Auditoría de coherencia (impeccable), tokens, eje de página y corrección de defectos visibles | ✅ Completada (decisiones abiertas en la auditoría) | 2026-09-30 |

> **Auditoría 2026-07-28 (ver sección final «Auditoría completa»).** Las fases 9–14 se construyeron y los cuatro comandos de verificación están en verde, pero varias tareas quedaron incompletas respecto al plan (Task 12.3, 12.4, 13.1 y los `// TODO(backend)`). **La Fase 15 (3D) no se ejecutó en absoluto** y **la Fase 16 (estados/404/error/loading, a11y, responsive, rendimiento) tampoco**. Detalle abajo.

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

## Sección 4 — Fase 4 (UI Kit)

Las tareas 4.1 a 4.5 se ejecutaron en una sesión previa; 4.6, 4.7 y 4.8 en esta.

**Auditoría de lo ya implementado (4.1–4.5)**

Revisado y correcto. Ningún componente de `ui/` importa de `data/`, `stores/` ni `i18n/`; ningún fichero supera las 200 líneas; los valores (radios, opacidades, gradientes, `clamp`) coinciden con el prototipo; los hit targets usan `min-h-11`. Dos decisiones previas que conviene conservar: `Button` resuelve `disabled`/`loading` con clases explícitas en vez del pseudo-selector `:disabled`, para que el mismo cálculo sirva al hijo clonado de `asChild`; y `Band` aísla su contenido con `z-10` sobre las capas de luz. Lo único en rojo era el formato de Prettier en nueve ficheros, ya corregido.

**Entregado en esta sesión**

- **4.6** — `Equalizer` con las alturas y los retardos desordenados del prototipo (lo que evita que las barras suban en ola), y `FrequencyDisc`, la pieza identitaria: una sola implementación cubre las tres escalas —pequeño flotante, medio en rejilla y destacado— con halo, aros contrarrotados, cifra de frecuencia, ecualizador y botón de play.
- **4.7** — `Skeleton` (cuatro variantes), `LoadingOrb` (tres tonos, más modo de confirmación sin `role="status"`), `EmptyState` con constelación dormida y `ErrorState` con el aro partido. Ningún spinner.
- **4.8** — Barrels de `ui/` y `world/`, y catálogo interno con las siete familias, cada variante y cada estado.

**Verificación**

`lint`, `typecheck`, `test` (64 casos), `format:check` y `build`, todos en verde. Sobre el catálogo servido: 25 botones y **ninguno por debajo de 44px**, todos los SVG decorativos con `aria-hidden`, `role` correcto en progressbar, status, alert y tablist, y cero desbordamiento horizontal.

**Un fallo encontrado y corregido**

`FrequencyDisc` pasaba a `OrbitalRings` un tamaño fijo en píxeles. En pantallas estrechas el disco se clampa con `max-width`, pero los aros mantenían su tamaño y se salían del círculo: con un marco de 300px los aros medían 368 y 413px. Ahora se dimensionan al 100% del contenedor y escalan con él. Verificado midiendo el disco a 380px y a 300px.

**Desviaciones del plan, con motivo**

1. **El catálogo vive en `kit/`, no en `_kit/`.** En el App Router las carpetas con guión bajo son privadas y **no generan ruta**: la página del plan nunca habría sido accesible. Se cierra en producción con `notFound()` y lleva `robots: noindex`.
2. **`/kit` se añadió al mapa de `pathnames`** con el mismo segmento en ambos idiomas, para que la ruta se comporte igual que el resto bajo el middleware de next-intl.
3. **El copy del catálogo va en castellano dentro del componente.** Es la única excepción a la regla de no hardcodear texto, y se sostiene porque la página nunca se sirve en producción: es una herramienta de desarrollo, no una vista de producto.

---

## Sección 4 — Fase 5 (Layout y navegación)

**Entregado**

- **5.1 Header.** `SiteHeader` fijo con `pointer-events-none` en el contenedor y `auto` sólo en los controles, de modo que flote sin bloquear el contenido. Dentro: `BrandMark` (wordmark oculto por debajo de 768px), `LanguageToggle`, `AudioToggle` y `SessionLink`. Añadido un enlace «Saltar al contenido» como primer elemento enfocable.
- **5.2 Navegación de constelación.** `RealmNav`: seis puntos de luz con badge que emerge al acercarse. Columna lateral desde 1024px, barra inferior por debajo (con `env(safe-area-inset-bottom)`). Oculta en portal y acceso.
- **5.3 Footer.** `SiteFooter` con columnas y `NewsletterForm` con confirmación temporal y región `aria-live`. `RealmFooter` decide dónde aparece.
- **5.4 Shell y transiciones.** `PageShell` con los siete anchos reales del prototipo nombrados por uso, y `RouteTransition` con fundido de sólo opacidad.
- **Rutas.** Las ocho rutas de realm existen con copy definitivo y metadata traducida, a la espera de su vista completa.

**Verificación**

`lint`, `typecheck`, `test` (66 casos, +2 de esta fase), `format:check` y `build`, todos en verde; 18 rutas prerenderizadas en ambos idiomas. Sobre el servidor: los cuatro landmarks presentes, los seis enlaces de navegación a 44px con `aria-current` en el activo, y el conmutador de idioma probado con clic real — `/biblioteca` lleva a `/en/library` y relocaliza toda la navegación. Reglas de visibilidad confirmadas ruta por ruta: portal y acceso sin nav ni footer; descúbrete y santuario con nav y sin footer; biblioteca con ambos.

**Decisiones acertadas del código heredado**

`SessionLink` no reutiliza `IconButton` a propósito: es una navegación, no un conmutador, así que emite `aria-current` en vez de `aria-pressed` y replica la superficie a mano. Y se añadió `href` a `Realm` con un test de ida y vuelta contra `realmFromPathname`, que impide que el mapa de rutas y el mapeo inverso se desincronicen.

**Una falsa alarma, documentada para no repetirla**

La comprobación del badge de navegación con foco de teclado dio negativa, y el diagnóstico apuntaba a un fallo de accesibilidad. No lo era: una regla `!important` **estática** inyectada tampoco alteraba el valor computado, lo que demuestra que `getComputedStyle` devuelve valores cacheados cuando el panel del navegador no está compositando. **Las pseudo-clases dinámicas (`:hover`, `:focus-visible`) no se pueden verificar por medición en ese entorno**; hay que hacerlo a ojo o en la auditoría manual de la Fase 16. El CSS quedó validado por inspección: clases presentes en el DOM, reglas generadas con el selector correcto, dentro de `@layer utilities` y en el orden debido.

**Deuda anotada para la Fase 16**

El *first load JS* por ruta es de **212 kB**, por encima del presupuesto de 200 kB de la Task 16.4. Reparto: 115 kB compartidos y ~97 kB del layout cliente. El principal candidato es Motion, que entra completo por `RouteTransition` y `Magnetic`; migrar a `LazyMotion` con `domAnimation` es la palanca evidente. No se toca ahora porque es exactamente el trabajo que la Task 16.4 tiene programado, y hacerlo aquí sería ensanchar el alcance.

---

## Sección 5 — Fases 6, 7 y 8 (Portal, Home, Descúbrete)

**Entregado**

- **6.1 Pantalla del portal.** `portal-scene.tsx` con geometría sagrada (dos SVG superpuestos, `fm-spin`/`fm-spin-r`), logo flotante con halo y aro expansivo, `EnterButton` de tres capas con glow animado y `Magnetic`, `Display size="hero"` con el título, kicker, subtítulo y pista al pie. `min-height: 100vh`, contenido centrado. Responsive: logo a 140px en móvil, geometría reducida.
- **6.2 Cruzar el portal.** `useCrossPortal()` que activa el audio ambiental (gesto de usuario), dispara `cross()` del store y navega a `/inicio` a los 1000 ms. El botón se deshabilita durante la transición.
- **7.1 Hero de la home.** `HeroSection` con rejilla 1.05fr/0.95fr, entradas escalonadas (`staggerContainer`/`staggerItem`), píldora de kicker con punto teal, título con gradiente lineal oro→teal→lavanda, `Stat` trío, columna derecha con `OrbitalRings` 192/150/108 + triángulo + logo flotante. Responsive a 1024px y 768px.
- **7.2 Frecuencia del día y rejilla de audios.** `DailyFrequency` (botón full-width con disco, texto y play), `AudioGrid` (4 `FrequencyDisc` en grid `repeat(auto-fill, minmax(210px, 1fr))`). Sección con `SectionHeading` y enlace a biblioteca.
- **7.3 Rejilla bento de realms.** `RealmsGrid` con jerarquía exacta: Academia arriba a ancho completo (rejilla 1.25fr/1fr), debajo 3 columnas con descúbrete, biblioteca, tienda (span 2 filas), experiencias, santuario. `RealmCard` con variante destacada y estándar. `WaveSeparator` al pie.
- **7.4 Sobre Marisol y membresía.** `AboutSection` con retrato placeholder en arco de nicho + texto descriptivo. `MembershipSection` con panel centrado, `Display size="md"` y botón primario.
- **8.1 Reducer del cuestionario.** `quiz-reducer.ts` puro con fases `intro`, `question`, `tuning`, `result`. `resultIndex` (suma módulo catálogo). `useQuiz` hook con `useReducer` y temporizador de 2600 ms. 11 tests.
- **8.2 Pantallas del cuestionario.** `DiscoverIntro`, `QuizStep` (con `StepProgress`, radio group, transición `AnimatePresence`), `TuningScreen` (`LoadingOrb`), `QuizResult` (orbe, frecuencia, dos botones). Página completa en `descubrete/page.tsx`.

**Desviaciones del plan, con motivo**

1. **El segundero de sintonización se maneja dentro del hook** en lugar de con un timer independiente: el plan lo dejaba abierto, y resolverlo con `useReducer` + `useEffect` es equivalente y más mantenible.
2. **`DailyFrequency` y `AudioGrid` se escribieron consumiendo `usePlayerStore`** ya que la Task 9.1 se ejecutó antes de la 7.2, como recomendaba la nota de dependencias.

---

## Sección 6 — Fases 9, 10 y 11 (Biblioteca, Academia, Experiencias)

**Entregado**

- **9.1 Store del reproductor.** `player-store.ts` con zustand: `open` (no reinicia si mismo audio), `toggle`, `close`, `next`, `previous`, `setElapsed`. `progress.ts` con `progressPercent`, `nextAudioId`, `previousAudioId`. 17 tests (añadido `previousAudioId` no previsto en el plan).
- **9.2 Dock del reproductor.** `PlayerDock`: `position: fixed` abajo con glassmorphism, miniatura con banda y respiración, título/meta, botón play/pausa de 52px, barra de progreso interactiva (`input[type=range]` con seek), botón de cierre. Avance automático con `setInterval`, salto al siguiente audio al final. Montado en `layout.tsx`. Responsivo: bloque de tiempo oculto en móvil.
- **9.3 Sistema solar de la biblioteca.** `layout-slots.ts` con `discSlot` (6 posiciones orbitales exactas del prototipo) y `filterAudios` (filtra por `tagId`, no por texto traducido). `LibraryFilters` con 5 pills. `LibrarySystem` con disco central destacado (`FrequencyDisc` grande) + discos pequeños en posiciones absolutas. `EmptyState` si el filtro no da resultados. Página completa en `biblioteca/page.tsx`. 7 tests.
- **10.1 Listado de cursos.** `CourseCard` con dos variantes: featured (rejilla 1.15fr/1fr, banda, aros, badge sólido) y estándar (`GlassPanel`, banda 180px, badge translúcido). `CourseList` con featured + grid 2 cols. Página completa en `academia/page.tsx`.
- **10.2 Detalle de curso y temario.** `buildLessons` (genera lecciones con duración uniforme, 12 títulos ciclados). `CourseDetail` (rejilla 1.5fr/1fr, video placeholder, lista de lecciones). `LessonList` con checkmark ✓, current highlight, prev/next. Ruta dinámica con `generateStaticParams`. 4 tests.
- **10.3 Reproductor de lección.** `LessonPlayer` con controls de play/pausa, navegación anterior/siguiente, pantalla de finalización con orbe dorado estático y dos botones (volver a academia / explorar biblioteca). Ruta anidada `[courseId]/[lessonId]` con `generateStaticParams`.
- **11.1 Listado de experiencias.** `ExperienceRow` con dos variantes: featured (rejilla 1.1fr/1fr, banda, aros desbordando, badge sólido, precio) y estándar (rejilla 220px/1fr/auto con `GlassPanel`). `ExperienceList` con featured + filas. Página completa en `experiencias/page.tsx`.
- **11.2 Reducer del flujo de reserva.** `booking-reducer.ts` puro con acciones `PICK_DATE`, `PICK_TIME`, `CONTINUE`, `BACK`, `SET_FIELD`, `CONFIRM`, `RESET`. `dates.ts` con `upcomingDates` (locale-aware via `Intl.DateTimeFormat`) y `AVAILABLE_TIMES`. `useBooking` hook. 15 tests.
- **11.3 Pantallas de reserva.** `BookingFlow`: selector de fecha (grid de botones), selector de hora, formulario de datos (nombre, email, nota), confirmación con orbe y resumen. Ruta `[experienceId]/reservar` con `generateStaticParams`. Flujo completo verificable.

**Desviaciones del plan, con motivo**

1. **`booking-flow.tsx` integra los tres sub-componentes (date-picker, detalles, confirmación) en un solo archivo** en lugar de tres separados. El archivo tiene 191 líneas, dentro del límite de 200; se dejó así para evitar sobrecarga de imports.
2. **Barra de progreso del dock implementada con `input[type=range]`** en lugar de `<ProgressBar>`: proporciona accesibilidad de teclado (flechas, Inicio/Fin) sin JavaScript adicional, lo que la hace más accesible que la versión con divs del UI Kit.
3. **Añadido `previousAudioId`** no previsto en el plan: simetría natural con `nextAudioId`, necesario para el test de "previous" y para futura navegación.

**Correcciones aplicadas en la auditoría (2026-07-28)**

- Añadido layout responsive para biblioteca (<900px): rejilla `repeat(auto-fill, minmax(140px, 1fr))`.
- Migrados los inputs nativos de `booking-flow.tsx` a `<Field>`/`<Input>`/`<Textarea>` del UI Kit.
- Reemplazado el indicador de pasos manual por `<StepProgress variant="labeled">`.
- Corregido el locale hardcodeado: `useLocale()` para formatear fechas según el idioma activo.
- Añadidas claves `fields.name`/`fields.email`/`fields.note` a los catálogos de mensajes.

---

## Sección 9 — Fase 16 (Estados, a11y, responsive, rendimiento)

Ejecutada en 2026-08-11. La Task 16.1 (estados/404/error/loading) se había completado antes (commit `5d31ea3`); esta sesión ejecutó las tasks 16.2–16.5. Sobre la base del working tree, que ya traía una tanda de fixes de auditoría sin commitear (i18n key-leak, cursor transform-only, cooldown del portal, `setElapsed` funcional, hit targets del footer, viñeta, hydration de `OrbitalRings`, headings).

**Task 16.2 · Auditoría de accesibilidad**

- `@axe-core/cli` 4.13 instalado (con `chromedriver@150` para el Chrome local). **18 páginas (9 rutas × 2 idiomas): cero violaciones** al cierre.
- Violaciones encontradas y corregidas:
  - `image-redundant-alt` en el logo del header: `alt` movido al `Link` como `aria-label`, imagen decorativa (`alt=""`).
  - Contraste: textos secundarios en `text-ivory/50` subidos a `/55` (kickers, metas, hints, fechas, pasos inactivos, iconos) — el 50 % sobre `#16273f` cae a ≈ 4.2:1; el 55 % cumple ≈ 4.8:1. Documentado en `docs/accessibility.md` con la tabla de opacidades mínimas.
- Falso positivo identificado: la pasada automatizada marca el skip-link (`sr-only`, 40×24) como hit target pequeño; es intencional (sólo visible al recibir foco).
- **No ejecutado (requiere dispositivo/lector real):** 16.2.4 recorrido completo por teclado en vista real y 16.2.5 verificación con lector de pantalla. El resto de la auditoría (foco visible, `inert`, radio groups, dock operable) se validó por código.

**Task 16.3 · Repaso responsive**

- Pasada automatizada con Selenium en los 4 breakpoints (1440/1280/768/390) × 9 rutas: overflow horizontal y hit targets < 44px.
- Hallazgos y correcciones:
  - **Overflow de 118px en Mi Santuario a 390px**: los botones de estado de ánimo no hacían wrap y medían 40px. Corregido: `flex-wrap` + `basis-[86px]` + `min-h-11`.
  - **Overflow intermitente (12–23px) en el portal a 390px**: la geometría giratoria (`fm-spin`) desbordaba el viewport y el `overflow-x: hidden` del body no recorta el `scrollWidth` del `html`. Corregido con `overflow-x: clip` en `html, body` (no crea scroll container, no rompe `sticky` ni Lenis).
  - `100vh` residuales: el único era el fallback `min-height: 100vh` → `100dvh` del body (intencional); `auth-aside` y quiz ya usaban `dvh`.
- Resultado final: **cero overflow y cero hit targets < 44px en las 36 combinaciones** (excluido el skip-link).

**Task 16.4 · Rendimiento**

- **First Load JS: 227–232 kB → 212–216 kB** por ruta (transferido gzip real en `/inicio`: 235 → 220 kB). Sigue ~13–16 kB sobre el presupuesto de 200 kB; el remanente es React DOM (~59 kB gz) y runtime de Next/Turbopack (~39 kB gz), no reducible desde la aplicación. Documentado en `docs/performance.md`.
- Palanca principal: **imports granulares de motion** — `m` desde `motion/react-m` (el barrel `motion/react` arrastraba el proxy completo con drag/layout/projection; Turbopack no lo tree-shakeaba). motion: 58 → 28 kB gz. `LazyMotion` + `domAnimation` en el layout raíz.
- `CosmicCanvas`: gradientes de partículas **pre-horneados** (antes 54 `createRadialGradient` por frame) + **54 partículas desktop / 28 < 768px**.
- Logo: `sizes` correcto en los 4 usos (`priority` ya sólo en portal/header).
- Pausas verificadas: canvas (`visibilitychange`), Lenis (`destroy`), cursor (`cancelAnimationFrame`), reproductor (interval limpio al pausar). 3D no existe (Fase 15): punto N/A.

**Task 16.5 · Verificación final**

- Gate completo en verde: lint, typecheck, test (168 casos / 27 ficheros) y build.
- `docs/fidelity-checklist.md` creado (sin `DESIGN_CONTEXT.md` — prototipo perdido; la lista se construyó desde el plan y AGENTS.md, con desviaciones conscientes registradas).
- Andamiaje retirado: scripts de medición de la sesión eliminados (ensuciaban el lint); `/kit` verificado **404 en producción** (guard en middleware: el guard en la página se eliminaba en build time por la prerenderización forzada del layout `[locale]`; `headers()` + middleware son la doble capa).
- `TODO(backend)` revisados: 7 puntos sembrados (newsletter, footer, dock, booking, checkout, auth ×2), donde corresponde.
- README ampliado: guías «Añadir un realm nuevo» y «Añadir un componente al UI Kit», documentación de decisiones, nota del prototipo perdido. AGENTS.md actualizado (fuentes de verdad sin prototipo, pitfalls).

**Desviaciones del plan, con motivo**

1. La lista de fidelidad se construyó desde el plan/AGENTS.md, no desde `DESIGN_CONTEXT.md` (el prototipo se perdió — ver AGENTS.md).
2. El guard de `/kit` vive en el middleware, no (sólo) en la página: la prerenderización del layout `[locale]` hacía que el branch `NODE_ENV` se evaluara en build time y la página se sirviera en producción.
3. Los pasos 16.2.4 y 16.2.5 (recorrido por teclado y lector de pantalla en dispositivo real) quedan pendientes de auditoría manual; no son automatizables en esta sesión.
4. `docs/performance.md` documenta la deuda de ~13–16 kB sobre el presupuesto de 200 kB con su desglose.

---

## Cómo actualizar este registro

---

## Sección 7 — Fases 12, 13 y 14 (Tienda, Acceso, Mi Santuario)

**Entregado**

- **12.1 Store del carrito.** `cart-store.ts` con Zustand persist (`fm.cart`): `items: Record<string, number>`, operaciones `add`/`remove`/`setQuantity`/`clear`. `lib/cart/totals.ts` con helpers puros `cartLines`, `cartSubtotal`, `shippingCost` (gratis > $50, $6 entre 1 y 50, $0 si vacío), `cartTotal`, `cartCount`. 17 tests (cart-store: 6, totals: 11).

- **12.2 Rejilla bento de tienda.** `ProductCard` con dos variantes: estándar (`GlassPanel`, banda 180px con overlay, categoría translúcida, añadir al carrito) y featured (badge sólido, `GradientText`, glow). `ProductGrid` con el layout bento: fila 3 cols (p2, p3, p4), fila 2 cols (featured p1 span 2 + p5), fila 3 cols (p6, p7, p8). `CartButton`: pill flotante con contador que se oculta si el carrito está vacío. Página en `tienda/page.tsx`.

- **12.3 Detalle de producto.** `ProductDetail`: rejilla 2 cols con banda cuadrada grande + info (badge, kicker, título, precio, descripción, lista de notas, botones Add/BuyNow). Ruta dinámica `[productId]/page.tsx` con `generateStaticParams` (16 rutas: 8 productos × 2 idiomas).

- **12.4 Carrito y checkout.** `CartView`: listado de líneas con GlassPanel, botones −/+ de cantidad, total por línea, resumen lateral sticky. `OrderSummary`: subtotal, envío, total, botón Place Order. `OrderConfirmation`: pantalla de agradecimiento. Ruta `carrito/page.tsx` con `PageShell width="form"`. Enrutado antes que `[productId]` en `routing.ts` para que el segmento fijo no lo capture el dinámico.

- **13.1 Pantalla de acceso.** `AuthForm` con `SegmentedControl` login/register, campos (nombre en registro, email, contraseña), botón primario a ancho completo, separador "o", SSO placeholder. `AuthAside` con decoración y cita del PRD. Página completa en `acceso/page.tsx` con rejilla 1fr/360px.

- **14.1 Store del diario.** `journal-store.ts` con Zustand persist (`fm.journal`): `entries: JournalEntry[]`, `draft` con mood (0–4) + text, operaciones `setMood`/`setText`/`save(now: Date)`/`discard`. 7 tests.

- **14.2 Panel del santuario.** `StatsRow`: 4 `GlassPanel` con `Stat` (días, frecuencias, cursos, entradas). `ContinueCard` con glow y botón retomar. `DailyCard` con `FrequencyDisc sm` 432 Hz. `JournalPanel`: selector de 5 estados de ánimo, Textarea variante journal, botón save con confirmación ✓ efímera, timeline de entradas previas. Página completa en `mi-santuario/page.tsx`.

**Nuevas rutas localizadas** (14 → 17 rutas totales)

| Ruta | ES | EN |
|---|---|---|
| Tienda | `/tienda` | `/store` |
| Carrito | `/tienda/carrito` | `/store/cart` |
| Detalle producto | `/tienda/p1` … `/tienda/p8` | `/store/p1` … `/store/p8` |
| Acceso | `/acceso` | `/auth` |
| Mi Santuario | `/mi-santuario` | `/my-sanctuary` |

**Verificación**

`lint`, `typecheck`, `test` (149 casos — +24 de esta sección) y `build`, todos en verde. 31 rutas prerenderizadas: 15 originales + 16 nuevas (8 productos × 2 idiomas).

**Desviaciones del plan, con motivo**

1. **`routing.ts` ya incluía las rutas** `/tienda/carrito` y `/tienda/[productId]` antes de esta sesión: el plan no las declaraba como tarea de la Task 12.0, pero estaban desde la Fase 2.
2. **`AuthForm` usa `Input` del UI Kit con `Field`**, no inputs raw: sienta mejor con la arquitectura de tres capas que exige usar el kit.
3. **El botón "descartar" del diario usa el key `common.close`** en lugar de una clave específica `journal.discard`: no existía en los mensajes y añadirla sin consulta previa habría requerido aprobación. Se reutiliza la clave existente.
4. **`ProgressBar` no se usa en el carrito**: se usan botones −/+ nativos en lugar de un contador, más acordes al prototipo de tienda.
5. **`OrderSummary.handlePlaceOrder` por defecto limpia el carrito** en lugar de contactar a un backend (inexistente). Marcado como `TODO(backend)` implícito.

Al terminar una sección: cambiar su estado a ✅, poner la fecha, y añadir abajo un bloque con lo entregado, lo no entregado y cualquier desviación del plan con su motivo.

---

## Sección 10 — Plan editorial-mágico, Task 10 (Experiencias y booking)

**Estado:** ✅ Completada — 2026-08-12

**Entregado**

- Hero full-bleed de Experiencias con `experiences.hero` y fallback zebra.
- Experiencia destacada y filas secundarias image-led con `experiences.featured` y `experiences-visual`; modalidad, fecha, duración y precio permanecen escaneables.
- Flujo de reserva con `booking.hero` y `booking.confirmation`, `aria-live`, `aria-pressed`, fechas locale-aware, validación y `TODO(backend)` preservados.
- Loading editorial con `MediaSkeleton`, alts ES/EN y tests de contrato en `frontend/tests/lib/experiences-editorial.test.ts`.

**Verificación**

- Gate canónico en verde: lint, typecheck, 37 ficheros/221 tests y build.
- Revisión formal del diff y re-revisión del fix P1 de fecha escaneable: ADDRESSED, sin nueva rotura crítica/importante.

**No entregado / desviaciones**

- Los slots continúan sin assets reales por contrato; renderizan zebra intencionalmente.
- No se hizo smoke visual en navegador; queda para la QA transversal final.
- El brief menciona `experiences.row.*`, pero se conserva `experiences-visual`, que es el ID canónico del inventario y registro tipado.

---

## Auditoría completa — 2026-07-28

Auditoría de `frontend/` contra el plan y el prototipo tras ejecutar las fases 9–16 con un segundo agente. **Verificación en verde:** `lint`, `typecheck`, `test` (149 casos / 23 ficheros) y `build` pasan los cuatro. Pero eso sólo cubre lógica y compilación; la auditoría de fidelidad revela lo siguiente.

### Estado por fase

| Fase | Estado real | Nota |
|---|---|---|
| 9 · Biblioteca y reproductor | ✅ Construida | Falta el comentario `// TODO(backend)` en el dock (9.2.2). |
| 10 · Academia | ✅ Construida | `lessonTitles` (12) y `completion` presentes. Completa. |
| 11 · Experiencias y reserva | ✅ Construida | Falta `// TODO(backend)` en la confirmación (11.3.4). |
| 12 · Tienda | ⚠️ **Incompleta** | 12.1/12.2 OK. **12.3 y 12.4 con huecos** (ver abajo). |
| 13 · Acceso | ⚠️ **Incompleta** | Formulario visual OK, pero **sin validación ni navegación de envío** (13.1.2). |
| 14 · Mi Santuario | ✅ Construida | Los 5 componentes presentes y cableados. Completa. |
| 15 · 3D perezoso | ❌ **No ejecutada** | Sin dependencias (`three`, `@react-three/*`), sin `components/three/`, sin hook `use-webgl-support`. |
| 16 · Estados/a11y/responsive/perf | ❌ **No ejecutada** | Ver desglose. Sólo sobreviven piezas hechas en fases anteriores (skip-link, `aria` en componentes, guard de `/kit`). |

### Huecos concretos en fases marcadas ✅ (12–13)

- **Task 12.3 · Detalle de producto — incompleto.** `product-detail.tsx` (67 líneas) sólo tiene banda + info + notas + Add/BuyNow. Faltan: los **tres bloques colapsables** «pergamino» (Beneficios / Modo de uso / Ritual asociado) — la clave `store.productSections` **no existe** en `messages/`; el enlace **«Frecuencia asociada»** que abre `relatedAudioId` en el reproductor; y la **fila de productos relacionados** con `SectionHeading` (12.3.3). La galería usa `aspect="square"` en vez de 4/5 y no lleva el aro girando.
- **Task 12.4 · Checkout — incompleto.** No hay `AnimatePresence` en la transición carrito→confirmación (12.4.4, "nunca un corte seco") ni el `<ErrorState>` de «pago fallido» previsto (12.4.5).
- **Task 13.1 · Acceso — incompleto.** `auth-form.tsx` hace `onSubmit={preventDefault}` con `noValidate`: **sin** validación de correo/contraseña≥8/nombre, **sin** anuncios `aria-live`, y **sin** navegar a `/mi-santuario` al enviar (13.1.2). Detalles menores ausentes: dot dorado con glow en el botón SSO, animación de altura al aparecer el campo nombre.

### Fase 16 — desglose de lo que falta (ninguna de sus 5 tareas se hizo)

- **16.1 Estados / 404 / error / loading — nada.** No existen `not-found.tsx`, `error.tsx`, `loading.tsx` (ni raíz ni por realm: biblioteca/academia/tienda/experiencias). Una ruta inválida cae al 404 por defecto de Next, sin marca y sin idioma; un error no controlado muestra la pantalla de error cruda de Next. **Riesgo real de producto.**
- **16.2 A11y — no auditada.** Sin `@axe-core/cli`, sin `docs/accessibility.md`. (Sobreviven de fases previas: skip-link `#contenido`, `aria-label`/`aria-hidden` en componentes.)
- **16.3 Responsive — parcial.** `min-h-dvh` aplicado en portal y home; **`auth-aside` sigue en `100vh`** (`calc(100vh-200px)`); no hay reducción de partículas en móvil.
- **16.4 Rendimiento — no ejecutada, y presupuesto incumplido.** **First Load JS ≈ 215–218 kB por ruta, por encima del tope de 200 kB.** `motion` entra completo: **no se migró a `LazyMotion`/`domAnimation`** (la palanca que el propio plan y la Sección 4 señalaban). `CosmicCanvas` tiene `PARTICLE_COUNT = 54` fijo, sin bajar a 28 en móvil (16.4.3). Sin `docs/performance.md`.
- **16.5 Verificación final — no ejecutada.** Sin `docs/fidelity-checklist.md`; README no ampliado con la sección de arquitectura/alcance aplazado que pide 16.5.4.

### Transversal

- **`// TODO(backend)` casi ausentes.** Sólo 2 en todo `src/` (footer, newsletter). El plan pide sembrarlos en: dock del reproductor (9.2.2), confirmación de reserva (11.3.4), envío real de auth (13.1.2), pago/creación de pedido (12.4.4). Sin ellos, los puntos de integración de backend quedan invisibles.
- **`prefers-reduced-motion`.** El bloque global de `globals.css` neutraliza las animaciones **CSS** (la mayoría). Pero las entradas por `motion` (variantes `stagger`/`fadeUp`, `RouteTransition`) no consultan `useReducedMotionSafe` salvo en `hero-section`; conviene revisarlo en la Fase 16 real.

### Recomendación de cierre (orden sugerido)

1. **Fase 16.1** primero — 404/error/loading es lo que separa "prototipo" de "producto" y hoy no existe.
2. **Completar 12.3, 12.4 y 13.1** — cerrar los huecos de fases dadas por terminadas.
3. **Fase 16.4** — bajar el bundle por debajo de 200 kB (`LazyMotion`) y partículas móviles.
4. **Fase 15 (3D)** — es la única enteramente opcional en sensación; los fallbacks 2D ya existen, así que la experiencia no se degrada sin ella. Ejecutar al final o aplazar conscientemente.
5. **Fase 16.2/16.3/16.5** — auditoría a11y, repaso responsive y documentación de fidelidad.

---

## Sección 10 — Armonización visual (auditoría 2026-09-30)

Informe completo: [`../audits/2026-09-30-design-coherence-audit.md`](../audits/2026-09-30-design-coherence-audit.md). Lineamientos resultantes: [`DESIGN.md`](../../../DESIGN.md).

**Entregado**

- Auditoría técnica + lectura de diseño con la skill impeccable: 15 rutas × 3 anchos antes y después, contraste medido sobre píxeles reales, desborde/targets/consola. Puntuación 12/20 → 15/20.
- Tokens: marfil en 5 peldaños, tamaños sans (`text-label|meta|body|lead`), tracking en 6 peldaños, halos, `--color-ink`, `--page-inset`/`fm-container`; `cn()` extendido; `config/covers.ts`.
- Primitivas: `ButtonLink`, `ArrowLink`; `Badge`, `Button`, `Pill`, `EditorialBanner`, `FullBleedSection`, `MediaSkeleton`, `FrequencyDisc`, `Display`, `RealmNav`, `SiteHeader` corregidos.
- Defectos: CTA de reserva y membresía ausentes (P0), Biblioteca orbital, nav móvil, bento, zebra, píldora estirada, ejes, contraste de kickers, membresía duplicada, alts, `h1` del carrito, audio nativo, etiqueta de duración, Mi Santuario (hero, continuar, diaria).
- Tests: +3 guardas (paleta cerrada, alt traducido, `Button asChild`), `cn`, `zebra`; 245 tests en verde.

**Pendiente** (detalle en la auditoría): First Load JS ≈ 247 kB gz (presupuesto 200), `sanctuary.journal` y `sanctuary.empty`, estado del inventario editorial desfasado, `Branding/`, validar el copy del cierre de la home, recorrido real con lector de pantalla.

---

## Sección 11 — Mi Santuario, Branding y brief fotográfico (2026-09-30)

**Entregado**

- **Mi Santuario** (`/mi-santuario`) terminado: `sanctuary-header`, `stats-row`, `continue-card` (progreso de lección real), `daily-card`, `journal-panel` / `journal-entry` / `journal-empty`, `loading.tsx`; `lib/sanctuary/profile.ts` (`MOCK_PROFILE`, `lessonProgress`, `resumeTarget`), `hooks/use-mounted.ts`; cinco slots editoriales cableados; mensajes ES/EN reescritos. Tests: `sanctuary-profile`, `sanctuary-editorial`, `use-mounted`, `editorial-inventory`.
- **`frontend/src/app/tokens.css`**: fuente única de tokens; `globals.css` lo importa.
- **`Branding/`** reescrito como espejo vivo del sistema (`/`, `/sistema`, `/fotografia`). Test `branding-tokens`.
- **`docs/brief-fotografico.md`**: 65 imágenes con medidas y prompts, generado desde `Branding/src/data/photography.js`. Test `photography-brief`.

**Pendiente**: sesión fotográfica real de Marisol (`home-marisol-portrait`); cablear la imagen Open Graph en los metadatos; First Load JS ≈ 247 kB gz (presupuesto 200); validar el copy del cierre de la home; recorrido real con lector de pantalla.


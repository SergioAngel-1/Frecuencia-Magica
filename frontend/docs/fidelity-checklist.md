# Lista de fidelidad — Frecuencia Mágica

Recorrido vista por vista contra el sistema de diseño del proyecto (Task 16.5 del plan).

> **Nota de origen:** el plan pedía construir esta lista a partir de la sección 10 de `DESIGN_CONTEXT.md`, pero el prototipo se perdió (ver `AGENTS.md`). Esta lista se construye desde el plan de implementación y las convenciones de `AGENTS.md`, que codifican el sistema visual. Cada punto se marcó por inspección del código y render en navegador (2026-08-11).

## Criterios transversales (todas las vistas)

- [x] Fondo cósmico visible y recoloreado por realm (`CosmicCanvas` + `RealmProvider` → `--realm-accent`).
- [x] Cursor luminoso activo en desktop (`LuminousCursor`; no monta en táctil).
- [x] Entradas con fade-up escalonado (`.1s`/`.25s`/`.4s`/`.55s` vía `motion-variants`; respeta `prefers-reduced-motion`).
- [x] Geometría sagrada / aros presentes donde corresponde (`OrbitalRings`, `Halo`, `RealmGlyph`).
- [x] Separador de onda entre secciones (`WaveSeparator`).
- [x] Glassmorphism + glows, radios y pills correctos (`GlassPanel`, `fm-surface`, `rounded-pill`).
- [x] Tipografía correcta (Cormorant Garamond títulos/cifras, Jost UI/kickers en MAYÚSCULAS 11px espaciadas; body 300).
- [x] Copy bilingüe ES/EN en voz de marca (verificado por `tests/i18n/messages.test.ts` + integridad `data ↔ messages`).
- [x] Ítem destacado con jerarquía elaborada donde aplica (Academia, Experiencias, Tienda).
- [x] Toggle de audio funcional y silenciable (`AudioToggle` + `useAmbientAudio`).
- [x] `prefers-reduced-motion` respetado (CSS global + `useReducedMotionSafe` en JS).
- [x] Objetivos táctiles ≥ 44px (auditoría automatizada en 1440/1280/768/390; correcciones aplicadas).
- [x] Sin desbordamiento horizontal en ningún breakpoint (`overflow-x: clip` en `html, body`).
- [x] Texto secundario con contraste ≥ 4.5:1 (marfil ≥ 55 %; ver `docs/accessibility.md`).

## Por vista

### Portal (`/`)
- [x] Geometría sagrada girando (dos SVG contrapuestos) + logo flotante con halo.
- [x] Título/kicker/subtítulo en Display hero centrado.
- [x] Botón «Entrar» de tres capas con glow y `Magnetic`.
- [x] Pista al pie en mayúsculas espaciadas.
- [x] Coreografía de cruce con cooldown de 24 h (primera vez completa; cruces recientes fundido corto de 250 ms).
- [x] Sin nav ni footer (regla de visibilidad).

### Home (`/inicio`)
- [x] Hero con rejilla 1.05fr/0.95fr, kicker en píldora, título con gradiente, trío de stats.
- [x] Columna derecha con aros orbitales + triángulo + logo flotante.
- [x] Frecuencia del día (botón full-width con `FrequencyDisc`) y rejilla de 4 audios.
- [x] Bento de realms de 12 columnas que tesela: Academia (7) + Descúbrete (5) / Biblioteca (4) + Experiencias (4) + Tienda (4, dos filas) / Mi Santuario (8); 2 columnas en tablet. *(Hasta 2026-09-30 los spans sumaban 13 y dejaban huecos pese a esta casilla.)*
- [x] Sobre Marisol (retrato en arco de nicho) y membresía.
- [x] `WaveSeparator` entre secciones.

### Acceso (`/acceso`)
- [x] Rejilla 1fr/360px con `AuthAside` (aros, logo, cita).
- [x] SegmentedControl login/registro; campo nombre con apertura «pergamino» (grid-rows, `inert`).
- [x] Validación real (email, contraseña ≥ 8, nombre en registro) con `aria-live` y errores en `--color-warn`.
- [x] Envío navega a `/mi-santuario`; `TODO(backend)` en el punto de autenticación real.
- [x] Sin nav ni footer.

### Descúbrete (`/descubrete`)
- [x] Flujo intro → pregunta → sintonización → resultado (reducer puro + temporizador 2600 ms).
- [x] Radio group accesible, `StepProgress`, `AnimatePresence` entre pasos.
- [x] Resultado: orbe, frecuencia asignada, dos botones (repetir / biblioteca).
- [x] Vista centrada verticalmente (`min-h-dvh`), con nav y sin footer.

### Biblioteca (`/biblioteca`)
- [x] Sistema solar: disco destacado («el sol», su foto se funde con una máscara radial) + 6 discos en posiciones orbitales exactas, sin columna de texto duplicada. Apilado en <1024px.
- [x] Filtros por tags (5 pills), `EmptyState` cuando no hay resultados.
- [x] Disco destacado centrado (`FrequencyDisc` con `mx-auto`), aros que escalan.
- [x] Grid responsive < 900px.

### Academia (`/academia`, `/[courseId]`, `/[courseId]/[lessonId]`)
- [x] Card destacada + grid 2 cols (jerarquía 1.15fr/1fr).
- [x] Detalle: video placeholder de geometría/luz, temario con ✓, lección actual resaltada.
- [x] Reproductor de lección con prev/next y pantalla de finalización.
- [x] Headings jerarquizados (h2 en cards).

### Experiencias (`/experiencias`, `/[experienceId]/reservar`)
- [x] Fila destacada + filas estándar (220px/1fr/auto).
- [x] Flujo de reserva: fecha (grid), hora, formulario, confirmación con orbe.
- [x] Fechas locale-aware (`Intl.DateTimeFormat`).
- [x] `TODO(backend)` en el envío de confirmación.

### Tienda (`/tienda`, `/[productId]`, `/carrito`)
- [x] Bento exacto: fila 3 cols (p2/p3/p4), destacado span 2 + p5, fila 3 cols (p6/p7/p8).
- [x] Detalle: banda 4/5, info, secciones colapsables «pergamino», frecuencia asociada, relacionados.
- [x] Carrito con líneas, −/+, resumen sticky y totales correctos (gratis > $50).
- [x] Checkout con `AnimatePresence` y pantalla de confirmación; `ErrorState` de pago fallido.
- [x] `sr-only` h2 sobre el grid de productos (jerarquía h1→h2→h3).

### Mi Santuario (`/mi-santuario`)
- [x] Stats (días, frecuencias, cursos, entradas), tarjeta de continuación, frecuencia diaria.
- [x] Diario: 5 estados de ánimo (44px, wrap en móvil), textarea, guardar con ✓ efímero, timeline.
- [x] `TODO(backend)` implícito en persistencia (store Zustand local).

## Criterios añadidos 2026-09-30

- [x] Un solo eje de página: héroes, bandas y contenido arrancan en el mismo margen (`--page-inset`, `fm-container`).
- [x] Bandas y héroes siempre a sangre; ninguna banda inset junto a bandas a sangre.
- [x] Sin solapes entre la navegación de constelación y el contenido en 1024/1280/1440.
- [x] Barra de realms de móvil/tablet sin truncar, con el realm actual centrado.
- [x] Todos los CTA presentes en el DOM (reserva, membresía, continuar).
- [x] Escalas con nombre (texto, tracking, marfil) y paleta cerrada verificadas por test.

## Desviaciones conscientes registradas

0. **`Branding/` no es fuente visual.** Es un showcase de design system claro/pastel (junio de 2026) que contradice la paleta del producto y no lo referencia ninguna doc. Decisión pendiente del cliente (ver la auditoría del 2026-09-30).


1. **Prototipo perdido**: no existe `frontend-prototype/` en el repo (eliminado en `7c55bf0`). La fidelidad se verifica contra el sistema codificado (`globals.css`, `config/`) y el Brand Book de `~/Descargas/`.
2. **Kit de desarrollo en `/kit`** (no `/_kit`): las carpetas con guión bajo no generan ruta en App Router. Cierra con `notFound()` en producción (guard con `force-dynamic` para que Turbopack no lo elimine en build).
3. **Orbe de carga durante la navegación**: añadido en `RouteTransition` (el plan no lo preveía) porque `usePathname` sólo cambia cuando la vista nueva está lista; sin él la vista anterior quedaba congelada sin indicador.
4. **Cooldown del portal de 24 h**: la coreografía completa sólo la primera vez o tras la ventana de reposo; cruces recientes usan fundido corto (250 ms). Decisión de UX para no repetir una secuencia de 2.2 s en cada cruce.
5. **Viñeta corregida** (`at 50% 145%`): la del prototipo dejaba una banda inferior sin oscurecer.
6. **Fase 15 (3D) no ejecutada**: no hay escenas three.js; los fallbacks 2D (aros, geometría) cubren la dirección visual. El bundle se mantiene dentro de presupuesto en parte por esta ausencia.

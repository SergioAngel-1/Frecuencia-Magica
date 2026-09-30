# Accesibilidad — Frecuencia Mágica

Decisiones y verificación de accesibilidad del frontend. Todo lo que se documenta aquí es de obligado cumplimiento para cambios futuros (ver `AGENTS.md`).

## Contraste

Paleta sobre el fondo de la app (`radial-gradient(140% 100% at 50% -10%, #16273f 0%, var(--void) 45%, var(--void-2) 100%)`). El punto más claro del gradiente es `#16273f` (arriba); los valores de opacidad se fijaron para cumplir **WCAG AA (4.5:1)** contra ese peor caso, no contra el fondo más oscuro.

| Texto | Opacidad mínima de `--ivory` | Contraste sobre `#16273f` |
|---|---|---|
| Cuerpo (≥ 15px) | `60%` | ≈ 5.2:1 |
| Meta / kickers (10–13px, MAYÚSCULAS espaciadas) | `55%` | ≈ 4.8:1 |
| Títulos grandes (≥ 24px serif) | `55%` | ≈ 4.8:1 (mínimo exigido 3:1) |
| Texto decorativo / deshabilitado | nunca por debajo de `55%` | — |

Los cinco peldaños de marfil son tokens (`text-ivory`, `text-fg-body` 82%, `text-fg-soft` 70%, `text-fg-muted` 60%, `text-fg-meta` 55%); el más bajo es el piso AA de la tabla. Sobre **fotografía o zebra** el contraste lo garantiza el scrim único de `EditorialOverlay`, no el peldaño: los kickers de 11px en oro/teal sobre bandas medían 3.3–4.3:1 hasta la pasada del 2026-09-30.

Regla práctica: **nunca introducir `text-ivory/50` o inferior en texto**. El marfil al 50 % sobre `#16273f` cae a ≈ 4.2:1, por debajo de AA. Si un diseño pide más sutil, usar otra señal (tamaño, peso, letter-spacing) en lugar de bajar la opacidad.

`--color-warn` (`#C98B7A`) se usa sólo en errores de formulario: sobre `--void` cumple ≈ 5.1:1 en texto de 14px+.

## Landmarks

| Landmark | Componente |
|---|---|
| `<header>` | `SiteHeader` (fijo, `pointer-events-none` salvo controles) |
| `<nav aria-label="Realms">` | `RealmNav` (constelación) |
| `<main id="contenido">` | Layout `[locale]` — posee el landmark; las páginas NO anidan `<main>` |
| `<footer>` | `SiteFooter` / `RealmFooter` |

Primer elemento enfocable del documento: enlace «Saltar al contenido» (`#contenido`), visualmente oculto hasta recibir foco.

## Foco y teclado

- Foco visible en todos los controles (anillo dorado sobre fondo oscuro, `:focus-visible`).
- La navegación de constelación despliega su badge al enfocar. En móvil/tablet (<1024px) es una barra inferior de vidrio con los seis nombres siempre visibles y **desplazable en horizontal** (seis nombres completos no caben en 390px y truncarlos los volvía ilegibles); el realm actual se centra al entrar. En escritorio sólo hay puntos: las etiquetas persistentes chocaban con los textos que arrancan en el eje de página.
- Grupos de radio del quiz y rejillas de fecha de reserva: radio group nativo / botones con flechas.
- El dock del reproductor es operable por teclado (la barra de progreso es un `input[type=range]` nativo).
- `inert` + `aria-hidden` retiran el campo «nombre» del tab y del árbol accesible cuando el formulario está en modo login (apertura tipo pergamino con grid-rows).
- Sin trampas de foco.

## Controles sólo-icono

Todo control sin texto visible lleva `aria-label` (o `aria-label` descriptivo en el link del logo, que repite el wordmark). Capas decorativas (canvas cósmico, nebulosas, aros, geometría, cursor) llevan `aria-hidden="true"` y `pointer-events-none`.

## Movimiento reducido

- CSS: el bloque `@media (prefers-reduced-motion: reduce)` de `tokens.css` (capa base compartida) neutraliza las animaciones CSS; las transiciones de estado quedan en fundido instantáneo.
- JS: `useReducedMotionSafe` (con `useSyncExternalStore`, sin parpadeo de hidratación) consultado por:
  - `LuminousCursor` — el anillo no interpola (sin estela); el cursor no se monta en táctil.
  - `CosmicCanvas` — un único frame quieto, sin `requestAnimationFrame`.
  - `SmoothScroll` — no se instancia (scroll nativo).
  - `RouteTransition` — sin fundido (render directo).
  - `HeroSection` — sin entradas escalonadas.
  - `useCrossPortal` — el cruce del portal pasa a fundido instantáneo y **acorta la navegación** a 250 ms (evita la pantalla negra de 1 s: con el overlay instantáneo, mantener el timer de 1000 ms dejaría un segundo de pantalla oscura).
  - El orbe de carga (`RouteTransition`) se omite con movimiento reducido.

## Anuncios y estados

- `PortalAnnouncer`: región `aria-live` fuera del `aria-hidden` del overlay del portal.
- `NewsletterForm` y el diario del santuario: confirmaciones en región `aria-live`.
- Estados de carga: `Skeleton` (variantes `disc`/`card`/`line`) por realm; `LoadingOrb` sólo como indicador de navegación (`RouteTransition`) — con `aria-hidden` porque es decorativo (la navegación se anuncia sola).
- 404 y error boundary con copy de marca (`ErrorState`, nunca el stack).

## Verificación

**2026-09-30 (auditoría de coherencia visual):**

- Contraste medido sobre píxeles renderizados (texto transparente + muestreo del percentil 90 de luminancia bajo cada caja; colores computados convertidos vía canvas porque Tailwind v4 emite `oklab()`): 603 textos por ancho, 99% ≥ AA en 1440 y 390. Sin fallos reales; los que quedan son etiquetas `sr-only`, un campo `inert` y un botón deshabilitado.
- 15 rutas × 3 anchos (1440/768/390) = 45 combinaciones: 0 desbordes horizontales, 0 errores de consola, 0 hit targets <44px (salvo el skip-link, oculto hasta recibir foco).
- `/tienda/carrito` ganó su `h1` (`sr-only`); el `<audio>` de la lección usa `color-scheme: dark`.
- `Button asChild` + `Link` en Server Components no renderiza el botón (sin error): los CTA de reserva y membresía no existían. Se usa `ButtonLink` y hay un test que lo impide.
- Los `alt` editoriales llegan siempre traducidos (`tests/lib/editorial-alt.test.ts`).

**2026-08-11:**

- `@axe-core/cli` (4.13) sobre las 9 rutas × 2 idiomas (18 páginas): **cero violaciones** (2026-08-11).
- Contraste: calculado contra el punto más claro del gradiente (`#16273f`).
- Hit targets ≥ 44px medidos por script en los 4 breakpoints (1440/1280/768/390): los controles de estado de ánimo del diario se subieron de 40 a 44px y hacen wrap en móvil.
- Sin desbordamiento horizontal en ningún breakpoint (`overflow-x: clip` en `html, body` recorta la geometría giratoria sin crear scroll container).
- Recorrido por teclado y lector de pantalla: pendiente de auditoría manual en dispositivo real.

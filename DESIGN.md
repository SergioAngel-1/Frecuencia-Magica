---
name: Frecuencia Mágica
description: Portal inmersivo de bienestar (marca Marisol). Fotografía como materia estructural sobre un world engine vivo, en una paleta cerrada de noche, oro, teal y lavanda.
colors:
  void: "#0F1B2E"
  void-deep: "#0a1220"
  void-lift: "#16273f"
  gold: "#D8B978"
  teal: "#96C6BC"
  lavender: "#B9B0D6"
  ivory: "#F7F4EA"
  ink: "#12213a"
  warn: "#C98B7A"
typography:
  display:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(46px, 8vw, 104px)"
    fontWeight: 300
    lineHeight: 0.98
    letterSpacing: "normal"
  headline:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(36px, 5.5vw, 72px)"
    fontWeight: 300
    lineHeight: 1
    letterSpacing: "normal"
  title:
    fontFamily: "Cormorant Garamond, Georgia, serif"
    fontSize: "clamp(26px, 3vw, 34px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "normal"
  body:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 300
    lineHeight: 1.7
    letterSpacing: "normal"
  lead:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 300
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Jost, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 300
    lineHeight: 1.4
    letterSpacing: "0.3em"
rounded:
  field: "14px"
  card: "22px"
  card-lg: "26px"
  pill: "999px"
spacing:
  page-inset-mobile: "24px"
  page-inset-tablet: "8vw"
  page-inset-desktop: "10vw"
  container-max: "1240px"
  hit-target: "44px"
components:
  button-primary:
    backgroundColor: "{colors.ivory}"
    textColor: "{colors.ink}"
    typography: "{typography.lead}"
    rounded: "{rounded.pill}"
    padding: "15px 34px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "15px 34px"
    height: "44px"
  button-accent:
    backgroundColor: "rgba(216,185,120,0.12)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "15px 34px"
    height: "44px"
  badge-solid:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  pill-filter:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "8px 20px"
    height: "44px"
  glass-panel:
    backgroundColor: "rgba(247,244,234,0.045)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.card}"
  input:
    backgroundColor: "rgba(247,244,234,0.045)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.field}"
    padding: "14px 16px"
    height: "44px"
---

# Design System: Frecuencia Mágica

> Fuente de verdad visual del frontend. Nace de leer el código de `frontend/` (2026-09-30), el contrato editorial (`docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md`) y `AGENTS.md`. Los **tokens normativos viven en `frontend/src/app/globals.css`**; este documento los describe y fija cómo usarlos. Si discrepan, manda el CSS y este archivo se corrige.

## Overview

**Creative North Star: "El Umbral Luminoso"**

Frecuencia Mágica no es un sitio sobre bienestar: es un lugar al que se entra. El visitante cruza un portal y llega a nueve *realms* que comparten una sola atmósfera, noche azul profunda atravesada por oro, teal y lavanda, donde todo respira. La tesis aprobada es una frase de dos mitades: **la fotografía es la materia estructural; el world engine es su energía viva**. La imagen aporta peso, escala y ritmo editorial; el canvas cósmico, los halos, los aros, la geometría sagrada, el cursor luminoso y el audio ambiental la atraviesan, la iluminan y la recortan. La fotografía se asienta *sobre* la energía; nunca la sustituye.

El tono visual es íntimo, sereno y poético. Se habla en segunda persona ("vuelve a ti", "respira"), se escribe con serif ligera a gran tamaño y se deja aire. Los acentos son luz (halos, bordes finos, resplandores), jamás rellenos. Nada es estático: los fondos viven, los elementos flotan, orbitan o laten, y toda entrada llega en fade-up escalonado.

Mientras no hay fotografía real, cada slot muestra el skeleton **zebra**: bandas de la paleta a baja opacidad con barrido de luz. Es arte dirigido, no un hueco; nunca una caja gris, ni stock, ni Unsplash.

**Key Characteristics:**
- Paleta cerrada de siete colores; el acento entra como luz, no como superficie.
- Serif Cormorant Garamond ligera (peso 300) para voz y números; Jost 300 para interfaz; kickers en mayúsculas espaciadas.
- Composición editorial: héroes y bandas a sangre, una sola línea de contenido, jerarquía por escala y no por cajas.
- Cada realm conserva su identidad (quiz, sistema orbital, bento, filas de reserva, diario); la fotografía se adapta al realm, no al revés.
- Movimiento siempre presente y siempre contenido: sólo `transform` y `opacity`, con `prefers-reduced-motion` respetado.

**El brief manda sobre los hábitos genéricos.** Las guías generales de diseño con IA desaconsejan kickers sobre titulares, texto con gradiente, tríos de métricas y glassmorphism. Aquí el cliente los fija de forma explícita (kickers en mayúsculas 11px, `heroTitleEm` con gradiente oro→teal→lavanda, stats del hero, cristal astral). Se mantienen; este documento prevalece sobre cualquier preset externo.

## Colors

Un cielo nocturno con tres luces y un marfil. Siete colores, ningún otro.

### Primary
- **Oro Atardecer** (`#D8B978`, `--color-gold`): la luz principal. Enlaces, bordes activos, badge «Destacado», kickers, halos de los realms Biblioteca, Tienda y Santuario, foco visible. Se usa como borde, brillo o texto; el único relleno permitido es pequeño (badge, botón de suscripción).

### Secondary
- **Teal Niebla** (`#96C6BC`, `--color-teal`): acento del realm Academia y de la voz informativa (kickers de archivo, enlaces «Ver todo»).
- **Lavanda Bruma** (`#B9B0D6`, `--color-lav`): acento de Descúbrete y Experiencias; tono de lo introspectivo.

### Neutral
- **Vacío** (`#0F1B2E`, `--color-void`): el fondo. Con `Vacío Hondo` (`#0a1220`) y `Vacío Elevado` (`#16273f`) forma el gradiente de la app: `radial-gradient(140% 100% at 50% -10%, #16273f 0%, #0F1B2E 45%, #0a1220 100%)`.
- **Marfil** (`#F7F4EA`, `--color-ivory`): todo el texto y los rellenos claros. Nunca blanco puro.
- **Tinta** (`#12213a`, `--color-ink`): texto oscuro sobre rellenos marfil u oro (botón primario, badge). Valor del prototipo.
- **Terracota** (`#C98B7A`, `--color-warn`): exclusivamente errores de formulario y estados de fallo.

### Named Rules
**La Regla de los Cinco Marfiles.** El texto sobre fondo oscuro usa cinco peldaños y sólo cinco: `text-ivory` (100%, títulos y énfasis), `text-fg-body` (82%, párrafos), `text-fg-soft` (70%, descripciones), `text-fg-muted` (60%, apoyo) y `text-fg-meta` (55%, kickers y meta mínima). Todos cumplen AA (4.5:1) contra el punto más claro del fondo (`#16273f`). Nunca por debajo de 55%; si un diseño pide más sutileza, se cambia tamaño, peso o tracking, no la opacidad.

**La Regla de la Luz, no del Relleno.** Oro, teal y lavanda aparecen como halo, borde de 1px o brillo. Un relleno sólido grande de acento (una barra, un panel, una píldora estirada) rompe el sistema. El relleno sólido se reserva para elementos pequeños: badge, botón circular, marfil del botón primario.

**La Regla de la Paleta Cerrada.** Ningún hex nuevo en componentes. Las portadas de audio, curso, experiencia y producto usan los nueve tintes de `frontend/src/config/covers.ts` (mezclas desaturadas de la paleta con el vacío); `tests/lib/palette.test.ts` lo verifica.

## Typography

**Display Font:** Cormorant Garamond (con Georgia, serif)
**Body Font:** Jost (con system-ui, sans-serif)
**Label Font:** Jost, mayúsculas

**Character:** La serif ligera y cursiva pone la voz poética (títulos, cifras de frecuencia, precios, citas); la sans geométrica y fina se queda en la interfaz. El contraste entre ambas es la firma tipográfica del sitio.

### Hierarchy
- **Display** (300, `clamp(46px, 8vw, 104px)`, 0.98): el título del portal y el hero. Sólo `Display size="hero"`.
- **Headline** (300, `clamp(36px, 5.5vw, 72px)`, 1): títulos de sección y de banda editorial (`lg`); `xl` (`clamp(46px, 6.2vw, 86px)`) para héroes de realm; `feature` (`clamp(38px, 6vw, 78px)`, 0.92) para la pieza destacada de una vista.
- **Title** (400, `clamp(26px, 3vw, 34px)`, 1.05): nombre de un ítem dentro de una tarjeta o fila. Precios y cifras en serif, peso 300–400.
- **Body** (300, 15px, 1.7): texto corrido y UI. `text-body`. Medida 65–75ch; `Prose` fija el ancho en `ch`.
- **Lead** (300, 17px, 1.75): entradillas y descripciones destacadas. `text-lead`.
- **Meta** (300, 13px): fechas, conteos, apoyo. `text-meta`. Nunca para información esencial única.
- **Label** (300, 11px, MAYÚSCULAS, tracking .14em–.4em): kickers y etiquetas. `text-label`. Sólo con tracking de la escala.

**Tracking: seis peldaños.** `soft` .05em (botones serif, nav), `ui` .1em (pills, meta sans), `label` .14em (stats), `caps` .2em (badges, enlaces con flecha), `kicker` .3em (kicker estándar), `eyebrow` .4em (cabecera de realm).

### Named Rules
**La Regla de los Tamaños Nombrados.** La sans usa `text-label`, `text-meta`, `text-body` y `text-lead`; nunca `text-[Npx]` suelto por debajo de 16px. Los titulares pasan por `Display`; el eyebrow, por `Kicker`. `cn()` conoce estos tokens (`frontend/src/lib/cn.ts`): al añadir uno a `@theme`, se registra allí.

**La Regla del Kicker.** Un kicker es 11px, mayúsculas, con tracking `label`, `kicker` o `eyebrow`, en `gold`, `teal`, `lav` o `muted`. Nunca se repite el mismo texto en kicker y badge, ni el kicker de la vista encima del kicker de su sección.

## Layout

**Un solo eje de página.** Héroes, bandas y contenido arrancan en el mismo margen lateral: `--page-inset` (24px en móvil, `8vw` desde 640px, `10vw` desde 1024px), combinado con un ancho máximo de lectura (`--container-max`, 1240px). El utilitario `fm-container` aplica ese eje a cualquier bloque de 100vw. Texto de héroe, filtros, títulos de banda y cuadrícula comparten la misma arista izquierda; si dos elementos de una misma vista arrancan en x distintas, es un defecto.

**A sangre o dentro del eje, nunca a medias.** Bandas (`EditorialBanner`), héroes (`FullBleedSection`) y secciones editoriales ocupan el viewport completo (`fm-editorial-full-bleed`); su contenido se alinea con el eje. Una banda inset deja un borde duro junto a las que sí llegan al borde.

**Rejilla y ritmo.** Retículas asimétricas de 12 columnas (bento de realms: 7+5, 4+4+4 con Tienda a dos filas, 8 + resto), gap de 16–28px. Separación generosa entre bloques (`clamp(46px, 8vw, 110px)`), apretada dentro de un grupo. Los realms con vista centrada (Descúbrete, portal) se resuelven en `min-h-dvh`.

**Breakpoints obligatorios:** 1440 / 1280 / 768 / 390. Utilidades de Tailwind en 640 (`sm`), 768 (`md`) y 1024 (`lg`); toda vista existe en móvil. Hit targets ≥44px; el texto corrido ≥15px.

**Navegación y capas fijas.** La constelación de realms es una columna lateral de puntos desde 1024px (el nombre aparece al acercarse o enfocar) y una barra inferior de vidrio, desplazable y con nombres completos, por debajo. El dock del reproductor reserva 140px al pie (`fm-shell-reserve-bottom`). El header lleva un scrim de vacío para que logo y controles no floten sobre texto.

## Elevation & Depth

Sin sombras de bloque. La profundidad se construye con **luz y vidrio**: superficies de cristal sobre el fondo vivo, halos de acento alrededor de lo importante y scrims del gradiente de la app sobre la fotografía. Las sombras que existen son resplandores suaves de acento.

### Shadow Vocabulary
- **Cristal astral** (`background: rgba(247,244,234,0.045); border: 1px solid rgba(216,185,120,0.20); backdrop-filter: blur(12px)`): `fm-surface`, la superficie de todas las tarjetas.
- **Cristal denso** (`background: rgba(15,27,46,0.72); backdrop-filter: blur(22px)`): `fm-surface-strong`, dock del reproductor, badge de la nav y barra inferior de móvil.
- **Halo** (`--shadow-glow-gold|teal|lav: 0 0 24px rgb(… / 0.25)`, `--shadow-glow-card: 0 0 60px rgb(216 185 120 / 0.18)`): el acento como luz, en hover y en tarjetas destacadas.
- **Scrim** (degradado de `#0F1B2E`/`#0a1220` al 70–88% según la dirección): legibilidad del texto sobre fotografía, definido una sola vez en `EditorialOverlay`.

### Named Rules
**La Regla del Halo.** Un resplandor es de acento (oro, teal o lavanda), de baja opacidad y gran radio. Nunca gris, nunca negro duro, nunca un desplazamiento de bloque.

**La Regla del Scrim Único.** El texto sobre imagen se lee por `EditorialOverlay`; ningún componente dibuja su propio degradado de legibilidad. El texto nunca baja del contraste AA documentado.

## Shapes

Lenguaje de formas redondo y de línea fina, con geometría sagrada como ornamento. Tarjetas de cristal de 22px (26px para las destacadas), campos de 14px, pills completas (999px). Bordes de 1px en `rgba(216,185,120,0.20)`. Los aros orbitales, el triángulo y el rombo del separador de onda son el ornamento; nada de iconos de librería ni emojis (única excepción: ✓ de confirmación).

Las bandas y héroes a sangre no llevan radio. El retrato de Marisol conserva su **arco de nicho** (esquinas superiores de 200px). Los radios de 2–4px existen sólo en pistas y líneas (barras de progreso, líneas de skeleton, ticks del ecualizador), nunca en contenedores.

## Components

### Buttons
- **Shape:** píldora completa (999px), serif con tracking `soft`, altura mínima 44px, transición de .3s sólo de color/fondo/borde/sombra/opacidad.
- **Primary:** marfil al 95% con texto `ink` y halo dorado; en hover sube a marfil pleno y el halo crece. Desactivado: la misma píldora como vidrio con borde, sin halo; nunca un relleno gris.
- **Outline / Glass / Ghost:** borde marfil al 22%; `glass` añade blur de 8px; `ghost` es texto sans sin contenedor.
- **Accent:** fondo y borde del acento (`gold`, `teal` o `lav`) a baja opacidad, con halo en hover.
- **En Server Components** se usa `ButtonLink` (`components/layout`), nunca `Button asChild` con `Link`: desaparece en silencio.

### Kicker, Display y ArrowLink
`Kicker` (eyebrow), `Display` (titulares, con `id` para `aria-labelledby`) y `arrowLinkClasses` + `ArrowGlyph` («Ver todo →»: subrayado fino del acento del realm, mayúsculas, 44px) son las tres piezas tipográficas del UI Kit; se prefieren a cualquier `<p>`/`<h*>` con clases sueltas.

### Cards / Containers
- **Corner Style:** 22px (`rounded-card`); 26px para destacadas.
- **Background:** cristal astral; halo opcional (`glow`).
- **Internal Padding:** 20–38px según escala (`clamp`). Una tarjeta contiene o complementa la imagen; no la sustituye. Nunca tarjetas anidadas.

### Badge y Pill
`Badge` es una píldora de 11px en mayúsculas con tracking `caps`; la variante sólida (oro 92%, texto `ink`) marca lo «Destacado» y **siempre mide lo que su texto** (`w-fit self-start`). `Pill` es el filtro/toggle: borde y fondo marfil tenues, activo en oro, `aria-pressed`.

### Inputs / Fields
- **Style:** fondo cristal, borde `glass-brd`, radio 14px, 44px de alto, placeholder `fg-meta`.
- **Focus:** borde dorado al 55% + halo de 3px; el foco global es un aro dorado de 2px con offset de 3px.
- **Error:** borde y etiqueta en terracota, mensaje con `aria-live="polite"`.

### Navigation
La **constelación**: seis puntos de luz, uno por realm, tintados con el acento del realm; el activo brilla. En escritorio el nombre emerge al acercarse o enfocar; en móvil y tablet es una barra de cristal con los seis nombres en mayúsculas, desplazable, con el realm actual centrado. No aparece en portal ni acceso.

### Editorial media (signature)
`FullBleedSection` (héroe o banda con fotografía), `EditorialBanner` (franja con kicker, título y acción), `EditorialImage` (imagen o zebra más scrim) y `MediaSkeleton` (zebra: bandas oro/teal/lavanda/vacío a baja opacidad, ángulo y fase derivados del id del slot, capa del 124% para que el barrido nunca deje ver el borde). Todo slot sin asset usa la zebra y lleva `data-media-slot`.

### Frequency Disc (signature)
El disco orbital de frecuencia es la pieza identitaria: esfera con luz especular, aros contrarrotados, cifra en serif y unidad «Hz». Tres escalas (`sm` 150px, `md` 190px, `lg` 380px); sólo la grande lleva ecualizador. En la Biblioteca no hay rejilla de tarjetas: el destacado es el sol y seis discos orbitan a su alrededor.

### Movimiento
Entradas en fade-up escalonado (`.1s`, `.25s`, `.4s`, `.55s`), curva `cubic-bezier(.2,.85,.25,1)` sin rebote; el portal usa `cubic-bezier(.7,0,.3,1)`. Sólo `transform` y `opacity`. Con `prefers-reduced-motion` se congela lo decorativo y se conserva la narrativa.

## Do's and Don'ts

### Do:
- **Do** usar los cinco marfiles (`text-ivory`, `text-fg-body`, `text-fg-soft`, `text-fg-muted`, `text-fg-meta`) y los tamaños nombrados (`text-label`, `text-meta`, `text-body`, `text-lead`).
- **Do** alinear héroe, filtros, bandas y cuadrícula al eje de página con `fm-container`, y dejar las bandas a sangre (`fm-editorial-full-bleed`).
- **Do** dar a cada slot fotográfico su ratio (3:4, 1:1, 16:8, 16:9), su alt traducido (`messages/{es,en}.json`) y, sin asset, la zebra.
- **Do** usar `ButtonLink` para botones-enlace en Server Components y `Kicker`/`Display`/`arrowLinkClasses` antes que clases sueltas.
- **Do** verificar en 1440, 1280, 768 y 390: sin desbordes, sin solapes con la nav, hit targets ≥44px.
- **Do** registrar cualquier escala nueva de `@theme` en `frontend/src/lib/cn.ts`.

### Don't:
- **Don't** añadir hex, fuentes ni colores de acento fuera de la paleta; ni `rgba()` de la paleta en clases cuando existe el token con opacidad (`border-gold/20`).
- **Don't** usar rellenos sólidos grandes de acento, cajas grises, stock, Unsplash ni emojis.
- **Don't** escribir `text-[Npx]` (<16px), `tracking-[…]` ni `text-ivory/NN` sueltos: hay tokens.
- **Don't** repetir el mismo mensaje en dos bandas de una misma vista, ni el mismo texto en kicker y badge.
- **Don't** dibujar scrims propios sobre fotografía ni poner texto sobre imagen por debajo de AA.
- **Don't** reintroducir `Button asChild` con `Link` en un Server Component.
- **Don't** convertir los nueve realms en la misma plantilla: la fotografía se adapta al trabajo de cada uno.
- **Don't** tomar `Branding/` (design system claro/pastel de junio de 2026) como referencia de esta marca: contradice la paleta de este documento y no es autoritativo.

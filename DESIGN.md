---
name: Frecuencia Mágica
description: Portal inmersivo de bienestar (marca Marisol). Paisaje luminoso como materia estructural sobre un world engine vivo, en una paleta cerrada de noche, oro, teal y lavanda, con cinco temas globales (la noche es uno de ellos).
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
    padding: "11px 26px"
    height: "44px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "11px 26px"
    height: "44px"
  button-accent:
    backgroundColor: "rgba(216,185,120,0.12)"
    textColor: "{colors.ivory}"
    rounded: "{rounded.pill}"
    padding: "11px 26px"
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

> Fuente de verdad visual del frontend. Nace de leer el código de `frontend/` (2026-09-30), el contrato editorial (`docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md`) y `AGENTS.md`. Los **tokens normativos viven en `frontend/src/app/tokens.css`** (fuente única: `globals.css` los importa y `Branding/` los muestra en vivo); este documento los describe y fija cómo usarlos. Si discrepan, manda el CSS y este archivo se corrige.

## Overview

**Creative North Star: "El Umbral Luminoso"**

Frecuencia Mágica no es un sitio sobre bienestar: es un lugar al que se entra. El visitante cruza un portal y llega a nueve _realms_ que comparten una misma marca y uno de cinco temas: la noche azul profunda atravesada por oro, teal y lavanda es la primera y la predeterminada del portal, y donde todo respira. La tesis es una frase de dos mitades: **la imagen es el paisaje; el world engine es su energía viva**. La imagen (agua, bruma, cielo cósmico, a veces una silueta de luz) aporta peso, escala y ritmo editorial; el canvas cósmico, los halos, los aros, la geometría sagrada, el cursor luminoso y el audio ambiental la atraviesan, la iluminan y la recortan. La imagen se asienta _sobre_ la energía; nunca la sustituye. Desde la enmienda de 2026-10-10 el medio es el paisaje luminoso nocturno y no el bodegón fotográfico (ver _Imagery_).

El tono visual es íntimo, sereno y poético. Se habla en segunda persona ("vuelve a ti", "respira"), se escribe con serif ligera a gran tamaño y se deja aire. Los acentos son luz (halos, bordes finos, resplandores), jamás rellenos. Nada es estático: los fondos viven, los elementos flotan, orbitan o laten, y toda entrada llega en fade-up escalonado.

Mientras no hay fotografía real, cada slot pinta el fallback de su contrato: la **zebra** (bandas de la paleta a baja opacidad, quietas) en héroes y retrato; la banda de color del ítem en cursos, experiencias, productos y audios; nada en las atmósferas sin trabajo narrativo. Es arte dirigido, no un hueco; nunca una caja gris, ni stock genérico, ni Unsplash. La zebra no late: un barrido en bucle se lee como «cargando», y la única espera del sitio es la escena de `states.loading`.

**Key Characteristics:**

- Paleta cerrada de siete colores; el acento entra como luz, no como superficie.
- Serif Cormorant Garamond ligera (peso 300) para voz y números; Jost 300 para interfaz; kickers en mayúsculas espaciadas.
- Composición editorial: héroes y bandas a sangre, una sola línea de contenido, jerarquía por escala y no por cajas.
- Imagen de paisaje luminoso: cielo arriba y materia abajo, para no duplicar el campo de estrellas que ya pinta el engine.
- Cada realm conserva su identidad (quiz, sol y esferas por tipo de escucha, bento, filas de reserva, diario); la fotografía se adapta al realm, no al revés.
- Movimiento siempre presente y siempre contenido: sólo `transform` y `opacity`, con `prefers-reduced-motion` respetado.

**El brief manda sobre los hábitos genéricos.** Las guías generales de diseño con IA desaconsejan kickers sobre titulares, texto con gradiente, tríos de métricas y glassmorphism. Aquí el cliente los fija de forma explícita (kickers en mayúsculas 11px, `heroTitleEm` con gradiente oro→teal→lavanda, stats del hero, cristal astral). Se mantienen; este documento prevalece sobre cualquier preset externo.

## Colors

Un cielo nocturno con tres luces y un marfil. Siete colores de marca, ningún otro. Las atmósferas (§ Atmósferas) son la única capa que añade matices, y los declara sólo en `tokens.css`.

### Primary

- **Oro Atardecer** (`#D8B978`, `--color-gold`): la luz principal. Enlaces, bordes activos, badge «Destacado», kickers, halos de los realms Resonario, Tienda y Santuario, foco visible. Se usa como borde, brillo o texto; el único relleno permitido es pequeño (badge, botón de suscripción).

### Secondary

- **Teal Niebla** (`#96C6BC`, `--color-teal`): acento del realm Academia y de la voz informativa (kickers de archivo, enlaces «Ver todo»).
- **Lavanda Bruma** (`#B9B0D6`, `--color-lav`): acento de Descúbrete y Experiencias; tono de lo introspectivo.

### Neutral

- **Vacío** (`#0F1B2E`, `--color-void`): el fondo. Con `Vacío Hondo` (`#0a1220`) y `Vacío Elevado` (`#16273f`) forma el gradiente de la app en el tema `night` (los demás declaran el suyo, § Atmósferas): `radial-gradient(140% 100% at 50% -10%, #16273f 0%, #0F1B2E 45%, #0a1220 100%)`.
- **Marfil** (`#F7F4EA`, `--color-ivory`): todo el texto y los rellenos claros. Nunca blanco puro.
- **Tinta** (`#12213a`, `--color-ink`): texto oscuro sobre rellenos marfil u oro (botón primario, badge). Valor del prototipo.
- **Terracota** (`#C98B7A`, `--color-warn`): exclusivamente errores de formulario y estados de fallo.

### Named Rules

**La Regla de los Cinco Marfiles.** El texto sobre fondo oscuro usa cinco peldaños y sólo cinco: `text-ivory` (100%, títulos y énfasis), `text-fg-body` (82%, párrafos), `text-fg-soft` (70%, descripciones), `text-fg-muted` (60%, apoyo) y `text-fg-meta` (55%, kickers y meta mínima). Todos cumplen AA (4.5:1) contra el punto más claro del fondo de la noche (`#16273f`); el tema claro usa su derivado oscuro y cada tema mide su contraste (§ Atmósferas). Nunca por debajo de 55%; si un diseño pide más sutileza, se cambia tamaño, peso o tracking, no la opacidad.

**La Regla de la Luz, no del Relleno.** Oro, teal y lavanda aparecen como halo, borde de 1px o brillo. Un relleno sólido grande de acento (una barra, un panel, una píldora estirada) rompe el sistema. El relleno sólido se reserva para elementos pequeños: badge, botón circular, marfil del botón primario.

**La Regla del Espectro Cerrado.** La frecuencia no es un arcoíris: sus líneas son de oro, teal y lavanda, nunca un espectro de colores saturados ni neón. Ni en imagen ni en componentes.

**La Regla de la Paleta Cerrada.** Ningún hex nuevo en componentes; los valores de atmósfera viven sólo en `tokens.css`. Las portadas de audio, curso, experiencia y producto usan los nueve tintes de `frontend/src/config/covers.ts` (mezclas desaturadas de la paleta con el vacío); `tests/lib/palette.test.ts` lo verifica.

## Atmósferas

> En la interfaz son **temas**; en el código se conserva el nombre `atmosphere` (`config/atmospheres.ts`, `data-atmosphere`) porque `ambient` ya nombra el drone. Contrato: `docs/superpowers/specs/2026-10-17-temas-globales-design.md`.

Cinco temas conviven con la marca y **uno solo está activo en todo el sitio**: lo fija `<html data-atmosphere>` y todas las vistas lo leen. La persona lo elige en el header (cinco muestras y «Automático»); la elección vive en `localStorage` (`fm.atmosphere`) y se aplica antes del primer pintado. Sin elección, cada lugar sugiere el suyo. Cada tema es un conjunto de valores declarado **sólo en `frontend/src/app/tokens.css`** (`Branding/` lo muestra sin copiarlo). Ninguna sección re-tematiza una parte de una página.

| id | UI | Esquema | Carácter | Lo sugiere |
| --- | --- | --- | --- | --- |
| `night` | Noche | oscuro | la v1, sin cambios; estrellas marfil y polen dorado | portal, Home, acceso, Descúbrete, Resonario, Mi Santuario |
| `dusk` | Atardecer | oscuro cálido | terracota, coral oscuro, ámbar; brasas que ascienden y titilan; sin rojo intenso | Experiencias |
| `dawn` | Amanecer | claro | azul cielo, marfil, dorado tenue; motas de luz que derivan sobre un fondo claro | Academia, Tienda, Sobre Marisol |
| `moon` | Luna | oscuro profundo | azul noche y plata; estrellas plateadas que parpadean y polvo de plata | — |
| `forest` | Bosque | verde natural, luz media | verde y luz filtrada; luciérnagas que pulsan y esporas que caen | — |

«¿Cómo llegas hoy?» (Home, Descúbrete) también cambia el tema global: es otra forma de elegirlo.

**Lo común de marca** (no cambia entre temas): Cormorant Garamond y Jost con sus escalas; el isotipo y el logo; la forma del vidrio y los radios; la luz como acento (halos, nunca rellenos grandes); el movimiento lento (flotar, respirar, entrada escalonada); la voz del texto; el reproductor como pieza reconocible; el pie.

**Qué redefine cada tema** (y sólo esto):

- **Superficie:** gradiente de fondo (`--atmo-bg`), vidrio y su borde, scrim.
- **Texto:** la escalera de cinco peldaños (`fg`, `fg-body`, `fg-soft`, `fg-muted`, `fg-meta`) y un acento de texto propio. Sobre claro, el oro de marca (`#D8B978`) da ≈1,7:1 contra marfil: no sirve de texto, y el tema claro declara su derivado oscuro.
- **Luz:** halos y glows que reemplazan a los dorados (`--halo`).
- **Controles:** botón primario, foco, píldoras, barra y disco del reproductor.
- **Escena del motor:** estrellas, partículas y nebulosas propias del tema (`lib/cosmic/themes.ts`; las nebulosas del DOM leen `--nebula-a|b|c` y `--nebula-boost`). Ningún tema apaga el motor: el claro pinta motas de luz en lugar de estrellas. Los modos del realm (`cosmic|editorial|quiet`) siguen graduando la intensidad.
- **Imagen:** un slot escénico puede traer una imagen propia en el tema (`<slot>@<tema>`); sin ella ve la de la noche.
- **Sonido:** nota y voz del drone.
- **Barra del navegador:** `theme-color`.

**Contraste como guarda.** Cada tema cumple AA sobre su propia superficie: 4,5:1 para texto y 3:1 para UI grande y foco, también en el caso sin imagen (su degradado de respaldo). Lo comprueba un test por tema (`atmosphere-contrast`). En el claro (`dawn`) la escalera de texto `fg-body|soft|muted|meta` sube a 0.9/0.8/0.74/0.7 para cumplir AA; la de la noche y las oscuras conserva 82/70/60/55. `line` es un borde decorativo (≥1,5:1) y `line-strong`, el de controles y foco, llega a ≥3:1. Los controles fijos (header, constelación, reproductor, WhatsApp) usan vidrio denso tintado por el tema activo, no transparente.

**Velo, luz y cambio.** El velo de cada tema son dos tripletes, `--scrim` (medio) y `--scrim-deep` (denso), con sus utilidades `bg-scrim` y `bg-scrim-deep`: en los oscuros el navy de siempre (la noche, idéntica), en el claro el velo claro. `EditorialOverlay` y la viñeta de la nebulosa leen esos tokens: ningún componente fija un navy a mano ni recibe el «tono» del velo por props. Sí lo fija a propósito la superficie de un video (controles en marfil sobre oscuro en todo tema). Sobre claro, los puntos de la constelación llevan un aro de tinta (`.fm-nav-dot`). Al cambiar de tema el fondo funde por `opacity` (`AtmosphereBackdrop`), el lienzo apaga la escena vieja y enciende la nueva, y durante el fundido los colores del sitio transitan (`[data-theme-switching]`); con movimiento reducido el cambio es inmediato.

**Imagen por tema.** La base de un slot es la foto nocturna (`kind: photo`); las variantes salen en el manifiesto como `slot@tema` y `ThemedPhoto` monta la del tema activo sobre la base, con una regla CSS que oculta la base mientras tanto (nunca se ve la foto equivocada). Hasta que exista la variante de un tema claro, la base se lava (`[data-scheme='light'] [data-photo-night]`). Reglas de cobertura en `THEME_VARIANTS` (`config/editorial-media.ts`): los héroes llevan variante en Atardecer, Amanecer y Bosque; las bandas con texto y los fondos de cristal, en Amanecer; la luna comparte la imagen de la noche; las portadas de audio, curso y experiencia y los productos no cambian con el tema. Las imágenes de tema conservan sus colores naturales (tratamiento `natural`), sin stock genérico: fotografía propia o con licencia comercial documentada. Sin foto, el fallback es el del contrato del slot. Los prompts viven en `docs/prompts-chatgpt.md`.

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

**Bandas que se encuentran en la noche.** Las bandas a sangre consecutivas se encadenan dentro de `BandChain`, sin hueco, y se encuentran en una línea de noche; fuera de una cadena, `section`. Toda banda funde sus bordes con máscara, nunca con un degradado de color.

**Rejilla y ritmo.** Retículas asimétricas de 12 columnas (bento de realms: 7+5, 4+4+4 con Tienda a dos filas, 8 + resto), gap de 16–28px. Separación generosa entre bloques, apretada dentro de un grupo, con **dos peldaños y sólo dos**: `section` (`clamp(56px, 8vw, 112px)`) separa secciones y cierra la página antes del footer; `block` (`clamp(28px, 5vw, 72px)`) separa un héroe o un encabezado de su contenido. Se usan como `py-section`, `gap-section`, `mt-block`; ninguna sección trae su propio margen exterior (lo pone el contenedor de la vista) y no se escriben `clamp()` sueltos para separar bloques. El hueco de los controles fijos (el dock del reproductor) lo reserva el footer, no cada vista. Los realms con vista centrada (Descúbrete, portal) se resuelven en `min-h-dvh`.

**Breakpoints obligatorios:** 1440 / 1280 / 768 / 390. Utilidades de Tailwind en 640 (`sm`), 768 (`md`) y 1024 (`lg`); toda vista existe en móvil. Hit targets ≥44px; el texto corrido ≥15px.

**Navegación y capas fijas.** La constelación de realms es una columna lateral de puntos desde 1024px (el nombre aparece al acercarse o enfocar). Por debajo, un botón de menú en el header la despliega en una tarjeta modal (`RealmMenu` + `Modal`): no queda ninguna barra fija al pie compitiendo con el reproductor. El dock del reproductor ocupa el pie y el footer le reserva su hueco. El header lleva un scrim de vacío para que logo y controles no floten sobre texto.

## Elevation & Depth

Sin sombras de bloque. La profundidad se construye con **luz y vidrio**: superficies de cristal sobre el fondo vivo, halos de acento alrededor de lo importante y scrims del gradiente de la app sobre la fotografía. Las sombras que existen son resplandores suaves de acento.

### Shadow Vocabulary

- **Cristal astral** (`background: rgba(247,244,234,0.045); border: 1px solid rgba(216,185,120,0.20); backdrop-filter: blur(12px)`): `fm-surface`, la superficie de todas las tarjetas.
- **Cristal denso** (`background: rgba(15,27,46,0.72); backdrop-filter: blur(22px)`): `fm-surface-strong`, dock del reproductor, badge de la nav y barra inferior de móvil.
- **Halo** (`--shadow-glow-gold|teal|lav: 0 0 24px rgb(… / 0.25)`, `--shadow-glow-card: 0 0 60px rgb(216 185 120 / 0.18)`): el acento como luz, en hover y en tarjetas destacadas.
- **Scrim** (degradado de `#0F1B2E`/`#0a1220` al 70–88% según la dirección): legibilidad del texto sobre fotografía, definido una sola vez en `EditorialOverlay`.

### Named Rules

**La Regla del Halo.** Un resplandor es de acento (oro, teal o lavanda), de baja opacidad y gran radio. Nunca gris, nunca negro duro, nunca un desplazamiento de bloque.

**La Regla de las Capas con Nombre.** Entre capas del layout se apila con la escala `z-*` de `frontend/src/app/globals.css`, nunca con `z-[N]`:

| Capa           | `z-index` | Quién la ocupa                       |
| -------------- | --------- | ------------------------------------ |
| `z-world`      | 0         | Canvas cósmico                       |
| `z-atmosphere` | 1         | Nebulosa y figuras de marca          |
| `z-content`    | 100       | `<main>` y footer                    |
| `z-player`     | 180       | Dock del reproductor                 |
| `z-nav`        | 210       | Constelación de realms               |
| `z-header`     | 220       | Header                               |
| `z-offline`    | 8000      | Velo de sin conexión (`OfflineVeil`) |
| `z-portal`     | 9000      | Cruce del portal                     |
| `z-veil`       | 9500      | Velo de transición de ruta           |
| `z-cursor`     | 9800      | Cursor luminoso                      |

El cursor va encima de todo: es el puntero, no decoración. Dentro de un componente aislado (`isolate`) bastan `z-10`/`z-20`. Los nombres están registrados en `frontend/src/lib/cn.ts` y `tests/lib/z-layers.test.ts` prohíbe los `z-[N]` de tres cifras o más.

**La Regla del Scrim Único.** El texto sobre imagen se lee por `EditorialOverlay`; ningún componente dibuja su propio degradado de legibilidad. El texto nunca baja del contraste AA documentado.

## Shapes

Lenguaje de formas redondo y de línea fina, con geometría sagrada como ornamento. Tarjetas de cristal de 22px (26px para las destacadas), campos de 14px, pills completas (999px). Bordes de 1px en `rgba(216,185,120,0.20)`. Los aros orbitales, el triángulo y el rombo del separador de onda son el ornamento; nada de iconos de librería ni emojis (única excepción: ✓ de confirmación).

Las bandas y héroes a sangre no llevan radio. El retrato de Marisol conserva su **arco de nicho** (esquinas superiores de 200px). Los radios de 2–4px existen sólo en pistas y líneas (barras de progreso, líneas de skeleton, ticks del ecualizador), nunca en contenedores.

## Imagery

> Dirección vigente tras la enmienda de 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md`. El inventario, los prompts y las reglas por imagen viven en `docs/brief-fotografico.md` (generado desde `Branding/src/data/photography.js`).

**Paisaje luminoso nocturno.** Las imágenes de fondo de la noche son paisajes de noche, no bodegones (las demás atmósferas siguen § Atmósferas, con color natural): agua en calma, bruma y montaña, cielo cósmico. La luz es un único foco dorado; teal y lavanda son los únicos matices. Es una referencia de sensación (energía, quietud, cosmos), traducida a la paleta cerrada: nunca neón, arcoíris ni saturación alta.

**Cielo arriba, materia abajo.** El cosmos ocupa como mucho el tercio superior de la imagen, con estrellas escasas. El campo estelar, las partículas y la nebulosa son del world engine; una imagen con el cielo completo las duplicaría y competiría con el canvas.

**Cuatro elementos y una firma.**

- **Agua:** espejo en calma, ondas concéntricas, cimática. Resonario, Portal, Santuario.
- **Bruma y montaña:** horizontes, valles, amanecer. Descúbrete, Experiencias, Acceso, Academia.
- **Cielo cósmico:** galaxia en espiral o vía láctea baja. Portal, Home, Sobre Marisol.
- **Cuerpo de luz:** silueta translúcida **sin rasgos faciales**, oro en el borde y teal y lavanda por dentro. Sólo en seis slots narrativos (`home.hero`, `discover.tuning`, `discover.result`, `experiences.featured`, `academy.completion`, `sanctuary.hero`) y en la portada de curso `academy-course-cover-c1`; toda figura de cuerpo entero es el cuerpo de luz y las personas reales sólo aparecen como manos; `about.angels` permanece sin figura.
- **Filamentos de frecuencia** (firma opcional): como máximo tres líneas verticales ondulantes —oro, teal y lavanda— a baja opacidad.

**Lo que no entra.** ADN, cerebros ni anatomía (la energía se sugiere con luz, agua y geometría sagrada); rasgos faciales fuera del retrato real de Marisol; marcas o nombres de canal; campos de estrellas a pantalla completa. El retrato de Marisol sigue siendo sesión real; los productos siguen siendo objetos, bañados en la misma luz.

**No cambia.** Los ratios, focales, prioridades y `fallback` de cada slot, los scrims y las máscaras en CSS, y el rol de la zebra: el contrato de slots permanece intacto.

## Components

### Buttons

- **Size:** uno solo en todo el sitio (17px, 11px × 26px, 44px de alto mínimo). No hay prop `size`: la jerarquía entre botones la dan las variantes, no el tamaño.
- **Shape:** píldora completa (999px), serif con tracking `soft`, altura mínima 44px, transición de .3s sólo de color/fondo/borde/sombra/opacidad.
- **Primary:** marfil al 95% con texto `ink` y halo dorado; en hover sube a marfil pleno y el halo crece. Desactivado: la misma píldora como vidrio con borde, sin halo; nunca un relleno gris.
- **Outline / Glass / Ghost:** borde marfil al 22%; `glass` añade blur de 8px; `ghost` es texto sans sin contenedor.
- **Accent:** fondo y borde del acento (`gold`, `teal` o `lav`) a baja opacidad, con halo en hover.
- **En Server Components** se usa `ButtonLink` (`components/layout`), nunca `Button asChild` con `Link`: desaparece en silencio.

### Kicker, Display y ArrowLink

`Kicker` (eyebrow), `Display` (titulares, con `id` para `aria-labelledby`; reparte sus líneas con `text-balance`, así que ningún titular deja una palabra suelta) y `arrowLinkClasses` + `ArrowGlyph` («Ver todo →»: subrayado fino del acento del realm, mayúsculas, 44px) son las tres piezas tipográficas del UI Kit; se prefieren a cualquier `<p>`/`<h*>` con clases sueltas.

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

La **constelación**: seis puntos de luz, uno por realm, tintados con el acento del realm; el activo brilla. En escritorio el nombre emerge al acercarse o enfocar. En móvil y tablet se abre desde el botón de menú del header como tarjeta modal: los seis realms de un vistazo, cada uno con su punto, su nombre en serif y su emoción, y el actual marcado. No aparece en portal ni acceso.

### Modal

`Modal` (UI Kit) es una tarjeta de cristal denso sobre la noche difuminada, montada sobre el `<dialog>` nativo: foco atrapado, Escape, cierre al pulsar fuera y scroll de página bloqueado. Cabecera con el título en kicker y el cierre como `IconButton` fantasma. `placement="top"` la cuelga bajo el header (menús); `center` la centra. Sólo para lo que de verdad pide interrumpir o proteger el foco.

### Editorial media (signature)

`FullBleedSection` (héroe o banda con fotografía), `EditorialBanner` (franja con kicker, título y acción), `EditorialImage` (imagen o zebra más scrim) y `MediaSkeleton` (zebra: bandas oro/teal/lavanda/vacío a baja opacidad, ángulo y fase derivados del id del slot, capa del 124% para que el barrido de carga nunca deje ver el borde; estática: ninguna vista usa `animated`, porque la espera es la escena de `states.loading`). Sin asset, `EditorialImage` pinta el `fallback` del slot (`zebra`, `band` o `none`, resuelto por `editorialVisual`) y lleva `data-media-slot` y `data-media-visual`.

**Bordes fundidos.** Una banda a sangre no termina en arista: `FullBleedSection` y `EditorialBanner` funden por defecto sus dos bordes (`fade`, por defecto `'both'`) con las máscaras `fm-fade-top` / `fm-fade-bottom` de `tokens.css`, que miden `--fade-band` (un peldaño `section`). La máscara cubre la capa de medios entera, materia y scrim con el mismo alfa (un scrim sin fundir dibujaría la arista él solo); el contenido nunca se enmascara. Lo que roza el header funde sólo el borde inferior. `BandChain` (UI Kit) encadena bandas consecutivas sin hueco y, por posición, abre en cada una el borde que comparte con su vecina; con `intoFooter`, la última continúa en el banner del footer, que anula su filete y su hueco (el único `:has()` del proyecto). `portal.portal-field` usa `fm-fade-radial`: un campo de luz sin aristas.

**Cajas con el ratio del slot.** Una sección cuyo alto decide su contenido usa `mode="anchored"`: la imagen se pinta con el ratio del slot, anclada arriba y a todo el ancho, y funde su borde inferior; el contenido sigue sobre la noche. El foco viaja como variables (`--fm-pos`, y `--fm-pos-mobile` por debajo de 768 px cuando el slot declara `mobilePosition`). `sizes` se deriva de cómo ocupa la imagen su caja (`mediaSizes`): a viewport, por el alto.

### Frequency Disc (signature)

El disco orbital de frecuencia es la pieza identitaria: esfera con luz especular, aros contrarrotados, cifra en serif y unidad «Hz». Cuatro escalas (`xs` 92px, `sm` 150px, `md` 190px, `lg` 380px); sólo la grande lleva ecualizador. Las pequeñas y la destacada llevan un **aura**: la banda del propio audio, difuminada y respirando detrás de la esfera, de modo que cada frecuencia irradia su color; la destacada le suma un halo dorado amplio y tenue (el color cerca, el oro lejos). La portada fotográfica de un audio se pinta **dentro** de la esfera (`cover`), nunca en un marco propio alrededor del disco. Todo disco que abre el reproductor pasa por `AudioDisc` (`components/features/player`). En el Resonario, el destacado es el sol (la esfera grande, con su foto) y cada pista de cada tipo de escucha es una esfera dentro de su tarjeta, en una sección por tipo. Las esferas no ocupan posiciones orbitales fijas: con 16 pistas no caben. Sonando ahora se marca en la tarjeta activa y en el sol.

### Reproductor (dock)

Barra de cristal denso al pie, con halo de tarjeta (nunca sombra negra). Tres estados: cerrado, **desplegado** y **recogido**. Desplegado: la esfera del audio (`PlayerOrb`), título y meta, anterior / reproducir / siguiente, la barra de posición (`SeekBar`: línea de 3px, tramo recorrido en oro, punto de luz al acercarse) y, al final, ocultar y cerrar como `IconButton variant="ghost"`. En móvil se quedan la esfera, el título, reproducir, ocultar y cerrar, y el avance es el filo superior de la barra. **Ocultar no es cerrar**: recoge el dock en un disco flotante en la esquina inferior derecha, con un aro dorado de avance, que sigue sonando y lo despliega al pulsarlo; cerrar termina la escucha. Elegir cualquier audio vuelve a desplegarlo. Los iconos son SVG de un solo trazo (`player-icons.tsx`), no glifos de texto.

### Movimiento

Entradas en fade-up escalonado (`.1s`, `.25s`, `.4s`, `.55s`), curva `cubic-bezier(.2,.85,.25,1)` sin rebote; el portal usa `cubic-bezier(.7,0,.3,1)`. Sólo `transform` y `opacity`. Con `prefers-reduced-motion` se congela lo decorativo y se conserva la narrativa.

**Nada sale de golpe.** Toda transición tiene ida y vuelta: lo que entra con fundido también se va con fundido. Cuando una zona cambia su contenido (un paso por el siguiente, un formulario por su confirmación, una lista al filtrarse) se envuelve en `Swap` (UI Kit), que funde el contenido anterior antes de dejar entrar el nuevo. Las capas que aparecen y desaparecen (`Modal`, el dock del reproductor) animan su salida con `AnimatePresence` y sólo entonces se desmontan; los paneles que se pliegan usan una fila de rejilla de `0fr` a `1fr`, nunca `hidden` ni `height`. Un `animate-fm-fade-up` sobre algo que se monta y desmonta por condición sólo resuelve la entrada: no basta.

### Barras de desplazamiento
La pista es la noche (`void-2`) y el pulgar, una línea de luz fina y en píldora con el espectro de la frecuencia (oro, teal y lavanda) a baja opacidad, que se enciende con un halo al acercarse. Firefox sólo admite color y grosor (`scrollbar-color`, `thin`), acotado a él porque en Chrome la propiedad estándar anularía los estilos de WebKit. Vive en la base de `tokens.css`.

### Espera (signature)

Una sola forma de esperar en todo el sitio: la esfera de `states.loading` respira sobre el agua y el orbe espera en el tercio inferior (`LoadingScene`). La pintan los `loading.tsx` (`RealmLoading`) en una carga directa y `RouteTransition` entre vistas, sólo si la navegación tarda más de `ROUTE_WAIT_DELAY_MS` (250 ms): una vista precargada llega antes y una imagen a pantalla completa en cada clic se leería como un parpadeo. Entra y sale con fundido; nunca un velo desenfocado propio ni siluetas zebra. La imagen se precarga cuando el navegador queda libre, para que esté cuando la red es lenta, que es cuando la espera se ve.

### Cruce del portal (signature)

El único momento coreografiado de la web: se cruza un umbral de luz y se llega a la noche. Tiempos en `PORTAL_TIMING` (`frontend/src/config/motion.ts`), forma en `globals.css`, secuencia en `stores/portal-store.ts`.

- **Entrada** (`cover`, 1150 ms): la luz se reúne en el centro como halo, una onda lavanda se adelanta y el **iris** —un disco de noche con el borde encendido en marfil y oro— se abre hasta que el aro sale de pantalla. La noche del fondo (`--fm-night`) se asienta detrás y la luz queda como un punto.
- **Espera**: noche y punto de luz. No hay reloj: la revelación empieza cuando el destino ha llegado, así que la vista anterior nunca se trasluce. Si la espera se alarga, el punto late; es el indicador de carga.
- **Revelación** (`reveal`, 900 ms): la noche se disuelve sobre el destino mientras el punto se abre, y la entrada escalonada de la vista toma el relevo. Bajo el velo, `RouteTransition` intercambia sin fundido propio.
- **Cruce reciente** (`brief`, 760 ms): el mismo iris, más ágil. El iris se abre hasta cubrir la pantalla en **todos** los cruces; lo que cambia con el reposo de 24 h es el ritmo, no la forma. Un cruce que sólo mostraba el punto de luz se leía como un loader, no como un umbral.
- **Movimiento reducido** (`quick`): sólo la noche que funde y vuelve, sin iris ni punto de luz.

**La Regla de la Noche que Cubre.** Lo que tapa la pantalla es el fondo de la atmósfera activa, nunca un color de acento: la luz del cruce es filo o halo. Un relleno claro a pantalla completa deslumbra, rompe la paleta y deja un lavado gris al disolverse.

## Do's and Don'ts

### Do:

- **Do** usar los cinco marfiles (`text-ivory`, `text-fg-body`, `text-fg-soft`, `text-fg-muted`, `text-fg-meta`) y los tamaños nombrados (`text-label`, `text-meta`, `text-body`, `text-lead`).
- **Do** alinear héroe, filtros, bandas y cuadrícula al eje de página con `fm-container`, y dejar las bandas a sangre (`fm-editorial-full-bleed`).
- **Do** componer la imagen con cielo arriba y materia abajo, y dejar el campo de estrellas y las partículas al world engine.
- **Do** dar a cada slot fotográfico su ratio (3:4, 1:1, 16:8, 16:9), su alt traducido (`messages/{es,en}.json`) y un `fallback` según su trabajo (`zebra`, `band` o `none`); a los slots `band`, el `band` del ítem.
- **Do** usar `ButtonLink` para botones-enlace en Server Components y `Kicker`/`Display`/`arrowLinkClasses` antes que clases sueltas.
- **Do** verificar en 1440, 1280, 768 y 390: sin desbordes, sin solapes con la nav, hit targets ≥44px.
- **Do** registrar cualquier escala nueva de `@theme` en `frontend/src/lib/cn.ts`.

### Don't:

- **Don't** añadir hex, fuentes ni colores de acento fuera de la paleta; ni `rgba()` de la paleta en clases cuando existe el token con opacidad (`border-gold/20`).
- **Don't** usar rellenos sólidos grandes de acento, cajas grises, stock genérico, Unsplash ni emojis.
- **Don't** escribir `text-[Npx]` (<16px), `tracking-[…]` ni `text-ivory/NN` sueltos: hay tokens.
- **Don't** repetir el mismo mensaje en dos bandas de una misma vista, ni el mismo texto en kicker y badge.
- **Don't** dibujar scrims propios sobre fotografía ni poner texto sobre imagen por debajo de AA.
- **Don't** reintroducir `Button asChild` con `Link` en un Server Component.
- **Don't** usar neón, arcoíris ni más de tres filamentos de frecuencia (oro, teal, lavanda) en una imagen.
- **Don't** poner rasgos faciales, ADN, cerebros ni anatomía en las imágenes; el cuerpo de luz es una silueta sin rostro.
- **Don't** convertir los nueve realms en la misma plantilla: la fotografía se adapta al trabajo de cada uno.
- **Don't** declarar tokens en `Branding/` ni en `globals.css`: van en `tokens.css`. `Branding/` refleja este documento, no lo define (el showcase claro/pastel de junio de 2026 fue sustituido el 2026-09-30).

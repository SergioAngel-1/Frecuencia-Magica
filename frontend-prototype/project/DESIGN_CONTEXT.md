# Frecuencia Mágica — Contexto de Diseño Frontend (Handoff)

Documento de traspaso para continuar el frontend en Claude Code / un stack de producción.
Contiene **todo**: concepto, lineamientos obligatorios, sistema visual, arquitectura del prototipo, dependencias y guía de migración.

---

## 1. Qué es Frecuencia Mágica

No es "un sitio web": es un **portal inmersivo y cinematográfico** de bienestar y transformación (marca "Marisol").

> Creemos que cada persona guarda dentro de sí una luz que nunca desaparece. Nuestra misión es crear experiencias que despierten esa luz: a través del conocimiento, los aromas, los rituales conscientes, la naturaleza y el sonido. No queremos vender bienestar: queremos acompañar procesos reales de transformación. Las personas no necesitan convertirse en alguien diferente — necesitan recordar quiénes siempre han sido.

Ese texto es la **voz de marca** y debe permear todo el copy. Tono: íntimo, sereno, poético, en segunda persona ("vuelve a ti", "respira"). Nunca marketing agresivo ni jerga wellness genérica.

El producto se organiza como un **universo de 8 "Realms"** (mundos), navegables entre sí, cada uno con su propia emoción y color de acento.

---

## 2. Estado actual del prototipo

- **Archivo único:** `Frecuencia Magica.dc.html` — un "Design Component" (DC): plantilla HTML declarativa + clase de lógica `Component`. Escala 1440px (desktop-first).
- **Runtime:** `support.js` (motor DC propietario del entorno de diseño; **NO portar** — es andamiaje del prototipo). Ver §9 para la migración.
- **Assets:** `assets/logo.png` (logo oficial, usado en header, portal, auth y hero).
- **Idiomas:** ES/EN completo, con selector en el header (estado `lang`).
- **Fidelidad:** alta-fi navegable. Datos = **placeholders coherentes** (sin backend, sin imágenes reales salvo el logo). El audio es un **drone ambiental generado con Web Audio API** (no archivos).

### Realms / rutas (estado `realm`)
| id | Nombre ES | Nombre EN | Emoción | Acento |
|----|-----------|-----------|---------|--------|
| `portal` | El Portal | The Portal | Umbral | oro |
| `home` | Home | Home | — | oro |
| `auth` | Acceso (login/register) | Auth | — | oro |
| `descubrete` | Descúbrete | Discover | Reflexión | lavanda |
| `biblioteca` | Biblioteca | Library | Sabiduría | oro |
| `academia` | Academia | Academy | Transformación | verde agua |
| `experiencias` | Experiencias | Experiences | Encuentro | lavanda |
| `tienda` | Tienda | Store | Abundancia | oro |
| `sanctuario` | Mi Santuario | My Sanctuary | Intimidad | oro |

---

## 3. LINEAMIENTOS OBLIGATORIOS (no negociables)

1. **Todo es inmersivo y animado.** Ninguna vista es estática: fondo cósmico vivo, elementos que respiran/flotan/orbitan, entradas con fade-up escalonado.
2. **Fondo cósmico global** detrás de todo (canvas + capa de nebulosas con blur). Se **recolorea según el Realm activo** (partículas y una nebulosa toman el color de acento del realm).
3. **Cursor luminoso propio** en desktop (punto dorado + anillo con estela suave que reacciona a elementos interactivos). Oculto en touch.
4. **Geometría sagrada** como leitmotiv: aros concéntricos, polígonos (triángulos), constelaciones, líneas punteadas girando lento (`fmSpin`/`fmSpinR`). Presente en portal, hero, cards destacadas, loaders, orbes.
5. **Separadores de "frecuencia/onda"**: SVG de línea punteada que fluye + forma de onda + rombo/nodo central (motivo "agua"). Usados entre secciones.
6. **Audio ambiental por Realm**: drone que se re-afina a una nota base distinta por realm. Toggle en header. Debe poder silenciarse.
7. **Paleta y tipografía fijas** (§4). No introducir colores ni fuentes nuevas.
8. **Estilo de card "redondo/orbital"** para frecuencias/audios (discos, no tarjetas cuadradas). Ver §6.
9. **Jerarquía por "destacado"**: varias vistas tienen un item hero más grande y elaborado (tienda, experiencias, biblioteca, academia, home).
10. **Bilingüe siempre**: cada string se define como `{es, en}`. Nunca hardcodear un solo idioma.
11. **Accesibilidad de movimiento**: respetar `prefers-reduced-motion` (ya se neutralizan animaciones).
12. **Mínimos de tamaño**: hit targets ≥44px; texto base ≥15px; no bajar de estos.
13. **Sin slop**: nada de emojis (salvo ✓ de confirmación ya usado), sin gradientes chillones, sin relleno vacío. Minimalismo cálido.

---

## 4. Sistema visual

### Paleta (definida por el cliente)
Declarada como CSS custom properties en `:root`:

```css
--void:    #0F1B2E;  /* azul profundo — fondo base */
--void-2:  #0a1220;  /* azul casi negro — degradado de fondo */
--gold:    #D8B978;  /* dorado suave — acento primario, CTAs, precios */
--teal:    #96C6BC;  /* verde agua — acento secundario */
--lav:     #B9B0D6;  /* lavanda hielo — acento terciario */
--ivory:   #F7F4EA;  /* marfil luz — texto principal */
--glass:      rgba(247,244,234,0.045);  /* relleno "vidrio" de cards */
--glass-brd:  rgba(216,185,120,0.20);   /* borde "vidrio" (oro tenue) */
```

Fondo de la app:
`radial-gradient(140% 100% at 50% -10%, #16273f 0%, var(--void) 45%, var(--void-2) 100%)`

Reglas de color:
- Texto: `--ivory`, con opacidades 0.55–0.78 para secundarios.
- Acentos: oro = principal (precios, CTAs, foco); verde agua y lavanda = secundarios y por-realm.
- Máximo 1–2 colores de fondo por vista. Los acentos entran como halos, bordes y glows, no como rellenos sólidos grandes.
- Gradientes de "banda" (miniaturas de audio/curso/producto): diagonales `150deg` de un tono desaturado a `--void`. Ej.: `linear-gradient(150deg,#3a5a6e,#1a2c44)`.

### Tipografía (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
```
- **Cormorant Garamond** (serif) — títulos, números de frecuencia, precios, texto poético. Pesos 300–500; se usa mucho el 300 con tamaños grandes (`clamp(30px,4vw,72px)`). Cursiva para acentos ("desapareció", citas).
- **Jost** (sans) — kickers, labels, meta, UI. Peso 300–400. Kickers en MAYÚSCULAS con `letter-spacing` amplio (`.24em–.4em`) y tamaño 11px.
- Body: `font-weight:300`.

### Formas y superficies
- **Glassmorphism**: `background:var(--glass)`, `border:1px solid var(--glass-brd)`, `backdrop-filter:blur(10–14px)`.
- Radios: cards 18–26px; pills/botones `999px`; discos `50%`.
- Sombras suaves y **glows** (box-shadow con color de acento a baja opacidad + blur alto), no sombras duras.
- Botón primario: relleno `rgba(247,244,234,0.95)`, texto `#12213a`, pill. Secundario: contorno translúcido.

---

## 5. Motion / animación (obligatorio replicar)

Keyframes definidos (en `<style>`), todos con prefijo `fm`:

| Nombre | Uso |
|--------|-----|
| `fmFadeUp` | entrada de contenido (opacity + translateY 26px) |
| `fmFadeIn` | entrada de vistas/secciones |
| `fmBreathe` | orbes/discos "respirando" (scale 1↔1.05) |
| `fmFloat` / `fmFloatS` | flotación logo / discos pequeños |
| `fmSpin` / `fmSpinR` | rotación lenta de geometría (60–130s) |
| `fmTwinkle` / `fmSparkle` | estrellas y destellos |
| `fmRing` / `fmRingPulse` | anillos expansivos / pulso |
| `fmGlow` | glow pulsante de bordes/CTAs |
| `fmDrift` | nebulosas del fondo a la deriva (34–50s) |
| `fmWaveFlow` | flujo de la línea punteada de los separadores (stroke-dashoffset) |
| `fmWavePulse` | barras del ecualizador |
| `fmPortalExpand` / `fmPortalFade` / `fmPortalCore` / `fmPortalRing` / `fmPortalSpin` | **transición "Cruzar el portal"** |
| `fmShimmer` | brillo deslizante (placeholders) |

Reglas:
- Entradas escalonadas con `animation-delay` (.1s, .25s, .4s, .55s).
- `prefers-reduced-motion: reduce` → todas las animaciones a ~0ms (bloque ya incluido).
- Las animaciones que deben sobrevivir re-render se construyen en JS (`React.createElement`) y se exponen; el resto vive como CSS inline + keyframes.

### Fondo cósmico (canvas)
`<canvas>` fijo a pantalla completa (`z-index:0`), dibujado con `requestAnimationFrame`:
- ~220 estrellas titilando.
- ~54 partículas de "polen dorado" ascendente, recoloreadas al acento del realm.
- 3 nebulosas radiales a la deriva (una toma el acento del realm).
- `devicePixelRatio` cap a 2; se re-dimensiona en `resize`.
- Encima, capa DOM con 3 blobs `blur(30px)` animados con `fmDrift` + viñeta radial.

### Cursor luminoso
Dos divs fijos (`.fm-cursor`): punto (9px, glow oro) y anillo (34px). Un `mousemove` mueve el punto al instante y agranda ambos sobre `[data-magnetic],a,button`; el anillo sigue con easing (lerp 0.14) en su propio rAF. Oculto con `@media (hover:none)`.

### Transición de portal
Overlay `z-index:9000`: círculo gigante (`300vmax`) con gradiente radial oro→aurora→void que hace `fmPortalExpand` (~1s), núcleo blanco `fmPortalCore`, dos anillos `fmPortalRing`, geometría sagrada `fmPortalSpin`; luego `fmPortalFade`. Orquestado por el estado `entering` (`'in'` → cambia a `home` → `'out'` → `false`), con timeouts 1000/1900ms.

---

## 6. Componentes / patrones clave

- **Header fijo**: logo (img) + wordmark; a la derecha selector de idioma (pill ES/EN), toggle de audio (♪/𝄽) e icono de sesión (→ `auth`). `pointer-events` selectivos.
- **Nav lateral (constelación)**: columna izquierda de dots por-realm; en hover se expande un **badge con el nombre** (`.fm-navbadge`, `scaleX` + fade). Oculto en portal/auth.
- **Discos de frecuencia (Biblioteca)**: layout "sistema solar" — un **disco central grande destacado** (número Hz gigante en Cormorant, ecualizador `fmWavePulse`, doble aro orbital, halo, botón play) rodeado de **discos pequeños flotando** en posiciones absolutas (`SLOTS`/`SIZES` en la lógica). No usar grilla de tarjetas cuadradas aquí.
- **Reproductor (dock)**: barra fija inferior glass con banda, título, Hz/tag, play/pause, progreso con gradiente teal→gold, cerrar.
- **Cards "destacado"**: 
  - *Home "Elige por dónde entrar"*: grilla de realms; **Academia ocupa 3 columnas** y **Tienda ocupa 2 filas**, con diseño más elaborado.
  - *Tienda*: fila de 3 · destacado 2col×2fila + lateral 1col · fila de 3 (8 productos).
  - *Experiencias*: card destacada a doble ancho (badge, aros orbitando, CTA con flecha, precio grande) + resto en filas (4 experiencias).
  - *Academia*: card grande destacada + 2 debajo; detalle de curso con lista de lecciones; reproductor de lección con prev/next.
- **Separador de onda**: SVG full-width entre secciones (línea punteada `fmWaveFlow` + forma de onda + nodo/rombo central). Motivo "agua".
- **Auth**: pantalla partida 50/50 — formulario (login/register en la misma vista, alternable) + panel media-pantalla con logo centrado, aros y copy de marca.
- **Descúbrete**: cuestionario de 5 pasos (barra de progreso) → pantalla "sintonizando" (loader con constelación) → resultado (frecuencia elegida, orbe, CTA a reproductor). Lógica de resultado: suma de respuestas `% AUDIOS.length`.
- **Flujos**: reserva de experiencia (fecha/hora → datos → confirmación, 3 pasos) y checkout de tienda (carrito → resumen → pedido realizado). Estados en la clase.
- **Mi Santuario**: dashboard con stats, "continuar curso", frecuencia del día y **diario** (selector de estado de ánimo + textarea).

---

## 7. Arquitectura del código (prototipo)

`Frecuencia Magica.dc.html` = plantilla declarativa + `class Component`:
- **Estado** (`this.state`): `lang, realm, audioOn, entering, dStarted, dStep, dAnswers, dLoading, libFilter, player, playing, progress, course, lesson, lessonView, expBooking, bookStep, bookDate, bookTime, product, cart[], checkoutStep, orderPlaced, journalMood, journalText`.
- **Datos** (arrays en la clase, cada campo textual como `{es,en}`): `REALMS`, `ACCENT`, `BANDS`, `AUDIOS` (7, con `hz`), `COURSES` (3), `EXPERIENCES` (4), `PRODUCTS` (8), `QUESTIONS` (5).
- **Helper `t(obj)`**: devuelve `obj[lang]`. Todo string pasa por aquí.
- **`renderVals()`**: expone valores/handlers a la plantilla; delega los realms internos a **`buildRealmVals(L,t,r)`**.
- **Motor** en `componentDidMount`: `setupCanvas`, `setupCursor`, Web Audio (`ensureAudio`/`retuneAudio`/`toggleAudio`), listeners de resize/mousemove; limpieza en `componentWillUnmount`.
- Plantilla usa control-flow del runtime: `<sc-if>`, `<sc-for>`, y holes `{{ }}` (solo lookups, sin expresiones).

> El motor DC (`support.js`, sintaxis `<x-dc>`, `<sc-if>`, holes) es **específico de este entorno de diseño**. Sirve como *fuente de verdad visual*, no como código de producción.

---

## 8. Dependencias / librerías

**Prototipo actual (runtime):**
- React 18 (inyectado por el runtime DC).
- `support.js` (runtime DC propietario — no reutilizable fuera del entorno).
- Google Fonts: Cormorant Garamond + Jost.
- **Sin** librerías de terceros: canvas, animaciones y audio son a mano.
  - Fondo: Canvas 2D API.
  - Audio: **Web Audio API** (OscillatorNode + BiquadFilter + GainNode + LFO). Sin assets de audio.
  - Iconos: SVG inline (play, flecha, check). Sin librería de iconos.
  - Imágenes: solo `assets/logo.png`.

**Stack recomendado para producción (ver §9):**
- **Next.js (App Router) + React 18 + TypeScript**.
- **Tailwind CSS** con los tokens de §4 mapeados en `theme.extend.colors`, **o** CSS Modules con las mismas custom properties.
- **Framer Motion** para las animaciones de entrada/estado (reemplaza los keyframes `fmFade*`, portal, etc.). Mantener nombres/tiempos equivalentes.
- Canvas cósmico como componente cliente (`"use client"`) con `requestAnimationFrame` (portar tal cual la lógica de `setupCanvas`).
- Cursor luminoso como componente cliente (portar `setupCursor`).
- Audio: envolver Web Audio en un hook `useAmbientAudio(realm, enabled)`.
- i18n: `next-intl` o diccionario propio `{es,en}` (ya está la estructura de datos lista).
- Estado de navegación entre realms → **rutas reales** (`/`, `/login`, `/descubrete`, `/biblioteca`, `/academia`, `/experiencias`, `/tienda`, `/mi-santuario`) en lugar de `state.realm`.

---

## 9. Guía de migración (para Claude Code)

1. **Extraer tokens** de §4 a `globals.css`/Tailwind config (colores, fondo, radios).
2. **Cargar fuentes** (Cormorant Garamond + Jost) vía `next/font/google`.
3. **Layout raíz**: `<CosmicBackground/>` (canvas fijo) + `<LuminousCursor/>` + `<Header/>` + `<RealmNav/>` + `<AudioToggle/>` envolviendo `{children}`. El acento activo se propaga por contexto (`RealmContext`) para recolorear canvas/nebulosa.
4. **Una ruta por realm** (§8). La transición de portal se dispara al entrar desde `/` hacia `/home` (o hacer de `/` el portal y `/home` la home).
5. **Portar datos** `AUDIOS/COURSES/EXPERIENCES/PRODUCTS/QUESTIONS` a `data/*.ts` tipados, conservando `{es,en}` y `band`/`hz`.
6. **Reconstruir vistas** 1:1 con el markup del prototipo (mismos layouts, "destacados", separadores, discos). Traducir `<sc-if>`→condicional JSX, `<sc-for>`→`.map`, `{{x}}`→`{x}`.
7. **Animaciones** → Framer Motion con variants equivalentes; conservar `prefers-reduced-motion`.
8. **Audio** → hook con Web Audio; nota base por realm (mapa en `retuneAudio`).
9. **Assets**: `assets/logo.png` → `/public/logo.png`. Pedir al cliente imágenes reales de audios/cursos/productos/Marisol (hoy son gradientes placeholder).
10. **Pendiente de backend** (no diseñado aún): auth real, pagos/checkout, reproducción de audio real, persistencia de diario/progreso, CMS de contenido.

---

## 10. Checklist de fidelidad (revisar en cada vista portada)
- [ ] Fondo cósmico visible y recoloreado por realm.
- [ ] Cursor luminoso activo en desktop.
- [ ] Entradas con fade-up escalonado.
- [ ] Geometría sagrada / aros presentes donde corresponde.
- [ ] Separador de onda entre secciones.
- [ ] Glassmorphism + glows, radios y pills correctos.
- [ ] Tipografía correcta (Cormorant títulos / Jost UI, kickers en mayúsculas espaciadas).
- [ ] Copy bilingüe ES/EN y en voz de marca.
- [ ] Item "destacado" con jerarquía elaborada donde aplica.
- [ ] Toggle de audio funcional y silenciable.
- [ ] `prefers-reduced-motion` respetado; hit targets ≥44px.

# Brief fotográfico — Frecuencia Mágica

> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.
> El estado de cada imagen (a corregir, faltante, por cablear…) vive en `Branding/src/data/photography-status.js`; un test lo cruza con lo publicado.
> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.
> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.

**66 imágenes** (43 slots registrados, varios por instancia; 5 fuera del registro): P0 4 · P1 47 · P2 15. 1 requiere sesión real (retrato de Marisol).

**Estado:** 30 completadas · 14 a corregir · 16 faltantes · 4 por cablear · 2 no tenidas en cuenta. Ver la sección 5.

## 1. Entrega

- **Formatos:** AVIF (principal) y WebP (respaldo). El único PNG permitido es el logo.
- **Carpeta:** `frontend/public/editorial/`
- **Nombre:** `<slot-id>.<ext>` con el punto cambiado por guion (`portal.hero` → `portal-hero.avif`). Por instancia: `<slot-id>-<slug>.avif`.
- **Color:** sRGB, perfil incrustado, sin canal alfa.
- **Dimensiones:** Máximo 2× el ancho de render (DPR capado a 2). No exportar por encima del master.

## 2. Estilo común

Cada prompt ya incluye este bloque al final; se repite aquí para ajustarlo en un solo sitio.

**Prompt base**

```text
Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

**Prompt negativo** (pegarlo tal cual en el campo de negativo del agente)

```text
text, letters, numbers, captions, watermark, logo, signature, channel name, UI elements, frame, border, baked vignette, baked gradient overlay, stock photo look, wellness clichés (lotus on a sunset beach, yoga pose on a mountain, stacked zen stones, om symbol, buddha statue), neon, glowing neon tube, rainbow spectrum, saturated magenta, electric blue, oversaturated colors, HDR, pastel candy colors, bright white or grey background, DNA helix, brain, anatomical or medical detail, nude body detail, more than three vertical light lines, dense starfield filling the frame, lens flare, sci-fi, plastic skin, distorted hands, extra fingers, cartoon, CGI plastic look, game-engine render, emojis, recognizable faces, visible facial features, face in profile, eyes, nose, lips, mouth, ear
```

**Tratamientos por acento**

- `warm`: Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents.
- `teal`: Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents.
- `lav`: Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents.
- `soft`: Balanced faint gold, teal and lavender, ultra calm, very low contrast.
- `none`: Balanced gold, teal and lavender in equal, faint measure; cosmic and immersive but restrained.

**Vocabulario visual** (la imagen es el paisaje; el world engine es su energía)

- **Agua:** Espejo en calma, ondas concéntricas, cimática: la frecuencia hecha visible. Realms: Resonario, Portal, Santuario.
- **Bruma y montaña:** Horizontes, valles, amanecer y niebla: el camino que se abre. Realms: Descúbrete, Experiencias, Acceso, Academia (teal).
- **Cielo cósmico:** Galaxia en espiral o vía láctea baja, sólo en el tercio superior. Realms: Portal, Home, Sobre Marisol.
- **Cuerpo de luz:** Silueta translúcida sin rasgos, bordeada de oro con teal y lavanda por dentro. Realms: Seis slots narrativos (ver abajo).
- **Filamentos de frecuencia:** Tres líneas verticales ondulantes —oro, teal y lavanda— a baja opacidad. Motivo recurrente, no obligatorio.
- **Slots con cuerpo de luz:** `home.hero`, `discover.tuning`, `discover.result`, `experiences.featured`, `academy.completion`, `sanctuary.hero`.

**Reglas**

- Sin texto, logos, marcas, nombres de canal ni etiquetas legibles dentro de la imagen: el copy lo pone la web.
- Sin rasgos faciales: el cuerpo de luz es una silueta translúcida sin ojos, boca ni nariz, y el único rostro es el retrato real de Marisol. Fuera de esos casos: manos, espaldas, siluetas lejanas u objetos. El prompt describe la silueta en positivo (cabeza lisa, sin nariz, labios ni oreja; de espaldas o girada): «faceless» a secas no basta.
- Cielo arriba, materia abajo: el cosmos ocupa como mucho el tercio superior, con estrellas escasas. El world engine ya pinta el campo de estrellas y las partículas; la imagen no los duplica.
- Luz dorada sobre fondo oscuro: los bordes de la imagen tienden a --void para que el scrim de CSS funda sin corte.
- Nada de fondos blancos, grises ni pasteles, ni neón ni arcoíris: es un universo nocturno. Oro, teal y lavanda, a baja saturación.
- Filamentos de frecuencia: como máximo tres líneas ondulantes (oro, teal y lavanda), a baja opacidad, nunca un espectro completo. El prompt las cuenta en positivo («exactly three … in total»): los modelos tienden a duplicarlas.
- Anillos y círculos de luz: halo suave y difuso, nunca un tubo de neón fino.
- Sin ADN, cerebros ni anatomía: la energía se sugiere con luz, agua y geometría sagrada, no con ilustración médica.
- Sin stock ni Unsplash. Lo generado es materia de ambiente y dirección de arte: cuando exista el producto físico o la persona real, se sustituye por fotografía real.
- Sin máscaras, viñetas ni degradados horneados: los aplica el CSS.

## 3. Medidas

| Preset | Ratio | Master | Tablet | Móvil | Generar a | Peso | Uso |
|---|---|---|---|---|---|---|---|
| Banda ancha 16:9 | 16:9 | 2880×1620 | 1440×810 | 768×432 | 2048×1152 | ≤ 260 KB (P0 ≤ 320 KB) | Héroes y bandas a sangre de viewport |
| Banda cine 16:8 (2:1) | 16:8 | 2880×1440 | 1440×720 | 768×384 | 2048×1024 | ≤ 220 KB | Bandas bajas y fondos de tarjeta destacada |
| Retrato 3:4 | 3:4 | 1440×1920 | 1080×1440 | 780×1040 | 1536×2048 | ≤ 220 KB | Media página (50vw en ≥768px), retratos y atmósferas verticales |
| Cuadrada 1:1 | 1:1 | 1024×1024 | 768×768 | 640×640 | 1024×1024 | ≤ 120 KB | Portadas de audio, tarjetas de producto y de curso |

Los pesos son recomendaciones de trabajo, no un contrato de la web. El master es 2× el ancho de render máximo (DPR capado a 2).

## 4. Resumen

| Archivo | Vista | Ratio | Master | Prio. | Estado |
|---|---|---|---|---|---|
| `portal-hero.avif` | Portal · umbral | 16:9 | 2880×1620 | P0 | A corregir por desviación de la IA |
| `portal-portal-field.avif` | Portal · campo | 16:8 | 2880×1440 | P1 | Completadas |
| `not-found-hero.avif` | 404 | 16:9 | 2880×1620 | P2 | Completadas |
| `home-hero.avif` | Home · hero | 16:9 | 2880×1620 | P0 | A corregir por desviación de la IA |
| `home-daily-frequency.avif` | Home · frecuencia del día | 16:8 | 2880×1440 | P1 | Completadas |
| `home-realms-banner.avif` | Home · banner de realms | 16:8 | 2880×1440 | P1 | Completadas |
| `home-marisol-portrait.avif` | Home · Sobre Marisol | 3:4 | 1440×1920 | P0 | A corregir por desviación de la IA |
| `home-membership.avif` | Home · membresía | 16:9 | 2880×1620 | P2 | Faltantes |
| `home-footer-banner.avif` | Home · cierre | 16:9 | 2880×1620 | P2 | A corregir por desviación de la IA |
| `about-hero.avif` | Sobre Marisol · hero | 16:9 | 2880×1620 | P1 | A corregir por desviación de la IA |
| `about-angels.avif` | Sobre Marisol · Experiencias con Ángeles | 16:8 | 2880×1440 | P1 | Completadas |
| `auth-hero.avif` | Acceso · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `auth-form-atmosphere.avif` | Acceso · formulario | 3:4 | 1440×1920 | P2 | A corregir por desviación de la IA |
| `discover-hero.avif` | Descúbrete · hero | 16:9 | 2880×1620 | P1 | A corregir por desviación de la IA |
| `discover-question-atmosphere.avif` | Descúbrete · pregunta | 3:4 | 1440×1920 | P2 | A corregir por desviación de la IA |
| `discover-tuning.avif` | Descúbrete · afinación | 16:8 | 2880×1440 | P1 | Completadas |
| `discover-result.avif` | Descúbrete · resultado | 16:9 | 2880×1620 | P1 | A corregir por desviación de la IA |
| `resonario-hero.avif` | Resonario · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-featured.avif` | Resonario · destacado | 16:8 | 2880×1440 | P1 | Completadas |
| `resonario-archive-banner.avif` | Resonario · archivo | 16:9 | 2880×1620 | P2 | Completadas |
| `resonario-audio-cover-a1.avif` | Resonario · portadas · Regreso a la Calma | 1:1 | 1024×1024 | P1 | No tenidas en cuenta |
| `resonario-audio-cover-a2.avif` | Resonario · portadas · Luz Interior | 1:1 | 1024×1024 | P1 | A corregir por desviación de la IA |
| `resonario-audio-cover-a3.avif` | Resonario · portadas · Raíces Profundas | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a4.avif` | Resonario · portadas · Umbral del Sueño | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a5.avif` | Resonario · portadas · Aroma de Cedro | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a6.avif` | Resonario · portadas · Respirar el Cielo | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a7.avif` | Resonario · portadas · Corazón Abierto | 1:1 | 1024×1024 | P1 | A corregir por desviación de la IA |
| `academy-hero.avif` | Academia · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-featured-course.avif` | Academia · curso destacado | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-course-cover-c1.avif` | Academia · portadas de curso · El Arte de Volver a Ti | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-course-cover-c2.avif` | Academia · portadas de curso · Rituales Conscientes | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Sanan | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-lesson-visual.avif` | Academia · lección | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-completion.avif` | Academia · curso completado | 16:8 | 2880×1440 | P1 | Faltantes |
| `experiences-hero.avif` | Experiencias · hero | 16:9 | 2880×1620 | P1 | A corregir por desviación de la IA |
| `experiences-featured.avif` | Experiencias · destacada | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | 16:9 | 2880×1620 | P1 | No tenidas en cuenta |
| `experiences-visual-e2.avif` | Experiencias · filas · Círculo de Luna Nueva | 16:9 | 2880×1620 | P1 | Faltantes |
| `experiences-visual-e3.avif` | Experiencias · filas · Ritual de Aromas | 16:9 | 2880×1620 | P1 | Faltantes |
| `experiences-visual-e4.avif` | Experiencias · filas · Meditación al Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `booking-hero.avif` | Reserva · hero | 16:9 | 2880×1620 | P1 | A corregir por desviación de la IA |
| `booking-confirmation.avif` | Reserva · confirmación | 16:8 | 2880×1440 | P1 | Completadas |
| `store-hero.avif` | Tienda · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `store-product-visual-p1.avif` | Tienda · productos · Aceite Esencial · Cedro Sagrado | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p2.avif` | Tienda · productos · Vela Ritual · Luz de Vela | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p3.avif` | Tienda · productos · Cuarzo de Serenidad | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p4.avif` | Tienda · productos · Bruma de Enraizamiento | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p5.avif` | Tienda · productos · Incienso · Bosque de Copal | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p6.avif` | Tienda · productos · Sal de Baño · Luna Llena | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p7.avif` | Tienda · productos · Infusión · Calma de Cedro | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-product-visual-p8.avif` | Tienda · productos · Diario de Frecuencias | 1:1 | 1024×1024 | P1 | Faltantes |
| `store-ritual-banner.avif` | Tienda · banner ritual | 16:9 | 2880×1620 | P2 | Completadas |
| `product-detail.avif` | Tienda · detalle | 16:8 | 2880×1440 | P1 | Completadas |
| `product-related.avif` | Tienda · relacionados | 16:8 | 2880×1440 | P2 | Completadas |
| `cart-empty.avif` | Carrito · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `checkout-confirmation.avif` | Compra · confirmación | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-hero.avif` | Mi Santuario · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `sanctuary-continue.avif` | Mi Santuario · continuar | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-daily.avif` | Mi Santuario · práctica diaria | 1:1 | 1024×1024 | P1 | Completadas |
| `sanctuary-journal.avif` | Mi Santuario · diario | 3:4 | 1440×1920 | P2 | A corregir por desviación de la IA |
| `sanctuary-empty.avif` | Mi Santuario · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `states-loading.avif` | Estados · carga | 16:9 | 2880×1620 | P2 | Por cablear (crear vistas) |
| `states-empty.avif` | Estados · vacío | 16:9 | 2880×1620 | P2 | Por cablear (crear vistas) |
| `states-error.avif` | Estados · error | 16:9 | 2880×1620 | P2 | Por cablear (crear vistas) |
| `states-offline.avif` | Estados · sin conexión | 16:9 | 2880×1620 | P2 | Por cablear (crear vistas) |
| `og-image.jpg` | Metadatos · Open Graph | 1.91:1 | 1200×630 | P0 | Completadas |

## 5. Estado de las imágenes

Cada imagen está en una sola sección. El estado se mantiene en `Branding/src/data/photography-status.js`.

**Nota general sobre tamaños:** las imágenes entregadas llegan a 1672 px de ancho en 16:9, 1774 px en 2:1 y 1086 px en 3:4, por debajo del «generar a» de su preset (2048, 2048 y 1536 px); las cuadradas (1254 px) lo superan. No se trata como desviación individual.

### 5.1 A corregir por desviación de la IA (14)

Entregadas y publicadas, pero desviadas del brief o de su prompt. Van de más a menos grave; la gravedad es criterio visual, y la baja no justifica regenerar salvo que se vea mal en pantalla. Cada entrada trae el prompt para regenerarla.

#### `discover.question-atmosphere` — Descúbrete · pregunta · P2

- **Desviación (alta):** Esfera de vidrio nítida que el prompt no pedía («nada nítido») y contraste mayor del indicado: va detrás del texto de la pregunta y compite con él. Causa probable: la frase «A glass form sits on top of this image» se dibujó como objeto.
- **Archivo:** `discover-question-atmosphere.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Baja luminosidad general: va detrás de un formulario de cristal
- **Contenido:** Respiro visual que acompaña cada pregunta.

**Prompt**

```text
Soft-focus ambient abstraction: drifting translucent veils of lavender and teal mist with tiny golden specks like slow snowfall, very dark, almost abstract. Vertical, very low contrast, nothing sharp (it sits behind the question text). Vertical portrait framing. A glass form sits on top of this image: keep the whole image very dark and very low in contrast, with nothing sharp. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Luz Interior` — Resonario · portadas · P1

- **Desviación (alta):** La geoda tiene el centro brillante y de alto contraste; el brief pide el centro calmo y de bajo contraste porque el Hz va superpuesto al disco.
- **Archivo:** `resonario-audio-cover-a2.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
A single warm orb of light glowing inside a dark lavender crystal geode, facets catching the glow, inner light. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `portal.hero` — Portal · umbral · P0

- **Desviación (media):** El aro es una línea fina y nítida; el brief pide un halo suave y difuso, «nunca un tubo de neón fino». 1672 px de ancho.
- **Archivo:** `portal-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Umbral de entrada al universo: lo primero que ve el visitante.

**Prompt**

```text
A vast nocturnal threshold over still water: a circular opening of warm golden light, a soft diffuse halo of light, never a thin glowing neon tube, hovering low above a mirror-calm dark sea at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, a sparse arc of fine stars and a small faint galaxy glow in the upper third, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising out of the haze like frequencies: the gold one rising straight up from the top of the ring and never crossing its inside, the teal one at 35% from the left, the lavender one at 65% from the left, and no other vertical lines anywhere, a faint teal glow low on the horizon at the left and a faint lavender glow low on the horizon at the right, both fading out well before the frame edges. Centered, balanced wide composition with the horizon at about 52% from the top, the ring at 50% horizontal and 40% vertical, deep dark negative space all around, the bottom 30% of the frame plain dark still water with no reflections, for a logo and a button. Wide landscape framing. Balanced gold, teal and lavender in equal, faint measure; cosmic and immersive but restrained. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `home.hero` — Home · hero · P0

- **Desviación (media):** La cabeza queda hacia el 51 % horizontal (brief: 62 %) y el cuerpo llega al borde derecho, cuando el brief pedía que terminara antes.
- **Archivo:** `home-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim. Cuerpo de luz: la imagen firma de la marca.

**Prompt**

```text
The brand signature image: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on its side across the surface of dark still water, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse spiral-galaxy glow gathers beneath it in the water and ripples outward in concentric rings, the silhouette edged in warm gold with faint teal and lavender light flowing through it like fine veins of current, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising behind it, and no other vertical lines anywhere, sparse fine stars in the upper third, deep navy background. The figure lies entirely in the right half of the frame, never left of center: its head at 62% horizontal and 40% vertical, its body extending to the right and ending well before the right edge; the left 55% of the frame is dark and empty for the headline, low camera angle at water level. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `home-marisol-portrait` — Home · Sobre Marisol · P0

- **Desviación (media):** Sesión real (confirmada). La llama de la vela toca el borde inferior izquierdo (el brief: «nada brillante tocando el borde») y 1086 px de ancho quedan blandos en retina: pedir el original a 1440 px o más.
- **Archivo:** `home-marisol-portrait.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Retrato de la fundadora en arco de nicho: el ancla emocional de la marca.
- **Nota:** Sesión fotográfica real, no generada: es la cara de la marca. Lista de planos: (1) medio cuerpo sentada junto a la ventana, (2) primer plano con una vela, (3) manos sobre un cuenco de cristal, (4) de espaldas frente a la luz. Vestuario de lino en marfil, luz cálida de vela o de atardecer, fondo oscuro. Entregar 3:4 con aire sobre la cabeza. El prompt sólo sirve como moodboard para el fotógrafo.
- **Producción:** sesión fotográfica real (el prompt es sólo moodboard).

**Prompt**

```text
Mood reference only — the published photograph must come from a real session with Marisol. Intimate half-length portrait of a calm woman seated beside a window at dusk, warm candlelight on one side of her face, natural linen clothing in ivory tones, soft gaze, quiet smile, dark navy room behind her. Vertical 3:4, face in the upper third with generous headroom because a niche-arch mask is applied in CSS, shoulders and hands softly out of focus, dark edges. Vertical portrait framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

**Negativo (moodboard):**

```text
text, letters, numbers, captions, watermark, logo, signature, channel name, UI elements, frame, border, baked vignette, baked gradient overlay, stock photo look, wellness clichés (lotus on a sunset beach, yoga pose on a mountain, stacked zen stones, om symbol, buddha statue), neon, glowing neon tube, rainbow spectrum, saturated magenta, electric blue, oversaturated colors, HDR, pastel candy colors, bright white or grey background, DNA helix, brain, anatomical or medical detail, nude body detail, more than three vertical light lines, dense starfield filling the frame, lens flare, sci-fi, plastic skin, distorted hands, extra fingers, cartoon, CGI plastic look, game-engine render, emojis
```

#### `auth.form-atmosphere` — Acceso · formulario · P2

- **Desviación (media):** Esfera de vidrio con un punto de luz dentro, no pedida: el prompt describía agua negra con un punto de luz reflejado y ningún objeto. Misma causa que en la pregunta del quiz.
- **Archivo:** `auth-form-atmosphere.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Baja luminosidad general: va detrás de un formulario de cristal
- **Contenido:** Fondo atmosférico del formulario de acceso.

**Prompt**

```text
Intimate calm: a surface of nearly black still water with a single soft golden point of light reflected in it and faint teal mist drifting low, blurred velvet-dark background, a soft warm glow at the bottom of the frame. Vertical, very dark and low contrast (it sits behind a glass form), the point of light in the lower third, generous dark space above. Vertical portrait framing. A glass form sits on top of this image: keep the whole image very dark and very low in contrast, with nothing sharp. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `discover.result` — Descúbrete · resultado · P1

- **Desviación (media):** El haz cruza el centro, que el brief pedía calmo y oscuro para el texto del resultado, y se abre en bandas de color que rozan el «arcoíris» de la lista de evitar.
- **Archivo:** `discover-result.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El resultado del quiz como revelación visual. Cuerpo de luz.

**Prompt**

```text
Revelation: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single soft beam of warm light from above splitting into gold, teal and lavender glows that run through the body and fall across the water as its reflection, a moment of clarity. Figure small and centered in the lower third, the beam descending gently from the top center, the middle of the frame calm and dark for the result text. Wide landscape framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Corazón Abierto` — Resonario · portadas · P1

- **Desviación (media):** El resplandor entre las manos cae justo en el centro, donde va el Hz; el brief pide el centro calmo y de bajo contraste.
- **Archivo:** `resonario-audio-cover-a7.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
Two cupped hands holding a small warm glow of light against a sage-green dark background, tender and open. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `home.footer-banner` — Home · cierre · P2

- **Desviación (baja):** El horizonte queda hacia el 47 % vertical (brief: 40 %).
- **Archivo:** `home-footer-banner.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** Cierre editorial: la despedida que invita a quedarse.

**Prompt**

```text
The horizon after the page: a dusk sky with faint lavender clouds above a dark mirror-calm sea, a single thin line of gold light along the horizon, the first stars appearing, vast stillness. Horizon at 40% vertical, sky above, dark water below fading to near-black for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `about.hero` — Sobre Marisol · hero · P1

- **Desviación (baja):** La mesa y la vela quedan hacia el 61 % vertical (brief: 40 %).
- **Archivo:** `about-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera de la vista de Marisol: el lugar desde el que acompaña.

**Prompt**

```text
The place where the work begins: a quiet terrace of dark stone at dusk opening onto a still lake and distant mountains in lavender mist, a low wooden table with a crystal singing bowl and a single lit candle in the foreground, a linen shawl left over a stone bench as if someone had just stepped out, warm golden light, a faint spiral of galaxy glow in the upper sky. Table and candle at 60% horizontal and 40% vertical, left third dark and empty for the title, lower edge fading to near-black. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `discover.hero` — Descúbrete · hero · P1

- **Desviación (baja):** El punto de fuga queda hacia el 64 % horizontal (brief: 50 %).
- **Archivo:** `discover-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Bienvenida del quiz: la materia que abre la exploración.

**Prompt**

```text
The beginning of a discovery: a narrow path of dark stone steps rising from still water into soft lavender and gold dawn mist over distant mountain ridges, a sense of a first step, no people. Path entering from the lower right toward a bright vanishing point at 50% horizontal and 40% vertical, left third dark. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences.hero` — Experiencias · hero · P1

- **Desviación (baja):** El pabellón queda hacia el 61 % horizontal (brief: 55 %) y su arquitectura es de pagoda de Asia oriental, más específica que el «pavilion» del prompt.
- **Archivo:** `experiences-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera de experiencias: el viaje como promesa.

**Prompt**

```text
The journey as a promise: a lantern-lit path of stepping stones across still water toward a softly glowing pavilion on the far shore, lavender dusk mist between dark trees and hills, nobody present. Pavilion at 55% horizontal and 40% vertical, lanterns leading in from the lower left, left third dark. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `booking.hero` — Reserva · hero · P1

- **Desviación (baja):** Las velas están encendidas (el prompt pedía apagadas) y el tercio izquierdo oscuro se aplicó con un degradado vertical recto que corta la bruma y las montañas.
- **Archivo:** `booking-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** El lugar de la experiencia elegida, antes de reservar.

**Prompt**

```text
An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck over still water at twilight, a few unlit candles waiting, a soft lavender light on the planks and the mountains beyond. Wide symmetrical, circle of cushions in the middle distance, left third dark. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `sanctuary.journal` — Mi Santuario · diario · P2

- **Desviación (baja):** Esfera de vidrio desenfocada añadida arriba a la derecha, no pedida. Queda de fondo y no compite con el cuaderno.
- **Archivo:** `sanctuary-journal.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Baja luminosidad general: va detrás de un formulario de cristal
- **Contenido:** El diario como materia íntima.

**Prompt**

```text
The journal as intimate matter: an open linen-bound notebook with blank pages and a brass pen on dark wood, candlelight raking across the paper, a dried sprig of lavender, no legible writing. Vertical, notebook in the lower two thirds, upper third dark and calm. Vertical portrait framing. A glass form sits on top of this image: keep the whole image very dark and very low in contrast, with nothing sharp. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### 5.2 Faltantes (16)

Aún no entregadas. La vista de cada una ya está preparada, salvo donde la nota indica lo contrario. Cada entrada trae su prompt.

#### `home-membership` — Home · membresía · P2

- **Archivo:** `home-membership.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 15%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** Atmósfera cálida que invita a la comunidad.

**Prompt**

```text
Golden light pouring from above onto a still lake at dawn: a warm beam of light falling from the top of the frame onto mist-covered water, a ring of low smooth stones at the shore arranged in a circle as a gathering place, dust motes and mist drifting, deep shadows in the corners. The light source sits near the top edge at 15% vertical, the ring of stones in the middle distance, lower third dark for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-course-cover · El Arte de Volver a Ti` — Academia · portadas de curso · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el detalle de curso: hoy resuelve una portada compartida. En la lista, `c1` es el curso destacado y usa `academy.featured-course`.
- **Archivo:** `academy-course-cover-c1.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
A person seen from behind sitting cross-legged on a rock at the edge of still water at dawn, silhouetted against lavender and gold light over distant mountains, deep calm, no face visible. Keep the subject inside the central 50% of the width so the 1:1 crop of the card still contains it. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-course-cover · Rituales Conscientes` — Academia · portadas de curso · P1

- **Qué falta:** Al llegar hay que pasar `instance` en la lista y en el detalle de curso (hoy comparten una portada).
- **Archivo:** `academy-course-cover-c2.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
Hands arranging ritual objects on dark stone — a ceramic bowl, a candle, a sprig of cedar — moss-green and gold light, unhurried gesture. Keep the subject inside the central 50% of the width so the 1:1 crop of the card still contains it. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-course-cover · Aromas que Sanan` — Academia · portadas de curso · P1

- **Qué falta:** Al llegar hay que pasar `instance` en la lista y en el detalle de curso (hoy comparten una portada).
- **Archivo:** `academy-course-cover-c3.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
Amber glass vials of essential oils, dried cedar and herbs on a dark wooden tray, warm golden light and a thread of fragrant smoke. Keep the subject inside the central 50% of the width so the 1:1 crop of the card still contains it. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy.completion` — Academia · curso completado · P1

- **Archivo:** `academy-completion.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Celebración del curso terminado: el logro con luz. Cuerpo de luz.

**Prompt**

```text
A completed cycle closed in light: a ring of small golden lights floating on dark still water seen from a slightly oblique overhead angle, a small abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated cross-legged at the far side of the ring, every light steady and one slightly brighter, concentric ripples radiating outward. Ring centered with its middle empty and dark for a check mark and a line of text, the small figure at the far edge of the ring at 50% horizontal and 30% vertical. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Círculo de Luna Nueva` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e2.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
A circle of small candles on a dark stone shore beneath a thin new-moon crescent over still water, quiet and ceremonial. The subject sits on the right at 62% horizontal and 45% vertical, the left 45% is dark and empty because a left scrim carries the text. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Ritual de Aromas` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e3.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
A brass burner with copal smoke rising in slow spirals, amber oil bottles and dried herbs beside it on a dark table, golden light. The subject sits on the right at 62% horizontal and 45% vertical, the left 45% is dark and empty because a left scrim carries the text. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Meditación al Amanecer` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e4.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
A small terrace at first light with a cushion and a steaming cup, teal mist over distant hills and still water, the first gold on the horizon; nobody present. The subject sits on the right at 62% horizontal and 45% vertical, the left 45% is dark and empty because a left scrim carries the text. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Aceite Esencial · Cedro Sagrado` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda (hoy resuelve cada producto sin él). Es el producto destacado, a 16:8.
- **Archivo:** `store-product-visual-p1.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
An amber glass dropper bottle with a plain unmarked label and a cedar sprig beside it. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Vela Ritual · Luz de Vela` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p2.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A honey-coloured wax candle in a dark glass vessel, lit, the flame reflected in the glass. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Cuarzo de Serenidad` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p3.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A clear quartz crystal point standing upright with faint lavender internal light and a soft warm rim light. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Bruma de Enraizamiento` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p4.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A small dark-green glass spray bottle with a fine mist drifting from it, moss and stone beneath. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Incienso · Bosque de Copal` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p5.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
Chunks of pale copal resin in a small clay dish with a thin ribbon of smoke rising. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Sal de Baño · Luna Llena` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p6.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A glass jar of pale bath salts with a hint of lavender, a wooden scoop beside it, soft moonlit sheen. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Infusión · Calma de Cedro` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p7.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A handmade ceramic cup of steaming herbal infusion with dried herbs scattered near it, amber light. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Diario de Frecuencias` — Tienda · productos · P1

- **Qué falta:** Al llegar hay que pasar `instance` en el catálogo de la tienda.
- **Archivo:** `store-product-visual-p8.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A linen-bound blank notebook closed, a brass pen lying across its cover, no title and no text on it. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### 5.3 Por cablear (crear vistas) (4)

Entregadas, pero sin slot en el registro (`frontend/src/config/editorial-media.ts`) ni pantalla que las pinte. Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.

| Archivo | Vista | Qué falta |
|---|---|---|
| `states-loading.avif` | Estados · carga | Pantalla de carga: `RealmLoading` y los `loading.tsx`. |
| `states-empty.avif` | Estados · vacío | Pantalla de vacío: `EmptyState`, del UI Kit puro, así que habría que pasarle la imagen por props. |
| `states-error.avif` | Estados · error | Pantalla de error: `app/[locale]/error.tsx`. |
| `states-offline.avif` | Estados · sin conexión | No existe ninguna pantalla de sin conexión: el texto `states.offline` está en los mensajes, pero nada lo pinta. Hay que crear la vista. |

### 5.4 No tenidas en cuenta (2)

Publicadas, pero ninguna vista las pinta con el diseño actual.

| Archivo | Vista | Por qué |
|---|---|---|
| `resonario-audio-cover-a1.avif` | Resonario · portadas · Regreso a la Calma | `a1` es siempre el audio destacado del resonario, que usa `resonario.featured`. Hay que usarla en otra vista o retirarla. |
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | `e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla. |

### 5.5 Completadas (30)

Entregadas, publicadas, cableadas y sin desviación conocida.

| Archivo | Vista | Slot | Ratio | Prio. |
|---|---|---|---|---|
| `portal-portal-field.avif` | Portal · campo | `portal.portal-field` | 16:8 | P1 |
| `not-found-hero.avif` | 404 | `not-found.hero` | 16:9 | P2 |
| `home-daily-frequency.avif` | Home · frecuencia del día | `home.daily-frequency` | 16:8 | P1 |
| `home-realms-banner.avif` | Home · banner de realms | `home.realms-banner` | 16:8 | P1 |
| `about-angels.avif` | Sobre Marisol · Experiencias con Ángeles | `about.angels` | 16:8 | P1 |
| `auth-hero.avif` | Acceso · hero | `auth.hero` | 16:9 | P1 |
| `discover-tuning.avif` | Descúbrete · afinación | `discover.tuning` | 16:8 | P1 |
| `resonario-hero.avif` | Resonario · hero | `resonario.hero` | 16:9 | P1 |
| `resonario-featured.avif` | Resonario · destacado | `resonario.featured` | 16:8 | P1 |
| `resonario-archive-banner.avif` | Resonario · archivo | `resonario.archive-banner` | 16:9 | P2 |
| `resonario-audio-cover-a3.avif` | Resonario · portadas · Raíces Profundas | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a4.avif` | Resonario · portadas · Umbral del Sueño | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a5.avif` | Resonario · portadas · Aroma de Cedro | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a6.avif` | Resonario · portadas · Respirar el Cielo | `resonario.audio-cover.*` | 1:1 | P1 |
| `academy-hero.avif` | Academia · hero | `academy.hero` | 16:9 | P1 |
| `academy-featured-course.avif` | Academia · curso destacado | `academy.featured-course` | 16:8 | P1 |
| `academy-lesson-visual.avif` | Academia · lección | `academy-lesson-visual` | 16:8 | P1 |
| `experiences-featured.avif` | Experiencias · destacada | `experiences.featured` | 16:8 | P1 |
| `booking-confirmation.avif` | Reserva · confirmación | `booking.confirmation` | 16:8 | P1 |
| `store-hero.avif` | Tienda · hero | `store.hero` | 16:9 | P1 |
| `store-ritual-banner.avif` | Tienda · banner ritual | `store.ritual-banner` | 16:9 | P2 |
| `product-detail.avif` | Tienda · detalle | `product.detail` | 16:8 | P1 |
| `product-related.avif` | Tienda · relacionados | `product.related` | 16:8 | P2 |
| `cart-empty.avif` | Carrito · vacío | `cart.empty` | 16:9 | P2 |
| `checkout-confirmation.avif` | Compra · confirmación | `checkout.confirmation` | 16:8 | P1 |
| `sanctuary-hero.avif` | Mi Santuario · hero | `sanctuary.hero` | 16:9 | P1 |
| `sanctuary-continue.avif` | Mi Santuario · continuar | `sanctuary.continue` | 16:8 | P1 |
| `sanctuary-daily.avif` | Mi Santuario · práctica diaria | `sanctuary.daily` | 1:1 | P1 |
| `sanctuary-empty.avif` | Mi Santuario · vacío | `sanctuary.empty` | 16:9 | P2 |
| `og-image.jpg` | Metadatos · Open Graph | `og-image` | 1.91:1 | P0 |

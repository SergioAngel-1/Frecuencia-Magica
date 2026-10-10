# Brief fotográfico — Frecuencia Mágica

> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.
> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.
> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.

**66 imágenes** (43 slots registrados, varios por instancia; 5 fuera del registro): P0 4 · P1 47 · P2 15. 1 requiere sesión real (retrato de Marisol).

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

| Archivo | Vista | Ratio | Master | Prio. |
|---|---|---|---|---|
| `portal-hero.avif` | Portal · umbral | 16:9 | 2880×1620 | P0 |
| `portal-portal-field.avif` | Portal · campo | 16:8 | 2880×1440 | P1 |
| `not-found-hero.avif` | 404 | 16:9 | 2880×1620 | P2 |
| `home-hero.avif` | Home · hero | 16:9 | 2880×1620 | P0 |
| `home-daily-frequency.avif` | Home · frecuencia del día | 16:8 | 2880×1440 | P1 |
| `home-realms-banner.avif` | Home · banner de realms | 16:8 | 2880×1440 | P1 |
| `home-marisol-portrait.avif` | Home · Sobre Marisol | 3:4 | 1440×1920 | P0 |
| `home-membership.avif` | Home · membresía | 16:9 | 2880×1620 | P2 |
| `home-footer-banner.avif` | Home · cierre | 16:9 | 2880×1620 | P2 |
| `about-hero.avif` | Sobre Marisol · hero | 16:9 | 2880×1620 | P1 |
| `about-angels.avif` | Sobre Marisol · Experiencias con Ángeles | 16:8 | 2880×1440 | P1 |
| `auth-hero.avif` | Acceso · hero | 16:9 | 2880×1620 | P1 |
| `auth-form-atmosphere.avif` | Acceso · formulario | 3:4 | 1440×1920 | P2 |
| `discover-hero.avif` | Descúbrete · hero | 16:9 | 2880×1620 | P1 |
| `discover-question-atmosphere.avif` | Descúbrete · pregunta | 3:4 | 1440×1920 | P2 |
| `discover-tuning.avif` | Descúbrete · afinación | 16:8 | 2880×1440 | P1 |
| `discover-result.avif` | Descúbrete · resultado | 16:9 | 2880×1620 | P1 |
| `resonario-hero.avif` | Resonario · hero | 16:9 | 2880×1620 | P1 |
| `resonario-featured.avif` | Resonario · destacado | 16:8 | 2880×1440 | P1 |
| `resonario-archive-banner.avif` | Resonario · archivo | 16:9 | 2880×1620 | P2 |
| `resonario-audio-cover-a1.avif` | Resonario · portadas · Regreso a la Calma | 1:1 | 1024×1024 | P1 |
| `resonario-audio-cover-a2.avif` | Resonario · portadas · Luz Interior | 1:1 | 1024×1024 | P1 |
| `resonario-audio-cover-a3.avif` | Resonario · portadas · Raíces Profundas | 1:1 | 1024×1024 | P1 |
| `resonario-audio-cover-a4.avif` | Resonario · portadas · Umbral del Sueño | 1:1 | 1024×1024 | P1 |
| `resonario-audio-cover-a5.avif` | Resonario · portadas · Aroma de Cedro | 1:1 | 1024×1024 | P1 |
| `resonario-audio-cover-a6.avif` | Resonario · portadas · Respirar el Cielo | 1:1 | 1024×1024 | P1 |
| `resonario-audio-cover-a7.avif` | Resonario · portadas · Corazón Abierto | 1:1 | 1024×1024 | P1 |
| `academy-hero.avif` | Academia · hero | 16:9 | 2880×1620 | P1 |
| `academy-featured-course.avif` | Academia · curso destacado | 16:8 | 2880×1440 | P1 |
| `academy-course-cover-c1.avif` | Academia · portadas de curso · El Arte de Volver a Ti | 16:8 | 2880×1440 | P1 |
| `academy-course-cover-c2.avif` | Academia · portadas de curso · Rituales Conscientes | 16:8 | 2880×1440 | P1 |
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Sanan | 16:8 | 2880×1440 | P1 |
| `academy-lesson-visual.avif` | Academia · lección | 16:8 | 2880×1440 | P1 |
| `academy-completion.avif` | Academia · curso completado | 16:8 | 2880×1440 | P1 |
| `experiences-hero.avif` | Experiencias · hero | 16:9 | 2880×1620 | P1 |
| `experiences-featured.avif` | Experiencias · destacada | 16:8 | 2880×1440 | P1 |
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | 16:9 | 2880×1620 | P1 |
| `experiences-visual-e2.avif` | Experiencias · filas · Círculo de Luna Nueva | 16:9 | 2880×1620 | P1 |
| `experiences-visual-e3.avif` | Experiencias · filas · Ritual de Aromas | 16:9 | 2880×1620 | P1 |
| `experiences-visual-e4.avif` | Experiencias · filas · Meditación al Amanecer | 16:9 | 2880×1620 | P1 |
| `booking-hero.avif` | Reserva · hero | 16:9 | 2880×1620 | P1 |
| `booking-confirmation.avif` | Reserva · confirmación | 16:8 | 2880×1440 | P1 |
| `store-hero.avif` | Tienda · hero | 16:9 | 2880×1620 | P1 |
| `store-product-visual-p1.avif` | Tienda · productos · Aceite Esencial · Cedro Sagrado | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p2.avif` | Tienda · productos · Vela Ritual · Luz de Vela | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p3.avif` | Tienda · productos · Cuarzo de Serenidad | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p4.avif` | Tienda · productos · Bruma de Enraizamiento | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p5.avif` | Tienda · productos · Incienso · Bosque de Copal | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p6.avif` | Tienda · productos · Sal de Baño · Luna Llena | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p7.avif` | Tienda · productos · Infusión · Calma de Cedro | 1:1 | 1024×1024 | P1 |
| `store-product-visual-p8.avif` | Tienda · productos · Diario de Frecuencias | 1:1 | 1024×1024 | P1 |
| `store-ritual-banner.avif` | Tienda · banner ritual | 16:9 | 2880×1620 | P2 |
| `product-detail.avif` | Tienda · detalle | 16:8 | 2880×1440 | P1 |
| `product-related.avif` | Tienda · relacionados | 16:8 | 2880×1440 | P2 |
| `cart-empty.avif` | Carrito · vacío | 16:9 | 2880×1620 | P2 |
| `checkout-confirmation.avif` | Compra · confirmación | 16:8 | 2880×1440 | P1 |
| `sanctuary-hero.avif` | Mi Santuario · hero | 16:9 | 2880×1620 | P1 |
| `sanctuary-continue.avif` | Mi Santuario · continuar | 16:8 | 2880×1440 | P1 |
| `sanctuary-daily.avif` | Mi Santuario · práctica diaria | 1:1 | 1024×1024 | P1 |
| `sanctuary-journal.avif` | Mi Santuario · diario | 3:4 | 1440×1920 | P2 |
| `sanctuary-empty.avif` | Mi Santuario · vacío | 16:9 | 2880×1620 | P2 |
| `states-loading.avif` | Estados · carga | 16:9 | 2880×1620 | P2 |
| `states-empty.avif` | Estados · vacío | 16:9 | 2880×1620 | P2 |
| `states-error.avif` | Estados · error | 16:9 | 2880×1620 | P2 |
| `states-offline.avif` | Estados · sin conexión | 16:9 | 2880×1620 | P2 |
| `og-image.jpg` | Metadatos · Open Graph | 1.91:1 | 1200×630 | P0 |

## 5. Imágenes

### Portal

#### `portal.hero` — Portal · umbral · P0

- **Archivo:** `portal-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Umbral de entrada al universo: lo primero que ve el visitante.

**Prompt**

```text
A vast nocturnal threshold over still water: a circular opening of warm golden light, a soft diffuse halo of light, never a thin glowing neon tube, hovering low above a mirror-calm dark sea at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, a sparse arc of fine stars and a small faint galaxy glow in the upper third, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising out of the haze like frequencies: the gold one rising straight up from the top of the ring and never crossing its inside, the teal one at 35% from the left, the lavender one at 65% from the left, and no other vertical lines anywhere, a faint teal glow low on the horizon at the left and a faint lavender glow low on the horizon at the right, both fading out well before the frame edges. Centered, balanced wide composition with the horizon at about 52% from the top, the ring at 50% horizontal and 40% vertical, deep dark negative space all around, the bottom 30% of the frame plain dark still water with no reflections, for a logo and a button. Wide landscape framing. Balanced gold, teal and lavender in equal, faint measure; cosmic and immersive but restrained. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `portal.portal-field` — Portal · campo · P1

- **Archivo:** `portal-portal-field.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El campo de energía donde se elige el camino: materia suspendida en el cruce.

**Prompt**

```text
A horizontal field of luminous water at night: slow streams of golden light crossing a dark mirror-still surface, a soft beam of teal light and a soft beam of lavender light meeting at the center like a crossing of paths, faint concentric ripples where they meet, long-exposure feel. Wide and horizontal, the crossing at dead center, dark margins on both sides. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Balanced gold, teal and lavender in equal, faint measure; cosmic and immersive but restrained. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### 404

#### `not-found.hero` — 404 · P2

- **Archivo:** `not-found-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Acompañar al visitante extraviado sin romper el hechizo.

**Prompt**

```text
A serene empty corner of the cosmos: a single small warm lantern glowing on the surface of dark still water, a faint reflection beneath it, distant teal mist, a few fine stars far above, absolute calm, nobody present. Lantern slightly above center, large calm dark water surface around it, empty sky above. Wide landscape framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Home

#### `home.hero` — Home · hero · P0

- **Archivo:** `home-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim. Cuerpo de luz: la imagen firma de la marca.

**Prompt**

```text
The brand signature image: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on its side across the surface of dark still water, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse spiral-galaxy glow gathers beneath it in the water and ripples outward in concentric rings, the silhouette edged in warm gold with faint teal and lavender light flowing through it like fine veins of current, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising behind it, and no other vertical lines anywhere, sparse fine stars in the upper third, deep navy background. The figure lies entirely in the right half of the frame, never left of center: its head at 62% horizontal and 40% vertical, its body extending to the right and ending well before the right edge; the left 55% of the frame is dark and empty for the headline, low camera angle at water level. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `home.daily-frequency` — Home · frecuencia del día · P1

- **Archivo:** `home-daily-frequency.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** La frecuencia del día como materia: el sonido hecho imagen.

**Prompt**

```text
Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in dark water and lit by golden light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light, top-down macro. Pattern centered and radially symmetric, dark water fading to near-black at all four edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `home.realms-banner` — Home · banner de realms · P1

- **Archivo:** `home-realms-banner.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Mapa de los nueve reinos: la invitación a entrar.

**Prompt**

```text
A constellation as a map of nine realms: nine small glowing points of gold, teal and lavender light joined by the faintest filaments across an immense dark nebula, long-exposure night sky with a slow arc of stars, a thin line of still water along the lower edge mirroring the points. Nine points spread across the width with the brightest near the center, deep dark edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Balanced gold, teal and lavender in equal, faint measure; cosmic and immersive but restrained. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `home-marisol-portrait` — Home · Sobre Marisol · P0

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

#### `home.footer-banner` — Home · cierre · P2

- **Archivo:** `home-footer-banner.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** Cierre editorial: la despedida que invita a quedarse.

**Prompt**

```text
The horizon after the page: a dusk sky with faint lavender clouds above a dark mirror-calm sea, a single thin line of gold light along the horizon, the first stars appearing, vast stillness. Horizon at 40% vertical, sky above, dark water below fading to near-black for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Sobre Marisol

#### `about.hero` — Sobre Marisol · hero · P1

- **Archivo:** `about-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera de la vista de Marisol: el lugar desde el que acompaña.

**Prompt**

```text
The place where the work begins: a quiet terrace of dark stone at dusk opening onto a still lake and distant mountains in lavender mist, a low wooden table with a crystal singing bowl and a single lit candle in the foreground, a linen shawl left over a stone bench as if someone had just stepped out, warm golden light, a faint spiral of galaxy glow in the upper sky. Table and candle at 60% horizontal and 40% vertical, left third dark and empty for the title, lower edge fading to near-black. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `about.angels` — Sobre Marisol · Experiencias con Ángeles · P1

- **Archivo:** `about-angels.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 30%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** La presencia sin figura: luz que desciende, nunca un ángel literal.

**Prompt**

```text
Presence without a figure: a soft shaft of pale lavender and gold light descending through still dark air onto a mist-covered lake, a single white feather suspended mid-fall, fine luminous dust around it, no wings, no faces, no statues, no religious iconography. Light source and feather in the upper third at 30% vertical, lower half dark and calm for the headline. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Acceso

#### `auth.hero` — Acceso · hero · P1

- **Archivo:** `auth-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** El umbral personal que recibe antes del formulario.

**Prompt**

```text
A tall arched doorway of soft golden light set into a dark stone wall at the edge of still water, seen from a few steps back, a warm path of light spilling across the wet stone and the water toward the viewer, mist at its base, quiet, inviting, nobody in the frame. Arch placed in the right half, the left third dark stone and empty for a quote. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `auth.form-atmosphere` — Acceso · formulario · P2

- **Archivo:** `auth-form-atmosphere.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Baja luminosidad general: va detrás de un formulario de cristal
- **Contenido:** Fondo atmosférico del formulario de acceso.

**Prompt**

```text
Intimate calm: a surface of nearly black still water with a single soft golden point of light reflected in it and faint teal mist drifting low, blurred velvet-dark background, a soft warm glow at the bottom of the frame. Vertical, very dark and low contrast (it sits behind a glass form), the point of light in the lower third, generous dark space above. Vertical portrait framing. A glass form sits on top of this image: keep the whole image very dark and very low in contrast, with nothing sharp. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Descúbrete

#### `discover.hero` — Descúbrete · hero · P1

- **Archivo:** `discover-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Bienvenida del quiz: la materia que abre la exploración.

**Prompt**

```text
The beginning of a discovery: a narrow path of dark stone steps rising from still water into soft lavender and gold dawn mist over distant mountain ridges, a sense of a first step, no people. Path entering from the lower right toward a bright vanishing point at 50% horizontal and 40% vertical, left third dark. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `discover.question-atmosphere` — Descúbrete · pregunta · P2

- **Archivo:** `discover-question-atmosphere.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Baja luminosidad general: va detrás de un formulario de cristal
- **Contenido:** Respiro visual que acompaña cada pregunta.

**Prompt**

```text
Soft-focus ambient abstraction: drifting translucent veils of lavender and teal mist with tiny golden specks like slow snowfall, very dark, almost abstract. Vertical, very low contrast, nothing sharp (it sits behind the question text). Vertical portrait framing. A glass form sits on top of this image: keep the whole image very dark and very low in contrast, with nothing sharp. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `discover.tuning` — Descúbrete · afinación · P1

- **Archivo:** `discover-tuning.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El momento de la afinación personal: la materia que sintoniza. Cuerpo de luz.

**Prompt**

```text
Tuning in: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated at the edge of dark still water and seen from behind, head slightly bowed, as a halo of golden ripples spreads across the surface toward it from a single struck point, soft teal reflections in the water, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the ripples, and no other vertical lines anywhere. Figure centered, ripples fanning left and right across the wide frame, dark edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `discover.result` — Descúbrete · resultado · P1

- **Archivo:** `discover-result.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El resultado del quiz como revelación visual. Cuerpo de luz.

**Prompt**

```text
Revelation: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single soft beam of warm light from above splitting into gold, teal and lavender glows that run through the body and fall across the water as its reflection, a moment of clarity. Figure small and centered in the lower third, the beam descending gently from the top center, the middle of the frame calm and dark for the result text. Wide landscape framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Resonario

#### `resonario.hero` — Resonario · hero · P1

- **Archivo:** `resonario-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera del archivo sonoro: la escucha como paisaje.

**Prompt**

```text
A vast dark resonant space over still water: rows of softly glowing translucent discs suspended at different depths like a solar system above a mirror-calm surface that doubles them, warm gold rims, drifting haze, cinematic depth of field. Discs receding from the upper right toward the center, the left third dark and empty for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.featured` — Resonario · destacado · P1

- **Archivo:** `resonario-featured.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Fondo del audio destacado de la semana.

**Prompt**

```text
A backdrop for a featured disc: soft concentric rings of golden light radiating from an empty center across dark still water, faint teal and lavender halos at the edges. Empty calm center (a disc is placed on top in the UI), rings fading to near-black at the edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.archive-banner` — Resonario · archivo · P2

- **Archivo:** `resonario-archive-banner.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** La colección completa como lugar.

**Prompt**

```text
The archive as a place: a long colonnade of dark stone opening onto still water at dusk, tall niches holding softly glowing vessels — brass bowls, glass discs, ceramic jars — lavender haze, a few warm lamps far away reflected in the floor-water. One-point perspective down the colonnade, lower third dark for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Regreso a la Calma` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a1.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
Still water at dusk, a single pebble just dropped, perfect concentric ripples spreading in teal and gold light, calm and cool. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Luz Interior` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a2.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
A single warm orb of light glowing inside a dark lavender crystal geode, facets catching the glow, inner light. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Raíces Profundas` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a3.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
Dark moss-covered stones half-submerged at the edge of black water, fine exposed roots in earth, a thread of gold light running between them, grounded and quiet. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Umbral del Sueño` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a4.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
An indigo night lake under a drifting veil of mist, a doorway of soft hazy light far away on the shore, heavy and soothing. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Aroma de Cedro` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a5.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
Amber cedar smoke curling upward from a small brass burner against darkness, a bundle of cedar sprigs beside it, warm glow. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Respirar el Cielo` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a6.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
A lagoon-teal sky at blue hour with soft layered clouds lit from below by faint gold, open air, spacious. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `resonario.audio-cover.* · Corazón Abierto` — Resonario · portadas · P1

- **Archivo:** `resonario-audio-cover-a7.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Portada de cada audio del archivo: el sonido con rostro (7 audios).

**Prompt**

```text
Two cupped hands holding a small warm glow of light against a sage-green dark background, tender and open. Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc. Square framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Academia

#### `academy.hero` — Academia · hero · P1

- **Archivo:** `academy-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera de la academia: el estudio como escena.

**Prompt**

```text
Study as a scene: a low wooden desk on a quiet lakeside terrace at blue hour with an open blank notebook, a ceramic bowl and a lit candle, teal mist over the water and the far hills, no people. Desk in the right half, the left third quiet and dark for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy.featured-course` — Academia · curso destacado · P1

- **Archivo:** `academy-featured-course.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** El curso destacado con materia propia en la cabecera.

**Prompt**

```text
The featured practice: a pair of hands cradling a small brass singing bowl with a wooden striker resting on its rim, golden candlelight on the hands, teal mist behind, close framing. Hands and bowl in the right-center, the left third dark for the course title. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-course-cover · El Arte de Volver a Ti` — Academia · portadas de curso · P1

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

- **Archivo:** `academy-course-cover-c3.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
Amber glass vials of essential oils, dried cedar and herbs on a dark wooden tray, warm golden light and a thread of fragrant smoke. Keep the subject inside the central 50% of the width so the 1:1 crop of the card still contains it. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-lesson-visual` — Academia · lección · P1

- **Archivo:** `academy-lesson-visual.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** Respaldo de la lección: la práctica que acompaña al audio.

**Prompt**

```text
A soft-focus practice backdrop: out-of-focus candle flames as warm bokeh and a pair of hands resting on knees in the far distance, teal shadows, almost abstract. Very low contrast, nothing sharp in the lower third (the player controls sit there). Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
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

### Experiencias

#### `experiences.hero` — Experiencias · hero · P1

- **Archivo:** `experiences-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera de experiencias: el viaje como promesa.

**Prompt**

```text
The journey as a promise: a lantern-lit path of stepping stones across still water toward a softly glowing pavilion on the far shore, lavender dusk mist between dark trees and hills, nobody present. Pavilion at 55% horizontal and 40% vertical, lanterns leading in from the lower left, left third dark. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences.featured` — Experiencias · destacada · P1

- **Archivo:** `experiences-featured.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia destacada con presencia propia: el baño de sonido. Cuerpo de luz.

**Prompt**

```text
A sound bath in progress: a circle of abstract translucent silhouettes of pure light, each with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated around a ring of crystal singing bowls glowing lavender and gold from within, set on dark still water that mirrors them, concentric rings of light spreading across the surface, drifting haze above. Ring of bowls and figures in the right two thirds at 45% vertical, left third dark for the title and the booking button. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Baño de Sonido en Vivo` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e1.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
Crystal and brass singing bowls glowing from within on a dark wooden platform over still water, candles between them, rings of light spreading across the surface, a soft haze; nobody present. The subject sits on the right at 62% horizontal and 45% vertical, the left 45% is dark and empty because a left scrim carries the text. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
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

### Reserva

#### `booking.hero` — Reserva · hero · P1

- **Archivo:** `booking-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** El lugar de la experiencia elegida, antes de reservar.

**Prompt**

```text
An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck over still water at twilight, a few unlit candles waiting, a soft lavender light on the planks and the mountains beyond. Wide symmetrical, circle of cushions in the middle distance, left third dark. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `booking.confirmation` — Reserva · confirmación · P1

- **Archivo:** `booking-confirmation.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Confirmación con la materia del lugar: el sí con imagen.

**Prompt**

```text
The same serene place now with its candles lit: a warm golden glow over the circle of cushions on the deck, reflected in the still water, a steaming cup set beside them, a soft light on the horizon. Warm center, dark edges, calm space in the middle for a check mark and a line of text. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Tienda

#### `store.hero` — Tienda · hero · P1

- **Archivo:** `store-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** Cabecera de la tienda: el ritual de adquirir.

**Prompt**

```text
The ritual of acquiring: a dark stone ledge at the edge of still water at night with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, low golden light raking across the objects and reflecting in the water behind them. Objects in the right half at 40% vertical, the left third dark and empty for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Aceite Esencial · Cedro Sagrado` — Tienda · productos · P1

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

- **Archivo:** `store-product-visual-p8.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A linen-bound blank notebook closed, a brass pen lying across its cover, no title and no text on it. Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store.ritual-banner` — Tienda · banner ritual · P2

- **Archivo:** `store-ritual-banner.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior despejada (el texto va abajo, sobre scrim)
- **Contenido:** Franja del ritual: los objetos como materia de práctica.

**Prompt**

```text
Objects of ritual as matter: a top-down flat lay on dark slate of matches, copal resin, a small brass dish, dried herbs and a quartz point, a warm rim light from the left. Objects grouped in the upper two thirds, the bottom third dark slate for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `product.detail` — Tienda · detalle · P1

- **Archivo:** `product-detail.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El producto protagonista en su página: materia de contemplación y compra.
- **Nota:** Fondo genérico para cualquier producto. Si se quisiera uno por producto, reutilizar el encuadre de store-product-visual-<slug> en panorámico: el mismo objeto con más aire lateral.

**Prompt**

```text
A contemplation backdrop for a product: a dark surface with a soft pool of golden light and a single slow ribbon of smoke rising, faint teal haze at the edges. Empty center-right for the product to be overlaid, light pool at center, near-black edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `product.related` — Tienda · relacionados · P2

- **Archivo:** `product-related.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Ristra de objetos afines: el conjunto como mundo.

**Prompt**

```text
A sweep of a dark slate shelf with a line of softly out-of-focus ritual objects receding into warm bokeh, amber and honey tones, gentle depth. Horizontal line of objects at 50% vertical, dark upper and lower edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Carrito

#### `cart.empty` — Carrito · vacío · P2

- **Archivo:** `cart-empty.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El vacío del carrito como calma, no como castigo.

**Prompt**

```text
A small empty ceramic dish on a dark stone ledge beside still water, a single ray of warm light falling across it, a thread of steam rising, serene and open, nothing inside. Dish at center slightly below the middle, dark ledge and background, calm space above. Wide landscape framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Compra

#### `checkout.confirmation` — Compra · confirmación · P1

- **Archivo:** `checkout-confirmation.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** La compra confirmada con la materia del ritual.

**Prompt**

```text
Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, warm candlelight, no writing on the wrapping. Parcel centered, dark wooden surface, warm glow, calm space above for a check mark. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Mi Santuario

#### `sanctuary.hero` — Mi Santuario · hero · P1

- **Archivo:** `sanctuary-hero.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo e inferior despejados (titular y CTA)
- **Contenido:** El espacio personal: la materia que recibe al volver. Cuerpo de luz.

**Prompt**

```text
A personal sanctuary at night: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on a cushion beside a large window that opens onto a moonlit lake, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, teal moonlight balanced with golden glow, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the water outside, and no other vertical lines anywhere. Window on the right with the figure beneath it, left third dark and calm. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `sanctuary.continue` — Mi Santuario · continuar · P1

- **Archivo:** `sanctuary-continue.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La invitación a retomar la práctica donde se dejó.

**Prompt**

```text
Continuity: the same cushion with a half-burned candle beside it and a blank open book, a soft warm glow, a feeling that someone has just stepped away and will return. Objects in the right half, the left third dark for the lesson title. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `sanctuary.daily` — Mi Santuario · práctica diaria · P1

- **Archivo:** `sanctuary-daily.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 y reescalar · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** La práctica del día con materia propia.

**Prompt**

```text
Today's practice: a small brass bowl of still water on dark stone, a single beam of early morning light falling into it and making it glow gold, tiny ripples. Bowl centered, beam entering from the upper left, dark surroundings. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `sanctuary.journal` — Mi Santuario · diario · P2

- **Archivo:** `sanctuary-journal.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 y reescalar · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Baja luminosidad general: va detrás de un formulario de cristal
- **Contenido:** El diario como materia íntima.

**Prompt**

```text
The journal as intimate matter: an open linen-bound notebook with blank pages and a brass pen on dark wood, candlelight raking across the paper, a dried sprig of lavender, no legible writing. Vertical, notebook in the lower two thirds, upper third dark and calm. Vertical portrait framing. A glass form sits on top of this image: keep the whole image very dark and very low in contrast, with nothing sharp. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `sanctuary.empty` — Mi Santuario · vacío · P2

- **Archivo:** `sanctuary-empty.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El santuario recién estrenado: vacío luminoso, no ausencia.

**Prompt**

```text
Luminous emptiness: an empty dark space opening onto still water, a soft pool of light gathering in the center of the floor and reflecting in the water beyond, dust motes drifting, no objects, the quiet of a place that is new. Light pool at center, slightly below the middle, dark space around it. Wide landscape framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Estados

#### `states.loading` — Estados · carga · P2

- **Archivo:** `states-loading.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** La espera con materia: cargar es también respirar.
- **Estado:** fuera del registro de slots (aún sin cablear).

**Prompt**

```text
Waiting with matter: a single soft sphere of golden light floating in a dark misty space above still water as if breathing, faint halo, slow and calm. Sphere at center, dark calm space around it. Wide landscape framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `states.empty` — Estados · vacío · P2

- **Archivo:** `states-empty.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El vacío de marca en cualquier vista.
- **Estado:** fuera del registro de slots (aún sin cablear).

**Prompt**

```text
An empty dark space with one soft window of pale lavender light on the still water, dust motes drifting through it, open space. Light on the water just below center, dark space around it. Wide landscape framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `states.error` — Estados · error · P2

- **Archivo:** `states-error.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** El error sin ruido: compañía en el tropiezo.
- **Estado:** fuera del registro de slots (aún sin cablear).

**Prompt**

```text
Something interrupted: a single candle flickering on a dark stone ledge by still water with a wisp of smoke still rising, calm and unbothered, warm faint glow. Candle at center, dark surroundings, quiet space above. Wide landscape framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `states.offline` — Estados · sin conexión · P2

- **Archivo:** `states-offline.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 y reescalar · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** La desconexión como retiro, no como fallo.
- **Estado:** fuera del registro de slots (aún sin cablear).

**Prompt**

```text
A brief retreat: a quiet cabin window at night with a warm lamp inside and lavender mist over a still lake outside, a sense of pausing, nobody in the frame. Window slightly right of center, dark surroundings. Wide landscape framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### Metadatos

#### `og-image` — Metadatos · Open Graph · P0

- **Archivo:** `og-image.jpg`
- **Medidas:** 1200×630 · 1.91:1
- **Ratio / focal:** 1.91:1 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Imagen al compartir el enlace en redes y mensajería. No está cableada: hay que añadirla a los metadatos.
- **Nota:** JPEG (las plataformas sociales no leen AVIF de forma fiable), 1200×630, ≤ 300 KB. Componer el logo encima, no generarlo.
- **Estado:** fuera del registro de slots (aún sin cablear).

**Prompt**

```text
The Frecuencia Mágica universe in one frame: a golden circle of light, a soft diffuse halo of light, never a thin glowing neon tube, hovering above a mirror-calm dark sea at the horizon, fine concentric arcs in a deep navy cosmos above, faint teal dust toward the left and faint lavender dust toward the right, both fading before the frame edges, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, standing in the haze: the gold one rising straight up from the top of the circle and never crossing its inside, the teal one at 35% from the left, the lavender one at 65% from the left, and no other vertical lines anywhere, the inside of the circle dark and empty for the logo to be composited later. Landscape 1.91:1, the circle centered, dark edges, keep everything important within the central 80% because platforms crop. Wide landscape framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

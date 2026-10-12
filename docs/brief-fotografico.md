# Brief fotográfico — Frecuencia Mágica

> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.
> El estado de cada imagen (a corregir, faltante, por cablear…) vive en `Branding/src/data/photography-status.js`; un test lo cruza con lo publicado.
> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.
> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.

**66 imágenes** (47 slots registrados, varios por instancia; 1 fuera del registro): P0 4 · P1 47 · P2 15. 1 requiere sesión real (retrato de Marisol).

**Estado:** 50 completadas · 0 a corregir · 15 faltantes · 0 por cablear · 1 no tenidas en cuenta. Ver la sección 5.

## 1. Entrega

- **Formatos:** Se entrega el PNG del agente, sin convertir. La web no publica PNG (salvo el logo): `npm run editorial:ingest` (desde `frontend/`) lo comprime una sola vez en AVIF q88, en variantes de 640, 828, 1200, 1920 y 2880 px acotadas al ancho del archivo, y reescribe el manifiesto. No convertir a AVIF ni a WebP a mano: cada recompresión pierde grano.
- **Carpeta:** `frontend/.editorial-originals/ (los PNG; git los ignora). La ingesta escribe los AVIF en frontend/public/editorial/.`
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
- **Cuerpo de luz:** Silueta translúcida sin rasgos, bordeada de oro con teal y lavanda por dentro. Realms: Seis slots narrativos y una portada de curso (ver abajo).
- **Filamentos de frecuencia:** Tres líneas verticales ondulantes —oro, teal y lavanda— a baja opacidad. Motivo recurrente, no obligatorio.
- **Slots con cuerpo de luz:** `home.hero`, `discover.tuning`, `discover.result`, `experiences.featured`, `academy.completion`, `sanctuary.hero`, `academy-course-cover-c1`.

**Reglas**

- Sin texto, logos, marcas, nombres de canal ni etiquetas legibles dentro de la imagen: el copy lo pone la web.
- Sin rasgos faciales: el cuerpo de luz es una silueta translúcida sin ojos, boca ni nariz, y el único rostro es el retrato real de Marisol. Fuera de esos casos: manos u objetos. Toda figura de cuerpo entero es el cuerpo de luz, nunca una persona real, ni de espaldas. El prompt describe la silueta en positivo (cabeza lisa, sin nariz, labios ni oreja; de espaldas o girada): «faceless» a secas no basta.
- Cielo arriba, materia abajo: el cosmos ocupa como mucho el tercio superior, con estrellas escasas. El world engine ya pinta el campo de estrellas y las partículas; la imagen no los duplica.
- Luz dorada sobre fondo oscuro: los bordes de la imagen tienden a --void para que el scrim de CSS funda sin corte.
- Nada de fondos blancos, grises ni pasteles, ni neón ni arcoíris: es un universo nocturno. Oro, teal y lavanda, a baja saturación.
- Filamentos de frecuencia: como máximo tres líneas ondulantes (oro, teal y lavanda), a baja opacidad, nunca un espectro completo. El prompt las cuenta en positivo («exactly three … in total»): los modelos tienden a duplicarlas.
- Anillos y círculos de luz: halo suave y difuso, nunca un tubo de neón fino.
- Sin ADN, cerebros ni anatomía: la energía se sugiere con luz, agua y geometría sagrada, no con ilustración médica.
- Sin stock ni Unsplash. Lo generado es materia de ambiente y dirección de arte: cuando exista el producto físico o la persona real, se sustituye por fotografía real.
- Sin máscaras, viñetas ni degradados horneados: los aplica el CSS.

**Cómo redactar el prompt** (aprendido de las desviaciones: casi todas nacieron de una contradicción o una frase ambigua del propio prompt)

- Sujeto y encuadre no se contradicen: algo «en primer plano» no puede estar «al 40 % de la altura», ni un resplandor central pedirse a la vez que un centro calmo. Antes de dar un porcentaje, comprueba que el sujeto cabe donde lo pones.
- Una posición lleva rango y tamaño, no sólo una cifra: «entre el 62 % y el 88 % del ancho, un cuarto del ancho». Un porcentaje suelto se corre varios puntos.
- Los conteos y los estados se escriben en positivo y con número: «exactly three filaments in total»; unas velas apagadas son «unburnt wax, dark wick, no flame», no sólo «unlit».
- Un sustantivo sin estilo trae su estereotipo («pavilion» sale pagoda): descríbelo con materiales, tejado y ornamento.
- La negación sola no basta («never a thin neon tube»): describe lo que sí debe verse («a broad soft glow with no outline, like the corona of an eclipse»).
- Nada de la interfaz en el prompt: «glass form», «scrim», «check mark» o «disc» acaban dibujados como objeto. Di sólo que el contenido se coloca encima después.
- La oscuridad de una zona libre sale de la escena (sombra, agua sin luz, cielo apagado), no de un «tercio oscuro» a secas, que se aplica como una banda de degradado recta.
- Un centro libre para superponer algo se fija con coordenadas («exact center, 50% and 50%») y lo brillante se coloca fuera de él.
- Una altura depende del horizonte: una figura «pequeña» y «baja» a la vez se contradice, porque en perspectiva lo pequeño está lejos y lo lejano queda junto al horizonte. Fija dónde está el horizonte y a qué distancia del espectador está el sujeto.

## 3. Medidas

| Preset | Ratio | Master | Tablet | Móvil | Generar a | Peso | Uso |
|---|---|---|---|---|---|---|---|
| Banda ancha 16:9 | 16:9 | 2880×1620 | 1440×810 | 768×432 | 2048×1152 | ≤ 260 KB (P0 ≤ 320 KB) | Héroes y bandas a sangre de viewport |
| Banda cine 16:8 (2:1) | 16:8 | 2880×1440 | 1440×720 | 768×384 | 2048×1024 | ≤ 220 KB | Bandas bajas y fondos de tarjeta destacada |
| Retrato 3:4 | 3:4 | 1440×1920 | 1080×1440 | 780×1040 | 1536×2048 | ≤ 220 KB | Media página (50vw en ≥768px), retratos y atmósferas verticales |
| Cuadrada 1:1 | 1:1 | 1024×1024 | 768×768 | 640×640 | 1024×1024 | ≤ 120 KB | Portadas de audio, tarjetas de producto y de curso |

Los pesos son recomendaciones de trabajo, no un contrato de la web. El master es 2× el ancho de render máximo (DPR capado a 2).

**Excepciones de encuadre en la web** (las fija el contrato de slots; el resto de imágenes usa un solo foco y se pinta a su ratio):

- `home.hero` (`home-hero.avif`): foco 62% 40% · foco móvil 75% 40%. El foco móvil rige por debajo de 768 px: así el cuerpo de luz (62–88 % del ancho) queda dentro de la ventana visible.
- `discover.question-atmosphere` (`discover-question-atmosphere.avif`): fondo a pantalla completa (`backdrop`), por encima de su ratio. Por eso es de bajo contraste y sin nada nítido: la ampliación no se percibe.

## 4. Resumen

| Archivo | Vista | Ratio | Master | Prio. | Estado |
|---|---|---|---|---|---|
| `portal-hero.avif` | Portal · umbral | 16:9 | 2880×1620 | P0 | Completadas |
| `portal-portal-field.avif` | Portal · campo | 16:8 | 2880×1440 | P1 | Completadas |
| `not-found-hero.avif` | 404 | 16:9 | 2880×1620 | P2 | Completadas |
| `home-hero.avif` | Home · hero | 16:9 | 2880×1620 | P0 | Completadas |
| `home-daily-frequency.avif` | Home · frecuencia del día | 16:8 | 2880×1440 | P1 | Completadas |
| `home-realms-banner.avif` | Home · banner de realms | 16:8 | 2880×1440 | P1 | Completadas |
| `home-marisol-portrait.avif` | Home · Sobre Marisol | 3:4 | 1440×1920 | P0 | Completadas |
| `home-membership.avif` | Home · membresía | 16:9 | 2880×1620 | P2 | Completadas |
| `home-footer-banner.avif` | Home · cierre | 16:9 | 2880×1620 | P2 | Completadas |
| `about-hero.avif` | Sobre Marisol · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `about-angels.avif` | Sobre Marisol · Experiencias con Ángeles | 16:8 | 2880×1440 | P1 | Completadas |
| `auth-hero.avif` | Acceso · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `auth-form-atmosphere.avif` | Acceso · formulario | 3:4 | 1440×1920 | P2 | Completadas |
| `discover-hero.avif` | Descúbrete · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `discover-question-atmosphere.avif` | Descúbrete · pregunta | 3:4 | 1440×1920 | P2 | Completadas |
| `discover-tuning.avif` | Descúbrete · afinación | 16:8 | 2880×1440 | P1 | Completadas |
| `discover-result.avif` | Descúbrete · resultado | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero.avif` | Resonario · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-featured.avif` | Resonario · destacado | 16:8 | 2880×1440 | P1 | Completadas |
| `resonario-archive-banner.avif` | Resonario · archivo | 16:9 | 2880×1620 | P2 | Completadas |
| `resonario-audio-cover-a1.avif` | Resonario · portadas · Regreso a la Calma | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a2.avif` | Resonario · portadas · Luz Interior | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a3.avif` | Resonario · portadas · Raíces Profundas | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a4.avif` | Resonario · portadas · Umbral del Sueño | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a5.avif` | Resonario · portadas · Aroma de Cedro | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a6.avif` | Resonario · portadas · Respirar el Cielo | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-a7.avif` | Resonario · portadas · Corazón Abierto | 1:1 | 1024×1024 | P1 | Completadas |
| `academy-hero.avif` | Academia · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-featured-course.avif` | Academia · curso destacado | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-course-cover-c1.avif` | Academia · portadas de curso · El Arte de Volver a Ti | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-course-cover-c2.avif` | Academia · portadas de curso · Rituales Conscientes | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Sanan | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-lesson-visual.avif` | Academia · lección | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-completion.avif` | Academia · curso completado | 16:8 | 2880×1440 | P1 | Faltantes |
| `experiences-hero.avif` | Experiencias · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-featured.avif` | Experiencias · destacada | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | 16:9 | 2880×1620 | P1 | No tenidas en cuenta |
| `experiences-visual-e2.avif` | Experiencias · filas · Círculo de Luna Nueva | 16:9 | 2880×1620 | P1 | Faltantes |
| `experiences-visual-e3.avif` | Experiencias · filas · Ritual de Aromas | 16:9 | 2880×1620 | P1 | Faltantes |
| `experiences-visual-e4.avif` | Experiencias · filas · Meditación al Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `booking-hero.avif` | Reserva · hero | 16:9 | 2880×1620 | P1 | Completadas |
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
| `sanctuary-journal.avif` | Mi Santuario · diario | 3:4 | 1440×1920 | P2 | Completadas |
| `sanctuary-empty.avif` | Mi Santuario · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `states-loading.avif` | Estados · carga | 16:9 | 2880×1620 | P2 | Completadas |
| `states-empty.avif` | Estados · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `states-error.avif` | Estados · error | 16:9 | 2880×1620 | P2 | Completadas |
| `states-offline.avif` | Estados · sin conexión | 16:9 | 2880×1620 | P2 | Completadas |
| `og-image.jpg` | Metadatos · Open Graph | 1.91:1 | 1200×630 | P0 | Completadas |

## 5. Estado de las imágenes

Cada imagen está en una sola sección. El estado se mantiene en `Branding/src/data/photography-status.js`.

**Nota general sobre tamaños:** las imágenes entregadas llegan a 1672 px de ancho en 16:9, 1774 px en 2:1 y 1086 px en 3:4, por debajo del «generar a» de su preset (2048, 2048 y 1536 px); las cuadradas (1254 px) lo superan. No se trata como desviación individual.

### 5.1 A corregir por desviación de la IA (0)

Entregadas, pero desviadas del brief o de su prompt. Van de más a menos urgente: primero la gravedad y, a igual gravedad, la prioridad de la vista (P0 → P2). La gravedad es criterio visual, y la baja no justifica regenerar salvo que se vea mal en pantalla. Cada entrada dice qué parte del prompt falló según el resultado y trae ya el prompt con ese punto reforzado, listo para regenerarla.

Ninguna.

### 5.2 Faltantes (15)

Aún no entregadas. La vista de cada una ya está preparada, salvo donde la nota indica lo contrario. Cada entrada trae su prompt.

#### `academy-course-cover · El Arte de Volver a Ti` — Academia · portadas de curso · P1

- **Qué falta:** En la lista, `c1` es el curso destacado y usa `academy.featured-course`: su portada sólo se ve en el detalle de curso.
- **Archivo:** `academy-course-cover-c1.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
A small abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated cross-legged on a dark rock at the edge of still water at dawn, seen from behind with the head turned away from the camera, the whole figure made of soft glowing light from head to knees, a smooth luminous form edged in warm gold with faint teal and lavender light flowing through it like fine veins of current, its glow mirrored softly on the water, lavender and gold first light over distant misty mountains, deep calm; it is the only figure in the scene, about 12% of the frame width and centered at 55% horizontal. Keep the subject inside the band between 40% and 70% of the width: that is inside the central 50% that a square crop of this panoramic frame keeps, and to the right of the left third, which stays dark because that side of the scene is unlit and quiet. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-course-cover · Rituales Conscientes` — Academia · portadas de curso · P1

- **Archivo:** `academy-course-cover-c2.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
Hands arranging ritual objects on dark stone — a ceramic bowl, a candle, a sprig of cedar — moss-green and gold light, unhurried gesture. Keep the subject inside the band between 40% and 70% of the width: that is inside the central 50% that a square crop of this panoramic frame keeps, and to the right of the left third, which stays dark because that side of the scene is unlit and quiet. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy-course-cover · Aromas que Sanan` — Academia · portadas de curso · P1

- **Archivo:** `academy-course-cover-c3.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.

**Prompt**

```text
Amber glass vials of essential oils, dried cedar and herbs on a dark wooden tray, warm golden light and a thread of fragrant smoke. Keep the subject inside the band between 40% and 70% of the width: that is inside the central 50% that a square crop of this panoramic frame keeps, and to the right of the left third, which stays dark because that side of the scene is unlit and quiet. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `academy.completion` — Academia · curso completado · P1

- **Archivo:** `academy-completion.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Celebración del curso terminado: el logro con luz. Cuerpo de luz.

**Prompt**

```text
A completed cycle closed in light: a ring of exactly twelve small golden lights, evenly spaced and with no other lights, floating on dark still water seen from a slightly oblique overhead angle, a small abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated cross-legged at the far side of the ring, every light steady and one slightly brighter, concentric ripples radiating outward. Ring centered at 50% horizontal, its middle empty, dark and perfectly still water because content is laid over it later, the ripples spreading outward from the ring only, the small figure no taller than 12% of the frame height at the far edge of the ring at 50% horizontal and 30% vertical. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Círculo de Luna Nueva` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e2.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
An empty ceremonial place waiting for its guests: a circle of small candles, each with a small steady flame, on a dark stone shore beneath a thin new-moon crescent low in the upper part of the sky over still water, the middle of the circle bare dark stone with nothing and nobody in it, the shore deserted, quiet and ceremonial; the only things on the shore are the candles, nobody present. The subject sits on the right, spanning roughly 50% to 80% of the frame width and centered at 45% vertical, and the left 45% of the frame is dark and empty because that side of the scene is unlit shore, water and sky, continuing across the whole width with no gradient, band or vertical edge; text is laid over that side later. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Ritual de Aromas` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e3.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
A brass burner with copal smoke rising in slow spirals, amber oil bottles and dried herbs beside it on a dark wooden table in a quiet room that opens onto still water, golden light. The subject sits on the right, spanning roughly 50% to 80% of the frame width and centered at 45% vertical, and the left 45% of the frame is dark and empty because that side of the scene is unlit shore, water and sky, continuing across the whole width with no gradient, band or vertical edge; text is laid over that side later. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `experiences-visual · Meditación al Amanecer` — Experiencias · filas · P1

- **Archivo:** `experiences-visual-e4.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 45%
- **Zona de texto:** Tercio izquierdo oscuro y despejado (el texto va a la izquierda)
- **Contenido:** La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).

**Prompt**

```text
A small terrace at first light with a cushion and a steaming cup placed in the middle distance at the far end of the terrace, teal mist over distant hills and still water, the first gold on the horizon; nobody present. The subject sits on the right, spanning roughly 50% to 80% of the frame width and centered at 45% vertical, and the left 45% of the frame is dark and empty because that side of the scene is unlit shore, water and sky, continuing across the whole width with no gradient, band or vertical edge; text is laid over that side later. Wide landscape framing. Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Aceite Esencial · Cedro Sagrado` — Tienda · productos · P1

- **Qué falta:** Es el producto destacado: desde 768 px se compone a 1:1 junto a su texto, en dos columnas.
- **Archivo:** `store-product-visual-p1.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
An amber glass dropper bottle with a plain unmarked label and a cedar sprig beside it, the whole bottle and sprig held inside the central 50% of the frame height with plain dark surface above and below. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Vela Ritual · Luz de Vela` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p2.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A honey-coloured wax candle in a dark glass vessel, lit, the flame reflected in the glass. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Cuarzo de Serenidad` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p3.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A clear quartz crystal point standing upright with faint lavender internal light and a soft warm rim light. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Bruma de Enraizamiento` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p4.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A small dark-green glass spray bottle with a fine mist drifting from it, moss and stone beneath. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Incienso · Bosque de Copal` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p5.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
Chunks of pale copal resin in a small clay dish with a thin ribbon of smoke rising. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Balanced faint gold, teal and lavender, ultra calm, very low contrast. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Sal de Baño · Luna Llena` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p6.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A glass jar of pale bath salts with a hint of lavender, a wooden scoop beside it, soft moonlit sheen. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Infusión · Calma de Cedro` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p7.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A handmade ceramic cup of steaming herbal infusion with dried herbs scattered near it, amber light. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

#### `store-product-visual · Diario de Frecuencias` — Tienda · productos · P1

- **Archivo:** `store-product-visual-p8.avif`
- **Medidas:** master 1024×1024 · tablet 768×768 · móvil 640×640 · generar a 1024×1024 (sin ampliar después) · peso ≤ 120 KB
- **Ratio / focal:** 1:1 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** El objeto completo y centrado; materia de compra (8 productos).

**Prompt**

```text
A linen-bound notebook closed, its cover plain unmarked linen, a brass pen lying across it. One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side. Square framing. Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents. Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.
```

### 5.3 Por cablear (crear vistas) (0)

Entregadas, pero sin slot en el registro (`frontend/src/config/editorial-media.ts`) ni pantalla que las pinte. Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.

Ninguna.

### 5.4 No tenidas en cuenta (1)

Publicadas, pero ninguna vista las pinta con el diseño actual.

| Archivo | Vista | Por qué |
|---|---|---|
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | `e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla. |

### 5.5 Completadas (50)

Entregadas, publicadas, cableadas y sin desviación conocida.

| Archivo | Vista | Slot | Ratio | Prio. |
|---|---|---|---|---|
| `portal-hero.avif` | Portal · umbral | `portal.hero` | 16:9 | P0 |
| `portal-portal-field.avif` | Portal · campo | `portal.portal-field` | 16:8 | P1 |
| `not-found-hero.avif` | 404 | `not-found.hero` | 16:9 | P2 |
| `home-hero.avif` | Home · hero | `home.hero` | 16:9 | P0 |
| `home-daily-frequency.avif` | Home · frecuencia del día | `home.daily-frequency` | 16:8 | P1 |
| `home-realms-banner.avif` | Home · banner de realms | `home.realms-banner` | 16:8 | P1 |
| `home-marisol-portrait.avif` | Home · Sobre Marisol | `home-marisol-portrait` | 3:4 | P0 |
| `home-membership.avif` | Home · membresía | `home-membership` | 16:9 | P2 |
| `home-footer-banner.avif` | Home · cierre | `home.footer-banner` | 16:9 | P2 |
| `about-hero.avif` | Sobre Marisol · hero | `about.hero` | 16:9 | P1 |
| `about-angels.avif` | Sobre Marisol · Experiencias con Ángeles | `about.angels` | 16:8 | P1 |
| `auth-hero.avif` | Acceso · hero | `auth.hero` | 16:9 | P1 |
| `auth-form-atmosphere.avif` | Acceso · formulario | `auth.form-atmosphere` | 3:4 | P2 |
| `discover-hero.avif` | Descúbrete · hero | `discover.hero` | 16:9 | P1 |
| `discover-question-atmosphere.avif` | Descúbrete · pregunta | `discover.question-atmosphere` | 3:4 | P2 |
| `discover-tuning.avif` | Descúbrete · afinación | `discover.tuning` | 16:8 | P1 |
| `discover-result.avif` | Descúbrete · resultado | `discover.result` | 16:9 | P1 |
| `resonario-hero.avif` | Resonario · hero | `resonario.hero` | 16:9 | P1 |
| `resonario-featured.avif` | Resonario · destacado | `resonario.featured` | 16:8 | P1 |
| `resonario-archive-banner.avif` | Resonario · archivo | `resonario.archive-banner` | 16:9 | P2 |
| `resonario-audio-cover-a1.avif` | Resonario · portadas · Regreso a la Calma | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a2.avif` | Resonario · portadas · Luz Interior | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a3.avif` | Resonario · portadas · Raíces Profundas | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a4.avif` | Resonario · portadas · Umbral del Sueño | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a5.avif` | Resonario · portadas · Aroma de Cedro | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a6.avif` | Resonario · portadas · Respirar el Cielo | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-a7.avif` | Resonario · portadas · Corazón Abierto | `resonario.audio-cover.*` | 1:1 | P1 |
| `academy-hero.avif` | Academia · hero | `academy.hero` | 16:9 | P1 |
| `academy-featured-course.avif` | Academia · curso destacado | `academy.featured-course` | 16:8 | P1 |
| `academy-lesson-visual.avif` | Academia · lección | `academy-lesson-visual` | 16:8 | P1 |
| `experiences-hero.avif` | Experiencias · hero | `experiences.hero` | 16:9 | P1 |
| `experiences-featured.avif` | Experiencias · destacada | `experiences.featured` | 16:8 | P1 |
| `booking-hero.avif` | Reserva · hero | `booking.hero` | 16:9 | P1 |
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
| `sanctuary-journal.avif` | Mi Santuario · diario | `sanctuary.journal` | 3:4 | P2 |
| `sanctuary-empty.avif` | Mi Santuario · vacío | `sanctuary.empty` | 16:9 | P2 |
| `states-loading.avif` | Estados · carga | `states.loading` | 16:9 | P2 |
| `states-empty.avif` | Estados · vacío | `states.empty` | 16:9 | P2 |
| `states-error.avif` | Estados · error | `states.error` | 16:9 | P2 |
| `states-offline.avif` | Estados · sin conexión | `states.offline` | 16:9 | P2 |
| `og-image.jpg` | Metadatos · Open Graph | `og-image` | 1.91:1 | P0 |

# Brief fotográfico — Frecuencia Mágica

> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.
> El estado de cada imagen (a corregir, faltante, por cablear…) vive en `Branding/src/data/photography-status.js`; un test lo cruza con lo publicado.
> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.
> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.
> Enmienda 2026-10-17 (`docs/superpowers/specs/2026-10-17-ambientes-v2-design.md`): además de la noche hay atmósferas con paisajes de color natural y escenas claras. Tienen estilo propio (sección 2) y son provisionales (sección 5.6).

**204 imágenes** (50 slots registrados, varios por instancia; 1 fuera del registro): P0 12 · P1 132 · P2 60. 1 requiere sesión real (retrato de Marisol).

**Estado:** 190 completadas · 0 a corregir · 13 faltantes · 0 por cablear · 1 no tenidas en cuenta. Ver la sección 5.

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

**Estilo de las atmósferas** (enmienda 2026-10-17: las imágenes `atmosphere-*`, `resonario-celtic` y `resonario-kind-banner-*` llevan este bloque en lugar del prompt base nocturno)

```text
Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

**Prompt negativo de las atmósferas** (el negativo común más esta cola)

```text
a navy or gold color cast over the whole image, crushed black shadows, teal-and-orange blockbuster grade, oversaturated sunset, blown-out sun disc, people, human figures, silhouettes of people, boats
```

**Tratamientos por atmósfera**

- `dusk`: Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light.
- `dawn`: Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows.
- `moon`: Dominant tone: cool silver-blue moonlight over a night of deep teal-blue, the whole scene clearly lit and readable by a soft luminous silver light on the water, the mist and the stone, with small warm accents (a candle, a distant lamp) for depth; shadows in lifted deep blue, never pure black, never a flat dark image.
- `forest`: Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated.
- `forest-autumn`: Dominant tone: natural amber, russet and gold foliage with a few soft greens; warm and cozy, not saturated.
- `study`: Dominant tone: cream, ivory, natural wood and linen in soft morning light; bright and welcoming.
- `store`: Dominant tone: sand, cream and soft sage green, with warm side light and natural soft shadows.
- `gathering`: Dominant tone: warm honey and clay in soft golden indoor light; human warmth with nobody in the frame.
- `marisol`: Dominant tone: warm ivory, honey and soft gold in luminous daylight; personal and bright.

**Reglas de las atmósferas**

- Una atmósfera comparte con la noche el lenguaje, no el etalonaje: fine-art cinematográfico, bruma suave, mate, sin neón, sin texto ni personas. El color es el natural de la escena, contenido; no se tiñe de marino ni de dorado.
- Los colores van por nombre (terracota, coral, ámbar, azul cielo, marfil, arena, crema, verde salvia), nunca con los hex de la paleta nocturna: la paleta definitiva de cada atmósfera se calibra contra la fotografía.
- Rojo del atardecer: reflejos rojizos y ámbar sobre el agua, nunca un rojo intenso ni una luz deslumbrante (decisión abierta D2 del spec: Marisol pide «evitar rojo intenso» y también «el mar real, rojo»).
- Los bordes de la imagen quedan en calma y en el tono base de la escena: el fundido a la atmósfera lo aplica el CSS, no el archivo. Nada nítido ni brillante toca el borde.
- Sin personas: donde Marisol pide gente (encuentros, Sobre Marisol) la imagen generada sólo sugiere presencia (cojines, tazas, una manta) y se sustituye por fotografía real propia.
- Todas son provisionales: se sustituyen por fotografía propia de Marisol o con licencia comercial documentada antes de publicar. Los productos de la tienda no se generan; son fotografía real que hará ella.

**Vocabulario visual** (la imagen es el paisaje; el world engine es su energía)

- **Agua:** Espejo en calma, ondas concéntricas, cimática: la frecuencia hecha visible. Realms: Resonario, Portal, Santuario.
- **Bruma y montaña:** Horizontes, valles, amanecer y niebla: el camino que se abre. Realms: Descúbrete, Experiencias, Acceso, Academia (teal).
- **Cielo cósmico:** Galaxia en espiral o vía láctea baja, sólo en el tercio superior. Realms: Portal, Home, Sobre Marisol.
- **Cuerpo de luz:** Silueta translúcida sin rasgos, bordeada de oro con teal y lavanda por dentro. Realms: Seis slots narrativos y una portada de curso (ver abajo).
- **Filamentos de frecuencia:** Tres líneas verticales ondulantes —oro, teal y lavanda— a baja opacidad. Motivo recurrente, no obligatorio.
- **Slots con cuerpo de luz:** `home.hero`, `discover.tuning`, `discover.result`, `experiences.featured`, `academy.completion`, `sanctuary.hero`, `academy-course-cover-c1`.

**Reglas**

- Sin texto, logos, marcas, nombres de canal ni etiquetas legibles dentro de la imagen: el copy lo pone la web. Única excepción: los productos de la tienda, que se generan adjuntando la foto real del producto y conservan su etiqueta tal como está en ella; el prompt nunca describe ni dicta ese texto.
- Sin rasgos faciales: el cuerpo de luz es una silueta translúcida sin ojos, boca ni nariz, y el único rostro es el retrato real de Marisol. Fuera de esos casos: manos u objetos. Toda figura de cuerpo entero es el cuerpo de luz, nunca una persona real, ni de espaldas. El prompt describe la silueta en positivo (cabeza lisa, sin nariz, labios ni oreja; de espaldas o girada): «faceless» a secas no basta.
- Cielo arriba, materia abajo: el cosmos ocupa como mucho el tercio superior, con estrellas escasas. El world engine ya pinta el campo de estrellas y las partículas; la imagen no los duplica.
- Luz dorada sobre fondo oscuro: los bordes de la imagen tienden a --void para que el scrim de CSS funda sin corte.
- En las imágenes nocturnas, nada de fondos blancos, grises ni pasteles, ni neón ni arcoíris: es un universo nocturno. Oro, teal y lavanda, a baja saturación. Las atmósferas tienen su propio estilo (ver «Estilo de las atmósferas»).
- Filamentos de frecuencia: como máximo tres líneas ondulantes (oro, teal y lavanda), a baja opacidad, nunca un espectro completo. El prompt las cuenta en positivo («exactly three … in total»): los modelos tienden a duplicarlas.
- Anillos y círculos de luz: halo suave y difuso, nunca un tubo de neón fino.
- Sin ADN, cerebros ni anatomía: la energía se sugiere con luz, agua y geometría sagrada, no con ilustración médica.
- Sin stock genérico ni Unsplash. Lo generado es materia de ambiente y dirección de arte, y es provisional: cuando exista el producto físico o la persona real, se sustituye por fotografía propia de Marisol o con licencia comercial documentada (enmienda 2026-10-17).
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
| `resonario-audio-cover-b1.avif` | Resonario · portadas · Pulso sereno | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-b2.avif` | Resonario · portadas · Pulso de raíz | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-n1.avif` | Resonario · portadas · Orilla de mar | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-n2.avif` | Resonario · portadas · Lluvia en la ventana | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-n3.avif` | Resonario · portadas · Canto de aves | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-m1.avif` | Resonario · portadas · Música celta para bajar el ritmo | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-m2.avif` | Resonario · portadas · Piano para la pausa | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-g1.avif` | Resonario · portadas · Respiración guiada | 1:1 | 1024×1024 | P1 | Completadas |
| `resonario-audio-cover-g2.avif` | Resonario · portadas · Un momento para ti | 1:1 | 1024×1024 | P1 | Completadas |
| `academy-hero.avif` | Academia · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-featured-course.avif` | Academia · curso destacado | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-course-cover-c1.avif` | Academia · portadas de curso · El Arte de Volver a Ti | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-course-cover-c2.avif` | Academia · portadas de curso · Rituales Conscientes | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Acompañan | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-lesson-visual.avif` | Academia · lección | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-completion.avif` | Academia · curso completado | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-hero.avif` | Experiencias · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-featured.avif` | Experiencias · destacada | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | 16:9 | 2880×1620 | P1 | No tenidas en cuenta |
| `experiences-visual-e2.avif` | Experiencias · filas · Círculo de Luna Nueva | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-visual-e3.avif` | Experiencias · filas · Ritual de Aromas | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-visual-e4.avif` | Experiencias · filas · Meditación al Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `booking-hero.avif` | Reserva · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `booking-confirmation.avif` | Reserva · confirmación | 16:8 | 2880×1440 | P1 | Completadas |
| `store-hero.avif` | Tienda · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `store-product-visual-p1.avif` | Tienda · productos · Aceite Esencial · Cedro Sagrado | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p2.avif` | Tienda · productos · Vela Ritual · Luz de Vela | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p3.avif` | Tienda · productos · Cuarzo de Serenidad | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p4.avif` | Tienda · productos · Bruma de Enraizamiento | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p5.avif` | Tienda · productos · Incienso · Bosque de Copal | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p6.avif` | Tienda · productos · Sal de Baño · Luna Llena | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p7.avif` | Tienda · productos · Infusión · Calma de Cedro | 1:1 | 1024×1024 | P1 | Completadas |
| `store-product-visual-p8.avif` | Tienda · productos · Diario de Frecuencias | 1:1 | 1024×1024 | P1 | Completadas |
| `store-ritual-banner.avif` | Tienda · banner ritual | 16:9 | 2880×1620 | P2 | Completadas |
| `product-detail.avif` | Tienda · detalle | 16:8 | 2880×1440 | P1 | Completadas |
| `product-related.avif` | Tienda · relacionados | 16:8 | 2880×1440 | P2 | Completadas |
| `cart-empty.avif` | Carrito · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `checkout-confirmation.avif` | Compra · confirmación | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-hero.avif` | Mi Santuario · hero | 16:9 | 2880×1620 | P1 | Completadas |
| `sanctuary-continue.avif` | Mi Santuario · continuar | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-daily.avif` | Mi Santuario · práctica diaria | 1:1 | 1024×1024 | P1 | Completadas |
| `sanctuary-journal.avif` | Mi Santuario · diario | 16:8 | 2880×1440 | P2 | Completadas |
| `sanctuary-empty.avif` | Mi Santuario · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `states-loading.avif` | Estados · carga | 16:9 | 2880×1620 | P2 | Completadas |
| `states-empty.avif` | Estados · vacío | 16:9 | 2880×1620 | P2 | Completadas |
| `states-error.avif` | Estados · error | 16:9 | 2880×1620 | P2 | Completadas |
| `states-offline.avif` | Estados · sin conexión | 16:9 | 2880×1620 | P2 | Completadas |
| `atmosphere-forest-autumn.avif` | Atmósfera · Bosque otoñal (nostalgia) | 16:9 | 2880×1620 | P2 | Completadas |
| `resonario-celtic.avif` | Resonario · música de inspiración celta | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-kind-banner-melody.avif` | Resonario · tipo de escucha · Melodías instrumentales | 16:8 | 2880×1440 | P2 | Completadas |
| `resonario-kind-banner-nature.avif` | Resonario · tipo de escucha · Naturaleza | 16:8 | 2880×1440 | P2 | Completadas |
| `resonario-kind-banner-frequency.avif` | Resonario · tipo de escucha · Frecuencias y tonos | 16:8 | 2880×1440 | P2 | Completadas |
| `resonario-kind-banner-binaural.avif` | Resonario · tipo de escucha · Binaurales | 16:8 | 2880×1440 | P2 | Completadas |
| `resonario-kind-banner-guided.avif` | Resonario · tipo de escucha · Prácticas guiadas | 16:8 | 2880×1440 | P2 | Completadas |
| `og-image.jpg` | Metadatos · Open Graph | 1.91:1 | 1200×630 | P0 | Completadas |
| `academy-hero-dawn.avif` | Academia · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `store-hero-dawn.avif` | Tienda · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `about-hero-dawn.avif` | Sobre Marisol · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `portal-hero-dusk.avif` | Portal · umbral · tema · Atardecer | 16:9 | 2880×1620 | P0 | Completadas |
| `portal-hero-dawn.avif` | Portal · umbral · tema · Amanecer | 16:9 | 2880×1620 | P0 | Completadas |
| `portal-hero-forest.avif` | Portal · umbral · tema · Bosque | 16:9 | 2880×1620 | P0 | Completadas |
| `home-hero-dusk.avif` | Home · hero · tema · Atardecer | 16:9 | 2880×1620 | P0 | Completadas |
| `home-hero-dawn.avif` | Home · hero · tema · Amanecer | 16:9 | 2880×1620 | P0 | Completadas |
| `home-hero-forest.avif` | Home · hero · tema · Bosque | 16:9 | 2880×1620 | P0 | Completadas |
| `about-hero-dusk.avif` | Sobre Marisol · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `about-hero-forest.avif` | Sobre Marisol · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `auth-hero-dusk.avif` | Acceso · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `auth-hero-dawn.avif` | Acceso · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `auth-hero-forest.avif` | Acceso · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `discover-hero-dusk.avif` | Descúbrete · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `discover-hero-dawn.avif` | Descúbrete · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `discover-hero-forest.avif` | Descúbrete · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-hero-dusk.avif` | Academia · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-hero-forest.avif` | Academia · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-hero-dusk.avif` | Experiencias · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-hero-dawn.avif` | Experiencias · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-hero-forest.avif` | Experiencias · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `booking-hero-dusk.avif` | Reserva · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `booking-hero-dawn.avif` | Reserva · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `booking-hero-forest.avif` | Reserva · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `store-hero-dusk.avif` | Tienda · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `store-hero-forest.avif` | Tienda · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `sanctuary-hero-dusk.avif` | Mi Santuario · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `sanctuary-hero-dawn.avif` | Mi Santuario · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `sanctuary-hero-forest.avif` | Mi Santuario · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `home-daily-frequency-dawn.avif` | Home · frecuencia del día · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `home-realms-banner-dawn.avif` | Home · banner de realms · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `home-footer-banner-dawn.avif` | Home · cierre · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `home-membership-dawn.avif` | Home · membresía · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `about-angels-dawn.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `auth-form-atmosphere-dawn.avif` | Acceso · formulario · tema · Amanecer | 3:4 | 1440×1920 | P2 | Completadas |
| `discover-question-atmosphere-dawn.avif` | Descúbrete · pregunta · tema · Amanecer | 3:4 | 1440×1920 | P2 | Completadas |
| `resonario-featured-dawn.avif` | Resonario · destacado · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `resonario-archive-banner-dawn.avif` | Resonario · archivo · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `academy-featured-course-dawn.avif` | Academia · curso destacado · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-featured-dawn.avif` | Experiencias · destacada · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `store-ritual-banner-dawn.avif` | Tienda · banner ritual · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `home-daily-frequency-dusk.avif` | Home · frecuencia del día · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `home-daily-frequency-forest.avif` | Home · frecuencia del día · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `home-realms-banner-dusk.avif` | Home · banner de realms · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `home-realms-banner-forest.avif` | Home · banner de realms · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `home-footer-banner-dusk.avif` | Home · cierre · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `home-footer-banner-forest.avif` | Home · cierre · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `home-membership-dusk.avif` | Home · membresía · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `home-membership-forest.avif` | Home · membresía · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `about-angels-dusk.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `about-angels-forest.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `auth-form-atmosphere-dusk.avif` | Acceso · formulario · tema · Atardecer | 3:4 | 1440×1920 | P2 | Completadas |
| `auth-form-atmosphere-forest.avif` | Acceso · formulario · tema · Bosque | 3:4 | 1440×1920 | P2 | Completadas |
| `discover-question-atmosphere-dusk.avif` | Descúbrete · pregunta · tema · Atardecer | 3:4 | 1440×1920 | P2 | Completadas |
| `discover-question-atmosphere-forest.avif` | Descúbrete · pregunta · tema · Bosque | 3:4 | 1440×1920 | P2 | Completadas |
| `resonario-featured-dusk.avif` | Resonario · destacado · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `resonario-featured-forest.avif` | Resonario · destacado · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `resonario-archive-banner-dusk.avif` | Resonario · archivo · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `resonario-archive-banner-forest.avif` | Resonario · archivo · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `academy-featured-course-dusk.avif` | Academia · curso destacado · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-featured-course-forest.avif` | Academia · curso destacado · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `academy-completion-forest.avif` | Academia · curso completado · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-featured-dusk.avif` | Experiencias · destacada · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `experiences-featured-forest.avif` | Experiencias · destacada · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `booking-confirmation-dusk.avif` | Reserva · confirmación · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `store-ritual-banner-dusk.avif` | Tienda · banner ritual · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `store-ritual-banner-forest.avif` | Tienda · banner ritual · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `states-loading-dawn.avif` | Estados · carga · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-loading-dusk.avif` | Estados · carga · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-loading-forest.avif` | Estados · carga · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `states-empty-dawn.avif` | Estados · vacío · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-empty-dusk.avif` | Estados · vacío · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-empty-forest.avif` | Estados · vacío · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `states-error-dawn.avif` | Estados · error · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-error-dusk.avif` | Estados · error · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-error-forest.avif` | Estados · error · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `states-offline-dawn.avif` | Estados · sin conexión · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-offline-dusk.avif` | Estados · sin conexión · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `states-offline-forest.avif` | Estados · sin conexión · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `sanctuary-continue-dawn.avif` | Mi Santuario · continuar · tema · Amanecer | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-continue-dusk.avif` | Mi Santuario · continuar · tema · Atardecer | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-continue-forest.avif` | Mi Santuario · continuar · tema · Bosque | 16:8 | 2880×1440 | P1 | Completadas |
| `sanctuary-daily-dawn.avif` | Mi Santuario · práctica diaria · tema · Amanecer | 1:1 | 1024×1024 | P1 | Completadas |
| `sanctuary-daily-dusk.avif` | Mi Santuario · práctica diaria · tema · Atardecer | 1:1 | 1024×1024 | P1 | Completadas |
| `sanctuary-daily-forest.avif` | Mi Santuario · práctica diaria · tema · Bosque | 1:1 | 1024×1024 | P1 | Completadas |
| `sanctuary-journal-dawn.avif` | Mi Santuario · diario · tema · Amanecer | 16:8 | 2880×1440 | P2 | Completadas |
| `sanctuary-journal-dusk.avif` | Mi Santuario · diario · tema · Atardecer | 16:8 | 2880×1440 | P2 | Completadas |
| `sanctuary-journal-forest.avif` | Mi Santuario · diario · tema · Bosque | 16:8 | 2880×1440 | P2 | Completadas |
| `sanctuary-empty-dawn.avif` | Mi Santuario · vacío · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `sanctuary-empty-dusk.avif` | Mi Santuario · vacío · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `sanctuary-empty-forest.avif` | Mi Santuario · vacío · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `cart-empty-dawn.avif` | Carrito · vacío · tema · Amanecer | 16:9 | 2880×1620 | P2 | Completadas |
| `cart-empty-dusk.avif` | Carrito · vacío · tema · Atardecer | 16:9 | 2880×1620 | P2 | Completadas |
| `cart-empty-forest.avif` | Carrito · vacío · tema · Bosque | 16:9 | 2880×1620 | P2 | Completadas |
| `checkout-confirmation-dawn.avif` | Compra · confirmación · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `checkout-confirmation-dusk.avif` | Compra · confirmación · tema · Atardecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `checkout-confirmation-forest.avif` | Compra · confirmación · tema · Bosque | 16:8 | 2880×1440 | P1 | Faltantes |
| `discover-tuning-dawn.avif` | Descúbrete · afinación · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `discover-tuning-dusk.avif` | Descúbrete · afinación · tema · Atardecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `discover-tuning-forest.avif` | Descúbrete · afinación · tema · Bosque | 16:8 | 2880×1440 | P1 | Faltantes |
| `discover-tuning-moon.avif` | Descúbrete · afinación · tema · Luna | 16:8 | 2880×1440 | P1 | Faltantes |
| `discover-result-dawn.avif` | Descúbrete · resultado · tema · Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `discover-result-dusk.avif` | Descúbrete · resultado · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `discover-result-forest.avif` | Descúbrete · resultado · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `discover-result-moon.avif` | Descúbrete · resultado · tema · Luna | 16:9 | 2880×1620 | P1 | Faltantes |
| `booking-confirmation-dawn.avif` | Reserva · confirmación · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `academy-completion-dawn.avif` | Academia · curso completado · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `portal-hero-moon.avif` | Portal · umbral · tema · Luna | 16:9 | 2880×1620 | P0 | Completadas |
| `home-hero-moon.avif` | Home · hero · tema · Luna | 16:9 | 2880×1620 | P0 | Completadas |
| `resonario-hero-moon.avif` | Resonario · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `about-hero-moon.avif` | Sobre Marisol · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `auth-hero-moon.avif` | Acceso · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `discover-hero-moon.avif` | Descúbrete · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-hero-moon.avif` | Academia · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-hero-moon.avif` | Experiencias · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `booking-hero-moon.avif` | Reserva · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `store-hero-moon.avif` | Tienda · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `sanctuary-hero-moon.avif` | Mi Santuario · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero-dusk.avif` | Resonario · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero-dawn.avif` | Resonario · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero-forest.avif` | Resonario · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |

## 5. Estado de las imágenes

Cada imagen está en una sola sección. El estado se mantiene en `Branding/src/data/photography-status.js`.

**Nota general sobre tamaños:** las imágenes entregadas llegan a 1672 px de ancho en 16:9, 1774 px en 2:1 y 1086 px en 3:4, por debajo del «generar a» de su preset (2048, 2048 y 1536 px); las cuadradas (1254 px) lo superan. No se trata como desviación individual.

### 5.1 A corregir por desviación de la IA (0)

Entregadas, pero desviadas del brief o de su prompt. Van de más a menos urgente: primero la gravedad y, a igual gravedad, la prioridad de la vista (P0 → P2). La gravedad es criterio visual, y la baja no justifica regenerar salvo que se vea mal en pantalla. Cada entrada dice qué parte del prompt falló según el resultado y trae ya el prompt con ese punto reforzado, listo para regenerarla.

Ninguna.

### 5.2 Faltantes (13)

Aún no entregadas. La vista de cada una ya está preparada, salvo donde la nota indica lo contrario. Cada entrada trae su prompt.

#### `checkout.confirmation · Amanecer` — Compra · confirmación · tema · P1

- **Archivo:** `checkout-confirmation-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Amanecer de `checkout.confirmation`: la misma vista y el mismo encuadre, con la escena del tema. La compra confirmada con la materia del ritual.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, soft morning light from a window on a pale wooden surface, no writing on the wrapping. Parcel centered, pale wooden surface, a soft warm glow, calm empty bright space above it because content is laid over that area later. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `checkout.confirmation · Atardecer` — Compra · confirmación · tema · P1

- **Archivo:** `checkout-confirmation-dusk.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Atardecer de `checkout.confirmation`: la misma vista y el mismo encuadre, con la escena del tema. La compra confirmada con la materia del ritual.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, warm amber candlelight on a dark wooden surface, no writing on the wrapping. Parcel centered, dark wooden surface, a soft warm glow, calm empty deep space above it because content is laid over that area later. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `checkout.confirmation · Bosque` — Compra · confirmación · tema · P1

- **Archivo:** `checkout-confirmation-forest.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Bosque de `checkout.confirmation`: la misma vista y el mismo encuadre, con la escena del tema. La compra confirmada con la materia del ritual.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, soft filtered golden-green light on a dark mossy wooden surface, no writing on the wrapping. Parcel centered, dark mossy wooden surface, a soft warm glow, calm empty deep green space above it because content is laid over that area later. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.tuning · Amanecer` — Descúbrete · afinación · tema · P1

- **Archivo:** `discover-tuning-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Variante del tema Amanecer de `discover.tuning`: la misma vista y el mismo encuadre, con la escena del tema. El momento de la afinación personal: la materia que sintoniza. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Tuning in at sunrise: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated at the edge of pale still water and seen from behind, head slightly bowed, edged in pale gold so it reads against the bright water, as a halo of pale golden ripples spreads across the surface toward it from a single struck point, soft sky-blue reflections in the water, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the ripples, and no other vertical lines anywhere. Figure centered, ripples fanning left and right across the wide frame, soft pale edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.tuning · Atardecer` — Descúbrete · afinación · tema · P1

- **Archivo:** `discover-tuning-dusk.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Variante del tema Atardecer de `discover.tuning`: la misma vista y el mismo encuadre, con la escena del tema. El momento de la afinación personal: la materia que sintoniza. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Tuning in at dusk: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated at the edge of dark still water and seen from behind, head slightly bowed, edged in warm amber so it reads against the deep water, as a halo of warm amber ripples spreads across the surface toward it from a single struck point, soft rose and coral reflections in the water, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the ripples, and no other vertical lines anywhere. Figure centered, ripples fanning left and right across the wide frame, deep calm edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.tuning · Bosque` — Descúbrete · afinación · tema · P1

- **Archivo:** `discover-tuning-forest.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Variante del tema Bosque de `discover.tuning`: la misma vista y el mismo encuadre, con la escena del tema. El momento de la afinación personal: la materia que sintoniza. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Tuning in in the forest: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated at the edge of a still forest pool and seen from behind, head slightly bowed, edged in warm golden-green light so it reads against the deep water, as a halo of golden-green ripples spreads across the surface toward it from a single struck point, soft green reflections in the water, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the ripples, and no other vertical lines anywhere, a few fireflies above the surface. Figure centered, ripples fanning left and right across the wide frame, deep green calm edges, ferns only in the outer corners. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.tuning · Luna` — Descúbrete · afinación · tema · P1

- **Archivo:** `discover-tuning-moon.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Variante del tema Luna de `discover.tuning`: la misma vista y el mismo encuadre, con la escena del tema. El momento de la afinación personal: la materia que sintoniza. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Tuning in under the moon: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated at the edge of dark still water and seen from behind, head slightly bowed, edged in cool silver so it reads against the dark water, as a halo of silver ripples spreads across the surface toward it from a single struck point, soft deep-blue reflections in the water, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the ripples, and no other vertical lines anywhere, a few dozen fine pinpoint stars above. Figure centered, ripples fanning left and right across the wide frame, deep blue calm edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: cool silver-blue moonlight over a night of deep teal-blue, the whole scene clearly lit and readable by a soft luminous silver light on the water, the mist and the stone, with small warm accents (a candle, a distant lamp) for depth; shadows in lifted deep blue, never pure black, never a flat dark image. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.result · Amanecer` — Descúbrete · resultado · tema · P1

- **Archivo:** `discover-result-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Amanecer de `discover.result`: la misma vista y el mismo encuadre, con la escena del tema. El resultado del quiz como revelación visual. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Revelation at sunrise: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, standing upright with open arms at the edge of pale still water, seen from behind facing the horizon, a single narrow beam of pale gold light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, pale gold, with no split and no colored bands, the body warm ivory-gold with only a very faint sky-blue and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single pale gold column, a moment of clarity. The horizon line sits high, at 30% of the frame height, so the wide still water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm pale mist and still water with nothing bright, for the result text. Wide landscape framing. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.result · Atardecer` — Descúbrete · resultado · tema · P1

- **Archivo:** `discover-result-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Atardecer de `discover.result`: la misma vista y el mismo encuadre, con la escena del tema. El resultado del quiz como revelación visual. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Revelation at dusk: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single narrow beam of warm amber light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, warm amber, with no split and no colored bands, the body warm amber-white with only a very faint rose and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single warm amber column, a moment of clarity. The horizon line sits high, at 30% of the frame height, so the wide dark water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark mist and still water with nothing bright, for the result text. Wide landscape framing. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.result · Bosque` — Descúbrete · resultado · tema · P1

- **Archivo:** `discover-result-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Bosque de `discover.result`: la misma vista y el mismo encuadre, con la escena del tema. El resultado del quiz como revelación visual. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Revelation in the forest: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, standing upright with open arms at the edge of a still forest pool, seen from behind facing the far shore, a single narrow beam of warm golden-green light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, warm golden-green, with no split and no colored bands, the body warm gold-white with only a very faint green and teal tint inside it, never iridescent and never pastel, and its reflection on the water a single warm golden column, a moment of clarity, a few fireflies rising. The far shore line sits high, at 30% of the frame height, so the wide dark still water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the shore; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark green mist and still water with nothing bright, for the result text. Wide landscape framing. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.result · Luna` — Descúbrete · resultado · tema · P1

- **Archivo:** `discover-result-moon.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Luna de `discover.result`: la misma vista y el mismo encuadre, con la escena del tema. El resultado del quiz como revelación visual. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Revelation under the moon: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single narrow beam of cool silver light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, silver, with no split and no colored bands, the body cool silver-white with only a very faint teal and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single silver column, a moment of clarity, a few dozen fine pinpoint stars above. The horizon line sits high, at 30% of the frame height, so the wide dark water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark blue mist and still water with nothing bright, for the result text. Wide landscape framing. Dominant tone: cool silver-blue moonlight over a night of deep teal-blue, the whole scene clearly lit and readable by a soft luminous silver light on the water, the mist and the stone, with small warm accents (a candle, a distant lamp) for depth; shadows in lifted deep blue, never pure black, never a flat dark image. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `booking.confirmation · Amanecer` — Reserva · confirmación · tema · P1

- **Archivo:** `booking-confirmation-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Amanecer de `booking.confirmation`: la misma vista y el mismo encuadre, con la escena del tema. Confirmación con la materia del lugar: el sí con imagen.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The same serene place now with its candles lit in the morning: a pale wooden deck over a mirror-calm lake, floor cushions in a circle with a small warm candle glow among them in the soft morning light, reflected in the still water, a steaming cup set beside them, a soft peach light on the horizon. Warm center, soft pale edges, calm space in the middle because content is laid over it later. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `academy.completion · Amanecer` — Academia · curso completado · tema · P1

- **Archivo:** `academy-completion-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Amanecer de `academy.completion`: la misma vista y el mismo encuadre, con la escena del tema. Celebración del curso terminado: el logro con luz. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A completed cycle closed in light at sunrise: a ring of exactly twelve small golden lights, evenly spaced and with no other lights, floating on pale still water seen from a slightly oblique overhead angle, each one a small warm point with a soft ring of light around it so it reads on the bright water, a small abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated cross-legged just outside the far side of the ring, never counted as one of the twelve, every light steady and one slightly brighter, concentric ripples radiating outward from the ring only. Ring centered at 50% horizontal, its middle empty, pale and perfectly still water because content is laid over it later, count the lights: twelve around the ring and the figure beyond them, the ripples spreading outward from the ring only, the small figure no taller than 12% of the frame height at the far edge of the ring at 50% horizontal and 30% vertical, nothing but soft pale mist and water around. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

### 5.3 Por cablear (crear vistas) (0)

Entregadas, pero sin slot en el registro (`frontend/src/config/editorial-media.ts`) ni pantalla que las pinte. Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.

Ninguna.

### 5.4 No tenidas en cuenta (1)

Publicadas, pero ninguna vista las pinta con el diseño actual.

| Archivo | Vista | Por qué |
|---|---|---|
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | `e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla. |

### 5.5 Completadas (190)

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
| `resonario-audio-cover-b1.avif` | Resonario · portadas · Pulso sereno | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-b2.avif` | Resonario · portadas · Pulso de raíz | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-n1.avif` | Resonario · portadas · Orilla de mar | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-n2.avif` | Resonario · portadas · Lluvia en la ventana | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-n3.avif` | Resonario · portadas · Canto de aves | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-m1.avif` | Resonario · portadas · Música celta para bajar el ritmo | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-m2.avif` | Resonario · portadas · Piano para la pausa | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-g1.avif` | Resonario · portadas · Respiración guiada | `resonario.audio-cover.*` | 1:1 | P1 |
| `resonario-audio-cover-g2.avif` | Resonario · portadas · Un momento para ti | `resonario.audio-cover.*` | 1:1 | P1 |
| `academy-hero.avif` | Academia · hero | `academy.hero` | 16:9 | P1 |
| `academy-featured-course.avif` | Academia · curso destacado | `academy.featured-course` | 16:8 | P1 |
| `academy-course-cover-c1.avif` | Academia · portadas de curso · El Arte de Volver a Ti | `academy-course-cover` | 16:8 | P1 |
| `academy-course-cover-c2.avif` | Academia · portadas de curso · Rituales Conscientes | `academy-course-cover` | 16:8 | P1 |
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Acompañan | `academy-course-cover` | 16:8 | P1 |
| `academy-lesson-visual.avif` | Academia · lección | `academy-lesson-visual` | 16:8 | P1 |
| `academy-completion.avif` | Academia · curso completado | `academy.completion` | 16:8 | P1 |
| `experiences-hero.avif` | Experiencias · hero | `experiences.hero` | 16:9 | P1 |
| `experiences-featured.avif` | Experiencias · destacada | `experiences.featured` | 16:8 | P1 |
| `experiences-visual-e2.avif` | Experiencias · filas · Círculo de Luna Nueva | `experiences-visual` | 16:9 | P1 |
| `experiences-visual-e3.avif` | Experiencias · filas · Ritual de Aromas | `experiences-visual` | 16:9 | P1 |
| `experiences-visual-e4.avif` | Experiencias · filas · Meditación al Amanecer | `experiences-visual` | 16:9 | P1 |
| `booking-hero.avif` | Reserva · hero | `booking.hero` | 16:9 | P1 |
| `booking-confirmation.avif` | Reserva · confirmación | `booking.confirmation` | 16:8 | P1 |
| `store-hero.avif` | Tienda · hero | `store.hero` | 16:9 | P1 |
| `store-product-visual-p1.avif` | Tienda · productos · Aceite Esencial · Cedro Sagrado | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p2.avif` | Tienda · productos · Vela Ritual · Luz de Vela | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p3.avif` | Tienda · productos · Cuarzo de Serenidad | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p4.avif` | Tienda · productos · Bruma de Enraizamiento | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p5.avif` | Tienda · productos · Incienso · Bosque de Copal | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p6.avif` | Tienda · productos · Sal de Baño · Luna Llena | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p7.avif` | Tienda · productos · Infusión · Calma de Cedro | `store-product-visual` | 1:1 | P1 |
| `store-product-visual-p8.avif` | Tienda · productos · Diario de Frecuencias | `store-product-visual` | 1:1 | P1 |
| `store-ritual-banner.avif` | Tienda · banner ritual | `store.ritual-banner` | 16:9 | P2 |
| `product-detail.avif` | Tienda · detalle | `product.detail` | 16:8 | P1 |
| `product-related.avif` | Tienda · relacionados | `product.related` | 16:8 | P2 |
| `cart-empty.avif` | Carrito · vacío | `cart.empty` | 16:9 | P2 |
| `checkout-confirmation.avif` | Compra · confirmación | `checkout.confirmation` | 16:8 | P1 |
| `sanctuary-hero.avif` | Mi Santuario · hero | `sanctuary.hero` | 16:9 | P1 |
| `sanctuary-continue.avif` | Mi Santuario · continuar | `sanctuary.continue` | 16:8 | P1 |
| `sanctuary-daily.avif` | Mi Santuario · práctica diaria | `sanctuary.daily` | 1:1 | P1 |
| `sanctuary-journal.avif` | Mi Santuario · diario | `sanctuary.journal` | 16:8 | P2 |
| `sanctuary-empty.avif` | Mi Santuario · vacío | `sanctuary.empty` | 16:9 | P2 |
| `states-loading.avif` | Estados · carga | `states.loading` | 16:9 | P2 |
| `states-empty.avif` | Estados · vacío | `states.empty` | 16:9 | P2 |
| `states-error.avif` | Estados · error | `states.error` | 16:9 | P2 |
| `states-offline.avif` | Estados · sin conexión | `states.offline` | 16:9 | P2 |
| `atmosphere-forest-autumn.avif` | Atmósfera · Bosque otoñal (nostalgia) | `atmosphere.forest-autumn` | 16:9 | P2 |
| `resonario-celtic.avif` | Resonario · música de inspiración celta | `resonario.celtic` | 16:9 | P1 |
| `resonario-kind-banner-melody.avif` | Resonario · tipo de escucha · Melodías instrumentales | `resonario.kind-banner.*` | 16:8 | P2 |
| `resonario-kind-banner-nature.avif` | Resonario · tipo de escucha · Naturaleza | `resonario.kind-banner.*` | 16:8 | P2 |
| `resonario-kind-banner-frequency.avif` | Resonario · tipo de escucha · Frecuencias y tonos | `resonario.kind-banner.*` | 16:8 | P2 |
| `resonario-kind-banner-binaural.avif` | Resonario · tipo de escucha · Binaurales | `resonario.kind-banner.*` | 16:8 | P2 |
| `resonario-kind-banner-guided.avif` | Resonario · tipo de escucha · Prácticas guiadas | `resonario.kind-banner.*` | 16:8 | P2 |
| `og-image.jpg` | Metadatos · Open Graph | `og-image` | 1.91:1 | P0 |
| `academy-hero-dawn.avif` | Academia · hero · tema · Amanecer | `academy.hero` | 16:9 | P1 |
| `store-hero-dawn.avif` | Tienda · hero · tema · Amanecer | `store.hero` | 16:9 | P1 |
| `about-hero-dawn.avif` | Sobre Marisol · hero · tema · Amanecer | `about.hero` | 16:9 | P1 |
| `portal-hero-dusk.avif` | Portal · umbral · tema · Atardecer | `portal.hero` | 16:9 | P0 |
| `portal-hero-dawn.avif` | Portal · umbral · tema · Amanecer | `portal.hero` | 16:9 | P0 |
| `portal-hero-forest.avif` | Portal · umbral · tema · Bosque | `portal.hero` | 16:9 | P0 |
| `home-hero-dusk.avif` | Home · hero · tema · Atardecer | `home.hero` | 16:9 | P0 |
| `home-hero-dawn.avif` | Home · hero · tema · Amanecer | `home.hero` | 16:9 | P0 |
| `home-hero-forest.avif` | Home · hero · tema · Bosque | `home.hero` | 16:9 | P0 |
| `about-hero-dusk.avif` | Sobre Marisol · hero · tema · Atardecer | `about.hero` | 16:9 | P1 |
| `about-hero-forest.avif` | Sobre Marisol · hero · tema · Bosque | `about.hero` | 16:9 | P1 |
| `auth-hero-dusk.avif` | Acceso · hero · tema · Atardecer | `auth.hero` | 16:9 | P1 |
| `auth-hero-dawn.avif` | Acceso · hero · tema · Amanecer | `auth.hero` | 16:9 | P1 |
| `auth-hero-forest.avif` | Acceso · hero · tema · Bosque | `auth.hero` | 16:9 | P1 |
| `discover-hero-dusk.avif` | Descúbrete · hero · tema · Atardecer | `discover.hero` | 16:9 | P1 |
| `discover-hero-dawn.avif` | Descúbrete · hero · tema · Amanecer | `discover.hero` | 16:9 | P1 |
| `discover-hero-forest.avif` | Descúbrete · hero · tema · Bosque | `discover.hero` | 16:9 | P1 |
| `academy-hero-dusk.avif` | Academia · hero · tema · Atardecer | `academy.hero` | 16:9 | P1 |
| `academy-hero-forest.avif` | Academia · hero · tema · Bosque | `academy.hero` | 16:9 | P1 |
| `experiences-hero-dusk.avif` | Experiencias · hero · tema · Atardecer | `experiences.hero` | 16:9 | P1 |
| `experiences-hero-dawn.avif` | Experiencias · hero · tema · Amanecer | `experiences.hero` | 16:9 | P1 |
| `experiences-hero-forest.avif` | Experiencias · hero · tema · Bosque | `experiences.hero` | 16:9 | P1 |
| `booking-hero-dusk.avif` | Reserva · hero · tema · Atardecer | `booking.hero` | 16:9 | P1 |
| `booking-hero-dawn.avif` | Reserva · hero · tema · Amanecer | `booking.hero` | 16:9 | P1 |
| `booking-hero-forest.avif` | Reserva · hero · tema · Bosque | `booking.hero` | 16:9 | P1 |
| `store-hero-dusk.avif` | Tienda · hero · tema · Atardecer | `store.hero` | 16:9 | P1 |
| `store-hero-forest.avif` | Tienda · hero · tema · Bosque | `store.hero` | 16:9 | P1 |
| `sanctuary-hero-dusk.avif` | Mi Santuario · hero · tema · Atardecer | `sanctuary.hero` | 16:9 | P1 |
| `sanctuary-hero-dawn.avif` | Mi Santuario · hero · tema · Amanecer | `sanctuary.hero` | 16:9 | P1 |
| `sanctuary-hero-forest.avif` | Mi Santuario · hero · tema · Bosque | `sanctuary.hero` | 16:9 | P1 |
| `home-daily-frequency-dawn.avif` | Home · frecuencia del día · tema · Amanecer | `home.daily-frequency` | 16:8 | P1 |
| `home-realms-banner-dawn.avif` | Home · banner de realms · tema · Amanecer | `home.realms-banner` | 16:8 | P1 |
| `home-footer-banner-dawn.avif` | Home · cierre · tema · Amanecer | `home.footer-banner` | 16:9 | P2 |
| `home-membership-dawn.avif` | Home · membresía · tema · Amanecer | `home-membership` | 16:9 | P2 |
| `about-angels-dawn.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Amanecer | `about.angels` | 16:8 | P1 |
| `auth-form-atmosphere-dawn.avif` | Acceso · formulario · tema · Amanecer | `auth.form-atmosphere` | 3:4 | P2 |
| `discover-question-atmosphere-dawn.avif` | Descúbrete · pregunta · tema · Amanecer | `discover.question-atmosphere` | 3:4 | P2 |
| `resonario-featured-dawn.avif` | Resonario · destacado · tema · Amanecer | `resonario.featured` | 16:8 | P1 |
| `resonario-archive-banner-dawn.avif` | Resonario · archivo · tema · Amanecer | `resonario.archive-banner` | 16:9 | P2 |
| `academy-featured-course-dawn.avif` | Academia · curso destacado · tema · Amanecer | `academy.featured-course` | 16:8 | P1 |
| `experiences-featured-dawn.avif` | Experiencias · destacada · tema · Amanecer | `experiences.featured` | 16:8 | P1 |
| `store-ritual-banner-dawn.avif` | Tienda · banner ritual · tema · Amanecer | `store.ritual-banner` | 16:9 | P2 |
| `home-daily-frequency-dusk.avif` | Home · frecuencia del día · tema · Atardecer | `home.daily-frequency` | 16:8 | P1 |
| `home-daily-frequency-forest.avif` | Home · frecuencia del día · tema · Bosque | `home.daily-frequency` | 16:8 | P1 |
| `home-realms-banner-dusk.avif` | Home · banner de realms · tema · Atardecer | `home.realms-banner` | 16:8 | P1 |
| `home-realms-banner-forest.avif` | Home · banner de realms · tema · Bosque | `home.realms-banner` | 16:8 | P1 |
| `home-footer-banner-dusk.avif` | Home · cierre · tema · Atardecer | `home.footer-banner` | 16:9 | P2 |
| `home-footer-banner-forest.avif` | Home · cierre · tema · Bosque | `home.footer-banner` | 16:9 | P2 |
| `home-membership-dusk.avif` | Home · membresía · tema · Atardecer | `home-membership` | 16:9 | P2 |
| `home-membership-forest.avif` | Home · membresía · tema · Bosque | `home-membership` | 16:9 | P2 |
| `about-angels-dusk.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Atardecer | `about.angels` | 16:8 | P1 |
| `about-angels-forest.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Bosque | `about.angels` | 16:8 | P1 |
| `auth-form-atmosphere-dusk.avif` | Acceso · formulario · tema · Atardecer | `auth.form-atmosphere` | 3:4 | P2 |
| `auth-form-atmosphere-forest.avif` | Acceso · formulario · tema · Bosque | `auth.form-atmosphere` | 3:4 | P2 |
| `discover-question-atmosphere-dusk.avif` | Descúbrete · pregunta · tema · Atardecer | `discover.question-atmosphere` | 3:4 | P2 |
| `discover-question-atmosphere-forest.avif` | Descúbrete · pregunta · tema · Bosque | `discover.question-atmosphere` | 3:4 | P2 |
| `resonario-featured-dusk.avif` | Resonario · destacado · tema · Atardecer | `resonario.featured` | 16:8 | P1 |
| `resonario-featured-forest.avif` | Resonario · destacado · tema · Bosque | `resonario.featured` | 16:8 | P1 |
| `resonario-archive-banner-dusk.avif` | Resonario · archivo · tema · Atardecer | `resonario.archive-banner` | 16:9 | P2 |
| `resonario-archive-banner-forest.avif` | Resonario · archivo · tema · Bosque | `resonario.archive-banner` | 16:9 | P2 |
| `academy-featured-course-dusk.avif` | Academia · curso destacado · tema · Atardecer | `academy.featured-course` | 16:8 | P1 |
| `academy-featured-course-forest.avif` | Academia · curso destacado · tema · Bosque | `academy.featured-course` | 16:8 | P1 |
| `academy-completion-forest.avif` | Academia · curso completado · tema · Bosque | `academy.completion` | 16:8 | P1 |
| `experiences-featured-dusk.avif` | Experiencias · destacada · tema · Atardecer | `experiences.featured` | 16:8 | P1 |
| `experiences-featured-forest.avif` | Experiencias · destacada · tema · Bosque | `experiences.featured` | 16:8 | P1 |
| `booking-confirmation-dusk.avif` | Reserva · confirmación · tema · Atardecer | `booking.confirmation` | 16:8 | P1 |
| `store-ritual-banner-dusk.avif` | Tienda · banner ritual · tema · Atardecer | `store.ritual-banner` | 16:9 | P2 |
| `store-ritual-banner-forest.avif` | Tienda · banner ritual · tema · Bosque | `store.ritual-banner` | 16:9 | P2 |
| `states-loading-dawn.avif` | Estados · carga · tema · Amanecer | `states.loading` | 16:9 | P2 |
| `states-loading-dusk.avif` | Estados · carga · tema · Atardecer | `states.loading` | 16:9 | P2 |
| `states-loading-forest.avif` | Estados · carga · tema · Bosque | `states.loading` | 16:9 | P2 |
| `states-empty-dawn.avif` | Estados · vacío · tema · Amanecer | `states.empty` | 16:9 | P2 |
| `states-empty-dusk.avif` | Estados · vacío · tema · Atardecer | `states.empty` | 16:9 | P2 |
| `states-empty-forest.avif` | Estados · vacío · tema · Bosque | `states.empty` | 16:9 | P2 |
| `states-error-dawn.avif` | Estados · error · tema · Amanecer | `states.error` | 16:9 | P2 |
| `states-error-dusk.avif` | Estados · error · tema · Atardecer | `states.error` | 16:9 | P2 |
| `states-error-forest.avif` | Estados · error · tema · Bosque | `states.error` | 16:9 | P2 |
| `states-offline-dawn.avif` | Estados · sin conexión · tema · Amanecer | `states.offline` | 16:9 | P2 |
| `states-offline-dusk.avif` | Estados · sin conexión · tema · Atardecer | `states.offline` | 16:9 | P2 |
| `states-offline-forest.avif` | Estados · sin conexión · tema · Bosque | `states.offline` | 16:9 | P2 |
| `sanctuary-continue-dawn.avif` | Mi Santuario · continuar · tema · Amanecer | `sanctuary.continue` | 16:8 | P1 |
| `sanctuary-continue-dusk.avif` | Mi Santuario · continuar · tema · Atardecer | `sanctuary.continue` | 16:8 | P1 |
| `sanctuary-continue-forest.avif` | Mi Santuario · continuar · tema · Bosque | `sanctuary.continue` | 16:8 | P1 |
| `sanctuary-daily-dawn.avif` | Mi Santuario · práctica diaria · tema · Amanecer | `sanctuary.daily` | 1:1 | P1 |
| `sanctuary-daily-dusk.avif` | Mi Santuario · práctica diaria · tema · Atardecer | `sanctuary.daily` | 1:1 | P1 |
| `sanctuary-daily-forest.avif` | Mi Santuario · práctica diaria · tema · Bosque | `sanctuary.daily` | 1:1 | P1 |
| `sanctuary-journal-dawn.avif` | Mi Santuario · diario · tema · Amanecer | `sanctuary.journal` | 16:8 | P2 |
| `sanctuary-journal-dusk.avif` | Mi Santuario · diario · tema · Atardecer | `sanctuary.journal` | 16:8 | P2 |
| `sanctuary-journal-forest.avif` | Mi Santuario · diario · tema · Bosque | `sanctuary.journal` | 16:8 | P2 |
| `sanctuary-empty-dawn.avif` | Mi Santuario · vacío · tema · Amanecer | `sanctuary.empty` | 16:9 | P2 |
| `sanctuary-empty-dusk.avif` | Mi Santuario · vacío · tema · Atardecer | `sanctuary.empty` | 16:9 | P2 |
| `sanctuary-empty-forest.avif` | Mi Santuario · vacío · tema · Bosque | `sanctuary.empty` | 16:9 | P2 |
| `cart-empty-dawn.avif` | Carrito · vacío · tema · Amanecer | `cart.empty` | 16:9 | P2 |
| `cart-empty-dusk.avif` | Carrito · vacío · tema · Atardecer | `cart.empty` | 16:9 | P2 |
| `cart-empty-forest.avif` | Carrito · vacío · tema · Bosque | `cart.empty` | 16:9 | P2 |
| `portal-hero-moon.avif` | Portal · umbral · tema · Luna | `portal.hero` | 16:9 | P0 |
| `home-hero-moon.avif` | Home · hero · tema · Luna | `home.hero` | 16:9 | P0 |
| `resonario-hero-moon.avif` | Resonario · hero · tema · Luna | `resonario.hero` | 16:9 | P1 |
| `about-hero-moon.avif` | Sobre Marisol · hero · tema · Luna | `about.hero` | 16:9 | P1 |
| `auth-hero-moon.avif` | Acceso · hero · tema · Luna | `auth.hero` | 16:9 | P1 |
| `discover-hero-moon.avif` | Descúbrete · hero · tema · Luna | `discover.hero` | 16:9 | P1 |
| `academy-hero-moon.avif` | Academia · hero · tema · Luna | `academy.hero` | 16:9 | P1 |
| `experiences-hero-moon.avif` | Experiencias · hero · tema · Luna | `experiences.hero` | 16:9 | P1 |
| `booking-hero-moon.avif` | Reserva · hero · tema · Luna | `booking.hero` | 16:9 | P1 |
| `store-hero-moon.avif` | Tienda · hero · tema · Luna | `store.hero` | 16:9 | P1 |
| `sanctuary-hero-moon.avif` | Mi Santuario · hero · tema · Luna | `sanctuary.hero` | 16:9 | P1 |
| `resonario-hero-dusk.avif` | Resonario · hero · tema · Atardecer | `resonario.hero` | 16:9 | P1 |
| `resonario-hero-dawn.avif` | Resonario · hero · tema · Amanecer | `resonario.hero` | 16:9 | P1 |
| `resonario-hero-forest.avif` | Resonario · hero · tema · Bosque | `resonario.hero` | 16:9 | P1 |

### 5.6 Provisionales: reemplazar antes de publicar (137)

Imágenes generadas que hacen de marco mientras llegan las fotografías reales (propias de Marisol o con licencia comercial documentada). Pueden estar completadas y seguir siendo provisionales: esta lista no es un estado, cruza los de arriba.

| Slot | Vista | Archivos | Qué hacer |
|---|---|---|---|
| `store-product-visual` | Tienda · productos | `store-product-visual-p1.avif`, `store-product-visual-p2.avif`, `store-product-visual-p3.avif`, `store-product-visual-p4.avif`, `store-product-visual-p5.avif`, `store-product-visual-p6.avif`, `store-product-visual-p7.avif`, `store-product-visual-p8.avif` | Pendiente de Marisol: son fotografía real de sus productos y quedan por hacer (envase con etiqueta legible, tamaño o contenido, textura, una imagen en uso). Las ocho publicadas son provisionales; el catálogo real (nombres, tamaños, contenidos) también lo define ella. No se generan imágenes nuevas de producto. |
| `atmosphere.forest-autumn` | Atmósfera · Bosque otoñal (nostalgia) | `atmosphere-forest-autumn.avif` | Sólo si hay material: la variante otoñal es opcional (spec §4.2). Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.celtic` | Resonario · música de inspiración celta | `resonario-celtic.avif` | Imagen de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.kind-banner.*` | Resonario · tipo de escucha | `resonario-kind-banner-melody.avif`, `resonario-kind-banner-nature.avif`, `resonario-kind-banner-frequency.avif`, `resonario-kind-banner-binaural.avif`, `resonario-kind-banner-guided.avif` | Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.hero` | Academia · hero · tema | `academy-hero-dawn.avif`, `academy-hero-dusk.avif`, `academy-hero-forest.avif`, `academy-hero-moon.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `store.hero` | Tienda · hero · tema | `store-hero-dawn.avif`, `store-hero-dusk.avif`, `store-hero-forest.avif`, `store-hero-moon.avif` | Escenario sin producto. La fotografía real de los productos (envases con etiqueta legible, textura, en uso) la hace Marisol; esta imagen se sustituye o se conserva sólo como fondo. |
| `about.hero` | Sobre Marisol · hero · tema | `about-hero-dawn.avif`, `about-hero-dusk.avif`, `about-hero-forest.avif`, `about-hero-moon.avif` | Marco provisional. Sustituir por fotografías y videos reales de Marisol (spec §8). |
| `portal.hero` | Portal · umbral · tema | `portal-hero-dusk.avif`, `portal-hero-dawn.avif`, `portal-hero-forest.avif`, `portal-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.hero` | Home · hero · tema | `home-hero-dusk.avif`, `home-hero-dawn.avif`, `home-hero-forest.avif`, `home-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `auth.hero` | Acceso · hero · tema | `auth-hero-dusk.avif`, `auth-hero-dawn.avif`, `auth-hero-forest.avif`, `auth-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.hero` | Descúbrete · hero · tema | `discover-hero-dusk.avif`, `discover-hero-dawn.avif`, `discover-hero-forest.avif`, `discover-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `experiences.hero` | Experiencias · hero · tema | `experiences-hero-dusk.avif`, `experiences-hero-dawn.avif`, `experiences-hero-forest.avif`, `experiences-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `booking.hero` | Reserva · hero · tema | `booking-hero-dusk.avif`, `booking-hero-dawn.avif`, `booking-hero-forest.avif`, `booking-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.hero` | Mi Santuario · hero · tema | `sanctuary-hero-dusk.avif`, `sanctuary-hero-dawn.avif`, `sanctuary-hero-forest.avif`, `sanctuary-hero-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.daily-frequency` | Home · frecuencia del día · tema | `home-daily-frequency-dawn.avif`, `home-daily-frequency-dusk.avif`, `home-daily-frequency-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.realms-banner` | Home · banner de realms · tema | `home-realms-banner-dawn.avif`, `home-realms-banner-dusk.avif`, `home-realms-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.footer-banner` | Home · cierre · tema | `home-footer-banner-dawn.avif`, `home-footer-banner-dusk.avif`, `home-footer-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home-membership` | Home · membresía · tema | `home-membership-dawn.avif`, `home-membership-dusk.avif`, `home-membership-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `about.angels` | Sobre Marisol · Experiencias con Ángeles · tema | `about-angels-dawn.avif`, `about-angels-dusk.avif`, `about-angels-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `auth.form-atmosphere` | Acceso · formulario · tema | `auth-form-atmosphere-dawn.avif`, `auth-form-atmosphere-dusk.avif`, `auth-form-atmosphere-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.question-atmosphere` | Descúbrete · pregunta · tema | `discover-question-atmosphere-dawn.avif`, `discover-question-atmosphere-dusk.avif`, `discover-question-atmosphere-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.featured` | Resonario · destacado · tema | `resonario-featured-dawn.avif`, `resonario-featured-dusk.avif`, `resonario-featured-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.archive-banner` | Resonario · archivo · tema | `resonario-archive-banner-dawn.avif`, `resonario-archive-banner-dusk.avif`, `resonario-archive-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.featured-course` | Academia · curso destacado · tema | `academy-featured-course-dawn.avif`, `academy-featured-course-dusk.avif`, `academy-featured-course-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `experiences.featured` | Experiencias · destacada · tema | `experiences-featured-dawn.avif`, `experiences-featured-dusk.avif`, `experiences-featured-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `store.ritual-banner` | Tienda · banner ritual · tema | `store-ritual-banner-dawn.avif`, `store-ritual-banner-dusk.avif`, `store-ritual-banner-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.completion` | Academia · curso completado · tema | `academy-completion-forest.avif`, `academy-completion-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `booking.confirmation` | Reserva · confirmación · tema | `booking-confirmation-dusk.avif`, `booking-confirmation-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.loading` | Estados · carga · tema | `states-loading-dawn.avif`, `states-loading-dusk.avif`, `states-loading-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.empty` | Estados · vacío · tema | `states-empty-dawn.avif`, `states-empty-dusk.avif`, `states-empty-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.error` | Estados · error · tema | `states-error-dawn.avif`, `states-error-dusk.avif`, `states-error-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `states.offline` | Estados · sin conexión · tema | `states-offline-dawn.avif`, `states-offline-dusk.avif`, `states-offline-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.continue` | Mi Santuario · continuar · tema | `sanctuary-continue-dawn.avif`, `sanctuary-continue-dusk.avif`, `sanctuary-continue-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.daily` | Mi Santuario · práctica diaria · tema | `sanctuary-daily-dawn.avif`, `sanctuary-daily-dusk.avif`, `sanctuary-daily-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.journal` | Mi Santuario · diario · tema | `sanctuary-journal-dawn.avif`, `sanctuary-journal-dusk.avif`, `sanctuary-journal-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.empty` | Mi Santuario · vacío · tema | `sanctuary-empty-dawn.avif`, `sanctuary-empty-dusk.avif`, `sanctuary-empty-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `cart.empty` | Carrito · vacío · tema | `cart-empty-dawn.avif`, `cart-empty-dusk.avif`, `cart-empty-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `checkout.confirmation` | Compra · confirmación · tema | `checkout-confirmation-dawn.avif`, `checkout-confirmation-dusk.avif`, `checkout-confirmation-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.tuning` | Descúbrete · afinación · tema | `discover-tuning-dawn.avif`, `discover-tuning-dusk.avif`, `discover-tuning-forest.avif`, `discover-tuning-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.result` | Descúbrete · resultado · tema | `discover-result-dawn.avif`, `discover-result-dusk.avif`, `discover-result-forest.avif`, `discover-result-moon.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.hero` | Resonario · hero · tema | `resonario-hero-moon.avif`, `resonario-hero-dusk.avif`, `resonario-hero-dawn.avif`, `resonario-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |

# Brief fotográfico — Frecuencia Mágica

> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.
> El estado de cada imagen (a corregir, faltante, por cablear…) vive en `Branding/src/data/photography-status.js`; un test lo cruza con lo publicado.
> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.
> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.
> Enmienda 2026-10-17 (`docs/superpowers/specs/2026-10-17-ambientes-v2-design.md`): además de la noche hay atmósferas con paisajes de color natural y escenas claras. Tienen estilo propio (sección 2) y son provisionales (sección 5.6).

**128 imágenes** (50 slots registrados, varios por instancia; 1 fuera del registro): P0 10 · P1 91 · P2 27. 1 requiere sesión real (retrato de Marisol).

**Estado:** 89 completadas · 0 a corregir · 38 faltantes · 0 por cablear · 1 no tenidas en cuenta. Ver la sección 5.

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
- `moon`: Dominant tone: deep night blue and cool silver with soft silver moonlight; shadows in deep blue, never pure black.
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
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Sanan | 16:8 | 2880×1440 | P1 | Completadas |
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
| `resonario-hero-dusk.avif` | Resonario · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero-dawn.avif` | Resonario · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero-moon.avif` | Resonario · hero · tema · Luna | 16:9 | 2880×1620 | P1 | Completadas |
| `resonario-hero-forest.avif` | Resonario · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Completadas |
| `academy-hero-dawn.avif` | Academia · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `store-hero-dawn.avif` | Tienda · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `experiences-hero-dusk.avif` | Experiencias · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Completadas |
| `about-hero-dawn.avif` | Sobre Marisol · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Completadas |
| `portal-hero-dusk.avif` | Portal · umbral · tema · Atardecer | 16:9 | 2880×1620 | P0 | Faltantes |
| `portal-hero-dawn.avif` | Portal · umbral · tema · Amanecer | 16:9 | 2880×1620 | P0 | Faltantes |
| `portal-hero-forest.avif` | Portal · umbral · tema · Bosque | 16:9 | 2880×1620 | P0 | Faltantes |
| `home-hero-dusk.avif` | Home · hero · tema · Atardecer | 16:9 | 2880×1620 | P0 | Faltantes |
| `home-hero-dawn.avif` | Home · hero · tema · Amanecer | 16:9 | 2880×1620 | P0 | Faltantes |
| `home-hero-forest.avif` | Home · hero · tema · Bosque | 16:9 | 2880×1620 | P0 | Faltantes |
| `about-hero-dusk.avif` | Sobre Marisol · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `about-hero-forest.avif` | Sobre Marisol · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `auth-hero-dusk.avif` | Acceso · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `auth-hero-dawn.avif` | Acceso · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `auth-hero-forest.avif` | Acceso · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `discover-hero-dusk.avif` | Descúbrete · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `discover-hero-dawn.avif` | Descúbrete · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `discover-hero-forest.avif` | Descúbrete · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `academy-hero-dusk.avif` | Academia · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `academy-hero-forest.avif` | Academia · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `experiences-hero-dawn.avif` | Experiencias · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `experiences-hero-forest.avif` | Experiencias · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `booking-hero-dusk.avif` | Reserva · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `booking-hero-dawn.avif` | Reserva · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `booking-hero-forest.avif` | Reserva · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `store-hero-dusk.avif` | Tienda · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `store-hero-forest.avif` | Tienda · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `sanctuary-hero-dusk.avif` | Mi Santuario · hero · tema · Atardecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `sanctuary-hero-dawn.avif` | Mi Santuario · hero · tema · Amanecer | 16:9 | 2880×1620 | P1 | Faltantes |
| `sanctuary-hero-forest.avif` | Mi Santuario · hero · tema · Bosque | 16:9 | 2880×1620 | P1 | Faltantes |
| `home-daily-frequency-dawn.avif` | Home · frecuencia del día · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `home-realms-banner-dawn.avif` | Home · banner de realms · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `home-footer-banner-dawn.avif` | Home · cierre · tema · Amanecer | 16:9 | 2880×1620 | P2 | Faltantes |
| `home-membership-dawn.avif` | Home · membresía · tema · Amanecer | 16:9 | 2880×1620 | P2 | Faltantes |
| `about-angels-dawn.avif` | Sobre Marisol · Experiencias con Ángeles · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `auth-form-atmosphere-dawn.avif` | Acceso · formulario · tema · Amanecer | 3:4 | 1440×1920 | P2 | Faltantes |
| `discover-question-atmosphere-dawn.avif` | Descúbrete · pregunta · tema · Amanecer | 3:4 | 1440×1920 | P2 | Faltantes |
| `resonario-featured-dawn.avif` | Resonario · destacado · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `resonario-archive-banner-dawn.avif` | Resonario · archivo · tema · Amanecer | 16:9 | 2880×1620 | P2 | Faltantes |
| `academy-featured-course-dawn.avif` | Academia · curso destacado · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `experiences-featured-dawn.avif` | Experiencias · destacada · tema · Amanecer | 16:8 | 2880×1440 | P1 | Faltantes |
| `store-ritual-banner-dawn.avif` | Tienda · banner ritual · tema · Amanecer | 16:9 | 2880×1620 | P2 | Faltantes |

## 5. Estado de las imágenes

Cada imagen está en una sola sección. El estado se mantiene en `Branding/src/data/photography-status.js`.

**Nota general sobre tamaños:** las imágenes entregadas llegan a 1672 px de ancho en 16:9, 1774 px en 2:1 y 1086 px en 3:4, por debajo del «generar a» de su preset (2048, 2048 y 1536 px); las cuadradas (1254 px) lo superan. No se trata como desviación individual.

### 5.1 A corregir por desviación de la IA (0)

Entregadas, pero desviadas del brief o de su prompt. Van de más a menos urgente: primero la gravedad y, a igual gravedad, la prioridad de la vista (P0 → P2). La gravedad es criterio visual, y la baja no justifica regenerar salvo que se vea mal en pantalla. Cada entrada dice qué parte del prompt falló según el resultado y trae ya el prompt con ese punto reforzado, listo para regenerarla.

Ninguna.

### 5.2 Faltantes (38)

Aún no entregadas. La vista de cada una ya está preparada, salvo donde la nota indica lo contrario. Cada entrada trae su prompt.

#### `portal.hero · Atardecer` — Portal · umbral · tema · P0

- **Archivo:** `portal-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Atardecer de `portal.hero`: la misma vista y el mismo encuadre, con la escena del tema. Umbral de entrada al universo: lo primero que ve el visitante.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A vast threshold over still water at dusk: a circular opening of warm amber light, a soft diffuse halo of light: a broad blurred glow about one fifth of the ring's diameter wide, brightest in the middle of its width and fading smoothly on both sides, with no outline and no hard edge, like the corona of an eclipse seen through mist, never a thin glowing line or neon tube, hovering low above a calm sea at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, the sky a muted gradient of dusky rose, terracotta and soft amber with a few thin bands of cloud, the first few faint stars in the upper third, a faint coral glow low on the horizon at the left and a faint dusty mauve glow low on the horizon at the right, both fading out well before the frame edges. Centered, balanced wide composition with the horizon at about 52% from the top, the ring at 50% horizontal and 40% vertical, calm open space all around, the bottom 30% of the frame plain calm water with no reflections, for a logo and a button. Wide landscape framing. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `portal.hero · Amanecer` — Portal · umbral · tema · P0

- **Archivo:** `portal-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Amanecer de `portal.hero`: la misma vista y el mismo encuadre, con la escena del tema. Umbral de entrada al universo: lo primero que ve el visitante.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A vast threshold over still water at sunrise: a circular opening of pale gold light, a soft diffuse halo of light: a broad blurred glow about one fifth of the ring's diameter wide, brightest in the middle of its width and fading smoothly on both sides, with no outline and no hard edge, like the corona of an eclipse seen through mist, never a thin glowing line or neon tube, hovering low above a mirror-calm lake at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, a luminous open sky of soft sky blue fading to ivory with a few thin high clouds, a distant low line of hills in faint blue haze, a faint peach glow low on the horizon at the left and a faint pale blue glow low on the horizon at the right, both fading out well before the frame edges. Centered, balanced wide composition with the horizon at about 52% from the top, the ring at 50% horizontal and 40% vertical, calm open space all around, the bottom 30% of the frame plain calm water with no reflections, for a logo and a button. Wide landscape framing. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `portal.hero · Bosque` — Portal · umbral · tema · P0

- **Archivo:** `portal-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Bosque de `portal.hero`: la misma vista y el mismo encuadre, con la escena del tema. Umbral de entrada al universo: lo primero que ve el visitante.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A vast threshold in a forest clearing: a circular opening of warm golden-green light, a soft diffuse halo of light: a broad blurred glow about one fifth of the ring's diameter wide, brightest in the middle of its width and fading smoothly on both sides, with no outline and no hard edge, like the corona of an eclipse seen through mist, never a thin glowing line or neon tube, hovering low above a still forest pool, framed by tall tree trunks and ferns on both sides, its reflection on the water short and soft, a fine mist rising off the pool, warm filtered golden light between the canopy, deep natural greens. Centered, balanced wide composition with the far edge of the pool at about 52% from the top, the ring at 50% horizontal and 40% vertical, the trunks and ferns confined to the outer 15% on each side, the bottom 30% of the frame plain still water with no reflections, for a logo and a button. Wide landscape framing. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home.hero · Atardecer` — Home · hero · tema · P0

- **Archivo:** `home-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 40% · foco móvil 75% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `home.hero`: la misma vista y el mismo encuadre, con la escena del tema. El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim. Cuerpo de luz: la imagen firma de la marca.
- **Nota:** El foco móvil rige por debajo de 768 px: así el cuerpo de luz (62–88 % del ancho) queda dentro de la ventana visible.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The brand signature image at dusk: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on its side across the surface of a calm sea, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse warm glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in warm amber with faint coral and mauve light flowing through it like fine veins of current, a sky of dusky rose, terracotta and soft amber with thin warm clouds, the first faint stars in the upper third. The whole figure is small, only about a quarter of the frame width, and sits entirely inside the band between 62% and 88% of the frame width, never left of 62% and never closer to the right edge than 12%: its head at 62% horizontal and 40% vertical, its body extending to the right and ending at 88%, so a strip of calm open water stays between its feet and the right edge and no part of it touches or crosses that edge; the left 55% of the frame is open calm sea and soft dusk sky for the headline, low camera angle at water level. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home.hero · Amanecer` — Home · hero · tema · P0

- **Archivo:** `home-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 40% · foco móvil 75% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `home.hero`: la misma vista y el mismo encuadre, con la escena del tema. El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim. Cuerpo de luz: la imagen firma de la marca.
- **Nota:** El foco móvil rige por debajo de 768 px: así el cuerpo de luz (62–88 % del ancho) queda dentro de la ventana visible.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The brand signature image at sunrise: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on its side across the surface of a mirror-calm lake, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse pale-gold glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in pale gold with faint sky-blue and peach light flowing through it like fine veins of current, a luminous open sky of soft sky blue fading to ivory, a low line of hills in faint blue haze. The whole figure is small, only about a quarter of the frame width, and sits entirely inside the band between 62% and 88% of the frame width, never left of 62% and never closer to the right edge than 12%: its head at 62% horizontal and 40% vertical, its body extending to the right and ending at 88%, so a strip of calm open water stays between its feet and the right edge and no part of it touches or crosses that edge; the left 55% of the frame is open calm lake and soft morning sky for the headline, low camera angle at water level. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home.hero · Bosque` — Home · hero · tema · P0

- **Archivo:** `home-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 40% · foco móvil 75% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `home.hero`: la misma vista y el mismo encuadre, con la escena del tema. El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim. Cuerpo de luz: la imagen firma de la marca.
- **Nota:** El foco móvil rige por debajo de 768 px: así el cuerpo de luz (62–88 % del ancho) queda dentro de la ventana visible.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The brand signature image in the forest: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on its side across the surface of a still forest pool, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse golden glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in warm gold with faint green and teal light flowing through it like fine veins of current, tall tree ferns and slender trunks on the far shore, warm filtered golden light between the canopy, a fine mist rising off the water. The whole figure is small, only about a quarter of the frame width, and sits entirely inside the band between 62% and 88% of the frame width, never left of 62% and never closer to the right edge than 12%: its head at 62% horizontal and 40% vertical, its body extending to the right and ending at 88%, so a strip of calm open water stays between its feet and the right edge and no part of it touches or crosses that edge; the left 55% of the frame is open still water and soft out-of-focus foliage for the headline, low camera angle at water level. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `about.hero · Atardecer` — Sobre Marisol · hero · tema · P1

- **Archivo:** `about-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `about.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de la vista de Marisol: el lugar desde el que acompaña.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The place where the work begins, at golden hour: a quiet terrace of warm stone opening onto a calm sea and a distant headland in rose haze, a low wooden table with a crystal singing bowl and a single lit candle standing in the middle distance at the far end of the terrace, near the edge of the water, a linen shawl left over a stone bench as if someone had just stepped out, a sky of dusky rose and soft amber. Table and candle at 60% horizontal and 40% vertical, which is the middle distance: the stone floor of the terrace extends in front of them across the whole lower half of the frame, the left third open calm sea and sky for the title, the lower edge calm. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `about.hero · Bosque` — Sobre Marisol · hero · tema · P1

- **Archivo:** `about-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `about.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de la vista de Marisol: el lugar desde el que acompaña.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The place where the work begins, in the forest: a quiet wooden deck among tall trees opening onto a still forest pool, a low wooden table with a crystal singing bowl and a single lit candle standing in the middle distance at the far end of the deck, near the edge of the water, a linen shawl left over a bench as if someone had just stepped out, soft green ferns, warm filtered golden light through the canopy, a fine mist. Table and candle at 60% horizontal and 40% vertical, which is the middle distance: the wooden floor of the deck extends in front of them across the whole lower half of the frame, the left third soft out-of-focus foliage and still water for the title, the lower edge calm. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `auth.hero · Atardecer` — Acceso · hero · tema · P1

- **Archivo:** `auth-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `auth.hero`: la misma vista y el mismo encuadre, con la escena del tema. El umbral personal que recibe antes del formulario.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A tall arched doorway of warm amber light set into a wall of dusk-lit stone at the edge of a calm sea, seen from a few steps back, a warm path of light spilling across the wet stone and the water toward the viewer, a sky of dusky rose above, quiet, inviting, nobody in the frame. Arch placed in the right half, the left third plain calm wall, sea and soft sky for a quote. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `auth.hero · Amanecer` — Acceso · hero · tema · P1

- **Archivo:** `auth-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `auth.hero`: la misma vista y el mismo encuadre, con la escena del tema. El umbral personal que recibe antes del formulario.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A tall arched doorway of soft pale-gold light set into a wall of pale limestone at the edge of a lake at sunrise, seen from a few steps back, a gentle path of light spilling across the wet stone and the water toward the viewer, soft sky blue and ivory above, quiet, inviting, nobody in the frame. Arch placed in the right half, the left third plain calm wall, water and soft sky for a quote. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `auth.hero · Bosque` — Acceso · hero · tema · P1

- **Archivo:** `auth-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `auth.hero`: la misma vista y el mismo encuadre, con la escena del tema. El umbral personal que recibe antes del formulario.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A tall arched doorway of soft golden-green light set into an old wall of mossy stone at the edge of a forest pool, seen from a few steps back, a warm path of light spilling across the wet stone and the water toward the viewer, ferns and tall trunks around it, mist at its base, quiet, inviting, nobody in the frame. Arch placed in the right half, the left third plain mossy wall and soft out-of-focus ferns for a quote. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.hero · Atardecer` — Descúbrete · hero · tema · P1

- **Archivo:** `discover-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `discover.hero`: la misma vista y el mismo encuadre, con la escena del tema. Bienvenida del quiz: la materia que abre la exploración.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The beginning of a discovery at dusk: a narrow path of warm stone steps rising from a calm sea into a soft rose and amber sky over distant headlands in haze, a sense of a first step, no people. Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third calm and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.hero · Amanecer` — Descúbrete · hero · tema · P1

- **Archivo:** `discover-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `discover.hero`: la misma vista y el mismo encuadre, con la escena del tema. Bienvenida del quiz: la materia que abre la exploración.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The beginning of a discovery at sunrise: a narrow path of pale stone steps rising from a mirror-calm lake into a luminous sky of soft sky blue and ivory with a faint pale gold at the horizon over distant hills in blue haze, a sense of a first step, no people. Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third calm and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.hero · Bosque` — Descúbrete · hero · tema · P1

- **Archivo:** `discover-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `discover.hero`: la misma vista y el mismo encuadre, con la escena del tema. Bienvenida del quiz: la materia que abre la exploración.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The beginning of a discovery in the forest: a narrow path of mossy stone steps rising from a still pool between tall ferns into soft golden light filtering through the canopy and mist, a sense of a first step, no people. Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third soft out-of-focus ferns and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `academy.hero · Atardecer` — Academia · hero · tema · P1

- **Archivo:** `academy-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `academy.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de la academia: el estudio como escena.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Study as a scene at dusk: a low wooden desk on a quiet seaside terrace with an open blank notebook, a ceramic bowl and a lit candle, a calm sea and a far headland in rose haze, no people. Desk in the right half, the left third calm sea and soft sky, low in detail for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `academy.hero · Bosque` — Academia · hero · tema · P1

- **Archivo:** `academy-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `academy.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de la academia: el estudio como escena.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Study as a scene in the forest: a low wooden desk on a quiet deck among ferns beside a still pool, with an open blank notebook, a ceramic bowl and a lit candle, filtered green-gold light, no people. Desk in the right half, the left third soft out-of-focus ferns and still water, low in detail for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `experiences.hero · Amanecer` — Experiencias · hero · tema · P1

- **Archivo:** `experiences-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `experiences.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de experiencias: el viaje como promesa.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The journey as a promise at sunrise: a path of pale stepping stones across a mirror-calm lake toward a simple open pavilion on the far shore: a pavilion of light timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, soft sky-blue mist between trees and hills, nobody present. Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, stepping stones leading in from the lower left, the left third calm mist and water, low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `experiences.hero · Bosque` — Experiencias · hero · tema · P1

- **Archivo:** `experiences-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `experiences.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de experiencias: el viaje como promesa.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The journey as a promise in the forest: a path of mossy stepping stones across a still forest pool toward a simple open pavilion among tall trees: a pavilion of timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, filtered golden light and mist, nobody present. Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, stepping stones leading in from the lower left, the left third soft out-of-focus foliage and still water, low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `booking.hero · Atardecer` — Reserva · hero · tema · P1

- **Archivo:** `booking-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `booking.hero`: la misma vista y el mismo encuadre, con la escena del tema. El lugar de la experiencia elegida, antes de reservar.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck over a calm sea at dusk, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft rose and amber dusk on the planks and the headland beyond. Wide symmetrical, circle of cushions in the middle distance, the left third open calm sea and soft sky for the headline: the horizon and the haze continue across the whole width with no gradient, no band and no vertical edge. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `booking.hero · Amanecer` — Reserva · hero · tema · P1

- **Archivo:** `booking-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `booking.hero`: la misma vista y el mismo encuadre, con la escena del tema. El lugar de la experiencia elegida, antes de reservar.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
An empty serene place ready to receive: floor cushions arranged in a circle on a pale wooden deck over a mirror-calm lake in early morning, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft sky-blue morning light on the planks and the hills beyond. Wide symmetrical, circle of cushions in the middle distance, the left third open calm water and soft sky for the headline: the mist and the hills continue across the whole width with no gradient, no band and no vertical edge. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `booking.hero · Bosque` — Reserva · hero · tema · P1

- **Archivo:** `booking-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `booking.hero`: la misma vista y el mismo encuadre, con la escena del tema. El lugar de la experiencia elegida, antes de reservar.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck among ferns beside a still forest pool, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft green-gold light filtering through the canopy onto the planks. Wide symmetrical, circle of cushions in the middle distance, the left third soft out-of-focus ferns and still water for the headline: the mist and the foliage continue across the whole width with no gradient, no band and no vertical edge. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `store.hero · Atardecer` — Tienda · hero · tema · P1

- **Archivo:** `store-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `store.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de la tienda: el ritual de adquirir.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The ritual of acquiring at dusk: a warm stone ledge at the edge of a calm sea with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, low warm light raking across the objects and reflecting in the water behind them. Objects in the right half at 40% vertical, the left third calm open water and soft sky for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `store.hero · Bosque` — Tienda · hero · tema · P1

- **Archivo:** `store-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `store.hero`: la misma vista y el mismo encuadre, con la escena del tema. Cabecera de la tienda: el ritual de adquirir.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The ritual of acquiring in the forest: a mossy stone ledge at the edge of a still forest pool with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, filtered golden light raking across the objects and reflecting in the water behind them. Objects in the right half at 40% vertical, the left third still water and soft out-of-focus ferns for the headline. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `sanctuary.hero · Atardecer` — Mi Santuario · hero · tema · P1

- **Archivo:** `sanctuary-hero-dusk.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Atardecer de `sanctuary.hero`: la misma vista y el mismo encuadre, con la escena del tema. El espacio personal: la materia que recibe al volver. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A personal sanctuary at dusk: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on a cushion beside a large window that opens onto a calm sea at sunset, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, warm amber light balanced with a soft coral glow, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the water outside, and no other vertical lines anywhere. Window on the right with the figure beneath it, left third calm wall and soft curtain light, low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `sanctuary.hero · Amanecer` — Mi Santuario · hero · tema · P1

- **Archivo:** `sanctuary-hero-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `sanctuary.hero`: la misma vista y el mismo encuadre, con la escena del tema. El espacio personal: la materia que recibe al volver. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A personal sanctuary at sunrise: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on a cushion beside a large window that opens onto a mirror-calm lake in morning light, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, soft pale-gold light balanced with a faint sky-blue glow, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the water outside, and no other vertical lines anywhere. Window on the right with the figure beneath it, left third plain ivory wall and soft curtain light, low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `sanctuary.hero · Bosque` — Mi Santuario · hero · tema · P1

- **Archivo:** `sanctuary-hero-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Bosque de `sanctuary.hero`: la misma vista y el mismo encuadre, con la escena del tema. El espacio personal: la materia que recibe al volver. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A personal sanctuary in the forest: an abstract translucent silhouette of pure light with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, resting on a cushion beside a large window that opens onto a still forest pool among tall ferns, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, soft golden-green light balanced with a faint teal glow, exactly three thin vertical light filaments in total, one gold, one teal and one lavender, rising from the water outside, and no other vertical lines anywhere. Window on the right with the figure beneath it, left third plain calm wall and soft curtain light, low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home.daily-frequency · Amanecer` — Home · frecuencia del día · tema · P1

- **Archivo:** `home-daily-frequency-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Variante del tema Amanecer de `home.daily-frequency`: la misma vista y el mismo encuadre, con la escena del tema. La frecuencia del día como materia: el sonido hecho imagen.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in pale still water and lit by soft morning light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light in pale gold and soft blue, top-down macro, bright and airy. Pattern centered and radially symmetric, the water fading to a soft pale ivory-blue at all four edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home.realms-banner · Amanecer` — Home · banner de realms · tema · P1

- **Archivo:** `home-realms-banner-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Variante del tema Amanecer de `home.realms-banner`: la misma vista y el mismo encuadre, con la escena del tema. Mapa de los nueve reinos: la invitación a entrar.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A constellation as a map of nine realms in daylight: nine small luminous points of pale gold, soft teal and lavender light joined by the faintest filaments across a vast pale morning sky of soft sky blue and ivory, a slow arc of thin high cloud, a thin line of still water along the lower edge mirroring the points. Nine points spread across the width with the brightest near the center, calm pale edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home.footer-banner · Amanecer` — Home · cierre · tema · P2

- **Archivo:** `home-footer-banner-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior en calma, sin detalle ni contraste (el texto va abajo), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `home.footer-banner`: la misma vista y el mismo encuadre, con la escena del tema. Cierre editorial: la despedida que invita a quedarse.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The horizon after the page: a luminous morning sky with faint peach clouds above a mirror-calm lake, a single thin line of pale gold light along the horizon, vast stillness. The horizon line sits at exactly two fifths of the frame height from the top (40%): the sky fills the upper 40% and the calm water the lower 60%, the water soft and even for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open water, mist, sky or plain ground), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `home-membership · Amanecer` — Home · membresía · tema · P2

- **Archivo:** `home-membership-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 15%
- **Zona de texto:** Franja inferior en calma, sin detalle ni contraste (el texto va abajo), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `home-membership`: la misma vista y el mismo encuadre, con la escena del tema. Atmósfera cálida que invita a la comunidad.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Golden light pouring from above onto a still lake at sunrise: a warm beam of light, one color only, pale gold, with no colored bands, falling from the top of the frame onto mist-covered water, a wide circle of low smooth stones lying flat on the shore as a gathering place, none stacked and none higher than a hand, dust motes and mist drifting, soft blue-grey shadows in the corners. The light source sits near the top edge at 15% vertical, the ring of stones in the middle distance, lower third calm mist and water for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open water, mist, sky or plain ground), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `about.angels · Amanecer` — Sobre Marisol · Experiencias con Ángeles · tema · P1

- **Archivo:** `about-angels-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 30%
- **Zona de texto:** Franja inferior en calma, sin detalle ni contraste (el texto va abajo), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `about.angels`: la misma vista y el mismo encuadre, con la escena del tema. La presencia sin figura: luz que desciende, nunca un ángel literal.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Presence without a figure: a soft shaft of pale gold and sky-blue light descending through bright still air onto a mist-covered lake, a single white feather suspended mid-fall, fine luminous dust around it, no wings, no faces, no statues, no religious iconography. Light source and feather in the upper third at 30% vertical, lower half calm mist and water for the headline. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Text is overlaid on the lower third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open water, mist, sky or plain ground), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `auth.form-atmosphere · Amanecer` — Acceso · formulario · tema · P2

- **Archivo:** `auth-form-atmosphere-dawn.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Luminosidad alta y contraste muy bajo: va detrás de un formulario de cristal en un tema claro
- **Contenido:** Variante del tema Amanecer de `auth.form-atmosphere`: la misma vista y el mismo encuadre, con la escena del tema. Fondo atmosférico del formulario de acceso.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Intimate calm in morning light: a surface of pale still water with a single soft pale-gold point of light as small as a distant star, hovering just above the water, its reflection a short soft streak on the surface directly beneath it, the only element in the frame, with nothing around it or in front of it, and faint blue mist drifting low, a soft blurred ivory background. Vertical, very light and low contrast (a form is laid over it later), the point of light in the lower third, generous soft ivory space above. Vertical portrait framing. Interface content is laid over this image later: keep the whole image very light and very low in contrast, with nothing sharp, and make it only of what is described above, with no additional object, shape or outline. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `discover.question-atmosphere · Amanecer` — Descúbrete · pregunta · tema · P2

- **Archivo:** `discover-question-atmosphere-dawn.avif`
- **Medidas:** master 1440×1920 · tablet 1080×1440 · móvil 780×1040 · generar a 1536×2048 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 3:4 · foco 50% 50%
- **Zona de texto:** Luminosidad alta y contraste muy bajo: va detrás de un formulario de cristal en un tema claro
- **Contenido:** Variante del tema Amanecer de `discover.question-atmosphere`: la misma vista y el mismo encuadre, con la escena del tema. Respiro visual que acompaña cada pregunta.
- **Uso:** fondo a pantalla completa (`backdrop`), por encima de su ratio.
- **Nota:** Por eso es de bajo contraste y sin nada nítido: la ampliación no se percibe.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Soft-focus ambient abstraction: drifting translucent veils of pale sky-blue and soft peach mist with tiny pale-gold specks like slow snowfall, very light, almost abstract, the whole frame a single continuous field of soft mist with no object, no shape and no outline anywhere, the veils faint and low in saturation, and the golden specks few, tiny and out of focus. Vertical, very low contrast: the darkest part of the frame is no darker than a pale blue-grey haze, nothing sharp and nothing with an edge, the lower third as light as the rest (the question text is laid over the center). Vertical portrait framing. Interface content is laid over this image later: keep the whole image very light and very low in contrast, with nothing sharp, and make it only of what is described above, with no additional object, shape or outline. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.featured · Amanecer` — Resonario · destacado · tema · P1

- **Archivo:** `resonario-featured-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Centro despejado: lleva un disco, una cifra o un logo encima
- **Contenido:** Variante del tema Amanecer de `resonario.featured`: la misma vista y el mismo encuadre, con la escena del tema. Fondo del audio destacado de la semana.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A backdrop for a featured disc: soft concentric rings of pale gold light radiating from an empty center across calm bright water, faint sky-blue and peach halos at the edges. Empty calm center (a disc is placed on top in the UI), rings fading to soft pale ivory at the edges. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.archive-banner · Amanecer` — Resonario · archivo · tema · P2

- **Archivo:** `resonario-archive-banner-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior en calma, sin detalle ni contraste (el texto va abajo), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `resonario.archive-banner`: la misma vista y el mismo encuadre, con la escena del tema. La colección completa como lugar.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The archive as a place: a long colonnade of pale limestone opening onto still water at early morning, tall niches holding softly glowing vessels — brass bowls, glass discs, ceramic jars — soft sky-blue haze, a few warm lamps far away reflected in the floor-water. One-point perspective down the colonnade, lower third calm pale stone and water for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open water, mist, sky or plain ground), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `academy.featured-course · Amanecer` — Academia · curso destacado · tema · P1

- **Archivo:** `academy-featured-course-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 40%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `academy.featured-course`: la misma vista y el mismo encuadre, con la escena del tema. El curso destacado con materia propia en la cabecera.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The featured practice in daylight: a pair of hands cradling a small brass singing bowl with a wooden striker resting on its rim, soft morning light on the hands, a pale blue-green mist behind, close framing. Hands and bowl in the right-center, the left third soft pale mist and low in detail for the course title. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `experiences.featured · Amanecer` — Experiencias · destacada · tema · P1

- **Archivo:** `experiences-featured-dawn.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 45%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `experiences.featured`: la misma vista y el mismo encuadre, con la escena del tema. La experiencia destacada con presencia propia: el baño de sonido. Cuerpo de luz.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A sound bath in progress in morning light: a circle of abstract translucent silhouettes of pure light, each with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, the body a soft-edged form with no anatomical detail, more light than flesh, seated around a ring of crystal singing bowls glowing pale gold and soft lavender from within, set on pale still water that mirrors them, concentric rings of light spreading across the surface, drifting bright haze above. Ring of bowls and figures in the right two thirds at 45% vertical, left third calm bright mist for the title and the booking button. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `store.ritual-banner · Amanecer` — Tienda · banner ritual · tema · P2

- **Archivo:** `store-ritual-banner-dawn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 50% 40%
- **Zona de texto:** Franja inferior en calma, sin detalle ni contraste (el texto va abajo), en los tonos suaves de la propia escena
- **Contenido:** Variante del tema Amanecer de `store.ritual-banner`: la misma vista y el mismo encuadre, con la escena del tema. Franja del ritual: los objetos como materia de práctica.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Objects of ritual as matter in daylight: a top-down flat lay on pale sand-coloured stone of matches, copal resin, a small brass dish, dried herbs and a quartz point, soft morning light from the left with gentle natural shadows. Objects grouped in the upper two thirds, the bottom third plain pale stone for text. Wide landscape framing. Text is overlaid on the lower third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open water, mist, sky or plain ground), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

### 5.3 Por cablear (crear vistas) (0)

Entregadas, pero sin slot en el registro (`frontend/src/config/editorial-media.ts`) ni pantalla que las pinte. Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.

Ninguna.

### 5.4 No tenidas en cuenta (1)

Publicadas, pero ninguna vista las pinta con el diseño actual.

| Archivo | Vista | Por qué |
|---|---|---|
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | `e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla. |

### 5.5 Completadas (89)

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
| `academy-course-cover-c3.avif` | Academia · portadas de curso · Aromas que Sanan | `academy-course-cover` | 16:8 | P1 |
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
| `resonario-hero-dusk.avif` | Resonario · hero · tema · Atardecer | `resonario.hero` | 16:9 | P1 |
| `resonario-hero-dawn.avif` | Resonario · hero · tema · Amanecer | `resonario.hero` | 16:9 | P1 |
| `resonario-hero-moon.avif` | Resonario · hero · tema · Luna | `resonario.hero` | 16:9 | P1 |
| `resonario-hero-forest.avif` | Resonario · hero · tema · Bosque | `resonario.hero` | 16:9 | P1 |
| `academy-hero-dawn.avif` | Academia · hero · tema · Amanecer | `academy.hero` | 16:9 | P1 |
| `store-hero-dawn.avif` | Tienda · hero · tema · Amanecer | `store.hero` | 16:9 | P1 |
| `experiences-hero-dusk.avif` | Experiencias · hero · tema · Atardecer | `experiences.hero` | 16:9 | P1 |
| `about-hero-dawn.avif` | Sobre Marisol · hero · tema · Amanecer | `about.hero` | 16:9 | P1 |

### 5.6 Provisionales: reemplazar antes de publicar (61)

Imágenes generadas que hacen de marco mientras llegan las fotografías reales (propias de Marisol o con licencia comercial documentada). Pueden estar completadas y seguir siendo provisionales: esta lista no es un estado, cruza los de arriba.

| Slot | Vista | Archivos | Qué hacer |
|---|---|---|---|
| `store-product-visual` | Tienda · productos | `store-product-visual-p1.avif`, `store-product-visual-p2.avif`, `store-product-visual-p3.avif`, `store-product-visual-p4.avif`, `store-product-visual-p5.avif`, `store-product-visual-p6.avif`, `store-product-visual-p7.avif`, `store-product-visual-p8.avif` | Pendiente de Marisol: son fotografía real de sus productos y quedan por hacer (envase con etiqueta legible, tamaño o contenido, textura, una imagen en uso). Las ocho publicadas son provisionales; el catálogo real (nombres, tamaños, contenidos) también lo define ella. No se generan imágenes nuevas de producto. |
| `atmosphere.forest-autumn` | Atmósfera · Bosque otoñal (nostalgia) | `atmosphere-forest-autumn.avif` | Sólo si hay material: la variante otoñal es opcional (spec §4.2). Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.celtic` | Resonario · música de inspiración celta | `resonario-celtic.avif` | Imagen de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.kind-banner.*` | Resonario · tipo de escucha | `resonario-kind-banner-melody.avif`, `resonario-kind-banner-nature.avif`, `resonario-kind-banner-frequency.avif`, `resonario-kind-banner-binaural.avif`, `resonario-kind-banner-guided.avif` | Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.hero` | Resonario · hero · tema | `resonario-hero-dusk.avif`, `resonario-hero-dawn.avif`, `resonario-hero-moon.avif`, `resonario-hero-forest.avif` | Atardecer natural, sin rojo intenso (D2 del spec). Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.hero` | Academia · hero · tema | `academy-hero-dawn.avif`, `academy-hero-dusk.avif`, `academy-hero-forest.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `store.hero` | Tienda · hero · tema | `store-hero-dawn.avif`, `store-hero-dusk.avif`, `store-hero-forest.avif` | Escenario sin producto. La fotografía real de los productos (envases con etiqueta legible, textura, en uso) la hace Marisol; esta imagen se sustituye o se conserva sólo como fondo. |
| `experiences.hero` | Experiencias · hero · tema | `experiences-hero-dusk.avif`, `experiences-hero-dawn.avif`, `experiences-hero-forest.avif` | Sin personas por regla del brief. Sustituir por fotografías propias de Marisol de un encuentro real. |
| `about.hero` | Sobre Marisol · hero · tema | `about-hero-dawn.avif`, `about-hero-dusk.avif`, `about-hero-forest.avif` | Marco provisional. Sustituir por fotografías y videos reales de Marisol (spec §8). |
| `portal.hero` | Portal · umbral · tema | `portal-hero-dusk.avif`, `portal-hero-dawn.avif`, `portal-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.hero` | Home · hero · tema | `home-hero-dusk.avif`, `home-hero-dawn.avif`, `home-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `auth.hero` | Acceso · hero · tema | `auth-hero-dusk.avif`, `auth-hero-dawn.avif`, `auth-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.hero` | Descúbrete · hero · tema | `discover-hero-dusk.avif`, `discover-hero-dawn.avif`, `discover-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `booking.hero` | Reserva · hero · tema | `booking-hero-dusk.avif`, `booking-hero-dawn.avif`, `booking-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `sanctuary.hero` | Mi Santuario · hero · tema | `sanctuary-hero-dusk.avif`, `sanctuary-hero-dawn.avif`, `sanctuary-hero-forest.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.daily-frequency` | Home · frecuencia del día · tema | `home-daily-frequency-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.realms-banner` | Home · banner de realms · tema | `home-realms-banner-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home.footer-banner` | Home · cierre · tema | `home-footer-banner-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `home-membership` | Home · membresía · tema | `home-membership-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `about.angels` | Sobre Marisol · Experiencias con Ángeles · tema | `about-angels-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `auth.form-atmosphere` | Acceso · formulario · tema | `auth-form-atmosphere-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `discover.question-atmosphere` | Descúbrete · pregunta · tema | `discover-question-atmosphere-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.featured` | Resonario · destacado · tema | `resonario-featured-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.archive-banner` | Resonario · archivo · tema | `resonario-archive-banner-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `academy.featured-course` | Academia · curso destacado · tema | `academy-featured-course-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `experiences.featured` | Experiencias · destacada · tema | `experiences-featured-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |
| `store.ritual-banner` | Tienda · banner ritual · tema | `store-ritual-banner-dawn.avif` | Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada. |

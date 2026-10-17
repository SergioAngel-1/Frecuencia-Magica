# Brief fotográfico — Frecuencia Mágica

> Generado por `npm run export:photo-brief` desde `Branding/src/data/photography.js`. No editar a mano: cambia el dato y vuelve a generarlo.
> El estado de cada imagen (a corregir, faltante, por cablear…) vive en `Branding/src/data/photography-status.js`; un test lo cruza con lo publicado.
> El contrato que manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web falla si el brief se desvía.
> Dirección vigente: enmienda 2026-10-10 de `docs/superpowers/specs/2026-08-11-editorial-magical-visual-identity-design.md` — la imagen es el paisaje luminoso; el world engine es su energía.
> Enmienda 2026-10-17 (`docs/superpowers/specs/2026-10-17-ambientes-v2-design.md`): además de la noche hay atmósferas con paisajes de color natural y escenas claras. Tienen estilo propio (sección 2) y son provisionales (sección 5.6).

**81 imágenes** (58 slots registrados, varios por instancia; 1 fuera del registro): P0 4 · P1 56 · P2 21. 1 requiere sesión real (retrato de Marisol).

**Estado:** 69 completadas · 0 a corregir · 11 faltantes · 0 por cablear · 1 no tenidas en cuenta. Ver la sección 5.

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
| `atmosphere-dusk.avif` | Atmósfera · Atardecer (descanso) | 16:9 | 2880×1620 | P1 | Completadas |
| `atmosphere-dawn.avif` | Atmósfera · Amanecer (calma de día) | 16:9 | 2880×1620 | P1 | Completadas |
| `atmosphere-store.avif` | Atmósfera · Taller (tienda) | 16:9 | 2880×1620 | P1 | Completadas |
| `atmosphere-moon.avif` | Atmósfera · Luna (escucha nocturna) | 16:9 | 2880×1620 | P1 | Completadas |
| `atmosphere-forest.avif` | Atmósfera · Bosque (raíz y agua) | 16:9 | 2880×1620 | P1 | Faltantes |
| `atmosphere-forest-autumn.avif` | Atmósfera · Bosque otoñal (nostalgia) | 16:9 | 2880×1620 | P2 | Faltantes |
| `atmosphere-study.avif` | Atmósfera · Estudio (academia) | 16:9 | 2880×1620 | P1 | Faltantes |
| `atmosphere-gathering.avif` | Atmósfera · Encuentro (experiencias) | 16:9 | 2880×1620 | P1 | Faltantes |
| `atmosphere-marisol.avif` | Atmósfera · Luz de Marisol (sobre Marisol) | 16:9 | 2880×1620 | P1 | Faltantes |
| `resonario-celtic.avif` | Resonario · música de inspiración celta | 16:9 | 2880×1620 | P1 | Faltantes |
| `resonario-kind-banner-melody.avif` | Resonario · tipo de escucha · Melodías instrumentales | 16:8 | 2880×1440 | P2 | Faltantes |
| `resonario-kind-banner-nature.avif` | Resonario · tipo de escucha · Naturaleza | 16:8 | 2880×1440 | P2 | Faltantes |
| `resonario-kind-banner-frequency.avif` | Resonario · tipo de escucha · Frecuencias y tonos | 16:8 | 2880×1440 | P2 | Faltantes |
| `resonario-kind-banner-binaural.avif` | Resonario · tipo de escucha · Binaurales | 16:8 | 2880×1440 | P2 | Faltantes |
| `resonario-kind-banner-guided.avif` | Resonario · tipo de escucha · Prácticas guiadas | 16:8 | 2880×1440 | P2 | Faltantes |
| `og-image.jpg` | Metadatos · Open Graph | 1.91:1 | 1200×630 | P0 | Completadas |

## 5. Estado de las imágenes

Cada imagen está en una sola sección. El estado se mantiene en `Branding/src/data/photography-status.js`.

**Nota general sobre tamaños:** las imágenes entregadas llegan a 1672 px de ancho en 16:9, 1774 px en 2:1 y 1086 px en 3:4, por debajo del «generar a» de su preset (2048, 2048 y 1536 px); las cuadradas (1254 px) lo superan. No se trata como desviación individual.

### 5.1 A corregir por desviación de la IA (0)

Entregadas, pero desviadas del brief o de su prompt. Van de más a menos urgente: primero la gravedad y, a igual gravedad, la prioridad de la vista (P0 → P2). La gravedad es criterio visual, y la baja no justifica regenerar salvo que se vea mal en pantalla. Cada entrada dice qué parte del prompt falló según el resultado y trae ya el prompt con ese punto reforzado, listo para regenerarla.

Ninguna.

### 5.2 Faltantes (11)

Aún no entregadas. La vista de cada una ya está preparada, salvo donde la nota indica lo contrario. Cada entrada trae su prompt.

#### `atmosphere.forest` — Atmósfera · Bosque (raíz y agua) · P1

- **Archivo:** `atmosphere-forest.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 50%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Bosque verde y luminoso para Raíz, Renovación y la escucha para estudiar: cascada y helechos, luz filtrada. Referencia de Marisol: la cascada entre helechos.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A lush temperate forest with a slender waterfall: tall tree ferns and broad green fern fronds in the foreground and along both sides, a waterfall of two soft white streams falling down a dark mossy rock face into a still green pool, warm filtered golden sunlight entering from the upper left between the canopy, a fine mist rising off the pool, deep natural greens with glints of gold. The waterfall and its pool inside the band between 58% and 82% of the frame width, the pool in the lower center-right, the left 40% of the frame is soft slightly out-of-focus ferns and shaded trunks in even tones, low in detail, with no bright patch of sunlight there. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `atmosphere.forest-autumn` — Atmósfera · Bosque otoñal (nostalgia) · P2

- **Archivo:** `atmosphere-forest-autumn.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 60% 50%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Variante otoñal del bosque para Nostalgia y Vínculo: cálida y acogedora. Referencia de Marisol: el sendero de bosque en otoño.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Sólo si hay material: la variante otoñal es opcional (spec §4.2). Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
An autumn forest path: a narrow dirt path winding away between tall trees whose leaves are amber, russet and gold with a few soft greens, warm light filtering down through the canopy, a few fallen leaves on the path, soft mist in the far distance, cozy and warm. The path vanishes at 62% horizontal and 52% vertical, the brightest foliage inside the band between 50% and 85% of the frame width, the left 40% of the frame is soft out-of-focus foliage and trunks in warm even tones, low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural amber, russet and gold foliage with a few soft greens; warm and cozy, not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `atmosphere.study` — Atmósfera · Estudio (academia) · P1

- **Archivo:** `atmosphere-study.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 70% 50%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Academia: clara, acogedora y con buena luz para leer. Un rincón junto a una ventana, con cuaderno, materiales naturales y luz de mañana. Es una escena clara.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A reading corner beside a large window in morning light: a simple wooden desk with an open linen-bound notebook with blank pages, a ceramic cup and a small clay vase with one sprig of green leaves, a folded wool throw over a wooden chair, soft morning light entering from the window and falling across the desk with soft natural shadows, cream walls, natural materials of wood, linen and ceramic, and through the window a soft blurred green garden, no writing on the pages and no screens. The window between 62% and 95% of the frame width, the desk in the lower center-right between 45% and 90% of the width, the left 40% of the frame is a plain cream wall in soft shade, calm and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: cream, ivory, natural wood and linen in soft morning light; bright and welcoming. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `atmosphere.gathering` — Atmósfera · Encuentro (experiencias) · P1

- **Archivo:** `atmosphere-gathering.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 62% 55%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Experiencias: humano y cercano; personas compartiendo una experiencia en un espacio cálido. Marisol usará fotos propias; la imagen generada sólo sugiere la presencia, sin nadie.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Sin personas por regla del brief. Sustituir por fotografías propias de Marisol de un encuentro real.

**Prompt**

```text
A warm room prepared for a shared gathering, with nobody present: a wide circle of seven low floor cushions in natural linen and terracotta wool on a wooden floor, a low round wooden table at the center of the circle with a ceramic teapot, three small cups and three candles each with a small steady flame, soft warm golden light entering from a window and from the candles, a plant in a clay pot in the corner, a shawl resting on one cushion and one half-empty cup, as traces of presence. The circle of cushions centered at 64% horizontal and 60% vertical, inside the band between 40% and 90% of the frame width, the left 40% of the frame is a plain warm wall and soft window light, calm and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm honey and clay in soft golden indoor light; human warmth with nobody in the frame. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `atmosphere.marisol` — Atmósfera · Luz de Marisol (sobre Marisol) · P1

- **Archivo:** `atmosphere-marisol.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 66% 50%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** Sobre Marisol: personal, cálido y luminoso. Un rincón con luz de mañana que hace de marco mientras llegan las fotografías y los videos reales de ella.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Marco provisional. Sustituir por fotografías y videos reales de Marisol (spec §8).

**Prompt**

```text
A luminous personal corner in the morning: a wooden table beside a tall window with sheer ivory linen curtains stirring slightly, a ceramic cup of tea with a thin wisp of steam, a small open notebook with blank pages, a bunch of dried lavender in a glass jar and a small green plant, warm light flooding the room, and through the window a gentle blur of a sunlit garden. The table and the window inside the band between 50% and 92% of the frame width, the left 40% of the frame is a plain ivory wall and soft curtain light, calm and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: warm ivory, honey and soft gold in luminous daylight; personal and bright. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.celtic` — Resonario · música de inspiración celta · P1

- **Archivo:** `resonario-celtic.avif`
- **Medidas:** master 2880×1620 · tablet 1440×810 · móvil 768×432 · generar a 2048×1152 (sin ampliar después) · peso ≤ 260 KB (P0 ≤ 320 KB)
- **Ratio / focal:** 16:9 · foco 66% 50%
- **Zona de texto:** Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena
- **Contenido:** La pieza celta, con su texto editorial («una invitación a bajar el ritmo»): un arpa junto a una ventana sobre colinas verdes en la bruma.
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Imagen de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A Celtic lever harp of dark polished wood with fine carved knotwork on its pillar and gut strings, resting against a mossy stone window sill in early morning, beyond the window soft green hills and a quiet misty coast under pale light, a small bunch of green fern in a stone jar beside the harp, no hands and no people. The harp between 58% and 82% of the frame width and its top at 25% from the top, the window view behind it, the left 40% of the frame is the plain mossy stone wall and soft misty window light, calm and low in detail. Wide landscape framing. A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.kind-banner.* · Melodías instrumentales` — Resonario · tipo de escucha · P2

- **Archivo:** `resonario-kind-banner-melody.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Un banner por tipo de escucha, con su explicación debajo: melodías, naturaleza, frecuencias y tonos, binaurales y prácticas guiadas (5 tipos).
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
The open lid of a dark wooden upright piano standing against a cream wall, a cello resting on its side beside the piano on a wooden floor, soft morning light from a window at the left falling across the wood, warm honey and cream tones, nobody present. Wide and horizontal, the main subject at the exact center of the frame, calm space at both sides, everything important kept away from the top and bottom edges because the image is cropped to 2:1. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm ivory, honey and soft gold in luminous daylight; personal and bright. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.kind-banner.* · Naturaleza` — Resonario · tipo de escucha · P2

- **Archivo:** `resonario-kind-banner-nature.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Un banner por tipo de escucha, con su explicación debajo: melodías, naturaleza, frecuencias y tonos, binaurales y prácticas guiadas (5 tipos).
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
A calm forest stream running over smooth mossy stones under a fine soft rain, ferns along both banks, a single small songbird perched on a mossy branch at 25% from the left and 30% from the top, fresh natural greens. Wide and horizontal, the main subject at the exact center of the frame, calm space at both sides, everything important kept away from the top and bottom edges because the image is cropped to 2:1. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.kind-banner.* · Frecuencias y tonos` — Resonario · tipo de escucha · P2

- **Archivo:** `resonario-kind-banner-frequency.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Un banner por tipo de escucha, con su explicación debajo: melodías, naturaleza, frecuencias y tonos, binaurales y prácticas guiadas (5 tipos).
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Sound made visible: fine pale sand forming a symmetrical Chladni geometric pattern on a round brass plate, top-down macro, warm soft side light from the left, delicate concentric lines and petals of sand, the plate resting on pale stone. Wide and horizontal, the main subject at the exact center of the frame, calm space at both sides, everything important kept away from the top and bottom edges because the image is cropped to 2:1. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: sand, cream and soft sage green, with warm side light and natural soft shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.kind-banner.* · Binaurales` — Resonario · tipo de escucha · P2

- **Archivo:** `resonario-kind-banner-binaural.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Un banner por tipo de escucha, con su explicación debajo: melodías, naturaleza, frecuencias y tonos, binaurales y prácticas guiadas (5 tipos).
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
Two broad soft beams of light with no outline, like the glow of a distant lamp through mist, one a cool silver-blue entering from the left edge and one a warm amber entering from the right edge, drifting low over a calm sea at dusk and meeting in a quiet soft glow at the center, a gentle mirrored reflection on the water. Wide and horizontal, the main subject at the exact center of the frame, calm space at both sides, everything important kept away from the top and bottom edges because the image is cropped to 2:1. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

#### `resonario.kind-banner.* · Prácticas guiadas` — Resonario · tipo de escucha · P2

- **Archivo:** `resonario-kind-banner-guided.avif`
- **Medidas:** master 2880×1440 · tablet 1440×720 · móvil 768×384 · generar a 2048×1024 (sin ampliar después) · peso ≤ 220 KB
- **Ratio / focal:** 16:8 · foco 50% 50%
- **Zona de texto:** Sin texto encima: composición libre
- **Contenido:** Un banner por tipo de escucha, con su explicación debajo: melodías, naturaleza, frecuencias y tonos, binaurales y prácticas guiadas (5 tipos).
- **Estilo:** atmósfera (v2): etalonaje natural, no el nocturno; ver «Estilo de las atmósferas».
- **Provisional:** Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.

**Prompt**

```text
An empty round linen cushion and a folded cream blanket on a pale wooden floor beside a window at early morning, a steaming ceramic cup beside the cushion, a soft shaft of daylight falling across the floor, an invitation to sit, nobody present. Wide and horizontal, the main subject at the exact center of the frame, calm space at both sides, everything important kept away from the top and bottom edges because the image is cropped to 2:1. Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges. Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows. Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. Light with a clear natural direction and soft natural shadows. The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.
```

### 5.3 Por cablear (crear vistas) (0)

Entregadas, pero sin slot en el registro (`frontend/src/config/editorial-media.ts`) ni pantalla que las pinte. Los archivos están en `frontend/public/editorial/` como `states-<estado>.png`, sin convertir.

Ninguna.

### 5.4 No tenidas en cuenta (1)

Publicadas, pero ninguna vista las pinta con el diseño actual.

| Archivo | Vista | Por qué |
|---|---|---|
| `experiences-visual-e1.avif` | Experiencias · filas · Baño de Sonido en Vivo | `e1` es siempre la experiencia destacada, que usa `experiences.featured`. Hay que usarla en otra vista o retirarla. |

### 5.5 Completadas (69)

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
| `atmosphere-dusk.avif` | Atmósfera · Atardecer (descanso) | `atmosphere.dusk` | 16:9 | P1 |
| `atmosphere-dawn.avif` | Atmósfera · Amanecer (calma de día) | `atmosphere.dawn` | 16:9 | P1 |
| `atmosphere-store.avif` | Atmósfera · Taller (tienda) | `atmosphere.store` | 16:9 | P1 |
| `atmosphere-moon.avif` | Atmósfera · Luna (escucha nocturna) | `atmosphere.moon` | 16:9 | P1 |
| `og-image.jpg` | Metadatos · Open Graph | `og-image` | 1.91:1 | P0 |

### 5.6 Provisionales: reemplazar antes de publicar (23)

Imágenes generadas que hacen de marco mientras llegan las fotografías reales (propias de Marisol o con licencia comercial documentada). Pueden estar completadas y seguir siendo provisionales: esta lista no es un estado, cruza los de arriba.

| Slot | Vista | Archivos | Qué hacer |
|---|---|---|---|
| `store-product-visual` | Tienda · productos | `store-product-visual-p1.avif`, `store-product-visual-p2.avif`, `store-product-visual-p3.avif`, `store-product-visual-p4.avif`, `store-product-visual-p5.avif`, `store-product-visual-p6.avif`, `store-product-visual-p7.avif`, `store-product-visual-p8.avif` | Pendiente de Marisol: son fotografía real de sus productos y quedan por hacer (envase con etiqueta legible, tamaño o contenido, textura, una imagen en uso). Las ocho publicadas son provisionales; el catálogo real (nombres, tamaños, contenidos) también lo define ella. No se generan imágenes nuevas de producto. |
| `atmosphere.dusk` | Atmósfera · Atardecer (descanso) | `atmosphere-dusk.avif` | Atardecer natural, sin rojo intenso (D2 del spec). Sustituir por fotografía propia o con licencia comercial documentada. |
| `atmosphere.dawn` | Atmósfera · Amanecer (calma de día) | `atmosphere-dawn.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `atmosphere.store` | Atmósfera · Taller (tienda) | `atmosphere-store.avif` | Escenario sin producto. La fotografía real de los productos (envases con etiqueta legible, textura, en uso) la hace Marisol; esta imagen se sustituye o se conserva sólo como fondo. |
| `atmosphere.moon` | Atmósfera · Luna (escucha nocturna) | `atmosphere-moon.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `atmosphere.forest` | Atmósfera · Bosque (raíz y agua) | `atmosphere-forest.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `atmosphere.forest-autumn` | Atmósfera · Bosque otoñal (nostalgia) | `atmosphere-forest-autumn.avif` | Sólo si hay material: la variante otoñal es opcional (spec §4.2). Sustituir por fotografía propia o con licencia comercial documentada. |
| `atmosphere.study` | Atmósfera · Estudio (academia) | `atmosphere-study.avif` | Sustituir por fotografía propia o con licencia comercial documentada. |
| `atmosphere.gathering` | Atmósfera · Encuentro (experiencias) | `atmosphere-gathering.avif` | Sin personas por regla del brief. Sustituir por fotografías propias de Marisol de un encuentro real. |
| `atmosphere.marisol` | Atmósfera · Luz de Marisol (sobre Marisol) | `atmosphere-marisol.avif` | Marco provisional. Sustituir por fotografías y videos reales de Marisol (spec §8). |
| `resonario.celtic` | Resonario · música de inspiración celta | `resonario-celtic.avif` | Imagen de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |
| `resonario.kind-banner.*` | Resonario · tipo de escucha | `resonario-kind-banner-melody.avif`, `resonario-kind-banner-nature.avif`, `resonario-kind-banner-frequency.avif`, `resonario-kind-banner-binaural.avif`, `resonario-kind-banner-guided.avif` | Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada. |

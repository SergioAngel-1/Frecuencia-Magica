/**
 * Brief de imagen de Frecuencia Mágica: una fila por imagen que la web necesita, con medidas,
 * contenido y un prompt para un agente de imágenes.
 *
 * Es JS puro y sin imports a propósito: lo consumen la página `/fotografia` (Vite) y el script
 * `scripts/export-photo-brief.mjs` (Node) que genera `docs/brief-fotografico.md`. El contrato que
 * manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web
 * (`frontend/tests/lib/photography-brief.test.ts`) falla si este archivo se desvía de él.
 *
 * Dirección (enmienda 2026-10-10): «la imagen es el paisaje; el world engine es su energía». Paisaje
 * luminoso de noche —agua, bruma, cielo cósmico— con una silueta de luz en seis slots narrativos y una portada de curso. La
 * imagen es oscura y cálida, con bordes que se funden con `--void`; los scrims y las máscaras los
 * aplica el CSS, nunca el archivo.
 *
 * Prueba de estilo (2026-10-10, Nano Banana Pro a 2K): el modelo respeta paleta, saturación y espacio
 * negativo, pero lee «faceless» como un perfil con nariz y labios, multiplica los filamentos (salieron
 * 4 y 6) y dibuja los anillos como tubos de neón. Por eso la silueta, los filamentos y los halos se
 * describen en positivo con las frases fijas de abajo (`BODY_OF_LIGHT`, `filaments()`, `HALO`): los
 * agentes sin campo de negativo sólo obedecen lo que dice el propio prompt.
 *
 * Con GPT Image (ChatGPT) los mismos prompts salen más saturados y con cielos recargados: por eso el
 * estilo común fija el etalonaje con palabras (mate, bajo contraste, desaturado) y cada prompt dice la
 * zona libre para texto y el encuadre (`SAFE_PROMPT`, `FRAMING`). En composiciones centradas, los tres
 * filamentos llevan posición fija: si no, salen en pares.
 *
 * Enmienda 2026-10-17 (`docs/superpowers/specs/2026-10-17-ambientes-v2-design.md`): además de la noche, el
 * sitio tiene atmósferas (atardecer, amanecer, luna, bosque, estudio, taller, encuentro, Marisol) con paisajes
 * de color natural y escenas claras. Esas imágenes (`style: 'atmosphere'`) comparten el lenguaje fotográfico
 * del sitio —fine-art cinematográfico, bruma suave, mate, sin neón, sin texto ni personas— pero no el etalonaje
 * nocturno (sombras marino y una sola luz dorada): lo sustituyen un estilo propio (`GLOBAL.atmosphere.base`) y
 * un tratamiento por atmósfera. Son provisionales (`provisional`): se reemplazan por fotografía propia de
 * Marisol o con licencia comercial documentada antes de publicar. Los productos de la tienda no se generan:
 * son fotografía real que hará ella.
 */

import { BODY_OF_LIGHT, HALO, LIGHT_BODY_TRAITS, filaments } from './photography-phrases.js'
import { CALM_SAFE, THEME_LABELS, THEME_VARIANTS } from './photography-themes.js'

const PROVISIONAL_VARIANT = 'Variante de tema. Sustituir por fotografía propia o con licencia comercial documentada.'

/* ------------------------------------------------------------------ medidas */

/**
 * Presets de tamaño. `master` es el archivo de trabajo (2× el ancho de render máximo, DPR capado a 2);
 * `tablet` y `mobile` son derivados para `srcset`. `generate` es lo que conviene pedirle al agente de
 * imágenes (la mayoría no entrega 2880 px nativos). Lo entregado no se amplía (decisión de 2026-10-10:
 * con los fundidos de las bandas, las fuentes de ~1672 px se ven bien); la ingesta publica variantes hasta
 * el ancho real del archivo. Si se quiere la nitidez del master, se regenera a su medida, no se amplía.
 */
export const PRESETS = {
  wide: {
    ratio: '16:9',
    label: 'Banda ancha 16:9',
    master: [2880, 1620],
    tablet: [1440, 810],
    mobile: [768, 432],
    generate: '2048×1152',
    budget: '≤ 260 KB (P0 ≤ 320 KB)',
    use: 'Héroes y bandas a sangre de viewport',
  },
  cinema: {
    ratio: '16:8',
    label: 'Banda cine 16:8 (2:1)',
    master: [2880, 1440],
    tablet: [1440, 720],
    mobile: [768, 384],
    generate: '2048×1024',
    budget: '≤ 220 KB',
    use: 'Bandas bajas y fondos de tarjeta destacada',
  },
  portrait: {
    ratio: '3:4',
    label: 'Retrato 3:4',
    master: [1440, 1920],
    tablet: [1080, 1440],
    mobile: [780, 1040],
    generate: '1536×2048',
    budget: '≤ 220 KB',
    use: 'Media página (50vw en ≥768px), retratos y atmósferas verticales',
  },
  square: {
    ratio: '1:1',
    label: 'Cuadrada 1:1',
    master: [1024, 1024],
    tablet: [768, 768],
    mobile: [640, 640],
    generate: '1024×1024',
    budget: '≤ 120 KB',
    use: 'Portadas de audio, tarjetas de producto y de curso',
  },
}

export const DELIVERY = {
  formats:
    'Se entrega el PNG del agente, sin convertir. La web no publica PNG (salvo el logo): `npm run editorial:ingest` (desde `frontend/`) ' +
    'lo comprime una sola vez en AVIF q88, en variantes de 640, 828, 1200, 1920 y 2880 px acotadas al ancho del archivo, y reescribe el manifiesto. ' +
    'No convertir a AVIF ni a WebP a mano: cada recompresión pierde grano.',
  dir: 'frontend/.editorial-originals/ (los PNG; git los ignora). La ingesta escribe los AVIF en frontend/public/editorial/.',
  naming: '`<slot-id>.<ext>` con el punto cambiado por guion (`portal.hero` → `portal-hero.avif`). Por instancia: `<slot-id>-<slug>.avif`.',
  color: 'sRGB, perfil incrustado, sin canal alfa.',
  dpr: 'Máximo 2× el ancho de render (DPR capado a 2). No exportar por encima del master.',
}

/* ------------------------------------------------------------------ estilo */

/** Cláusula de rostros del negativo: va al final para que el retrato real de Marisol pueda quitarla. */
const FACE_CLAUSE = ', recognizable faces, visible facial features, face in profile, eyes, nose, lips, mouth, ear'

/**
 * Producto de la tienda: se genera adjuntando la foto real del producto. El prompt no describe ni la
 * forma ni la etiqueta —las fija la referencia—, sólo la escena; un texto descrito sale deformado.
 */
const FROM_REFERENCE =
  'shown in the attached reference image, reproduced faithfully: the same shape, proportions, materials, colours and closure, ' +
  'and its label copied exactly as it appears in the reference, with the lettering sharp and unchanged and nothing rewritten, added or invented'

/** Excepción al cierre del prompt base («No text…») en los productos con foto de referencia. */
const LABEL_EXCEPTION = "The only exception is the product's own label, kept exactly as in the reference image."

/** Arranque del negativo y su variante para los productos con foto de referencia. */
const TEXT_CLAUSE = 'text, letters, numbers, captions, watermark, logo, signature, channel name,'
const TEXT_CLAUSE_BUT_LABEL =
  'captions, watermark, signature, channel name, any text or logo that is not on the product in the reference image, invented or misspelled label text,'

export const GLOBAL = {
  /** Se añade al final de todos los prompts, después del sujeto y el encuadre. */
  base:
    'Cinematic fine-art photograph, photorealistic, low-key, long-exposure feel, soft atmospheric haze and mist. ' +
    'Color grade: matte, low contrast and desaturated, like a muted film still; shadows are deep midnight navy (#0F1B2E), never pure black; ' +
    'a single warm, muted gold light (#D8B978) is the only strong light; soft teal (#96C6BC) and dusty lavender (#B9B0D6) appear only as faint glows; ' +
    'ivory (#F7F4EA) highlights; no bloom, no glare, never neon, no lens flare, no oversaturated or electric colors. ' +
    'When the sky is visible: only a few dozen fine pinpoint stars in the upper third, and any galaxy is small, faint and soft, never a sharp detailed spiral. ' +
    'The darkness at the edges comes from the scene itself (unlit sky, water or room), with nothing bright touching the frame edge and no added vignette. ' +
    'Serene, intimate, poetic, timeless. No text, letters or numbers anywhere.',
  treatments: {
    warm: 'Dominant tone: warm muted gold (#D8B978) light on a dark navy ground; teal and lavender only as faint accents.',
    teal: 'Dominant tone: soft desaturated teal (#96C6BC) mist with small warm gold accents.',
    lav: 'Dominant tone: dusty lavender (#B9B0D6) dusk light with small warm gold accents.',
    soft: 'Balanced faint gold, teal and lavender, ultra calm, very low contrast.',
    none: 'Balanced gold, teal and lavender in equal, faint measure; cosmic and immersive but restrained.',
  },
  /**
   * Atmósferas (enmienda 2026-10-17). Mismo lenguaje fotográfico que la noche, otro etalonaje: color natural
   * y contenido en lugar de sombras marino con una sola luz dorada. Los colores van por nombre, no por hex:
   * la paleta de cada atmósfera se calibra contra la fotografía en las muestras (spec §14).
   */
  atmosphere: {
    base:
      'Cinematic fine-art photograph, photorealistic, long-exposure feel, soft atmospheric haze. ' +
      'Natural colors kept true to the real scene and gently muted, like a soft matte film still: low contrast, shadows gently lifted that keep their own hue and never crush to pure black, ' +
      'no bloom, no glare, no lens flare, no HDR, never neon, no oversaturated or electric colors. ' +
      'Light with a clear natural direction and soft natural shadows. ' +
      "The edges of the frame stay calm and low in detail, in the scene's own base tone, with nothing bright or sharp touching them and no added vignette. " +
      'Serene, intimate, poetic, timeless. No text, letters or numbers anywhere. No people.',
    treatments: {
      dusk: 'Dominant tone: warm terracotta, deep coral and soft amber light over dusky rose and warm brown shadows; reddish reflections that never become an intense red, and no dazzling light.',
      dawn: 'Dominant tone: soft sky blue, ivory and a faint pale gold; light, open and airy, with soft blue-grey shadows.',
      moon: 'Dominant tone: cool silver-blue moonlight over a night of deep teal-blue, the whole scene clearly lit and readable by a soft luminous silver light on the water, the mist and the stone, with small warm accents (a candle, a distant lamp) for depth; shadows in lifted deep blue, never pure black, never a flat dark image.',
      forest: 'Dominant tone: natural greens, mossy and fresh, with warm filtered golden light; lush but not saturated.',
      'forest-autumn': 'Dominant tone: natural amber, russet and gold foliage with a few soft greens; warm and cozy, not saturated.',
      study: 'Dominant tone: cream, ivory, natural wood and linen in soft morning light; bright and welcoming.',
      store: 'Dominant tone: sand, cream and soft sage green, with warm side light and natural soft shadows.',
      gathering: 'Dominant tone: warm honey and clay in soft golden indoor light; human warmth with nobody in the frame.',
      marisol: 'Dominant tone: warm ivory, honey and soft gold in luminous daylight; personal and bright.',
    },
    /** Se añade al negativo de las imágenes de atmósfera. */
    negativeExtra:
      ', a navy or gold color cast over the whole image, crushed black shadows, teal-and-orange blockbuster grade, oversaturated sunset, blown-out sun disc, people, human figures, silhouettes of people, boats',
    rules: [
      'Una atmósfera comparte con la noche el lenguaje, no el etalonaje: fine-art cinematográfico, bruma suave, mate, sin neón, sin texto ni personas. El color es el natural de la escena, contenido; no se tiñe de marino ni de dorado.',
      'Los colores van por nombre (terracota, coral, ámbar, azul cielo, marfil, arena, crema, verde salvia), nunca con los hex de la paleta nocturna: la paleta definitiva de cada atmósfera se calibra contra la fotografía.',
      'Rojo del atardecer: reflejos rojizos y ámbar sobre el agua, nunca un rojo intenso ni una luz deslumbrante (decisión abierta D2 del spec: Marisol pide «evitar rojo intenso» y también «el mar real, rojo»).',
      'Los bordes de la imagen quedan en calma y en el tono base de la escena: el fundido a la atmósfera lo aplica el CSS, no el archivo. Nada nítido ni brillante toca el borde.',
      'Sin personas: donde Marisol pide gente (encuentros, Sobre Marisol) la imagen generada sólo sugiere presencia (cojines, tazas, una manta) y se sustituye por fotografía real propia.',
      'Todas son provisionales: se sustituyen por fotografía propia de Marisol o con licencia comercial documentada antes de publicar. Los productos de la tienda no se generan; son fotografía real que hará ella.',
    ],
  },
  negative:
    'text, letters, numbers, captions, watermark, logo, signature, channel name, UI elements, frame, border, baked vignette, ' +
    'baked gradient overlay, stock photo look, wellness clichés (lotus on a sunset beach, yoga pose on a mountain, stacked zen stones, ' +
    'om symbol, buddha statue), neon, glowing neon tube, rainbow spectrum, saturated magenta, electric blue, oversaturated colors, HDR, ' +
    'pastel candy colors, bright white or grey background, DNA helix, brain, anatomical or medical detail, nude body detail, ' +
    'more than three vertical light lines, dense starfield filling the frame, lens flare, sci-fi, plastic skin, distorted hands, extra fingers, cartoon, ' +
    'CGI plastic look, game-engine render, emojis' +
    FACE_CLAUSE,
  rules: [
    'Sin texto, logos, marcas, nombres de canal ni etiquetas legibles dentro de la imagen: el copy lo pone la web. Única excepción: los productos de la tienda, que se generan adjuntando la foto real del producto y conservan su etiqueta tal como está en ella; el prompt nunca describe ni dicta ese texto.',
    'Sin rasgos faciales: el cuerpo de luz es una silueta translúcida sin ojos, boca ni nariz, y el único rostro es el retrato real de Marisol. Fuera de esos casos: manos u objetos. Toda figura de cuerpo entero es el cuerpo de luz, nunca una persona real, ni de espaldas. El prompt describe la silueta en positivo (cabeza lisa, sin nariz, labios ni oreja; de espaldas o girada): «faceless» a secas no basta.',
    'Cielo arriba, materia abajo: el cosmos ocupa como mucho el tercio superior, con estrellas escasas. El world engine ya pinta el campo de estrellas y las partículas; la imagen no los duplica.',
    'Luz dorada sobre fondo oscuro: los bordes de la imagen tienden a --void para que el scrim de CSS funda sin corte.',
    'En las imágenes nocturnas, nada de fondos blancos, grises ni pasteles, ni neón ni arcoíris: es un universo nocturno. Oro, teal y lavanda, a baja saturación. Las atmósferas tienen su propio estilo (ver «Estilo de las atmósferas»).',
    'Filamentos de frecuencia: como máximo tres líneas ondulantes (oro, teal y lavanda), a baja opacidad, nunca un espectro completo. El prompt las cuenta en positivo («exactly three … in total»): los modelos tienden a duplicarlas.',
    'Anillos y círculos de luz: halo suave y difuso, nunca un tubo de neón fino.',
    'Sin ADN, cerebros ni anatomía: la energía se sugiere con luz, agua y geometría sagrada, no con ilustración médica.',
    'Sin stock genérico ni Unsplash. Lo generado es materia de ambiente y dirección de arte, y es provisional: cuando exista el producto físico o la persona real, se sustituye por fotografía propia de Marisol o con licencia comercial documentada (enmienda 2026-10-17).',
    'Sin máscaras, viñetas ni degradados horneados: los aplica el CSS.',
  ],
}

/**
 * Vocabulario visual (enmienda 2026-10-10): cuatro elementos y una firma. Cada slot toma uno como
 * protagonista; no todos los realms comparten plantilla. `bodyOfLight.slots` son los únicos slots
 * donde aparece la silueta de luz (un test comprueba que existen en el registro).
 */
export const LANGUAGE = {
  elements: [
    {
      name: 'Agua',
      feel: 'Espejo en calma, ondas concéntricas, cimática: la frecuencia hecha visible.',
      realms: 'Resonario, Portal, Santuario',
    },
    {
      name: 'Bruma y montaña',
      feel: 'Horizontes, valles, amanecer y niebla: el camino que se abre.',
      realms: 'Descúbrete, Experiencias, Acceso, Academia (teal)',
    },
    {
      name: 'Cielo cósmico',
      feel: 'Galaxia en espiral o vía láctea baja, sólo en el tercio superior.',
      realms: 'Portal, Home, Sobre Marisol',
    },
    {
      name: 'Cuerpo de luz',
      feel: 'Silueta translúcida sin rasgos, bordeada de oro con teal y lavanda por dentro.',
      realms: 'Seis slots narrativos y una portada de curso (ver abajo)',
    },
  ],
  signature: {
    name: 'Filamentos de frecuencia',
    feel: 'Tres líneas verticales ondulantes —oro, teal y lavanda— a baja opacidad. Motivo recurrente, no obligatorio.',
  },
  bodyOfLight: {
    slots: [
      'home.hero',
      'discover.tuning',
      'discover.result',
      'experiences.featured',
      'academy.completion',
      'sanctuary.hero',
    ],
    /** Instancias sueltas de un slot por instancia, por su nombre de archivo sin extensión. */
    instances: ['academy-course-cover-c1'],
  },
}

/**
 * Cómo redactar el prompt de una imagen nueva. Salen de las desviaciones de la IA ya vistas: casi todas
 * nacieron de una contradicción o de una frase ambigua dentro del propio prompt, no de falta de énfasis.
 */
export const PROMPT_WRITING = [
  'Sujeto y encuadre no se contradicen: algo «en primer plano» no puede estar «al 40 % de la altura», ni un resplandor central pedirse a la vez que un centro calmo. Antes de dar un porcentaje, comprueba que el sujeto cabe donde lo pones.',
  'Una posición lleva rango y tamaño, no sólo una cifra: «entre el 62 % y el 88 % del ancho, un cuarto del ancho». Un porcentaje suelto se corre varios puntos.',
  'Los conteos y los estados se escriben en positivo y con número: «exactly three filaments in total»; unas velas apagadas son «unburnt wax, dark wick, no flame», no sólo «unlit».',
  'Un sustantivo sin estilo trae su estereotipo («pavilion» sale pagoda): descríbelo con materiales, tejado y ornamento.',
  'La negación sola no basta («never a thin neon tube»): describe lo que sí debe verse («a broad soft glow with no outline, like the corona of an eclipse»).',
  'Nada de la interfaz en el prompt: «glass form», «scrim», «check mark» o «disc» acaban dibujados como objeto. Di sólo que el contenido se coloca encima después.',
  'La oscuridad de una zona libre sale de la escena (sombra, agua sin luz, cielo apagado), no de un «tercio oscuro» a secas, que se aplica como una banda de degradado recta.',
  'Un centro libre para superponer algo se fija con coordenadas («exact center, 50% and 50%») y lo brillante se coloca fuera de él.',
  'Una altura depende del horizonte: una figura «pequeña» y «baja» a la vez se contradice, porque en perspectiva lo pequeño está lejos y lo lejano queda junto al horizonte. Fija dónde está el horizonte y a qué distancia del espectador está el sujeto.',
]

/** Zona despejada para el texto que se superpone (lo decide el scrim del componente). */
export const SAFE = {
  left: 'Tercio izquierdo oscuro y despejado (el texto va a la izquierda)',
  bottom: 'Franja inferior despejada (el texto va abajo, sobre scrim)',
  'left-bottom': 'Tercio izquierdo e inferior despejados (titular y CTA)',
  'calm-left': 'Tercio izquierdo en calma, sin detalle ni contraste (el texto va a la izquierda), en los tonos suaves de la propia escena',
  center: 'Centro despejado: lleva un disco, una cifra o un logo encima',
  none: 'Sin texto encima: composición libre',
  low: 'Baja luminosidad general: va detrás de un formulario de cristal',
  'calm-bottom': 'Franja inferior en calma, sin detalle ni contraste (el texto va abajo), en los tonos suaves de la propia escena',
  'calm-low': 'Luminosidad alta y contraste muy bajo: va detrás de un formulario de cristal en un tema claro',
}

/**
 * La misma zona, dicha al modelo en inglés. Se añade a cada prompt para que el agente no la deduzca:
 * los modelos de chat (GPT Image) rellenan cualquier hueco que no se fije. `center` y `none` no añaden
 * nada: su encuadre ya describe dónde queda el hueco.
 */
const SAFE_PROMPT = {
  left: 'Text is overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay.',
  bottom: 'Text is overlaid on the lower third of the image: keep that area dark, quiet and low in detail.',
  'left-bottom': 'A headline and a button are overlaid on the left third of the image: keep that area dark, quiet and low in detail, dark because that side of the scene is in natural shadow (unlit hills, water and sky), never through a gradient, band or overlay.',
  'calm-left': 'A headline and a button are overlaid on the left third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open sky, still water, mist, plain wall or soft out-of-focus foliage), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay.',
  center: '',
  none: '',
  'calm-bottom': 'Text is overlaid on the lower third of the image: keep that area calm, low in detail and low in contrast, in the soft tones of the scene itself (open water, mist, sky or plain ground), with no bright highlight and no sharp subject there, and never through a gradient, band or overlay.',
  'calm-low': 'Interface content is laid over this image later: keep the whole image very light and very low in contrast, with nothing sharp, and make it only of what is described above, with no additional object, shape or outline.',
  low: 'Interface content is laid over this image later: keep the whole image very dark and very low in contrast, with nothing sharp, and make it only of what is described above, with no additional object, shape or outline.',
}

/** Encuadre por preset, dicho al modelo. `og-image` no tiene preset y usa el de banda ancha. */
const FRAMING = {
  wide: 'Wide landscape framing.',
  cinema: 'Panoramic framing composed for a 2:1 crop: keep everything important away from the top and bottom edges.',
  portrait: 'Vertical portrait framing.',
  square: 'Square framing.',
}

/* ------------------------------------------------------------------- slots */

const slot = (id, preset, focal, priority, treatment, safe, view, role, subject, frame, extra = {}) => ({
  id,
  file: `${id.replaceAll('.', '-')}.avif`,
  preset,
  focal,
  priority,
  treatment,
  safe,
  view,
  role,
  subject,
  frame,
  ...extra,
})

export const SLOTS = [
  /* Portal */
  slot(
    'portal.hero', 'wide', '50% 40%', 'P0', 'none', 'center', 'Portal · umbral',
    'Umbral de entrada al universo: lo primero que ve el visitante.',
    `A vast nocturnal threshold over still water: a circular opening of warm golden light, ${HALO}, hovering low above a mirror-calm dark sea at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, a sparse arc of fine stars and a small faint galaxy glow in the upper third, ${filaments('rising out of the haze like frequencies: the gold one rising straight up from the top of the ring and never crossing its inside, the teal one at 35% from the left, the lavender one at 65% from the left')}, a faint teal glow low on the horizon at the left and a faint lavender glow low on the horizon at the right, both fading out well before the frame edges`,
    'Centered, balanced wide composition with the horizon at about 52% from the top, the ring at 50% horizontal and 40% vertical, deep dark negative space all around, the bottom 30% of the frame plain dark still water with no reflections, for a logo and a button',
  ),
  slot(
    'portal.portal-field', 'cinema', '50% 50%', 'P1', 'none', 'none', 'Portal · campo',
    'El campo de energía donde se elige el camino: materia suspendida en el cruce.',
    'A horizontal field of luminous water at night: slow streams of golden light crossing a dark mirror-still surface, a soft beam of teal light and a soft beam of lavender light meeting at the center like a crossing of paths, faint concentric ripples where they meet, long-exposure feel',
    'Wide and horizontal, the crossing at dead center, dark margins on both sides',
  ),
  slot(
    'not-found.hero', 'wide', '50% 40%', 'P2', 'soft', 'center', '404',
    'Acompañar al visitante extraviado sin romper el hechizo.',
    'A serene empty corner of the cosmos: a single small warm lantern glowing on the surface of dark still water, a faint reflection beneath it, distant teal mist, a few fine stars far above, absolute calm, nobody present',
    'Lantern slightly above center, large calm dark water surface around it, empty sky above',
  ),

  /* Home */
  slot(
    'home.hero', 'wide', '62% 40%', 'P0', 'warm', 'left-bottom', 'Home · hero',
    'El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim. Cuerpo de luz: la imagen firma de la marca.',
    `The brand signature image: an ${BODY_OF_LIGHT}, resting on its side across the surface of dark still water, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse spiral-galaxy glow gathers beneath it in the water and ripples outward in concentric rings, the silhouette edged in warm gold with faint teal and lavender light flowing through it like fine veins of current, ${filaments('rising behind it')}, sparse fine stars in the upper third, deep navy background`,
    'The whole figure is small, only about a quarter of the frame width, and sits entirely inside the band between 62% and 88% of the frame width, never left of 62% and never closer to the right edge than 12%: its head at 62% horizontal and 40% vertical, its body extending to the right and ending at 88%, so a strip of dark empty water stays between its feet and the right edge and no part of it touches or crosses that edge; the left 55% of the frame is dark and empty for the headline, low camera angle at water level',
    {
      mobileFocal: '75% 40%',
      notes:
        'El foco móvil rige por debajo de 768 px: así el cuerpo de luz (62–88 % del ancho) queda dentro de la ventana visible.',
    },
  ),
  slot(
    'home.daily-frequency', 'cinema', '50% 50%', 'P1', 'warm', 'none', 'Home · frecuencia del día',
    'La frecuencia del día como materia: el sonido hecho imagen.',
    'Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in dark water and lit by golden light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light, top-down macro',
    'Pattern centered and radially symmetric, dark water fading to near-black at all four edges',
  ),
  slot(
    'home.realms-banner', 'cinema', '50% 50%', 'P1', 'none', 'none', 'Home · banner de realms',
    'Mapa de los nueve reinos: la invitación a entrar.',
    'A constellation as a map of nine realms: nine small glowing points of gold, teal and lavender light joined by the faintest filaments across an immense dark nebula, long-exposure night sky with a slow arc of stars, a thin line of still water along the lower edge mirroring the points',
    'Nine points spread across the width with the brightest near the center, deep dark edges',
  ),
  slot(
    'home-marisol-portrait', 'portrait', '50% 50%', 'P0', 'warm', 'none', 'Home · Sobre Marisol',
    'Retrato de la fundadora en arco de nicho: el ancla emocional de la marca.',
    'Mood reference only — the published photograph must come from a real session with Marisol. Intimate half-length portrait of a calm woman seated beside a window at dusk, warm candlelight on one side of her face, the candle itself outside the frame so that no candle, flame or other light source is visible and nothing bright touches the frame edge, natural linen clothing in ivory tones, soft gaze, quiet smile, dark navy room behind her',
    'Vertical 3:4, face in the upper third with generous headroom because a niche-arch mask is applied in CSS, shoulders and hands softly out of focus, dark edges',
    {
      realShoot: true,
      notes:
        'Sesión fotográfica real, no generada: es la cara de la marca. Lista de planos: (1) medio cuerpo sentada junto a la ventana, (2) primer plano con una vela, (3) manos sobre un cuenco de cristal, (4) de espaldas frente a la luz. Vestuario de lino en marfil, luz cálida de vela o de atardecer, fondo oscuro. Entregar 3:4 con aire sobre la cabeza, a 1440×1920 o más. Si aparece una vela en el plano, que quede dentro con al menos un 10 % de margen respecto al borde. El prompt sólo sirve como moodboard para el fotógrafo.',
    },
  ),
  slot(
    'home-membership', 'wide', '50% 15%', 'P2', 'warm', 'bottom', 'Home · membresía',
    'Atmósfera cálida que invita a la comunidad.',
    'Golden light pouring from above onto a still lake at dawn: a warm beam of light, one color only, warm gold, with no colored bands, falling from the top of the frame onto mist-covered water, a wide circle of low smooth stones lying flat on the shore as a gathering place, none stacked and none higher than a hand, dust motes and mist drifting, deep shadows in the corners',
    'The light source sits near the top edge at 15% vertical, the ring of stones in the middle distance, lower third dark for text',
  ),
  slot(
    'home.footer-banner', 'wide', '50% 40%', 'P2', 'soft', 'bottom', 'Home · cierre',
    'Cierre editorial: la despedida que invita a quedarse.',
    'The horizon after the page: a dusk sky with faint lavender clouds above a dark mirror-calm sea, a single thin line of gold light along the horizon, the first stars appearing, vast stillness',
    'The horizon line sits at exactly two fifths of the frame height from the top (40%): the sky fills the upper 40% and the dark water the lower 60%, fading to near-black for text',
  ),

  /* Sobre Marisol */
  slot(
    'about.hero', 'wide', '50% 40%', 'P1', 'warm', 'left-bottom', 'Sobre Marisol · hero',
    'Cabecera de la vista de Marisol: el lugar desde el que acompaña.',
    'The place where the work begins: a quiet terrace of dark stone at dusk opening onto a still lake and distant mountains in lavender mist, a low wooden table with a crystal singing bowl and a single lit candle standing in the middle distance at the far end of the terrace, near the edge of the water, a linen shawl left over a stone bench as if someone had just stepped out, warm golden light, a faint spiral of galaxy glow in the upper sky',
    'Table and candle at 60% horizontal and 40% vertical, which is the middle distance: the dark stone floor of the terrace extends in front of them across the whole lower half of the frame, left third dark and empty for the title, lower edge fading to near-black',
  ),
  slot(
    'about.angels', 'cinema', '50% 30%', 'P1', 'lav', 'bottom', 'Sobre Marisol · Experiencias con Ángeles',
    'La presencia sin figura: luz que desciende, nunca un ángel literal.',
    'Presence without a figure: a soft shaft of pale lavender and gold light descending through still dark air onto a mist-covered lake, a single white feather suspended mid-fall, fine luminous dust around it, no wings, no faces, no statues, no religious iconography',
    'Light source and feather in the upper third at 30% vertical, lower half dark and calm for the headline',
  ),

  /* Acceso */
  slot(
    'auth.hero', 'wide', '50% 40%', 'P1', 'soft', 'left', 'Acceso · hero',
    'El umbral personal que recibe antes del formulario.',
    'A tall arched doorway of soft golden light set into a dark stone wall at the edge of still water, seen from a few steps back, a warm path of light spilling across the wet stone and the water toward the viewer, mist at its base, quiet, inviting, nobody in the frame',
    'Arch placed in the right half, the left third dark stone and empty for a quote',
  ),
  slot(
    'auth.form-atmosphere', 'portrait', '50% 50%', 'P2', 'soft', 'low', 'Acceso · formulario',
    'Fondo atmosférico del formulario de acceso.',
    'Intimate calm: a surface of nearly black still water with a single soft golden point of light as small as a distant star, hovering just above the water, its reflection a short soft streak on the surface directly beneath it, the only element in the frame, with nothing around it or in front of it, and faint teal mist drifting low, blurred velvet-dark background, a soft warm glow at the bottom of the frame',
    'Vertical, very dark and low contrast (a form is laid over it later), the point of light in the lower third, generous dark space above',
  ),

  /* Descúbrete */
  slot(
    'discover.hero', 'wide', '50% 40%', 'P1', 'lav', 'left-bottom', 'Descúbrete · hero',
    'Bienvenida del quiz: la materia que abre la exploración.',
    'The beginning of a discovery: a narrow path of dark stone steps rising from still water into soft lavender and gold dawn mist over distant mountain ridges, a sense of a first step, no people',
    'Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright dawn light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), left third dark',
  ),
  slot(
    'discover.question-atmosphere', 'portrait', '50% 50%', 'P2', 'lav', 'low', 'Descúbrete · pregunta',
    'Respiro visual que acompaña cada pregunta.',
    'Soft-focus ambient abstraction: drifting translucent veils of lavender and teal mist with tiny golden specks like slow snowfall, very dark, almost abstract, the whole frame a single continuous field of soft mist with no object, no shape and no outline anywhere, the veils faint and low in saturation, and the golden specks few, tiny and out of focus',
    'Vertical, very low contrast: the brightest part of the frame is no lighter than a deep navy-lavender haze, nothing sharp and nothing with an edge, the lower third as dark as the rest (the question text is laid over the center)',
    {
      backdrop: true,
      notes:
        'Por eso es de bajo contraste y sin nada nítido: la ampliación no se percibe.',
    },
  ),
  slot(
    'discover.tuning', 'cinema', '50% 50%', 'P1', 'teal', 'none', 'Descúbrete · afinación',
    'El momento de la afinación personal: la materia que sintoniza. Cuerpo de luz.',
    `Tuning in: an ${BODY_OF_LIGHT}, seated at the edge of dark still water and seen from behind, head slightly bowed, as a halo of golden ripples spreads across the surface toward it from a single struck point, soft teal reflections in the water, ${filaments('rising from the ripples')}`,
    'Figure centered, ripples fanning left and right across the wide frame, dark edges',
  ),
  slot(
    'discover.result', 'wide', '50% 40%', 'P1', 'warm', 'center', 'Descúbrete · resultado',
    'El resultado del quiz como revelación visual. Cuerpo de luz.',
    `Revelation: an ${BODY_OF_LIGHT}, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single narrow beam of warm gold light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, gold, with no split and no colored bands, the body warm gold-white with only a very faint teal and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single warm gold column, a moment of clarity`,
    'The horizon line sits high, at 30% of the frame height, so the wide still water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark mist and still water with nothing bright, for the result text',
  ),

  /* Resonario */
  slot(
    'resonario.hero', 'wide', '50% 40%', 'P1', 'warm', 'left-bottom', 'Resonario · hero',
    'Cabecera del archivo sonoro: la escucha como paisaje.',
    'A vast dark resonant space over still water: rows of softly glowing translucent discs suspended at different depths like a solar system above a mirror-calm surface that doubles them, warm gold rims, drifting haze, cinematic depth of field',
    'Discs receding from the upper right toward the center, the left third dark and empty for the headline',
  ),
  slot(
    'resonario.featured', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Resonario · destacado',
    'Fondo del audio destacado de la semana.',
    'A backdrop for a featured disc: soft concentric rings of golden light radiating from an empty center across dark still water, faint teal and lavender halos at the edges',
    'Empty calm center (a disc is placed on top in the UI), rings fading to near-black at the edges',
  ),
  slot(
    'resonario.archive-banner', 'wide', '50% 40%', 'P2', 'lav', 'bottom', 'Resonario · archivo',
    'La colección completa como lugar.',
    'The archive as a place: a long colonnade of dark stone opening onto still water at dusk, tall niches holding softly glowing vessels — brass bowls, glass discs, ceramic jars — lavender haze, a few warm lamps far away reflected in the floor-water',
    'One-point perspective down the colonnade, lower third dark for text',
  ),
  slot(
    'resonario.audio-cover.*', 'square', '50% 50%', 'P1', 'none', 'center', 'Resonario · portadas',
    'Portada de cada audio del archivo: el sonido con rostro (16 audios).',
    '', 'Square, the exact center of the frame (50% horizontal, 50% vertical) is calm, dark and low in contrast because content is laid over it later: nothing bright and nothing sharp sits there',
    { family: 'audio' },
  ),

  /* Academia */
  slot(
    'academy.hero', 'wide', '50% 40%', 'P1', 'teal', 'left-bottom', 'Academia · hero',
    'Cabecera de la academia: el estudio como escena.',
    'Study as a scene: a low wooden desk on a quiet lakeside terrace at blue hour with an open blank notebook, a ceramic bowl and a lit candle, teal mist over the water and the far hills, no people',
    'Desk in the right half, the left third quiet and dark for the headline',
  ),
  slot(
    'academy.featured-course', 'cinema', '50% 40%', 'P1', 'teal', 'left', 'Academia · curso destacado',
    'El curso destacado con materia propia en la cabecera.',
    'The featured practice: a pair of hands cradling a small brass singing bowl with a wooden striker resting on its rim, golden candlelight on the hands, teal mist behind, close framing',
    'Hands and bowl in the right-center, the left third dark for the course title',
  ),
  slot(
    'academy-course-cover', 'cinema', '50% 40%', 'P1', 'teal', 'left', 'Academia · portadas de curso',
    'Materia visual de cada curso (3 cursos). Se ve 16:8 en el detalle y recortada 1:1 en la tarjeta.',
    '', 'Keep the subject inside the band between 40% and 70% of the width: that is inside the central 50% that a square crop of this panoramic frame keeps, and to the right of the left third, which stays dark because that side of the scene is unlit and quiet',
    { family: 'course' },
  ),
  slot(
    'academy-lesson-visual', 'cinema', '50% 50%', 'P1', 'teal', 'bottom', 'Academia · lección',
    'Respaldo de la lección: la práctica que acompaña al audio.',
    'A soft-focus practice backdrop: out-of-focus candle flames as warm bokeh and a pair of hands resting on knees in the far distance, teal shadows, almost abstract',
    'Very low contrast, nothing sharp in the lower third (the player controls sit there)',
  ),
  slot(
    'academy.completion', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Academia · curso completado',
    'Celebración del curso terminado: el logro con luz. Cuerpo de luz.',
    `A completed cycle closed in light: a ring of exactly twelve small golden lights, evenly spaced and with no other lights, floating on dark still water seen from a slightly oblique overhead angle, a small ${BODY_OF_LIGHT}, seated cross-legged at the far side of the ring, every light steady and one slightly brighter, concentric ripples radiating outward`,
    'Ring centered at 50% horizontal, its middle empty, dark and perfectly still water because content is laid over it later, the ripples spreading outward from the ring only, the small figure no taller than 12% of the frame height at the far edge of the ring at 50% horizontal and 30% vertical',
  ),

  /* Experiencias */
  slot(
    'experiences.hero', 'wide', '50% 40%', 'P1', 'lav', 'left-bottom', 'Experiencias · hero',
    'Cabecera de experiencias: el viaje como promesa.',
    'The journey as a promise: a lantern-lit path of stepping stones across still water toward a softly glowing pavilion on the far shore: a simple open pavilion of dark timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, lavender dusk mist between dark trees and hills, nobody present',
    'Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, lanterns leading in from the lower left, left third dark',
  ),
  slot(
    'experiences.featured', 'cinema', '50% 45%', 'P1', 'lav', 'left', 'Experiencias · destacada',
    'La experiencia destacada con presencia propia: el baño de sonido. Cuerpo de luz.',
    `A sound bath in progress: a circle of abstract translucent silhouettes of pure light, each ${LIGHT_BODY_TRAITS}, seated around a ring of crystal singing bowls glowing lavender and gold from within, set on dark still water that mirrors them, concentric rings of light spreading across the surface, drifting haze above`,
    'Ring of bowls and figures in the right two thirds at 45% vertical, left third dark for the title and the booking button',
  ),
  slot(
    'experiences-visual', 'wide', '62% 45%', 'P1', 'lav', 'left', 'Experiencias · filas',
    'La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).',
    '', 'The subject sits on the right, spanning roughly 50% to 80% of the frame width and centered at 45% vertical, and the left 45% of the frame is dark and empty because that side of the scene is unlit shore, water and sky, continuing across the whole width with no gradient, band or vertical edge; text is laid over that side later',
    { family: 'experience' },
  ),
  slot(
    'booking.hero', 'wide', '50% 40%', 'P1', 'lav', 'left-bottom', 'Reserva · hero',
    'El lugar de la experiencia elegida, antes de reservar.',
    'An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck over still water at twilight, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft lavender twilight on the planks and the mountains beyond',
    'Wide symmetrical, circle of cushions in the middle distance, the left third dark only because the hills, trees and water there fall into natural deep shadow: the mist and the mountain ridges continue across the whole width with no gradient, no band and no vertical edge',
  ),
  slot(
    'booking.confirmation', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Reserva · confirmación',
    'Confirmación con la materia del lugar: el sí con imagen.',
    'The same serene place now with its candles lit: a warm golden glow over the circle of cushions on the deck, reflected in the still water, a steaming cup set beside them, a soft light on the horizon',
    'Warm center, dark edges, calm space in the middle because content is laid over it later',
  ),

  /* Tienda */
  slot(
    'store.hero', 'wide', '50% 40%', 'P1', 'warm', 'left-bottom', 'Tienda · hero',
    'Cabecera de la tienda: el ritual de adquirir.',
    'The ritual of acquiring: a dark stone ledge at the edge of still water at night with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, low golden light raking across the objects and reflecting in the water behind them',
    'Objects in the right half at 40% vertical, the left third dark and empty for the headline',
  ),
  slot(
    'store-product-visual', 'square', '50% 50%', 'P1', 'warm', 'none', 'Tienda · productos',
    'El producto real, completo y centrado, a partir de su foto de referencia; materia de compra (8 productos).',
    '', 'One main object centered on a dark surface with a pool of warm light beneath it, occupying about 55% of the frame height, with any small companion directly beside its base, everything fully visible with at least 15% of dark space on every side',
    {
      family: 'product',
      reference: true,
      provisional:
        'Pendiente de Marisol: son fotografía real de sus productos y quedan por hacer (envase con etiqueta legible, tamaño o contenido, textura, una imagen en uso). Las ocho publicadas son provisionales; el catálogo real (nombres, tamaños, contenidos) también lo define ella. No se generan imágenes nuevas de producto.',
    },
  ),
  slot(
    'store.ritual-banner', 'wide', '50% 40%', 'P2', 'warm', 'bottom', 'Tienda · banner ritual',
    'Franja del ritual: los objetos como materia de práctica.',
    'Objects of ritual as matter: a top-down flat lay on dark slate of matches, copal resin, a small brass dish, dried herbs and a quartz point, a warm rim light from the left',
    'Objects grouped in the upper two thirds, the bottom third dark slate for text',
  ),
  slot(
    'product.detail', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Tienda · detalle',
    'El producto protagonista en su página: materia de contemplación y compra.',
    'A contemplation backdrop for a product: a dark surface with a soft pool of golden light and a single slow ribbon of smoke rising, faint teal haze at the edges',
    'Empty center-right for the product to be overlaid, light pool at center, near-black edges',
    {
      notes:
        'Fondo genérico para cualquier producto. Si se quisiera uno por producto, reutilizar el encuadre de store-product-visual-<slug> en panorámico: el mismo objeto con más aire lateral.',
    },
  ),
  slot(
    'product.related', 'cinema', '50% 50%', 'P2', 'warm', 'none', 'Tienda · relacionados',
    'Ristra de objetos afines: el conjunto como mundo.',
    'A sweep of a dark slate shelf with a line of softly out-of-focus ritual objects receding into warm bokeh, amber and honey tones, gentle depth',
    'Horizontal line of objects at 50% vertical, dark upper and lower edges',
  ),
  slot(
    'cart.empty', 'wide', '50% 40%', 'P2', 'soft', 'center', 'Carrito · vacío',
    'El vacío del carrito como calma, no como castigo.',
    'A small empty ceramic dish on a dark stone ledge beside still water, a single ray of warm light falling across it, a thread of steam rising, serene and open, nothing inside',
    'Dish at center slightly below the middle, dark ledge and background, calm space above',
  ),
  slot(
    'checkout.confirmation', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Compra · confirmación',
    'La compra confirmada con la materia del ritual.',
    'Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, warm candlelight, no writing on the wrapping',
    'Parcel centered, dark wooden surface, warm glow, calm empty space above it because content is laid over that area later',
  ),

  /* Mi santuario */
  slot(
    'sanctuary.hero', 'wide', '50% 40%', 'P1', 'soft', 'left-bottom', 'Mi Santuario · hero',
    'El espacio personal: la materia que recibe al volver. Cuerpo de luz.',
    `A personal sanctuary at night: an ${BODY_OF_LIGHT}, resting on a cushion beside a large window that opens onto a moonlit lake, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, teal moonlight balanced with golden glow, ${filaments('rising from the water outside')}`,
    'Window on the right with the figure beneath it, left third dark and calm',
  ),
  slot(
    'sanctuary.continue', 'cinema', '50% 50%', 'P1', 'warm', 'left', 'Mi Santuario · continuar',
    'La invitación a retomar la práctica donde se dejó.',
    'Continuity: the same cushion with a half-burned candle beside it and a blank open book, a soft warm glow, a feeling that someone has just stepped away and will return',
    'Objects in the right half, the left third dark for the lesson title',
  ),
  slot(
    'sanctuary.daily', 'square', '50% 50%', 'P1', 'warm', 'none', 'Mi Santuario · práctica diaria',
    'La práctica del día con materia propia.',
    'Today\'s practice: a small brass bowl of still water on dark stone, a single beam of early morning light falling into it and making it glow gold, tiny ripples',
    'Bowl centered, beam entering from the upper left, dark surroundings',
  ),
  // Fondo del campo de texto del diario: una caja apaisada (≈4:1 en escritorio, ≈6:5 en móvil) que
  // recorta el 2:1 por arriba y abajo o por los lados. Por eso todo vive en la franja central y sale
  // desenfocado: encima se escribe.
  slot(
    'sanctuary.journal', 'cinema', '50% 50%', 'P2', 'soft', 'low', 'Mi Santuario · diario',
    'La página sobre la que se escribe: el cuaderno, desenfocado y en penumbra, es el fondo del campo del diario y el texto va encima.',
    'The journal as a soft page to write on, entirely out of focus: an open linen-bound notebook with blank pages lying flat on dark wood, seen from directly above, a brass pen resting on the right page and one dried sprig of lavender beside the pen, faint warm candlelight from outside the frame grazing the paper, the whole image softly blurred as if photographed far out of focus, the edges of the notebook, the pen and the lavender dissolving into a gentle blur with no crisp line anywhere, the paper a dim muted ivory much darker than white, no writing on the pages, the table holding only these three things and nothing else',
    'The open notebook lies horizontally at the exact center of the frame, its spread between 25% and 75% of the frame width and between 30% and 70% of the frame height, the pen and the lavender inside that same area on the right page, the left page completely empty; the top quarter and the bottom quarter of the frame are only dark wood in shadow, and so are the left and right fifths, so the image can be cropped to its middle horizontal band or to its central square without losing anything',
  ),
  slot(
    'sanctuary.empty', 'wide', '50% 40%', 'P2', 'soft', 'center', 'Mi Santuario · vacío',
    'El santuario recién estrenado: vacío luminoso, no ausencia.',
    'Luminous emptiness: an empty dark space opening onto still water, a soft pool of light gathering in the center of the floor and reflecting in the water beyond, dust motes drifting, no objects, the quiet of a place that is new',
    'Light pool at center, slightly below the middle, dark space around it',
  ),

  /* Estados */
  slot(
    'states.loading', 'wide', '50% 42%', 'P2', 'soft', 'center', 'Estados · carga',
    'La espera con materia: cargar es también respirar.',
    'Waiting with matter: a single soft sphere of golden light floating in a dark misty space above still water as if breathing, faint halo, slow and calm',
    'Sphere at center, dark calm space around it',
  ),
  slot(
    'states.empty', 'wide', '50% 55%', 'P2', 'soft', 'center', 'Estados · vacío',
    'El vacío de marca en cualquier vista.',
    'An empty dark space with one soft window of pale lavender light on the still water, dust motes drifting through it, open space',
    'Light on the water just below center, dark space around it',
  ),
  slot(
    'states.error', 'wide', '50% 58%', 'P2', 'soft', 'center', 'Estados · error',
    'El error sin ruido: compañía en el tropiezo.',
    'Something interrupted: a single candle flickering on a dark stone ledge by still water with a wisp of smoke still rising, calm and unbothered, warm faint glow',
    'Candle at center, dark surroundings, quiet space above',
  ),
  slot(
    'states.offline', 'wide', '70% 45%', 'P2', 'lav', 'center', 'Estados · sin conexión',
    'La desconexión como retiro, no como fallo.',
    'A brief retreat: a quiet cabin window at night with a warm lamp inside and lavender mist over a still lake outside, a sense of pausing, nobody in the frame',
    'Window slightly right of center, dark surroundings',
  ),

  /*
   * Atmósferas (spec 2026-10-17): un fondo por ambiente, a sangre, con el tercio izquierdo en calma para el
   * titular. Las tres primeras son las muestras de la Fase 1 (atardecer, amanecer y tienda): se generan
   * primero. `provisional`: se sustituyen por fotografía propia o con licencia antes de publicar. Después, la
   * pieza celta y un banner por tipo de escucha del Resonario (spec §6).
   */
  slot(
    'atmosphere.forest-autumn', 'wide', '60% 50%', 'P2', 'forest-autumn', 'calm-left', 'Atmósfera · Bosque otoñal (nostalgia)',
    'Variante otoñal del bosque para Nostalgia y Vínculo: cálida y acogedora. Referencia de Marisol: el sendero de bosque en otoño.',
    'An autumn forest path: a narrow dirt path winding away between tall trees whose leaves are amber, russet and gold with a few soft greens, warm light filtering down through the canopy, a few fallen leaves on the path, soft mist in the far distance, cozy and warm',
    'The path vanishes at 62% horizontal and 52% vertical, the brightest foliage inside the band between 50% and 85% of the frame width, the left 40% of the frame is soft out-of-focus foliage and trunks in warm even tones, low in detail',
    { style: 'atmosphere', provisional: 'Sólo si hay material: la variante otoñal es opcional (spec §4.2). Sustituir por fotografía propia o con licencia comercial documentada.' },
  ),
  slot(
    'resonario.celtic', 'wide', '66% 50%', 'P1', 'forest', 'calm-left', 'Resonario · música de inspiración celta',
    'La pieza celta, con su texto editorial («una invitación a bajar el ritmo»): un arpa junto a una ventana sobre colinas verdes en la bruma.',
    'A Celtic lever harp of dark polished wood with fine carved knotwork on its pillar and gut strings, resting against a smooth pale stone window sill with only a little moss at its edge, in soft early morning light, beyond the window soft green hills and a quiet misty coast under pale light, a small bunch of green fern in a stone jar beside the harp, no hands and no people',
    'The harp between 58% and 82% of the frame width and its top at 25% from the top (not higher), the window view behind it, the left 40% of the frame is a plain stone wall in even deep shade, a dark olive-grey in low light, with only a very faint low-contrast mottling and no visible moss texture, no shafts of light, no haze streaks and no bright patch, calm, low in detail and dark enough for ivory text to stay readable on it',
    { style: 'atmosphere', provisional: 'Imagen de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.' },
  ),
  slot(
    'resonario.kind-banner.*', 'cinema', '50% 50%', 'P2', 'forest', 'none', 'Resonario · tipo de escucha',
    'Un banner por tipo de escucha, con su explicación debajo: melodías, naturaleza, frecuencias y tonos, binaurales y prácticas guiadas (5 tipos).',
    '',
    'Wide and horizontal, the main subject at the exact center of the frame, calm space at both sides, everything important kept away from the top and bottom edges because the image is cropped to 2:1',
    { style: 'atmosphere', provisional: 'Imágenes de apoyo. Sustituir por fotografía propia o con licencia comercial documentada.', family: 'kind' },
  ),
]

/* --------------------------------------------------------------- instancias */

/**
 * Los slots `family` se aplican por instancia: cada ítem del catálogo tiene su propio archivo
 * (`<slot-id>-<slug>.avif`). Los títulos deben coincidir con `messages/es.json` y `en.json`; el test
 * de la web lo comprueba.
 */
export const FAMILIES = {
  audio: {
    slotId: 'resonario.audio-cover.*',
    filePrefix: 'resonario-audio-cover',
    instances: [
      { slug: 'a1', es: 'Regreso a la Calma', en: 'Return to Calm', hz: 432, treatment: 'teal', subject: 'Still water at dusk, a single pebble just dropped, perfect concentric ripples spreading in teal and gold light, calm and cool' },
      { slug: 'a2', es: 'Luz Interior', en: 'Inner Light', hz: 528, treatment: 'lav', subject: 'A dark lavender crystal geode resting low in the frame, within its lower 40%, seen from slightly above with its opening turned away, so that only a dim warm glow shows deep between the facets, no brighter than the faint rim light on the crystals, while the upper-center of the frame is plain dark mist and dark water, open and calm' },
      { slug: 'a3', es: 'Raíces Profundas', en: 'Deep Roots', hz: 396, treatment: 'teal', subject: 'Dark moss-covered stones half-submerged at the edge of black water, fine exposed roots in earth, a thread of gold light running between them, grounded and quiet' },
      { slug: 'a4', es: 'Umbral del Sueño', en: 'Threshold of Sleep', hz: 174, treatment: 'lav', subject: 'An indigo night lake under a drifting veil of mist, a doorway of soft hazy light far away on the shore, heavy and soothing' },
      { slug: 'a5', es: 'Aroma de Cedro', en: 'Cedar Aroma', hz: 639, treatment: 'warm', subject: 'Amber cedar smoke curling upward from a small brass burner against darkness, a bundle of cedar sprigs beside it, warm glow' },
      { slug: 'a6', es: 'Respirar el Cielo', en: 'Breathe the Sky', hz: 417, treatment: 'teal', subject: 'A lagoon-teal sky at blue hour with soft layered clouds lit from below by faint gold, open air, spacious' },
      { slug: 'a7', es: 'Corazón Abierto', en: 'Open Heart', hz: 528, treatment: 'soft', subject: 'Two cupped hands entering from the bottom edge of the frame and filling only its lower 40%, holding a small faint warm glow no brighter than the highlights on the skin, against a sage-green dark background, while the upper 60% of the frame, including its exact center, is plain dark sage-green, calm and low in contrast, tender and open' },
      { slug: 'b1', es: 'Pulso sereno', en: 'Calm pulse', treatment: 'teal', subject: 'Concentric slow ripples of pale light spreading across a dark night lake, teal and silver, no figures, the upper 40% plain dark sky, calm and wide' },
      { slug: 'b2', es: 'Pulso de raíz', en: 'Grounding pulse', treatment: 'teal', subject: 'A dark moss-green riverbank at night seen across calm water: the bank, its trunk and its roots fill only the left 30% of the frame and its lower-left corner, with the root tips reaching down into the still water there and none of them going past 35% of the frame width, the far shore low and misty at 32% from the top, one single thin soft line of teal light lying along the far water at 32% from the top, faint and diffuse, beginning at 50% of the width and ending at 85% of the width so that it fades to nothing well before the right edge, never a sharp bright streak, and the whole middle of the lake, including the exact center of the frame, plain dark still water with no roots, no line and no reflection, quiet and grounded' },
      { slug: 'n1', es: 'Orilla de mar', en: 'Seashore', treatment: 'teal', subject: 'A dark night shoreline, long low waves catching faint silver light, sea mist drifting over the water, horizontal and spacious' },
      { slug: 'n2', es: 'Lluvia en la ventana', en: 'Rain at the window', treatment: 'lav', subject: 'Rain falling over a dark valley at night, soft blurred lights far away, long pale streaks of rain catching the light, lavender mist, calm' },
      { slug: 'n3', es: 'Canto de aves', en: 'Birdsong', treatment: 'warm', subject: 'A dawn sky over a forest edge seen from a dark misty meadow: the whole treeline and the pale gold light breaking through the treetops sit high in the upper third, between 15% and 35% of the frame height, a few birds as tiny dark shapes in that light, open air above, and everything from 40% of the frame height downward, including the exact center, plain dark misty meadow in deep shadow with no bright cloud, no silhouette edge and no glow' },
      { slug: 'm1', es: 'Música celta para bajar el ritmo', en: 'Celtic music to slow down', treatment: 'lav', subject: 'Low mist over dark water in a valley at blue hour, a single line of warm light on the far hills, quiet and unhurried' },
      { slug: 'm2', es: 'Piano para la pausa', en: 'Piano for the pause', treatment: 'soft', subject: 'Soft ivory light falling on still dark water at night, minimal: a faint pale haze of light low over the far horizon at 30% from the top with no visible moon or sun disc, a single narrow soft pale reflection on the water that stays entirely inside the band between 62% and 80% of the frame width, faint teal and lavender tints in the haze for balance, and a long quiet space of plain dark still water everywhere else, including the exact center of the frame, the brightest part of the whole image no brighter than a pale soft haze' },
      { slug: 'g1', es: 'Respiración guiada', en: 'Guided breathing', treatment: 'teal', subject: 'A soft column of luminous fog rising slowly from dark still water under a night sky, silver-teal light, open and calm: the column stands to the right of the frame inside the band between 66% and 86% of the width, its base on the water at the horizon at 36% from the top and its top fading out in the upper third, its faint reflection on the water in the same band, and plain dark still water and dark sky everywhere else, including the exact center of the frame' },
      { slug: 'g2', es: 'Un momento para ti', en: 'A moment for you', treatment: 'warm', subject: 'A single warm glow seen through mist at the edge of a dark forest at night, an intimate landscape with no figures' },
    ],
  },
  course: {
    slotId: 'academy-course-cover',
    filePrefix: 'academy-course-cover',
    instances: [
      { slug: 'c1', es: 'El Arte de Volver a Ti', en: 'The Art of Returning to You', treatment: 'lav', subject: `A small ${BODY_OF_LIGHT}, seated cross-legged on a dark rock at the edge of still water at dawn, seen from behind with the head turned away from the camera, the whole figure made of soft glowing light from head to knees, a smooth luminous form edged in warm gold with faint teal and lavender light flowing through it like fine veins of current, its glow mirrored softly on the water, lavender and gold first light over distant misty mountains, deep calm; it is the only figure in the scene, about 12% of the frame width and centered at 55% horizontal` },
      { slug: 'c2', es: 'Rituales Conscientes', en: 'Conscious Rituals', treatment: 'teal', subject: 'Hands arranging ritual objects on dark stone — a ceramic bowl, a candle, a sprig of cedar — moss-green and gold light, unhurried gesture' },
      { slug: 'c3', es: 'Aromas que Acompañan', en: 'Aromas that Accompany', treatment: 'warm', subject: 'Amber glass vials of essential oils, dried cedar and herbs on a dark wooden tray, warm golden light and a thread of fragrant smoke' },
    ],
  },
  experience: {
    slotId: 'experiences-visual',
    filePrefix: 'experiences-visual',
    instances: [
      { slug: 'e1', es: 'Baño de Sonido en Vivo', en: 'Live Sound Bath', treatment: 'lav', subject: 'Crystal and brass singing bowls glowing from within on a dark wooden platform over still water, candles between them, rings of light spreading across the surface, a soft haze; nobody present' },
      { slug: 'e2', es: 'Círculo de Luna Nueva', en: 'New Moon Circle', treatment: 'lav', subject: 'An empty ceremonial place waiting for its guests: a circle of small candles, each with a small steady flame, on a dark stone shore beneath a thin new-moon crescent low in the upper part of the sky over still water, the middle of the circle bare dark stone with nothing and nobody in it, the shore deserted, quiet and ceremonial; the only things on the shore are the candles, nobody present' },
      { slug: 'e3', es: 'Ritual de Aromas', en: 'Aroma Ritual', treatment: 'warm', subject: 'A brass burner with copal smoke rising in slow spirals, amber oil bottles and dried herbs beside it on a dark wooden table in a quiet room that opens onto still water, golden light' },
      { slug: 'e4', es: 'Meditación al Amanecer', en: 'Sunrise Meditation', treatment: 'teal', subject: 'A small terrace at first light with a cushion and a steaming cup placed in the middle distance at the far end of the terrace, teal mist over distant hills and still water, the first gold on the horizon; nobody present' },
    ],
  },
  product: {
    slotId: 'store-product-visual',
    filePrefix: 'store-product-visual',
    instances: [
      { slug: 'p1', es: 'Aceite Esencial · Cedro Sagrado', en: 'Essential Oil · Sacred Cedar', treatment: 'warm', subject: `The essential-oil bottle ${FROM_REFERENCE}, with a cedar sprig beside its base, the whole bottle and sprig held inside the central 50% of the frame height with plain dark surface above and below` },
      { slug: 'p2', es: 'Vela Ritual · Luz de Vela', en: 'Ritual Candle · Candlelight', treatment: 'warm', subject: `The ritual candle ${FROM_REFERENCE}, lit, with a small steady flame and its glow reflected in its vessel` },
      { slug: 'p3', es: 'Cuarzo de Serenidad', en: 'Serenity Quartz', treatment: 'lav', subject: `The quartz crystal ${FROM_REFERENCE}, standing upright with a faint lavender light inside it and a soft warm rim light` },
      { slug: 'p4', es: 'Bruma de Enraizamiento', en: 'Grounding Mist', treatment: 'teal', subject: `The mist spray bottle ${FROM_REFERENCE}, with a fine mist drifting beside it, moss and stone beneath` },
      { slug: 'p5', es: 'Incienso · Bosque de Copal', en: 'Incense · Copal Forest', treatment: 'soft', subject: `The incense ${FROM_REFERENCE}, with a thin ribbon of smoke rising beside it` },
      { slug: 'p6', es: 'Sal de Baño · Luna Llena', en: 'Bath Salt · Full Moon', treatment: 'lav', subject: `The bath-salt container ${FROM_REFERENCE}, with a wooden scoop beside its base, soft moonlit sheen` },
      { slug: 'p7', es: 'Infusión · Calma de Cedro', en: 'Infusion · Cedar Calm', treatment: 'warm', subject: `The herbal infusion ${FROM_REFERENCE}, with dried herbs scattered near its base, amber light` },
      { slug: 'p8', es: 'Diario de Frecuencias', en: 'Frequency Journal', treatment: 'teal', subject: `The journal ${FROM_REFERENCE}, closed, with a brass pen lying beside it` },
    ],
  },
}

/**
 * Un banner por tipo de escucha del Resonario (spec 2026-10-17 §6.1). Los nombres son los de la interfaz;
 * aún no están en `messages/` porque ninguna vista los pinta.
 */
FAMILIES.kind = {
  slotId: 'resonario.kind-banner.*',
  filePrefix: 'resonario-kind-banner',
  instances: [
    { slug: 'melody', es: 'Melodías instrumentales', en: 'Instrumental melodies', treatment: 'marisol', subject: 'The open lid of a dark wooden upright piano standing against a cream wall, a cello resting on its side beside the piano on a wooden floor, soft morning light from a window at the left falling across the wood, warm honey and cream tones, nobody present' },
    { slug: 'nature', es: 'Naturaleza', en: 'Nature', treatment: 'forest', subject: 'A calm forest stream running over smooth mossy stones under a fine soft rain, ferns along both banks, a single small songbird perched on a mossy branch at 25% from the left and 30% from the top, fresh natural greens' },
    { slug: 'frequency', es: 'Frecuencias y tonos', en: 'Frequencies and tones', treatment: 'store', subject: 'Sound made visible: fine pale sand forming a symmetrical Chladni geometric pattern on a round brass plate, top-down macro, warm soft side light from the left, delicate concentric lines and petals of sand, the plate resting on pale stone' },
    { slug: 'binaural', es: 'Binaurales', en: 'Binaural', treatment: 'dusk', subject: 'Two broad soft beams of light with no outline, like the glow of a distant lamp through mist, one a cool silver-blue entering from the left edge and one a warm amber entering from the right edge, drifting low over a calm sea at dusk and meeting in a quiet soft glow at the center, a gentle mirrored reflection on the water' },
    { slug: 'guided', es: 'Prácticas guiadas', en: 'Guided practices', treatment: 'dawn', subject: 'An empty round linen cushion and a folded cream blanket on a pale wooden floor beside a window at early morning, a steaming ceramic cup beside the cushion, a soft shaft of daylight falling across the floor, an invitation to sit, nobody present' },
  ],
}

/** Imágenes que aún no son un slot registrado: el inventario las lista como «sin cablear» o no existen. */
export const EXTRAS = [
  {
    id: 'og-image',
    file: 'og-image.jpg',
    preset: null,
    size: [1200, 630],
    ratio: '1.91:1',
    focal: '50% 50%',
    priority: 'P0',
    treatment: 'warm',
    safe: 'center',
    view: 'Metadatos · Open Graph',
    role: 'Imagen al compartir el enlace en redes y mensajería. No está cableada: hay que añadirla a los metadatos.',
    subject:
      `The Frecuencia Mágica universe in one frame: a golden circle of light, ${HALO}, hovering above a mirror-calm dark sea at the horizon, fine concentric arcs in a deep navy cosmos above, faint teal dust toward the left and faint lavender dust toward the right, both fading before the frame edges, ${filaments('standing in the haze: the gold one rising straight up from the top of the circle and never crossing its inside, the teal one at 35% from the left, the lavender one at 65% from the left')}, the inside of the circle dark and empty for the logo to be composited later`,
    frame: 'Landscape 1.91:1, the circle centered, dark edges, keep everything important within the central 80% because platforms crop',
    unregistered: true,
    notes: 'JPEG (las plataformas sociales no leen AVIF de forma fiable), 1200×630, ≤ 300 KB. Componer el logo encima, no generarlo.',
  },
]

/* ---------------------------------------------------------------- utilidades */

export function presetFor(entry) {
  return PRESETS[entry.preset]
}

function sizeOf(entry) {
  if (entry.size) return entry.size
  return presetFor(entry).master
}

/** `[2880, 1620]` → `"2880×1620"`. */
export function formatSize(size) {
  return `${size[0]}×${size[1]}`
}

/** `true` en las imágenes de atmósfera (enmienda 2026-10-17): otro etalonaje que el de la noche. */
export const isAtmosphere = (entry) => entry.style === 'atmosphere'

/** Estilo común que cierra el prompt de una imagen: el nocturno o el de las atmósferas. */
export function baseFor(entry) {
  return isAtmosphere(entry) ? GLOBAL.atmosphere.base : GLOBAL.base
}

/** Tratamiento de color de una imagen, según el estilo al que pertenece. */
function treatmentFor(entry, key) {
  return isAtmosphere(entry) ? GLOBAL.atmosphere.treatments[key] : GLOBAL.treatments[key]
}

/** Prompt completo, listo para pegar: sujeto, encuadre, estilo y tratamiento. */
export function composePrompt(entry, instance) {
  const treatment = instance?.treatment ?? entry.treatment
  const subject = instance ? instance.subject : entry.subject

  const layout = [FRAMING[entry.preset] ?? FRAMING.wide, SAFE_PROMPT[entry.safe]]
    .filter(Boolean)
    .join(' ')

  const prompt = `${subject}. ${entry.frame}. ${layout} ${treatmentFor(entry, treatment)} ${baseFor(entry)}`

  // Con foto de referencia, la etiqueta del producto es el único texto permitido.
  return entry.reference ? `${prompt} ${LABEL_EXCEPTION}` : prompt
}

/**
 * Negativo del agente. El retrato de Marisol es la única imagen donde un rostro es lo que se busca, y los
 * productos con foto de referencia, las únicas donde el texto de la etiqueta debe verse.
 */
export function negativeFor(entry) {
  if (isAtmosphere(entry)) return `${GLOBAL.negative}${GLOBAL.atmosphere.negativeExtra}`

  if (entry.reference) return GLOBAL.negative.replace(TEXT_CLAUSE, TEXT_CLAUSE_BUT_LABEL)

  return entry.realShoot ? GLOBAL.negative.replace(FACE_CLAUSE, '') : GLOBAL.negative
}

/** Todas las imágenes a producir, con las familias ya expandidas por instancia. */
export function expandAll() {
  const rows = []

  for (const entry of [...SLOTS, ...EXTRAS]) {
    if (entry.family) {
      const family = FAMILIES[entry.family]

      for (const instance of family.instances) {
        rows.push({
          ...entry,
          id: `${entry.id.replace('.*', '')}:${instance.slug}`,
          slotId: entry.id,
          file: `${family.filePrefix}-${instance.slug}.avif`,
          instance,
          title: instance.es,
          treatment: instance.treatment,
          prompt: composePrompt(entry, instance),
          size: sizeOf(entry),
        })
      }
    } else {
      rows.push({ ...entry, slotId: entry.id, prompt: composePrompt(entry), size: sizeOf(entry) })
    }
  }

  for (const variant of THEME_VARIANTS) {
    const base = SLOTS.find((slot) => slot.id === variant.base)
    if (!base) throw new Error(`variante de tema sin slot base: ${variant.base}`)

    const label = THEME_LABELS[variant.theme]
    const entry = {
      ...base,
      focal: variant.focal ?? base.focal,
      treatment: variant.theme,
      safe: variant.safe ?? CALM_SAFE[base.safe] ?? base.safe,
      subject: variant.subject,
      frame: variant.frame ?? base.frame,
      style: 'atmosphere',
    }

    rows.push({
      ...entry,
      id: `${variant.base}@${variant.theme}`,
      slotId: variant.base,
      theme: variant.theme,
      file: base.file.replace(/\.avif$/, `-${variant.theme}.avif`),
      title: label,
      view: `${base.view} · tema`,
      role: `Variante del tema ${label} de \`${variant.base}\`: la misma vista y el mismo encuadre, con la escena del tema. ${base.role}`,
      provisional: variant.provisional ?? PROVISIONAL_VARIANT,
      prompt: composePrompt(entry),
      size: sizeOf(entry),
    })
  }

  return rows
}

export function summarize() {
  const rows = expandAll()
  const byPriority = { P0: 0, P1: 0, P2: 0 }

  for (const row of rows) byPriority[row.priority] += 1

  return {
    total: rows.length,
    registeredSlots: SLOTS.length,
    byPriority,
    realShoot: rows.filter((row) => row.realShoot).length,
    unregistered: rows.filter((row) => row.unregistered).length,
  }
}

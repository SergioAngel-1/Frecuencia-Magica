/**
 * Brief fotográfico de Frecuencia Mágica: una fila por imagen que la web necesita, con medidas,
 * contenido y un prompt para un agente de imágenes.
 *
 * Es JS puro y sin imports a propósito: lo consumen la página `/fotografia` (Vite) y el script
 * `scripts/export-photo-brief.mjs` (Node) que genera `docs/brief-fotografico.md`. El contrato que
 * manda es `frontend/src/config/editorial-media.ts` (ratio, prioridad, focal); un test de la web
 * (`frontend/tests/lib/photography-brief.test.ts`) falla si este archivo se desvía de él.
 *
 * Dirección: «fotografía como materia; world engine como energía». La foto es oscura y cálida, con
 * bordes que se funden con `--void`; los scrims y las máscaras los aplica el CSS, nunca el archivo.
 */

/* ------------------------------------------------------------------ medidas */

/**
 * Presets de tamaño. `master` es el archivo de trabajo (2× el ancho de render máximo, DPR capado a 2);
 * `tablet` y `mobile` son derivados para `srcset`. `generate` es lo que conviene pedirle al agente de
 * imágenes (la mayoría no entrega 2880 px nativos): se reescala al master con un upscaler.
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
  formats: 'AVIF (principal) y WebP (respaldo). El único PNG permitido es el logo.',
  dir: 'frontend/public/editorial/',
  naming: '`<slot-id>.<ext>` con el punto cambiado por guion (`portal.hero` → `portal-hero.avif`). Por instancia: `<slot-id>-<slug>.avif`.',
  color: 'sRGB, perfil incrustado, sin canal alfa.',
  dpr: 'Máximo 2× el ancho de render (DPR capado a 2). No exportar por encima del master.',
}

/* ------------------------------------------------------------------ estilo */

export const GLOBAL = {
  /** Se añade al final de todos los prompts, después del sujeto y el encuadre. */
  base:
    'Cinematic fine-art photograph, natural film look with subtle grain, shallow depth of field, soft atmospheric haze, ' +
    'low-key lighting from a single warm golden source (candlelight or low sun) against deep midnight-navy shadows (#0F1B2E), ' +
    'faint teal (#96C6BC) and lavender (#B9B0D6) ambient reflections, ivory (#F7F4EA) highlights, muted desaturated palette, ' +
    'serene, intimate, poetic, timeless, editorial wellness photography, dark edges that melt into the background, no text.',
  treatments: {
    warm: 'Dominant tone: warm gold (#D8B978) glow on dark ground.',
    teal: 'Dominant tone: soft teal (#96C6BC) mist with gold accents.',
    lav: 'Dominant tone: lavender (#B9B0D6) dusk with gold accents.',
    soft: 'Balanced gold, teal and lavender, ultra calm, very low contrast.',
    none: 'Balanced gold, teal and lavender, cosmic and immersive.',
  },
  negative:
    'text, letters, numbers, captions, watermark, logo, signature, UI elements, frame, border, baked vignette, baked gradient overlay, ' +
    'stock photo look, wellness clichés (lotus on a sunset beach, yoga pose on a mountain, stacked zen stones, om symbol, buddha statue), ' +
    'neon, oversaturated colors, HDR, pastel candy colors, bright white or grey background, plastic skin, distorted hands, extra fingers, ' +
    'cartoon, 3D render look, emojis, recognizable faces',
  rules: [
    'Sin texto, logos, marcas ni etiquetas legibles dentro de la imagen: el copy lo pone la web.',
    'Sin rostros reconocibles (salvo el retrato de Marisol, que es una sesión real): manos, espaldas, siluetas lejanas u objetos.',
    'Luz dorada sobre fondo oscuro: los bordes de la imagen tienden a --void para que el scrim de CSS funda sin corte.',
    'Nada de fondos blancos, grises ni pasteles: es un universo nocturno. Tonos de oro, teal y lavanda, nunca saturados.',
    'Sin stock ni Unsplash. Lo generado es materia de ambiente y dirección de arte: cuando exista el producto físico o la persona real, se sustituye por fotografía real.',
    'Sin máscaras, viñetas ni degradados horneados: los aplica el CSS.',
  ],
}

/** Zona despejada para el texto que se superpone (lo decide el scrim del componente). */
export const SAFE = {
  left: 'Tercio izquierdo oscuro y despejado (el texto va a la izquierda)',
  bottom: 'Franja inferior despejada (el texto va abajo, sobre scrim)',
  'left-bottom': 'Tercio izquierdo e inferior despejados (titular y CTA)',
  center: 'Centro despejado: lleva un disco, una cifra o un logo encima',
  none: 'Sin texto encima: composición libre',
  low: 'Baja luminosidad general: va detrás de un formulario de cristal',
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
    'A vast nocturnal threshold: a circular opening of warm golden light hovering in an immense dark indigo space, fine luminous dust suspended in the air, faint concentric arcs of light emerging from the haze like sacred geometry, distant teal and lavender nebula glow at the far edges',
    'Symmetrical wide composition, the light source at 50% horizontal and 40% vertical, deep dark negative space all around, lower third quiet for a logo and a button',
  ),
  slot(
    'portal.portal-field', 'cinema', '50% 50%', 'P1', 'none', 'none', 'Portal · campo',
    'El campo de energía donde se elige el camino: materia suspendida en el cruce.',
    'A horizontal field of suspended luminous matter: slow streams of golden particles crossing a dark plane, a soft beam of teal light and a soft beam of lavender light meeting at the center like a crossing of paths, long-exposure feel',
    'Wide and horizontal, the crossing at dead center, dark margins on both sides',
  ),
  slot(
    'not-found.hero', 'wide', '50% 40%', 'P2', 'soft', 'center', '404',
    'Acompañar al visitante extraviado sin romper el hechizo.',
    'A serene empty corner of the cosmos: a single small warm lantern glowing on the surface of dark still water, a faint reflection beneath it, distant teal mist, absolute calm, nobody present',
    'Lantern slightly above center, large calm dark water surface around it, empty sky above',
  ),

  /* Home */
  slot(
    'home.hero', 'wide', '62% 40%', 'P0', 'warm', 'left-bottom', 'Home · hero',
    'El universo entero en una imagen: materia del hero con kicker, título y CTA sobre scrim.',
    'A sound-bath still life: a large crystal singing bowl glowing gold from within on dark stone, curls of incense smoke rising from beside it, fine rings of light rippling outward from the bowl, deep navy background with soft teal and lavender bokeh',
    'The bowl sits in the right half at 62% horizontal and 40% vertical, the left 55% of the frame is dark and empty for the headline, slightly low camera angle',
  ),
  slot(
    'home.daily-frequency', 'cinema', '50% 50%', 'P1', 'warm', 'none', 'Home · frecuencia del día',
    'La frecuencia del día como materia: el sonido hecho imagen.',
    'Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in dark water and lit by golden light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light, top-down macro',
    'Pattern centered and radially symmetric, dark water fading to near-black at all four edges',
  ),
  slot(
    'home.audio-banner', 'wide', '50% 40%', 'P2', 'teal', 'bottom', 'Home · banner de audio',
    'Franja fotográfica que invita a escuchar.',
    'Listening as landscape: a night clearing where layered translucent bands of teal mist and golden light stack across the scene like the strata of a waveform, dark pine silhouettes far away, suspended fireflies of light',
    'Horizontal layered bands, brightest strata in the middle third, lower third dark and quiet for text',
  ),
  slot(
    'home.realms-banner', 'cinema', '50% 50%', 'P1', 'none', 'none', 'Home · banner de realms',
    'Mapa de los nueve reinos: la invitación a entrar.',
    'A constellation as a map of nine realms: nine small glowing points of gold, teal and lavender light joined by the faintest filaments across an immense dark nebula, photographic long-exposure night sky with a slow arc of stars',
    'Nine points spread across the width with the brightest near the center, deep dark edges',
  ),
  slot(
    'home-marisol-portrait', 'portrait', '50% 50%', 'P0', 'warm', 'none', 'Home · Sobre Marisol',
    'Retrato de la fundadora en arco de nicho: el ancla emocional de la marca.',
    'Mood reference only — the published photograph must come from a real session with Marisol. Intimate half-length portrait of a calm woman seated beside a window at dusk, warm candlelight on one side of her face, natural linen clothing in ivory tones, soft gaze, quiet smile, dark navy room behind her',
    'Vertical 3:4, face in the upper third with generous headroom because a niche-arch mask is applied in CSS, shoulders and hands softly out of focus, dark edges',
    {
      realShoot: true,
      notes:
        'Sesión fotográfica real, no generada: es la cara de la marca. Lista de planos: (1) medio cuerpo sentada junto a la ventana, (2) primer plano con una vela, (3) manos sobre un cuenco de cristal, (4) de espaldas frente a la luz. Vestuario de lino en marfil, luz cálida de vela o de atardecer, fondo oscuro. Entregar 3:4 con aire sobre la cabeza. El prompt sólo sirve como moodboard para el fotógrafo.',
    },
  ),
  slot(
    'home-membership', 'wide', '50% 15%', 'P2', 'warm', 'bottom', 'Home · membresía',
    'Atmósfera cálida que invita a la comunidad.',
    'Golden light pouring from above into a serene empty communal space: a long low wooden table surrounded by floor cushions in a circle, a warm beam of light falling from the top of the frame, dust motes drifting, deep shadows in the corners',
    'The light source sits near the top edge at 15% vertical, table and cushions in the middle distance, lower third dark for text',
  ),
  slot(
    'home.footer-banner', 'wide', '50% 40%', 'P2', 'soft', 'bottom', 'Home · cierre',
    'Cierre editorial: la despedida que invita a quedarse.',
    'The horizon after the page: a dusk sky with faint lavender clouds above a dark calm plain, a single thin line of gold light along the horizon, the first stars appearing, vast stillness',
    'Horizon at 40% vertical, sky above, dark ground below fading to near-black for text',
  ),

  /* Acceso */
  slot(
    'auth.hero', 'wide', '50% 40%', 'P1', 'soft', 'left', 'Acceso · hero',
    'El umbral personal que recibe antes del formulario.',
    'A tall arched doorway of soft golden light set into a dark stone wall, seen from a few steps back, a warm path of light spilling across the floor toward the viewer, quiet, inviting, nobody in the frame',
    'Arch placed in the right half, the left third dark stone and empty for a quote',
  ),
  slot(
    'auth.form-atmosphere', 'portrait', '50% 50%', 'P2', 'soft', 'low', 'Acceso · formulario',
    'Fondo atmosférico del formulario de acceso.',
    'Intimate calm: a single lit candle and a small ceramic bowl of water on a dark wooden table, blurred velvet-dark background, a soft warm glow at the bottom of the frame',
    'Vertical, very dark and low contrast (it sits behind a glass form), candle in the lower third, generous dark space above',
  ),

  /* Descúbrete */
  slot(
    'discover.hero', 'wide', '50% 40%', 'P1', 'lav', 'left-bottom', 'Descúbrete · hero',
    'Bienvenida del quiz: la materia que abre la exploración.',
    'The beginning of a discovery: a narrow path of dark stone steps dissolving upward into soft lavender and gold dawn mist, a sense of a first step, no people',
    'Path entering from the lower right toward a bright vanishing point at 50% horizontal and 40% vertical, left third dark',
  ),
  slot(
    'discover.question-atmosphere', 'portrait', '50% 50%', 'P2', 'lav', 'low', 'Descúbrete · pregunta',
    'Respiro visual que acompaña cada pregunta.',
    'Soft-focus ambient abstraction: drifting translucent veils of lavender and teal mist with tiny golden specks like slow snowfall, very dark, almost abstract',
    'Vertical, very low contrast, nothing sharp (it sits behind the question text)',
  ),
  slot(
    'discover.tuning', 'cinema', '50% 50%', 'P1', 'teal', 'none', 'Descúbrete · afinación',
    'El momento de la afinación personal: la materia que sintoniza.',
    'Tuning in: a brass tuning fork just struck in the dark, a halo of golden light ripples spreading around it, macro photograph, shallow depth of field, subtle teal reflections on the metal',
    'Fork centered, ripples fanning left and right across the wide frame, dark edges',
  ),
  slot(
    'discover.result', 'wide', '50% 40%', 'P1', 'warm', 'center', 'Descúbrete · resultado',
    'El resultado del quiz como revelación visual.',
    'Revelation: a clear glass sphere on a dark surface catching a single beam of warm light and splitting it into soft gold, teal and lavender glows that fall across the surface, a moment of clarity',
    'Sphere centered slightly below the middle, light coming from the upper left, dark background',
  ),

  /* Biblioteca */
  slot(
    'library.hero', 'wide', '50% 40%', 'P1', 'warm', 'left-bottom', 'Biblioteca · hero',
    'Cabecera del archivo sonoro: la escucha como paisaje.',
    'A vast dark resonant space: rows of softly glowing translucent discs suspended at different depths like a solar system, warm gold rims, drifting haze, cinematic depth of field',
    'Discs receding from the upper right toward the center, the left third dark and empty for the headline',
  ),
  slot(
    'library.featured', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Biblioteca · destacado',
    'Fondo del audio destacado de la semana.',
    'A backdrop for a featured disc: soft concentric rings of golden light radiating from an empty center across a dark misty space, faint teal and lavender halos at the edges',
    'Empty calm center (a disc is placed on top in the UI), rings fading to near-black at the edges',
  ),
  slot(
    'library.archive-banner', 'wide', '50% 40%', 'P2', 'lav', 'bottom', 'Biblioteca · archivo',
    'La colección completa como lugar.',
    'The archive as a place: a long dim hall lined with tall shelves holding softly glowing vessels — brass bowls, glass discs, ceramic jars — lavender haze, a few warm lamps far away',
    'One-point perspective down the hall, lower third dark for text',
  ),
  slot(
    'library.audio-cover.*', 'square', '50% 50%', 'P1', 'none', 'center', 'Biblioteca · portadas',
    'Portada de cada audio del archivo: el sonido con rostro (7 audios).',
    '', 'Square, center kept calm and low contrast because the frequency number (Hz) is overlaid on the disc',
    { family: 'audio' },
  ),

  /* Academia */
  slot(
    'academy.hero', 'wide', '50% 40%', 'P1', 'teal', 'left-bottom', 'Academia · hero',
    'Cabecera de la academia: el estudio como escena.',
    'Study as a scene: a low wooden desk beside a window at blue hour with an open blank notebook, a ceramic bowl, a lit candle and a small stack of books, teal dusk light, no people',
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
    '', 'Keep the subject inside the central 50% of the width so the 1:1 crop of the card still contains it',
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
    'Celebración del curso terminado: el logro con luz.',
    'A completed cycle closed in light: a ring of small candles lit in a circle on dark stone, every flame steady and one slightly brighter, a warm golden glow radiating outward, slightly oblique overhead view',
    'Ring centered, enough dark space in the middle for a check mark and a line of text',
  ),

  /* Experiencias */
  slot(
    'experiences.hero', 'wide', '50% 40%', 'P1', 'lav', 'left-bottom', 'Experiencias · hero',
    'Cabecera de experiencias: el viaje como promesa.',
    'The journey as a promise: a lantern-lit path through a dark garden leading to a softly glowing pavilion, lavender dusk mist between the trees, nobody present',
    'Pavilion at 55% horizontal and 40% vertical, lanterns leading in from the lower left, left third dark',
  ),
  slot(
    'experiences.featured', 'cinema', '50% 45%', 'P1', 'lav', 'left', 'Experiencias · destacada',
    'La experiencia destacada con presencia propia: el baño de sonido.',
    'A sound bath in progress: a ring of crystal singing bowls glowing lavender and gold from within on a dark wooden floor, candles between them, low camera angle, no people, drifting haze above',
    'Ring of bowls in the right two thirds at 45% vertical, left third dark for the title and the booking button',
  ),
  slot(
    'experiences-visual', 'wide', '62% 45%', 'P1', 'lav', 'left', 'Experiencias · filas',
    'La experiencia como lugar: invitación sensorial a la reserva (4 experiencias).',
    '', 'The subject sits on the right at 62% horizontal and 45% vertical, the left 45% is dark and empty because a left scrim carries the text',
    { family: 'experience' },
  ),
  slot(
    'booking.hero', 'wide', '50% 40%', 'P1', 'lav', 'left-bottom', 'Reserva · hero',
    'El lugar de la experiencia elegida, antes de reservar.',
    'An empty serene room ready to receive: floor cushions arranged in a circle, a tall window showing a twilight sky, a few unlit candles waiting, a soft lavender light on the wooden floor',
    'Wide symmetrical interior, circle of cushions in the middle distance, left third dark',
  ),
  slot(
    'booking.confirmation', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Reserva · confirmación',
    'Confirmación con la materia del lugar: el sí con imagen.',
    'The same serene room now with its candles lit: a warm golden glow over the circle of cushions, a steaming cup set on the floor, a door ajar letting in soft light',
    'Warm center, dark edges, calm space in the middle for a check mark and a line of text',
  ),

  /* Tienda */
  slot(
    'store.hero', 'wide', '50% 40%', 'P1', 'warm', 'left-bottom', 'Tienda · hero',
    'Cabecera de la tienda: el ritual de adquirir.',
    'The ritual of acquiring: a dark wooden altar shelf with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, low golden light raking across the objects',
    'Objects in the right half at 40% vertical, the left third dark and empty for the headline',
  ),
  slot(
    'store-product-visual', 'square', '50% 50%', 'P1', 'warm', 'none', 'Tienda · productos',
    'El objeto completo y centrado; materia de compra (8 productos).',
    '', 'Single object centered on a dark surface with a pool of warm light beneath it, full object visible with breathing room on all sides',
    { family: 'product' },
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
    'A small empty ceramic dish on a dark wooden table, a single ray of warm light falling across it, a thread of steam rising, serene and open, nothing inside',
    'Dish at center slightly below the middle, dark table and background, calm space above',
  ),
  slot(
    'checkout.confirmation', 'cinema', '50% 50%', 'P1', 'warm', 'center', 'Compra · confirmación',
    'La compra confirmada con la materia del ritual.',
    'Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, warm candlelight, no writing on the wrapping',
    'Parcel centered, dark wooden surface, warm glow, calm space above for a check mark',
  ),

  /* Mi santuario */
  slot(
    'sanctuary.hero', 'wide', '50% 40%', 'P1', 'soft', 'left-bottom', 'Mi Santuario · hero',
    'El espacio personal: la materia que recibe al volver.',
    'A personal meditation nook at night: a cushion beside a large window with moonlight, sheer curtains, a lit candle and a small plant, teal moonlight balanced with golden candle glow, nobody present',
    'Window on the right with the cushion beneath it, left third dark and calm',
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
  slot(
    'sanctuary.journal', 'portrait', '50% 50%', 'P2', 'soft', 'low', 'Mi Santuario · diario',
    'El diario como materia íntima.',
    'The journal as intimate matter: an open linen-bound notebook with blank pages and a brass pen on dark wood, candlelight raking across the paper, a dried sprig of lavender, no legible writing',
    'Vertical, notebook in the lower two thirds, upper third dark and calm',
  ),
  slot(
    'sanctuary.empty', 'wide', '50% 40%', 'P2', 'soft', 'center', 'Mi Santuario · vacío',
    'El santuario recién estrenado: vacío luminoso, no ausencia.',
    'Luminous emptiness: an empty dark room with a soft pool of light gathering in the center of the floor, dust motes drifting in it, no objects, the quiet of a place that is new',
    'Light pool at center, slightly below the middle, dark room around it',
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
    slotId: 'library.audio-cover.*',
    filePrefix: 'library-audio-cover',
    instances: [
      { slug: 'a1', es: 'Regreso a la Calma', en: 'Return to Calm', hz: 432, treatment: 'teal', subject: 'Still water at dusk, a single pebble just dropped, perfect concentric ripples spreading in teal and gold light, calm and cool' },
      { slug: 'a2', es: 'Luz Interior', en: 'Inner Light', hz: 528, treatment: 'lav', subject: 'A single warm orb of light glowing inside a dark lavender crystal geode, facets catching the glow, inner light' },
      { slug: 'a3', es: 'Raíces Profundas', en: 'Deep Roots', hz: 396, treatment: 'teal', subject: 'Dark moss-covered stones and fine exposed roots in earth, a thread of gold light running between them, grounded and quiet' },
      { slug: 'a4', es: 'Umbral del Sueño', en: 'Threshold of Sleep', hz: 174, treatment: 'lav', subject: 'An indigo night room with a doorway of soft hazy light at the far end and a drifting veil of mist, heavy and soothing' },
      { slug: 'a5', es: 'Aroma de Cedro', en: 'Cedar Aroma', hz: 639, treatment: 'warm', subject: 'Amber cedar smoke curling upward from a small brass burner against darkness, a bundle of cedar sprigs beside it, warm glow' },
      { slug: 'a6', es: 'Respirar el Cielo', en: 'Breathe the Sky', hz: 417, treatment: 'teal', subject: 'A lagoon-teal sky at blue hour with soft layered clouds lit from below by faint gold, open air, spacious' },
      { slug: 'a7', es: 'Corazón Abierto', en: 'Open Heart', hz: 528, treatment: 'soft', subject: 'Two cupped hands holding a small warm glow of light against a sage-green dark background, tender and open' },
    ],
  },
  course: {
    slotId: 'academy-course-cover',
    filePrefix: 'academy-course-cover',
    instances: [
      { slug: 'c1', es: 'El Arte de Volver a Ti', en: 'The Art of Returning to You', treatment: 'lav', subject: 'A person seen from behind sitting cross-legged before a tall window at dawn, silhouetted against lavender and gold light, deep calm, no face visible' },
      { slug: 'c2', es: 'Rituales Conscientes', en: 'Conscious Rituals', treatment: 'teal', subject: 'Hands arranging ritual objects on dark stone — a ceramic bowl, a candle, a sprig of cedar — moss-green and gold light, unhurried gesture' },
      { slug: 'c3', es: 'Aromas que Sanan', en: 'Aromas that Heal', treatment: 'warm', subject: 'Amber glass vials of essential oils, dried cedar and herbs on a dark wooden tray, warm golden light and a thread of fragrant smoke' },
    ],
  },
  experience: {
    slotId: 'experiences-visual',
    filePrefix: 'experiences-visual',
    instances: [
      { slug: 'e1', es: 'Baño de Sonido en Vivo', en: 'Live Sound Bath', treatment: 'lav', subject: 'Crystal and brass singing bowls glowing from within on a dark floor, candles between them, rings of light, a soft haze; nobody present' },
      { slug: 'e2', es: 'Círculo de Luna Nueva', en: 'New Moon Circle', treatment: 'lav', subject: 'A circle of cushions and small candles on a dark floor beneath a tall window showing a thin new-moon crescent, quiet and ceremonial' },
      { slug: 'e3', es: 'Ritual de Aromas', en: 'Aroma Ritual', treatment: 'warm', subject: 'A brass burner with copal smoke rising in slow spirals, amber oil bottles and dried herbs beside it on a dark table, golden light' },
      { slug: 'e4', es: 'Meditación al Amanecer', en: 'Sunrise Meditation', treatment: 'teal', subject: 'A small terrace at first light with a cushion and a steaming cup, teal mist over distant hills, the first gold on the horizon; nobody present' },
    ],
  },
  product: {
    slotId: 'store-product-visual',
    filePrefix: 'store-product-visual',
    instances: [
      { slug: 'p1', es: 'Aceite Esencial · Cedro Sagrado', en: 'Essential Oil · Sacred Cedar', treatment: 'warm', subject: 'An amber glass dropper bottle with a plain unmarked label and a cedar sprig beside it' },
      { slug: 'p2', es: 'Vela Ritual · Luz de Vela', en: 'Ritual Candle · Candlelight', treatment: 'warm', subject: 'A honey-coloured wax candle in a dark glass vessel, lit, the flame reflected in the glass' },
      { slug: 'p3', es: 'Cuarzo de Serenidad', en: 'Serenity Quartz', treatment: 'lav', subject: 'A clear quartz crystal point standing upright with faint lavender internal light and a soft warm rim light' },
      { slug: 'p4', es: 'Bruma de Enraizamiento', en: 'Grounding Mist', treatment: 'teal', subject: 'A small dark-green glass spray bottle with a fine mist drifting from it, moss and stone beneath' },
      { slug: 'p5', es: 'Incienso · Bosque de Copal', en: 'Incense · Copal Forest', treatment: 'soft', subject: 'Chunks of pale copal resin in a small clay dish with a thin ribbon of smoke rising' },
      { slug: 'p6', es: 'Sal de Baño · Luna Llena', en: 'Bath Salt · Full Moon', treatment: 'lav', subject: 'A glass jar of pale bath salts with a hint of lavender, a wooden scoop beside it, soft moonlit sheen' },
      { slug: 'p7', es: 'Infusión · Calma de Cedro', en: 'Infusion · Cedar Calm', treatment: 'warm', subject: 'A handmade ceramic cup of steaming herbal infusion with dried herbs scattered near it, amber light' },
      { slug: 'p8', es: 'Diario de Frecuencias', en: 'Frequency Journal', treatment: 'teal', subject: 'A linen-bound blank notebook closed, a brass pen lying across its cover, no title and no text on it' },
    ],
  },
}

/** Imágenes que aún no son un slot registrado: el inventario las lista como «sin cablear» o no existen. */
export const EXTRAS = [
  slot(
    'states.loading', 'wide', '50% 50%', 'P2', 'soft', 'center', 'Estados · carga',
    'La espera con materia: cargar es también respirar.',
    'Waiting with matter: a single soft sphere of golden light floating in a dark misty space as if breathing, faint halo, slow and calm',
    'Sphere at center, dark calm space around it',
    { unregistered: true },
  ),
  slot(
    'states.empty', 'wide', '50% 50%', 'P2', 'soft', 'center', 'Estados · vacío',
    'El vacío de marca en cualquier vista.',
    'An empty dark room with one soft window of pale lavender light on the floor, dust motes drifting through it, open space',
    'Light on the floor just below center, dark room around it',
    { unregistered: true },
  ),
  slot(
    'states.error', 'wide', '50% 40%', 'P2', 'soft', 'center', 'Estados · error',
    'El error sin ruido: compañía en el tropiezo.',
    'Something interrupted: a single candle flickering in a dark room with a wisp of smoke still rising, calm and unbothered, warm faint glow',
    'Candle at center, dark room, quiet space above',
    { unregistered: true },
  ),
  slot(
    'states.offline', 'wide', '50% 40%', 'P2', 'lav', 'center', 'Estados · sin conexión',
    'La desconexión como retiro, no como fallo.',
    'A brief retreat: a quiet cabin window at night with a warm lamp inside and lavender mist outside, a sense of pausing, nobody in the frame',
    'Window slightly right of center, dark surroundings',
    { unregistered: true },
  ),
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
      'The Frecuencia Mágica universe in one frame: a glowing golden circle of light surrounded by fine concentric arcs in a deep navy cosmos, teal and lavender dust at the edges, empty center for the logo to be composited later',
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

/** Prompt completo, listo para pegar: sujeto, encuadre, estilo y tratamiento. */
export function composePrompt(entry, instance) {
  const treatment = instance?.treatment ?? entry.treatment
  const subject = instance ? instance.subject : entry.subject

  return `${subject}. ${entry.frame}. ${GLOBAL.treatments[treatment]} ${GLOBAL.base}`
}

/** Negativo del agente. El retrato de Marisol es la única imagen donde un rostro es lo que se busca. */
export function negativeFor(entry) {
  return entry.realShoot ? GLOBAL.negative.replace(', recognizable faces', '') : GLOBAL.negative
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

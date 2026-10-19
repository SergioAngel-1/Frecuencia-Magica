/**
 * Variantes de imagen por tema (spec `2026-10-17-temas-globales-design.md` § 6). Un slot escénico puede traer
 * una imagen propia en algunos temas cuando la base —siempre la de la noche— no funciona en ellos: un paisaje
 * nocturno azul no se lee bajo el atardecer, bajo un tema claro ni bajo el verde del bosque. La luna comparte
 * la imagen de la noche salvo en `resonario.hero`, `discover.tuning` y `discover.result`, que son su lugar.
 * Portadas de audio, de curso, visuales de experiencia y productos no cambian con el tema.
 *
 * Cada variante hereda del slot base el ratio, la prioridad y el foco, y sale en el brief y en
 * `docs/prompts-chatgpt.md` como una imagen más (`<slot>@<tema>`, archivo `<archivo-del-slot>-<tema>.avif`).
 * Llevan el estilo de las atmósferas (color natural, sin personas) y son provisionales. La lista de slots y
 * temas la fija `THEME_VARIANTS` de `frontend/src/config/editorial-media.ts`; un test la cruza con esta.
 *
 * Las tres primeras son las atmósferas de Ambientes v2 ya entregadas (`atmosphere-*`), reasignadas al slot al
 * que sirven ahora (`reusedFrom`); los cuatro paisajes de `resonario.hero` también se retiraron (no eran la escena del
 * héroe base, los discos sobre el agua) y se rehacen abajo; `experiences.hero@dusk` se retiró porque era una sala de cojines y sus hermanas
 * (dawn, forest) son un camino hacia un pabellón. El resto está por generar.
 */
import { BODY_OF_LIGHT, HALO, LIGHT_BODY_TRAITS, filaments } from './photography-phrases.js'

export const THEME_LABELS = { dusk: 'Atardecer', dawn: 'Amanecer', moon: 'Luna', forest: 'Bosque' }

/** Zona de texto equivalente cuando la imagen del tema no es oscura: «en calma» en vez de «oscura». */
export const CALM_SAFE = { left: 'calm-left', 'left-bottom': 'calm-left', bottom: 'calm-bottom', low: 'calm-low' }

const RING_FRAME =
  'Centered, balanced wide composition with the horizon at about 52% from the top, the ring at 50% horizontal and 40% vertical, calm open space all around, the bottom 30% of the frame plain calm water with no reflections, for a logo and a button'
const SIGNATURE_FRAME = (open) =>
  `The whole figure is small, only about a quarter of the frame width, and sits entirely inside the band between 62% and 88% of the frame width, never left of 62% and never closer to the right edge than 12%: its head at 62% horizontal and 40% vertical, its body extending to the right and ending at 88%, so a strip of calm open water stays between its feet and the right edge and no part of it touches or crosses that edge; the left 55% of the frame is ${open} for the headline, low camera angle at water level`

export const THEME_VARIANTS = [
  /* Atmósferas ya entregadas, reasignadas a su slot */
  {
    base: "academy.hero",
    theme: "dawn",
    focal: "70% 50%",
    subject: "A reading corner beside a large window in morning light: a simple wooden desk with an open linen-bound notebook with blank pages, a ceramic cup and a small clay vase with one sprig of green leaves, a folded wool throw over a wooden chair, soft morning light entering from the window and falling across the desk with soft natural shadows, cream walls, natural materials of wood, linen and ceramic, and through the window a soft blurred green garden, no writing on the pages and no screens",
    frame: "The window between 62% and 95% of the frame width, the desk in the lower center-right between 45% and 90% of the width, the left 40% of the frame is a plain cream wall in soft shade, calm and low in detail",
    provisional: "Sustituir por fotografía propia o con licencia comercial documentada.",
    reusedFrom: "atmosphere.study",
  },
  {
    base: "store.hero",
    theme: "dawn",
    focal: "60% 55%",
    subject: "A warm tabletop stage with no product on it: a wide slab of pale sand-colored stone beside a board of natural light oak wood, lit by low side light from the left that casts long soft natural shadows across both surfaces, two small sprigs of soft sage-green leaves lying on the stone, a folded cream linen cloth at the far edge, and behind them a plain cream plaster wall that carries the soft shadow of a third sprig",
    frame: "The tabletop fills the lower 55% of the frame and the wall the upper 45%, the middle of the surfaces between 35% and 80% of the frame width is bare stone and wood, kept empty, the sprigs and the cloth stay at the outer edges of the surfaces, and the left third is plain cream plaster in soft shade; an indoor still life only, a horizontal composition of surfaces and a wall, with no sea, beach, sky, sunset or landscape anywhere in the frame",
    provisional: "Escenario sin producto. La fotografía real de los productos (envases con etiqueta legible, textura, en uso) la hace Marisol; esta imagen se sustituye o se conserva sólo como fondo.",
    reusedFrom: "atmosphere.store",
  },
  {
    base: "about.hero",
    theme: "dawn",
    focal: "66% 50%",
    subject: "A luminous personal corner in the morning: a wooden table beside a tall window with sheer ivory linen curtains stirring slightly, a ceramic cup of tea with a thin wisp of steam, a small open notebook with blank pages, a bunch of dried lavender in a glass jar and a small green plant, warm light flooding the room, and through the window a gentle blur of a sunlit garden",
    frame: "The table and the window inside the band between 50% and 92% of the frame width, the left 40% of the frame is a plain ivory wall and soft curtain light, calm and low in detail",
    provisional: "Marco provisional. Sustituir por fotografías y videos reales de Marisol (spec §8).",
    reusedFrom: "atmosphere.marisol",
  },

  /* Portal */
  {
    base: 'portal.hero',
    theme: 'dusk',
    subject: `A vast threshold over still water at dusk: a circular opening of warm amber light, ${HALO}, hovering low above a calm sea at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, the sky a muted gradient of dusky rose, terracotta and soft amber with a few thin bands of cloud, the first few faint stars in the upper third, a faint coral glow low on the horizon at the left and a faint dusty mauve glow low on the horizon at the right, both fading out well before the frame edges`,
    frame: RING_FRAME,
  },
  {
    base: 'portal.hero',
    theme: 'dawn',
    subject: `A vast threshold over still water at sunrise: a circular opening of pale gold light, ${HALO}, hovering low above a mirror-calm lake at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, a luminous open sky of soft sky blue fading to ivory with a few thin high clouds, a distant low line of hills in faint blue haze, a faint peach glow low on the horizon at the left and a faint pale blue glow low on the horizon at the right, both fading out well before the frame edges`,
    frame: RING_FRAME,
  },
  {
    base: 'portal.hero',
    theme: 'forest',
    subject: `A vast threshold in a forest clearing: a circular opening of warm golden-green light, ${HALO}, hovering low above a still forest pool, framed by tall tree trunks and ferns on both sides, its reflection on the water short and soft, a fine mist rising off the pool, warm filtered golden light between the canopy, deep natural greens`,
    frame:
      'Centered, balanced wide composition with the far edge of the pool at about 52% from the top, the ring at 50% horizontal and 40% vertical, the trunks and ferns confined to the outer 15% on each side, the bottom 30% of the frame plain still water with no reflections, for a logo and a button',
  },

  /* Home */
  {
    base: 'home.hero',
    theme: 'dusk',
    subject: `The brand signature image at dusk: an ${BODY_OF_LIGHT}, resting on its side across the surface of a calm sea, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse warm glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in warm amber with faint coral and mauve light flowing through it like fine veins of current, a sky of dusky rose, terracotta and soft amber with thin warm clouds, the first faint stars in the upper third`,
    frame: SIGNATURE_FRAME('open calm sea and soft dusk sky'),
  },
  {
    base: 'home.hero',
    theme: 'dawn',
    subject: `The brand signature image at sunrise: an ${BODY_OF_LIGHT}, resting on its side across the surface of a mirror-calm lake, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse pale-gold glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in pale gold with faint sky-blue and peach light flowing through it like fine veins of current, a luminous open sky of soft sky blue fading to ivory, a low line of hills in faint blue haze`,
    frame: SIGNATURE_FRAME('open calm lake and soft morning sky'),
  },
  {
    base: 'home.hero',
    theme: 'forest',
    subject: `The brand signature image in the forest: an ${BODY_OF_LIGHT}, resting on its side across the surface of a still forest pool, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse golden glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in warm gold with faint green and teal light flowing through it like fine veins of current, tall tree ferns and slender trunks on the far shore, warm filtered golden light between the canopy, a fine mist rising off the water`,
    frame: SIGNATURE_FRAME('open still water and soft out-of-focus foliage'),
  },

  /* Sobre Marisol */
  {
    base: 'about.hero',
    theme: 'dusk',
    subject: `The place where the work begins, at golden hour: a quiet terrace of warm stone opening onto a calm sea and a distant headland in rose haze, a low wooden table with a crystal singing bowl and a single lit candle standing in the middle distance at the far end of the terrace, near the edge of the water, a linen shawl left over a stone bench as if someone had just stepped out, a sky of dusky rose and soft amber`,
    frame:
      'Table and candle at 60% horizontal and 40% vertical, which is the middle distance: the stone floor of the terrace extends in front of them across the whole lower half of the frame, the left third open calm sea and sky for the title, the lower edge calm',
  },
  {
    base: 'about.hero',
    theme: 'forest',
    subject: `The place where the work begins, in the forest: a quiet wooden deck among tall trees opening onto a still forest pool, a low wooden table with a crystal singing bowl and a single lit candle standing in the middle distance at the far end of the deck, near the edge of the water, a linen shawl left over a bench as if someone had just stepped out, soft green ferns, warm filtered golden light through the canopy, a fine mist`,
    frame:
      'Table and candle at 60% horizontal and 40% vertical, which is the middle distance: the wooden floor of the deck extends in front of them across the whole lower half of the frame, the left third soft out-of-focus foliage and still water for the title, the lower edge calm',
  },

  /* Acceso */
  {
    base: 'auth.hero',
    theme: 'dusk',
    subject: `A tall arched doorway of warm amber light set into a wall of dusk-lit stone at the edge of a calm sea, seen from a few steps back, a warm path of light spilling across the wet stone and the water toward the viewer, a sky of dusky rose above, quiet, inviting, nobody in the frame`,
    frame: 'Arch placed in the right half, the left third plain calm wall, sea and soft sky for a quote',
  },
  {
    base: 'auth.hero',
    theme: 'dawn',
    subject: `A tall arched doorway of soft pale-gold light set into a wall of pale limestone at the edge of a lake at sunrise, seen from a few steps back, a gentle path of light spilling across the wet stone and the water toward the viewer, soft sky blue and ivory above, quiet, inviting, nobody in the frame`,
    frame: 'Arch placed in the right half, the left third plain calm wall, water and soft sky for a quote',
  },
  {
    base: 'auth.hero',
    theme: 'forest',
    subject: `A tall arched doorway of soft golden-green light set into an old wall of mossy stone at the edge of a forest pool, seen from a few steps back, a warm path of light spilling across the wet stone and the water toward the viewer, ferns and tall trunks around it, mist at its base, quiet, inviting, nobody in the frame`,
    frame: 'Arch placed in the right half, the left third plain mossy wall and soft out-of-focus ferns for a quote',
  },

  /* Descúbrete */
  {
    base: 'discover.hero',
    theme: 'dusk',
    subject: `The beginning of a discovery at dusk: a narrow path of warm stone steps rising from a calm sea into a soft rose and amber sky over distant headlands in haze, a sense of a first step, no people`,
    frame:
      'Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third calm and low in detail',
  },
  {
    base: 'discover.hero',
    theme: 'dawn',
    subject: `The beginning of a discovery at sunrise: a narrow path of pale stone steps rising from a mirror-calm lake into a luminous sky of soft sky blue and ivory with a faint pale gold at the horizon over distant hills in blue haze, a sense of a first step, no people`,
    frame:
      'Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third calm and low in detail',
  },
  {
    base: 'discover.hero',
    theme: 'forest',
    subject: `The beginning of a discovery in the forest: a narrow path of mossy stone steps rising from a still pool between tall ferns into soft golden light filtering through the canopy and mist, a sense of a first step, no people`,
    frame:
      'Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the bright light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third soft out-of-focus ferns and low in detail',
  },

  /* Academia */
  {
    base: 'academy.hero',
    theme: 'dusk',
    subject: `Study as a scene at dusk: a low wooden desk on a quiet seaside terrace with an open blank notebook, a ceramic bowl and a lit candle, a calm sea and a far headland in rose haze, no people`,
    frame: 'Desk in the right half, the left third calm sea and soft sky, low in detail for the headline',
  },
  {
    base: 'academy.hero',
    theme: 'forest',
    subject: `Study as a scene in the forest: a low wooden desk on a quiet deck among ferns beside a still pool, with an open blank notebook, a ceramic bowl and a lit candle, filtered green-gold light, no people`,
    frame: 'Desk in the right half, the left third soft out-of-focus ferns and still water, low in detail for the headline',
  },

  /* Experiencias */
  {
    base: 'experiences.hero',
    theme: 'dusk',
    subject: `The journey as a promise at dusk: a path of warm stepping stones across a calm sea toward a simple open pavilion on the far shore: a pavilion of timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, soft rose and amber haze between dark trees and headlands, nobody present`,
    frame:
      'Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, stepping stones leading in from the lower left, the left third calm sea and soft sky, low in detail',
  },
  {
    base: 'experiences.hero',
    theme: 'dawn',
    subject: `The journey as a promise at sunrise: a path of pale stepping stones across a mirror-calm lake toward a simple open pavilion on the far shore: a pavilion of light timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, soft sky-blue mist between trees and hills, nobody present`,
    frame:
      'Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, stepping stones leading in from the lower left, the left third calm mist and water, low in detail',
  },
  {
    base: 'experiences.hero',
    theme: 'forest',
    subject: `The journey as a promise in the forest: a path of mossy stepping stones across a still forest pool toward a simple open pavilion among tall trees: a pavilion of timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, filtered golden light and mist, nobody present`,
    frame:
      'Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, stepping stones leading in from the lower left, the left third soft out-of-focus foliage and still water, low in detail',
  },

  /* Reserva */
  {
    base: 'booking.hero',
    theme: 'dusk',
    subject: `An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck over a calm sea at dusk, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft rose and amber dusk on the planks and the headland beyond`,
    frame:
      'Wide symmetrical, circle of cushions in the middle distance, the left third open calm sea and soft sky for the headline: the horizon and the haze continue across the whole width with no gradient, no band and no vertical edge',
  },
  {
    base: 'booking.hero',
    theme: 'dawn',
    subject: `An empty serene place ready to receive: floor cushions arranged in a circle on a pale wooden deck over a mirror-calm lake in early morning, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft sky-blue morning light on the planks and the hills beyond`,
    frame:
      'Wide symmetrical, circle of cushions in the middle distance, the left third open calm water and soft sky for the headline: the mist and the hills continue across the whole width with no gradient, no band and no vertical edge',
  },
  {
    base: 'booking.hero',
    theme: 'forest',
    subject: `An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck among ferns beside a still forest pool, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the soft green-gold light filtering through the canopy onto the planks`,
    frame:
      'Wide symmetrical, circle of cushions in the middle distance, the left third soft out-of-focus ferns and still water for the headline: the mist and the foliage continue across the whole width with no gradient, no band and no vertical edge',
  },

  /* Tienda */
  {
    base: 'store.hero',
    theme: 'dusk',
    subject: `The ritual of acquiring at dusk: a warm stone ledge at the edge of a calm sea with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, low warm light raking across the objects and reflecting in the water behind them`,
    frame: 'Objects in the right half at 40% vertical, the left third calm open water and soft sky for the headline',
  },
  {
    base: 'store.hero',
    theme: 'forest',
    subject: `The ritual of acquiring in the forest: a mossy stone ledge at the edge of a still forest pool with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, filtered golden light raking across the objects and reflecting in the water behind them`,
    frame: 'Objects in the right half at 40% vertical, the left third still water and soft out-of-focus ferns for the headline',
  },

  /* Mi Santuario */
  {
    base: 'sanctuary.hero',
    theme: 'dusk',
    subject: `A personal sanctuary at dusk: an ${BODY_OF_LIGHT}, resting on a cushion beside a large window that opens onto a calm sea at sunset, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, warm amber light balanced with a soft coral glow, ${filaments('rising from the water outside')}`,
    frame: 'Window on the right with the figure beneath it, left third calm wall and soft curtain light, low in detail',
  },
  {
    base: 'sanctuary.hero',
    theme: 'dawn',
    subject: `A personal sanctuary at sunrise: an ${BODY_OF_LIGHT}, resting on a cushion beside a large window that opens onto a mirror-calm lake in morning light, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, soft pale-gold light balanced with a faint sky-blue glow, ${filaments('rising from the water outside')}`,
    frame: 'Window on the right with the figure beneath it, left third plain ivory wall and soft curtain light, low in detail',
  },
  {
    base: 'sanctuary.hero',
    theme: 'forest',
    subject: `A personal sanctuary in the forest: an ${BODY_OF_LIGHT}, resting on a cushion beside a large window that opens onto a still forest pool among tall ferns, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, soft golden-green light balanced with a faint teal glow, ${filaments('rising from the water outside')}`,
    frame: 'Window on the right with the figure beneath it, left third plain calm wall and soft curtain light, low in detail',
  },

  /* Bandas y fondos de cristal en el tema claro (Amanecer) */
  {
    base: 'home.daily-frequency',
    theme: 'dawn',
    subject: `Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in pale still water and lit by soft morning light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light in pale gold and soft blue, top-down macro, bright and airy`,
    frame: 'Pattern centered and radially symmetric, the water fading to a soft pale ivory-blue at all four edges',
  },
  {
    base: 'home.realms-banner',
    theme: 'dawn',
    subject: `A constellation as a map of nine realms in daylight: nine small luminous points of pale gold, soft teal and lavender light joined by the faintest filaments across a vast pale morning sky of soft sky blue and ivory, a slow arc of thin high cloud, a thin line of still water along the lower edge mirroring the points`,
    frame: 'Nine points spread across the width with the brightest near the center, calm pale edges',
  },
  {
    base: 'home.footer-banner',
    theme: 'dawn',
    subject: `The horizon after the page: a luminous morning sky with faint peach clouds above a mirror-calm lake, a single thin line of pale gold light along the horizon, vast stillness`,
    frame:
      'The horizon line sits at exactly two fifths of the frame height from the top (40%): the sky fills the upper 40% and the calm water the lower 60%, the water soft and even for text',
  },
  {
    base: 'home-membership',
    theme: 'dawn',
    subject: `Golden light pouring from above onto a still lake at sunrise: a warm beam of light, one color only, pale gold, with no colored bands, falling from the top of the frame onto mist-covered water, a wide circle of low smooth stones lying flat on the shore as a gathering place, none stacked and none higher than a hand, dust motes and mist drifting, soft blue-grey shadows in the corners`,
    frame: 'The light source sits near the top edge at 15% vertical, the ring of stones in the middle distance, lower third calm mist and water for text',
  },
  {
    base: 'about.angels',
    theme: 'dawn',
    subject: `Presence without a figure: a soft shaft of pale gold and sky-blue light descending through bright still air onto a mist-covered lake, a single white feather suspended mid-fall, fine luminous dust around it, no wings, no faces, no statues, no religious iconography`,
    frame: 'Light source and feather in the upper third at 30% vertical, lower half calm mist and water for the headline',
  },
  {
    base: 'auth.form-atmosphere',
    theme: 'dawn',
    subject: `Intimate calm in morning light: a surface of pale still water with a single soft pale-gold point of light as small as a distant star, hovering just above the water, its reflection a short soft streak on the surface directly beneath it, the only element in the frame, with nothing around it or in front of it, and faint blue mist drifting low, a soft blurred ivory background`,
    frame: 'Vertical, very light and low contrast (a form is laid over it later), the point of light in the lower third, generous soft ivory space above',
  },
  {
    base: 'discover.question-atmosphere',
    theme: 'dawn',
    subject: `Soft-focus ambient abstraction: drifting translucent veils of pale sky-blue and soft peach mist with tiny pale-gold specks like slow snowfall, very light, almost abstract, the whole frame a single continuous field of soft mist with no object, no shape and no outline anywhere, the veils faint and low in saturation, and the golden specks few, tiny and out of focus`,
    frame:
      'Vertical, very low contrast: the darkest part of the frame is no darker than a pale blue-grey haze, nothing sharp and nothing with an edge, the lower third as light as the rest (the question text is laid over the center)',
  },
  {
    base: 'resonario.featured',
    theme: 'dawn',
    subject: `A backdrop for a featured disc, seen from directly above: calm bright water the color of pale ivory and soft sky blue, with exactly five thin concentric rings of pale gold light lying on the water and radiating from an empty calm center at the exact center of the frame, each ring a little fainter than the one inside it and the outermost about 45% of the frame height in diameter, faint sky-blue and peach tints at the outer edges, and the water continuing plain and smooth to the left and right edges; no sun, no horizon, no sky, no objects`,
    frame: 'Wide 2:1 panorama, top-down view, the empty calm center at 50% horizontal and 50% vertical, rings fading to soft pale ivory before the edges',
  },
  {
    base: 'resonario.archive-banner',
    theme: 'dawn',
    subject: `The archive as a place: a long colonnade of pale limestone opening onto still water at early morning, tall niches holding softly glowing vessels — brass bowls, glass discs, ceramic jars — soft sky-blue haze, a few warm lamps far away reflected in the floor-water`,
    frame: 'One-point perspective down the colonnade, lower third calm pale stone and water for text',
  },
  {
    base: 'academy.featured-course',
    theme: 'dawn',
    subject: `The featured practice in daylight: a pair of hands cradling a small brass singing bowl with a wooden striker resting on its rim, soft morning light on the hands, a pale blue-green mist behind, close framing`,
    frame: 'Hands and bowl in the right-center, the left third soft pale mist and low in detail for the course title',
  },
  {
    base: 'experiences.featured',
    theme: 'dawn',
    subject: `A sound bath in progress in morning light: a circle of abstract translucent silhouettes of pure light, each ${LIGHT_BODY_TRAITS}, seated around a ring of crystal singing bowls glowing pale gold and soft lavender from within, set on pale still water that mirrors them, concentric rings of light spreading across the surface, drifting bright haze above`,
    frame: 'Ring of bowls and figures in the right two thirds at 45% vertical, left third calm bright mist for the title and the booking button',
  },
  {
    base: 'store.ritual-banner',
    theme: 'dawn',
    subject: `Objects of ritual as matter in daylight: a top-down flat lay on pale sand-coloured stone of matches, copal resin, a small brass dish, dried herbs and a quartz point, soft morning light from the left with gentle natural shadows`,
    frame: 'Objects grouped in the upper two thirds, the bottom third plain pale stone for text',
  },

  /* Bandas y fondos en Atardecer y Bosque (2026-10-18): la misma escena que su hermana de Amanecer y que la base,
     con la paleta de sus héroes. Atardecer: índigo a ciruela y rosa vino, con ámbar y coral (nunca marrón);
     Bosque: verde y oro filtrado, helechos, bruma y estanque quieto. Los dos son temas oscuros: la zona de texto
     queda honda y calma, no clara. Luna no lleva variante: su azul noche funde con la foto base. */
  {
    base: "home.daily-frequency",
    theme: "dusk",
    subject: `Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in still water at dusk and lit by warm amber light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light in warm amber and soft coral with a faint mauve tint at the outer petals, top-down macro, the water a deep plum-indigo`,
    frame:
      "Pattern centered and radially symmetric, the plum-indigo water fading to a deep calm shade at all four edges",
  },
  {
    base: "home.daily-frequency",
    theme: "forest",
    subject: `Sound made visible: a cymatic pattern, fine radial standing-wave geometry traced in the still water of a forest pool and lit by soft filtered golden light, symmetrical sacred-geometry structure with delicate concentric rings and petals of light in warm gold and soft green with a faint teal tint at the outer petals, top-down macro, the water a deep forest green`,
    frame:
      "Pattern centered and radially symmetric, the deep green water fading to a calm dark shade at all four edges",
  },
  {
    base: "home.realms-banner",
    theme: "dusk",
    subject: `A constellation as a map of nine realms at dusk: nine small luminous points of warm amber, soft coral and mauve light joined by the faintest filaments across a vast dusk sky that shades from deep indigo at the top through plum to dusky rose at the horizon, a slow arc of thin cloud edged in amber, the first faint stars, a thin line of still water along the lower edge mirroring the points`,
    frame:
      "Nine points spread across the width with the brightest near the center, deep calm edges",
  },
  {
    base: "home.realms-banner",
    theme: "forest",
    subject: `A constellation as a map of nine realms in the forest at night: nine small luminous points of warm gold, soft green and pale teal light, each like a firefly, joined by the faintest filaments across the dark air above a still forest pool, the outlines of tall trunks and ferns confined to the outer 15% on each side, a fine mist, a thin line of still water along the lower edge mirroring the points`,
    frame:
      "Nine points spread across the width with the brightest near the center, deep calm edges, the trunks and ferns only at the far left and right",
  },
  {
    base: "home.footer-banner",
    theme: "dusk",
    subject: `The horizon after the page at dusk: a sky that shades from deep indigo to dusky rose with faint mauve clouds above a mirror-calm plum-toned sea, a single thin line of warm amber light along the horizon, the first stars appearing, vast stillness`,
    frame:
      "The horizon line sits at exactly two fifths of the frame height from the top (40%): the sky fills the upper 40% and the calm water the lower 60%, the water soft, even and deep in tone for text",
  },
  {
    base: "home.footer-banner",
    theme: "forest",
    subject: `The horizon after the page in the forest: a mirror-calm forest pool whose far shore is a soft low line of out-of-focus trees under a dim green-gold sky between the canopy, a single thin line of warm golden light along the far shore, a fine mist lying on the water, vast stillness`,
    frame:
      "The far shore line sits at exactly two fifths of the frame height from the top (40%): the trees and the sky fill the upper 40% and the calm water the lower 60%, the water soft, even and deep green for text",
  },
  {
    base: "home-membership",
    theme: "dusk",
    subject: `Golden light pouring from above onto a still sea at dusk: a warm beam of light, one color only, warm amber, with no colored bands, falling from the top of the frame onto mist-covered water, a wide circle of low smooth stones lying flat on the shore as a gathering place, none stacked and none higher than a hand, dust motes and mist drifting, deep indigo-plum shadows in the corners`,
    frame:
      "The light source sits near the top edge at 15% vertical, the ring of stones in the middle distance, lower third deep calm mist and water for text",
  },
  {
    base: "home-membership",
    theme: "forest",
    subject: `Golden light pouring from above through the canopy onto a still forest pool: a warm beam of light, one color only, warm gold, with no colored bands, falling from the top of the frame onto mist-covered water, a wide circle of low smooth moss-edged stones lying flat on the shore as a gathering place, none stacked and none higher than a hand, ferns at the outer edges, dust motes and mist drifting, deep green shadows in the corners`,
    frame:
      "The light source sits near the top edge at 15% vertical, the ring of stones in the middle distance, the ferns confined to the outer 15% on each side, lower third deep calm mist and water for text",
  },
  {
    base: "about.angels",
    theme: "dusk",
    subject: `Presence without a figure at dusk: a soft shaft of pale rose and warm amber light descending through still dusky air onto a mist-covered lake, a single white feather suspended mid-fall, fine luminous dust around it, no wings, no faces, no statues, no religious iconography`,
    frame:
      "Light source and feather in the upper third at 30% vertical, lower half deep calm mist and water for the headline",
  },
  {
    base: "about.angels",
    theme: "forest",
    subject: `Presence without a figure in the forest: a soft shaft of pale gold and green light descending through the canopy and still air onto a mist-covered forest pool, a single white feather suspended mid-fall, fine luminous dust around it, no wings, no faces, no statues, no religious iconography`,
    frame:
      "Light source and feather in the upper third at 30% vertical, lower half deep calm mist and water for the headline",
  },
  {
    base: "auth.form-atmosphere",
    theme: "dusk",
    subject: `Intimate calm at dusk: a surface of deep plum-indigo still water with a single soft warm amber point of light as small as a distant star, hovering just above the water, its reflection a short soft streak on the surface directly beneath it, the only element in the frame, with nothing around it or in front of it, and faint rose mist drifting low, a blurred velvet-dark plum background, a soft warm glow at the bottom of the frame`,
    frame:
      "Vertical, very dark and low contrast (a form is laid over it later), the point of light in the lower third, generous dark space above",
  },
  {
    base: "auth.form-atmosphere",
    theme: "forest",
    subject: `Intimate calm in the forest: a surface of nearly black green still water with a single soft golden-green point of light as small as a distant star, hovering just above the water, its reflection a short soft streak on the surface directly beneath it, the only element in the frame, with nothing around it or in front of it, and faint green mist drifting low, a blurred velvet-dark forest-green background, a soft warm glow at the bottom of the frame`,
    frame:
      "Vertical, very dark and low contrast (a form is laid over it later), the point of light in the lower third, generous dark space above",
  },
  {
    base: "discover.question-atmosphere",
    theme: "dusk",
    subject: `Soft-focus ambient abstraction: drifting translucent veils of dusky rose and plum mist with tiny warm amber specks like slow snowfall, very dark, almost abstract, the whole frame a single continuous field of soft mist with no object, no shape and no outline anywhere, the veils faint and low in saturation, and the amber specks few, tiny and out of focus`,
    frame:
      "Vertical, very low contrast: the brightest part of the frame is no lighter than a deep plum-rose haze, nothing sharp and nothing with an edge, the lower third as dark as the rest (the question text is laid over the center)",
  },
  {
    base: "discover.question-atmosphere",
    theme: "forest",
    subject: `Soft-focus ambient abstraction: drifting translucent veils of soft green and pale teal mist with tiny pale-gold specks like slow fireflies out of focus, very dark, almost abstract, the whole frame a single continuous field of soft mist with no object, no shape and no outline anywhere, the veils faint and low in saturation, and the golden specks few, tiny and out of focus`,
    frame:
      "Vertical, very low contrast: the brightest part of the frame is no lighter than a deep green-grey haze, nothing sharp and nothing with an edge, the lower third as dark as the rest (the question text is laid over the center)",
  },
  {
    base: "resonario.featured",
    theme: "dusk",
    subject: `A backdrop for a featured disc, seen from directly above: calm water the color of deep plum-indigo, with exactly five thin concentric rings of warm amber light lying on the water and radiating from an empty calm center at the exact center of the frame, each ring a little fainter than the one inside it and the outermost about 45% of the frame height in diameter, faint coral and mauve tints at the outer edges, and the water continuing plain and smooth to the left and right edges; no sun, no horizon, no sky, no objects`,
    frame:
      "Wide 2:1 panorama, top-down view, the empty calm center at 50% horizontal and 50% vertical, rings fading to deep plum before the edges",
  },
  {
    base: "resonario.featured",
    theme: "forest",
    subject: `A backdrop for a featured disc, seen from directly above: calm still forest-pool water the color of deep green, with exactly five thin concentric rings of warm gold light lying on the water and radiating from an empty calm center at the exact center of the frame, each ring a little fainter than the one inside it and the outermost about 45% of the frame height in diameter, faint soft green and teal tints at the outer edges, and the water continuing plain and smooth to the left and right edges; no sun, no horizon, no sky, no leaves, no objects`,
    frame:
      "Wide 2:1 panorama, top-down view, the empty calm center at 50% horizontal and 50% vertical, rings fading to deep green before the edges",
  },
  {
    base: "resonario.archive-banner",
    theme: "dusk",
    subject: `The archive as a place: a long colonnade of dark stone opening onto still water at dusk, tall niches holding softly glowing vessels — brass bowls, glass discs, ceramic jars — dusky rose haze, a few warm amber lamps far away reflected in the floor-water`,
    frame:
      "One-point perspective down the colonnade, lower third deep calm stone and water for text",
  },
  {
    base: "resonario.archive-banner",
    theme: "forest",
    subject: `The archive as a place in the forest: a long colonnade of dark moss-streaked stone opening onto a still forest pool, ferns at the feet of the columns, tall niches holding softly glowing vessels — brass bowls, glass discs, ceramic jars — a soft green mist, warm filtered golden light, a few warm lamps far away reflected in the floor-water`,
    frame:
      "One-point perspective down the colonnade, lower third deep calm stone and water for text",
  },
  {
    base: "academy.featured-course",
    theme: "dusk",
    subject: `The featured practice at dusk: a pair of hands cradling a small brass singing bowl with a wooden striker resting on its rim, warm amber light of the sunset on the hands, a soft mist of dusky rose and mauve behind, close framing`,
    frame:
      "Hands and bowl in the right-center, the left third deep calm mist and low in detail for the course title",
  },
  {
    base: "academy.featured-course",
    theme: "forest",
    subject: `The featured practice in the forest: a pair of hands cradling a small brass singing bowl with a wooden striker resting on its rim, soft filtered golden light on the hands, a green mist behind with a few out-of-focus fern fronds, close framing`,
    frame:
      "Hands and bowl in the right-center, the left third deep calm green mist and low in detail for the course title",
  },
  {
    base: "academy.completion",
    theme: "forest",
    subject: `A completed cycle closed in light in the forest: a ring of exactly twelve small golden lights, evenly spaced and with no other lights, floating on the still water of a forest pool seen from a slightly oblique overhead angle, a small ${BODY_OF_LIGHT}, seated cross-legged at the far side of the ring, every light steady and one slightly brighter, concentric ripples radiating outward, a fine green mist and the dark edge of ferns only at the outer corners`,
    frame:
      "Ring centered at 50% horizontal, its middle empty, deep green and perfectly still water because content is laid over it later, the ripples spreading outward from the ring only, the small figure no taller than 12% of the frame height at the far edge of the ring at 50% horizontal and 30% vertical",
  },
  {
    base: "experiences.featured",
    theme: "dusk",
    subject: `A sound bath in progress at dusk: a circle of abstract translucent silhouettes of pure light, each ${LIGHT_BODY_TRAITS}, seated around a ring of crystal singing bowls glowing warm amber and soft rose from within, set on still plum-indigo water that mirrors them, concentric rings of light spreading across the surface, drifting dusky haze above`,
    frame:
      "Ring of bowls and figures in the right two thirds at 45% vertical, left third deep calm haze for the title and the booking button",
  },
  {
    base: "experiences.featured",
    theme: "forest",
    subject: `A sound bath in progress in the forest: a circle of abstract translucent silhouettes of pure light, each ${LIGHT_BODY_TRAITS}, seated around a ring of crystal singing bowls glowing warm gold and soft green from within, set on the still water of a forest pool that mirrors them, concentric rings of light spreading across the surface, a fine mist drifting above and tall ferns only at the outer edges`,
    frame:
      "Ring of bowls and figures in the right two thirds at 45% vertical, left third deep calm green mist for the title and the booking button",
  },
  {
    base: "booking.confirmation",
    theme: "dusk",
    subject: `The same serene place now with its candles lit: a warm amber glow over the circle of cushions on the wooden deck above a calm sea at dusk, reflected in the still water, a steaming cup set beside them, a soft rose light on the horizon`,
    frame:
      "Warm center, deep plum-indigo edges, calm space in the middle because content is laid over it later",
  },
  {
    base: "store.ritual-banner",
    theme: "dusk",
    subject: `Objects of ritual as matter at dusk: a top-down flat lay on dark slate of matches, copal resin, a small brass dish, dried herbs and a quartz point, a warm amber rim light from the low sun on the left with a faint rose reflection on the slate`,
    frame:
      "Objects grouped in the upper two thirds, the bottom third plain dark slate for text",
  },
  {
    base: "store.ritual-banner",
    theme: "forest",
    subject: `Objects of ritual as matter in the forest: a top-down flat lay on dark slate with a thin film of green moss along its far edge, of matches, copal resin, a small brass dish, dried herbs and a quartz point, soft filtered golden light from the left with the faint shadow of leaves across the slate`,
    frame:
      "Objects grouped in the upper two thirds, the moss only at the far edge, the bottom third plain dark slate for text",
  },

  /* Fondos que Amanecer forzaba a ser claros (2026-10-19): la espera, los estados, Mi Santuario, el carrito, la
     compra, Descúbrete (afinación y resultado) y las dos confirmaciones. Eran una foto nocturna lavada con un filtro
     (`[data-scheme='light'] [data-photo-night]`): bajo el tema claro quedaban como una neblina gris o con una franja
     oscura. Cada uno es la misma escena de su base con la luz de amanecer: crema melocotón, azul cielo muy pálido y
     oro claro, nunca blanco frío (ver la nota de paleta de Amanecer). El texto de estas vistas es tinta oscura, así
     que la zona de texto queda clara y calma.
     Desde 2026-10-19 llevan también variante en Atardecer y Bosque (la noche azul desentona con su paleta y son
     temas oscuros: la zona de texto queda honda), y en Luna los dos de Descúbrete. `not-found.hero` no entra: el
     404 raíz está fuera del proveedor de tema. */
  {
    base: 'states.loading',
    theme: 'dawn',
    subject: `Waiting with matter at sunrise: a single soft sphere of pale golden light floating in bright misty space above still pale water as if breathing, a faint halo, slow and calm, the air a soft blend of cream, peach and very pale sky blue, only a soft even haze with no cumulus, no storm or grey clouds and no dramatic sky, warm cream and peach dominate and the pale blue is only a hint`,
    frame: 'Sphere at center at 42% vertical, calm bright mist all around it, the horizon lost in the mist with no line and no band, the lower third plain calm pale water for the loading label',
  },
  {
    base: 'states.loading',
    theme: 'dusk',
    subject: `Waiting with matter at dusk: a single soft sphere of warm amber light floating in dusky misty space above still water as if breathing, a faint halo, slow and calm, the air a deep blend of indigo, dusky rose and soft amber, the first faint stars lost in the mist`,
    frame: 'Sphere at center at 42% vertical, calm dusky mist all around it, the horizon lost in the mist with no line and no band, the lower third plain calm dark water for the loading label',
  },
  {
    base: 'states.loading',
    theme: 'forest',
    subject: `Waiting with matter in the forest: a single soft sphere of warm golden-green light floating in misty forest air above a still pool as if breathing, a faint halo, slow and calm, deep natural greens, the filtered golden light of the canopy, a few out-of-focus fireflies drifting around it`,
    frame: 'Sphere at center at 42% vertical, calm green mist all around it, the horizon lost in the mist with no line and no band, the lower third plain calm dark water for the loading label',
  },
  {
    base: 'states.empty',
    theme: 'dawn',
    subject: `An empty luminous space in the morning: one soft window of pale peach light lying on still pale water, fine pale-gold dust motes drifting through it, a faint ivory haze, open space, nothing else in the frame`,
    frame: 'Light on the water just below center, soft pale space around it, no object and no hard edge',
  },
  {
    base: 'states.empty',
    theme: 'dusk',
    subject: `An empty dusky space at last light: one soft window of warm amber light lying on still dark water, fine coral dust motes drifting through it, a faint rose haze, open space, nothing else in the frame`,
    frame: 'Light on the water just below center, deep calm space around it, no object and no hard edge',
  },
  {
    base: 'states.empty',
    theme: 'forest',
    subject: `An empty luminous clearing in the forest: one soft window of golden-green light lying on the still water of a forest pool, fine pale-gold dust motes and a few fireflies drifting through it, a faint green haze, open space, nothing else in the frame`,
    frame: 'Light on the water just below center, deep green calm space around it, no object and no hard edge',
  },
  {
    base: 'states.error',
    theme: 'dawn',
    subject: `Something interrupted, in morning light: a single candle flickering on a pale sandstone ledge by still water with a wisp of smoke still rising, calm and unbothered, a soft warm faint glow in the bright cream air`,
    frame: 'Candle at center, pale calm surroundings, quiet bright space above',
  },
  {
    base: 'states.error',
    theme: 'dusk',
    subject: `Something interrupted, at dusk: a single candle flickering on a dark stone ledge by still water with a wisp of smoke still rising, calm and unbothered, a soft warm amber glow in the deep indigo and rose air`,
    frame: 'Candle at center, deep calm surroundings, quiet space above',
  },
  {
    base: 'states.error',
    theme: 'forest',
    subject: `Something interrupted, in the forest: a single candle flickering on a mossy stone ledge by a still forest pool with a wisp of smoke still rising, calm and unbothered, a soft warm golden glow in the deep green air, a few fireflies near the water`,
    frame: 'Candle at center, deep calm green surroundings, quiet space above, ferns only at the outer corners',
  },
  {
    base: 'states.offline',
    theme: 'dawn',
    subject: `A brief retreat at first light: a quiet cabin window with a warm lamp still lit inside and pale blue mist over a still lake outside, a sense of pausing, nobody in the frame, soft cream morning light on the sill, the cabin wall and window frame painted pale whitewashed wood, light and smooth, never dark or heavily weathered`,
    frame: 'Window slightly right of center at 70% horizontal and small in the frame, no more than 28% of the frame width, soft pale surroundings, the misty lake and pale sky fill most of the frame, calm and low in detail',
  },
  {
    base: 'states.offline',
    theme: 'dusk',
    subject: `A brief retreat at dusk: a quiet cabin window with a warm lamp lit inside and rose mist over a still lake outside, a sense of pausing, nobody in the frame, the last soft amber light on the sill`,
    frame: 'Window slightly right of center at 70% horizontal, deep calm surroundings, calm and low in detail',
  },
  {
    base: 'states.offline',
    theme: 'forest',
    subject: `A brief retreat in the forest: a quiet cabin window with a warm lamp lit inside and green mist over a still forest pool outside, a sense of pausing, nobody in the frame, soft filtered golden light on the sill, a few fireflies in the mist`,
    frame: 'Window slightly right of center at 70% horizontal, deep calm green surroundings, calm and low in detail',
  },
  {
    base: 'sanctuary.continue',
    theme: 'dawn',
    subject: `Continuity in morning light: the same cream linen cushion on a pale wooden floor with a half-burned candle beside it and a blank open book, soft natural light from a window falling across them, a feeling that someone has just stepped away and will return`,
    frame: 'Objects in the right half, the left third a plain cream wall in soft shade, calm and low in detail for the lesson title',
  },
  {
    base: 'sanctuary.continue',
    theme: 'dusk',
    subject: `Continuity at dusk: the same linen cushion on a dark wooden floor with a half-burned candle beside it and a blank open book, the last warm amber light from a window falling across them, a feeling that someone has just stepped away and will return, the room itself in dusky plum, mauve and deep indigo shadow with the floor a dark aubergine-grey wood, never brown, caramel or sepia, the amber only as the light that enters through the window`,
    frame: 'Objects in the right half, the left third a plain wall in deep plum-indigo shade, calm, low in detail for the lesson title',
  },
  {
    base: 'sanctuary.continue',
    theme: 'forest',
    subject: `Continuity in the forest: the same linen cushion on a wooden floor among ferns with a half-burned candle beside it and a blank open book, soft filtered golden-green light falling across them, a feeling that someone has just stepped away and will return`,
    frame: 'Objects in the right half, the left third deep out-of-focus ferns and calm shade, low in detail for the lesson title',
  },
  {
    base: 'sanctuary.daily',
    theme: 'dawn',
    subject: `Today's practice in the morning: a small brass bowl of still water on pale stone, a single beam of early morning light falling into it and making it glow pale gold, tiny ripples, a soft cream haze around it`,
    frame: 'Bowl centered, beam entering from the upper left, the upper quarter of the frame plain pale and calm for a title laid over it, soft pale surroundings',
  },
  {
    base: 'sanctuary.daily',
    theme: 'dusk',
    subject: `Today's practice at dusk: a small brass bowl of still water on dark stone, a single beam of warm amber light falling into it and making it glow gold, tiny ripples, a soft rose haze around it`,
    frame: 'Bowl centered, beam entering from the upper left, the upper quarter of the frame plain deep indigo and calm for a title laid over it, deep surroundings',
  },
  {
    base: 'sanctuary.daily',
    theme: 'forest',
    subject: `Today's practice in the forest: a small brass bowl of still water on mossy stone, a single beam of filtered golden light falling into it and making it glow gold, tiny ripples, a soft green haze around it, a few fireflies`,
    frame: 'Bowl centered, beam entering from the upper left, the upper quarter of the frame plain deep green and calm for a title laid over it, deep surroundings',
  },
  {
    base: 'sanctuary.journal',
    theme: 'dawn',
    subject: `The journal as a soft page to write on, entirely out of focus: an open linen-bound notebook with blank pages lying flat on pale oak wood, seen from directly above, a brass pen resting on the right page and one dried sprig of lavender beside the pen, soft morning light from a window grazing the paper, the whole image softly blurred as if photographed far out of focus, the edges of the notebook, the pen and the lavender dissolving into a gentle blur with no crisp line anywhere, the paper a warm cream, no writing on the pages, the table holding only these three things and nothing else`,
    frame: 'The open notebook lies horizontally at the exact center of the frame, its spread between 25% and 75% of the frame width and between 30% and 70% of the frame height, the pen and the lavender inside that same area on the right page, the left page completely empty; the top quarter and the bottom quarter of the frame are only pale wood in soft shade, and so are the left and right fifths, so the image can be cropped to its middle horizontal band or to its central square without losing anything; very low contrast, nothing darker than a soft warm grey',
  },
  {
    base: 'sanctuary.journal',
    theme: 'dusk',
    subject: `The journal as a soft page to write on, entirely out of focus: an open linen-bound notebook with blank pages lying flat on dark aubergine-plum wood with a cool violet-grey cast, never brown, walnut or caramel, seen from directly above, a brass pen resting on the right page and one dried sprig of lavender beside the pen, warm amber candlelight from outside the frame grazing only the paper and its immediate surroundings, the whole image softly blurred as if photographed far out of focus, the edges of the notebook, the pen and the lavender dissolving into a gentle blur with no crisp line anywhere, the paper a warm dim ivory, no writing on the pages, the table holding only these three things and nothing else`,
    frame: 'The open notebook lies horizontally at the exact center of the frame, its spread between 25% and 75% of the frame width and between 30% and 70% of the frame height, the pen and the lavender inside that same area on the right page, the left page completely empty; the top quarter and the bottom quarter of the frame are only dark wood in shadow, and so are the left and right fifths, so the image can be cropped to its middle horizontal band or to its central square without losing anything; very low contrast, nothing brighter than a soft warm amber-grey',
  },
  {
    base: 'sanctuary.journal',
    theme: 'forest',
    subject: `The journal as a soft page to write on, entirely out of focus: an open linen-bound notebook with blank pages lying flat on dark mossy wood, seen from directly above, a brass pen resting on the right page and one dried sprig of lavender beside the pen, soft filtered golden-green light from the canopy grazing the paper, the whole image softly blurred as if photographed far out of focus, the edges of the notebook, the pen and the lavender dissolving into a gentle blur with no crisp line anywhere, the paper a dim muted ivory, no writing on the pages, the table holding only these three things and nothing else`,
    frame: 'The open notebook lies horizontally at the exact center of the frame, its spread between 25% and 75% of the frame width and between 30% and 70% of the frame height, the pen and the lavender inside that same area on the right page, the left page completely empty; the top quarter and the bottom quarter of the frame are only dark mossy wood in shadow, and so are the left and right fifths, so the image can be cropped to its middle horizontal band or to its central square without losing anything; very low contrast, nothing brighter than a soft warm green-grey',
  },
  {
    base: 'sanctuary.empty',
    theme: 'dawn',
    subject: `Luminous emptiness in the morning: an empty bright space opening onto still water, a soft pool of pale gold light gathering in the center of the floor and reflecting in the water beyond, fine dust motes drifting, no objects, the quiet of a place that is new`,
    frame: 'Light pool at center, slightly below the middle, soft pale cream space around it',
  },
  {
    base: 'sanctuary.empty',
    theme: 'dusk',
    subject: `A luminous emptiness at dusk: an empty dark space opening onto still water, a soft pool of warm amber light gathering in the center of the floor and reflecting in the water beyond, fine dust motes drifting, no objects, the quiet of a place that is new`,
    frame: 'Light pool at center, slightly below the middle, deep calm rose-indigo space around it',
  },
  {
    base: 'sanctuary.empty',
    theme: 'forest',
    subject: `A luminous emptiness in the forest: an empty space opening onto a still forest pool, a soft pool of golden-green light gathering in the center of the floor and reflecting in the water beyond, fine dust motes and a few fireflies drifting, no objects, the quiet of a place that is new`,
    frame: 'Light pool at center, slightly below the middle, deep calm green space around it',
  },
  {
    base: 'cart.empty',
    theme: 'dawn',
    subject: `A small empty ceramic dish on a pale stone ledge beside still water in morning light, a single ray of soft warm light falling across it, a thread of steam rising, serene and open, nothing inside`,
    frame: 'Dish at center slightly below the middle, pale ledge and soft cream background, calm bright space above',
  },
  {
    base: 'cart.empty',
    theme: 'dusk',
    subject: `A small empty ceramic dish on a dark stone ledge beside still water at dusk, a single ray of warm amber light falling across it, a thread of steam rising, serene and open, nothing inside`,
    frame: 'Dish at center slightly below the middle, dark ledge and deep rose-indigo background, calm space above',
  },
  {
    base: 'cart.empty',
    theme: 'forest',
    subject: `A small empty ceramic dish on a mossy stone ledge beside a still forest pool, a single ray of filtered golden light falling across it, a thread of steam rising, serene and open, nothing inside`,
    frame: 'Dish at center slightly below the middle, mossy ledge and deep green background, calm space above',
  },
  {
    base: 'checkout.confirmation',
    theme: 'dawn',
    subject: `Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, soft morning light from a window on a pale wooden surface, no writing on the wrapping`,
    frame: 'Parcel centered, pale wooden surface, a soft warm glow, calm empty bright space above it because content is laid over that area later',
  },
  {
    base: 'checkout.confirmation',
    theme: 'dusk',
    subject: `Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, warm amber candlelight on a dark wooden surface, no writing on the wrapping`,
    frame: 'Parcel centered, dark wooden surface, a soft warm glow, calm empty deep space above it because content is laid over that area later',
  },
  {
    base: 'checkout.confirmation',
    theme: 'forest',
    subject: `Your ritual is on its way: a small parcel wrapped in plain linen paper and tied with natural thread, a sprig of dried cedar tucked under the knot, soft filtered golden-green light on a dark mossy wooden surface, no writing on the wrapping`,
    frame: 'Parcel centered, dark mossy wooden surface, a soft warm glow, calm empty deep green space above it because content is laid over that area later',
  },
  {
    base: 'discover.tuning',
    theme: 'dawn',
    subject: `Tuning in at sunrise: an ${BODY_OF_LIGHT}, seated at the edge of pale still water and seen from behind, head slightly bowed, edged in pale gold so it reads against the bright water, as a halo of pale golden ripples spreads across the surface toward it from a single struck point, soft sky-blue reflections in the water, ${filaments('rising from the ripples')}`,
    frame: 'Figure centered, ripples fanning left and right across the wide frame, soft pale edges',
  },
  {
    base: 'discover.tuning',
    theme: 'dusk',
    subject: `Tuning in at dusk: an ${BODY_OF_LIGHT}, seated at the edge of dark still water and seen from behind, head slightly bowed, edged in warm amber so it reads against the deep water, as a halo of warm amber ripples spreads across the surface toward it from a single struck point, soft rose and coral reflections in the water, ${filaments('rising from the ripples')}`,
    frame: 'Figure centered, ripples fanning left and right across the wide frame, deep calm edges',
  },
  {
    base: 'discover.tuning',
    theme: 'forest',
    subject: `Tuning in in the forest: an ${BODY_OF_LIGHT}, seated at the edge of a still forest pool and seen from behind, head slightly bowed, edged in warm golden-green light so it reads against the deep water, as a halo of golden-green ripples spreads across the surface toward it from a single struck point, soft green reflections in the water, ${filaments('rising from the ripples')}, a few fireflies above the surface`,
    frame: 'Figure centered, ripples fanning left and right across the wide frame, deep green calm edges, ferns only in the outer corners',
  },
  {
    base: 'discover.tuning',
    theme: 'moon',
    subject: `Tuning in under the moon: an ${BODY_OF_LIGHT}, seated at the edge of dark still water and seen from behind, head slightly bowed, edged in cool silver so it reads against the dark water, as a halo of silver ripples spreads across the surface toward it from a single struck point, soft deep-blue reflections in the water, ${filaments('rising from the ripples')}, a few dozen fine pinpoint stars above`,
    frame: 'Figure centered, ripples fanning left and right across the wide frame, deep blue calm edges',
  },
  {
    base: 'discover.result',
    theme: 'dawn',
    subject: `Revelation at sunrise: an ${BODY_OF_LIGHT}, standing upright with open arms at the edge of pale still water, seen from behind facing the horizon, a single narrow beam of pale gold light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, pale gold, with no split and no colored bands, the body warm ivory-gold with only a very faint sky-blue and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single pale gold column, a moment of clarity`,
    frame: 'The horizon line sits high, at 30% of the frame height, so the wide still water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm pale mist and still water with nothing bright, for the result text',
  },
  {
    base: 'discover.result',
    theme: 'dusk',
    subject: `Revelation at dusk: an ${BODY_OF_LIGHT}, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single narrow beam of warm amber light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, warm amber, with no split and no colored bands, the body warm amber-white with only a very faint rose and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single warm amber column, a moment of clarity`,
    frame: 'The horizon line sits high, at 30% of the frame height, so the wide dark water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark mist and still water with nothing bright, for the result text',
  },
  {
    base: 'discover.result',
    theme: 'forest',
    subject: `Revelation in the forest: an ${BODY_OF_LIGHT}, standing upright with open arms at the edge of a still forest pool, seen from behind facing the far shore, a single narrow beam of warm golden-green light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, warm golden-green, with no split and no colored bands, the body warm gold-white with only a very faint green and teal tint inside it, never iridescent and never pastel, and its reflection on the water a single warm golden column, a moment of clarity, a few fireflies rising`,
    frame: 'The far shore line sits high, at 30% of the frame height, so the wide dark still water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the shore; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark green mist and still water with nothing bright, for the result text',
  },
  {
    base: 'discover.result',
    theme: 'moon',
    subject: `Revelation under the moon: an ${BODY_OF_LIGHT}, standing upright with open arms at the edge of dark still water, seen from behind facing the horizon, a single narrow beam of cool silver light descending from the top center of the frame that fades out completely well before it reaches the middle of the frame, ending at about 30% of the frame height, one color only, silver, with no split and no colored bands, the body cool silver-white with only a very faint teal and lavender tint inside it, never iridescent and never pastel, and its reflection on the water a single silver column, a moment of clarity, a few dozen fine pinpoint stars above`,
    frame: 'The horizon line sits high, at 30% of the frame height, so the wide dark water fills the lower 70%; the figure is small, about 12% of the frame height, and stands on that water close to the viewer, centered at 50% horizontal, its head at 70% of the frame height and its feet at 82%, never near the horizon; the beam stays in the top third of the frame and never crosses the middle; the band from 35% to 65% of the frame height is calm dark blue mist and still water with nothing bright, for the result text',
  },
  {
    base: 'booking.confirmation',
    theme: 'dawn',
    subject: `The same serene place now with its candles lit in the morning: a pale wooden deck over a mirror-calm lake, floor cushions in a circle with a small warm candle glow among them in the soft morning light, reflected in the still water, a steaming cup set beside them, a soft peach light on the horizon`,
    frame: 'Warm center, soft pale edges, calm space in the middle because content is laid over it later',
  },
  {
    base: 'academy.completion',
    theme: 'dawn',
    subject: `A completed cycle closed in light at sunrise: a ring of exactly twelve small golden lights, evenly spaced and with no other lights, floating on pale still water seen from a slightly oblique overhead angle, each one a small warm point with a soft ring of light around it so it reads on the bright water, a small ${BODY_OF_LIGHT}, seated cross-legged just outside the far side of the ring, never counted as one of the twelve, every light steady and one slightly brighter, concentric ripples radiating outward from the ring only`,
    frame:
      'Ring centered at 50% horizontal, its middle empty, pale and perfectly still water because content is laid over it later, count the lights: twelve around the ring and the figure beyond them, the ripples spreading outward from the ring only, the small figure no taller than 12% of the frame height at the far edge of the ring at 50% horizontal and 30% vertical, nothing but soft pale mist and water around',
  },

  /* Héroes en Luna: la misma escena que su slot, bajo luz de luna (azul noche y plata) */
  {
    base: 'portal.hero',
    theme: 'moon',
    subject: `A vast threshold over still water at night in soft moonlight: a circular opening of cool silver light, ${HALO}, hovering low above a calm sea at the horizon, its reflection on the water short and soft, ending at about 70% of the frame height, the sky deep night blue with a few dozen fine pinpoint stars in the upper third and a thin veil of cirrus mist, a faint teal glow low on the horizon at the left and a faint lavender glow low on the horizon at the right, both fading out well before the frame edges`,
    frame: RING_FRAME,
  },
  {
    base: 'home.hero',
    theme: 'moon',
    subject: `The brand signature image in soft moonlight: an ${BODY_OF_LIGHT}, resting on its side across the surface of a calm sea like a person lying down, clearly readable as a human form with a distinct round head, shoulders, back and the long line of the legs ending in the water, not a blob and not a jellyfish, seen softly from behind with the head turned away from the camera, its head close to the water where a soft diffuse silver glow gathers beneath it and ripples outward in concentric rings, the silhouette edged in cool silver with faint teal and lavender light flowing through it like fine veins of current, a few dozen fine pinpoint stars in the upper third and a pale moon high in the upper left, a thin veil of cirrus mist`,
    frame: SIGNATURE_FRAME('open calm sea and soft moonlit sky'),
  },
  {
    base: 'resonario.hero',
    theme: 'moon',
    subject: `A vast resonant space over still water in soft moonlight: rows of softly glowing translucent discs suspended at different depths like a solar system above a mirror-calm surface that doubles them, cool silver rims, a few dozen fine pinpoint stars, drifting haze, each disc lit from within like a soft lantern of light, not glass and not a bubble, with no hard outline, and the horizon a plain line of mist with no shore, rocks, hills, lamps or any object other than the discs and their reflections, cinematic depth of field`,
    frame: 'Discs receding from the upper right toward the center, the left third plain calm water and sky with no moon, no reflection column and no bright patch, low in detail',
  },
  {
    base: 'about.hero',
    theme: 'moon',
    subject: `The place where the work begins, in soft moonlight: a quiet terrace of dark stone opening onto a calm sea and a distant headland in silver haze, a low wooden table with a crystal singing bowl and a single lit candle standing in the middle distance at the far end of the terrace, near the edge of the water, a linen shawl left over a stone bench as if someone had just stepped out, cool silver moonlight and a few dozen fine pinpoint stars`,
    frame:
      'Table and candle at 60% horizontal and 40% vertical, which is the middle distance: the stone floor of the terrace extends in front of them across the whole lower half of the frame, the left third calm moonlit sea and sky for the title, the lower edge calm',
  },
  {
    base: 'auth.hero',
    theme: 'moon',
    subject: `A tall arched doorway of soft silver-white light set into a wall of moonlit stone at the edge of a calm sea, seen from a few steps back, a gentle path of light spilling across the wet stone and the water toward the viewer, a night sky with a few fine stars above, quiet, inviting, nobody in the frame`,
    frame: 'Arch placed in the right half, the left third plain calm wall, sea and soft sky for a quote',
  },
  {
    base: 'discover.hero',
    theme: 'moon',
    subject: `The beginning of a discovery in soft moonlight: a narrow path of pale stone steps rising from a calm sea into a soft silver mist over distant ridges in haze, a sense of a first step, no people`,
    frame:
      'Path entering from the lower right corner and curving gently to the left as it recedes, so that its far end and the pale light converge exactly at the horizontal center of the frame (50% horizontal, 40% vertical), the left third calm and low in detail',
  },
  {
    base: 'academy.hero',
    theme: 'moon',
    subject: `Study as a scene in soft moonlight: a low wooden desk on a quiet seaside terrace with an open blank notebook, a ceramic bowl and a lit candle, a calm sea and a far headland in silver haze, cool moonlight, no people`,
    frame: 'Desk in the right half, the left third calm sea and soft sky, low in detail for the headline',
  },
  {
    base: 'experiences.hero',
    theme: 'moon',
    subject: `The journey as a promise in soft moonlight: a path of pale stepping stones across a calm lake toward a simple open pavilion on the far shore: a pavilion of timber with slim square posts and a low plain gabled roof, with no curved eaves, no tiered roof and no ornament, belonging to no particular culture, silver mist between dark trees and hills, nobody present`,
    frame:
      'Pavilion centered at exactly 55% of the frame width (just right of center) and 40% vertical, stepping stones leading in from the lower left, the left third calm moonlit water and mist, low in detail',
  },
  {
    base: 'booking.hero',
    theme: 'moon',
    subject: `An empty serene place ready to receive: floor cushions arranged in a circle on a wooden deck over a calm sea at night, a few candles that are not lit, unburnt white wax with dark wicks and no flame, giving no light at all, so that the only light in the scene is the cool silver moonlight on the planks and the headland beyond`,
    frame:
      'Wide symmetrical, circle of cushions in the middle distance, the left third open calm sea and soft sky for the headline: the horizon and the haze continue across the whole width with no gradient, no band and no vertical edge',
  },
  {
    base: 'store.hero',
    theme: 'moon',
    subject: `The ritual of acquiring in soft moonlight: a dark stone ledge at the edge of a calm sea with a still life of an amber glass bottle, a honey-coloured candle, a rose quartz point and a bundle of incense, cool silver moonlight raking across the objects and reflecting in the water behind them`,
    frame: 'Objects in the right half at 40% vertical, the left third calm open water and soft sky for the headline',
  },
  {
    base: 'sanctuary.hero',
    theme: 'moon',
    subject: `A personal sanctuary in soft moonlight: an ${BODY_OF_LIGHT}, resting on a cushion beside a large window that opens onto a calm sea in soft moonlight, seen from behind looking out, sheer curtains stirring, a lit candle on the sill, cool silver light balanced with a faint teal glow, ${filaments('rising from the water outside')}`,
    frame: 'Window on the right with the figure beneath it, left third calm wall and soft curtain light, low in detail',
  },

  /* Resonario: la misma escena del héroe base (discos suspendidos sobre el agua) en cada tema */
  {
    base: 'resonario.hero',
    theme: 'dusk',
    subject: `A vast resonant space over a calm sea at dusk: rows of softly glowing translucent discs suspended at different depths like a solar system above a mirror-calm surface that doubles them, warm amber rims, a sky of dusky rose, terracotta and soft amber with thin warm clouds, drifting haze, each disc lit from within like a soft lantern of light, not glass and not a bubble, with no hard outline, and the horizon a plain line of mist with no shore, rocks, hills, lamps or any object other than the discs and their reflections, cinematic depth of field`,
    frame: 'Discs receding from the upper right toward the center, the left third calm sea and soft sky, low in detail',
  },
  {
    base: 'resonario.hero',
    theme: 'dawn',
    subject: `A vast resonant space over a mirror-calm lake at sunrise: rows of softly glowing translucent discs suspended at different depths like a solar system above the water that doubles them, pale gold rims, a luminous open sky of soft sky blue fading to ivory with a faint pale gold near the horizon, drifting bright haze, each disc lit from within like a soft lantern of light, not glass and not a bubble, with no hard outline, and the horizon a plain line of mist with no shore, rocks, hills, lamps or any object other than the discs and their reflections, cinematic depth of field`,
    frame: 'Discs receding from the upper right toward the center, the left third calm lake and soft sky, low in detail',
  },
  {
    base: 'resonario.hero',
    theme: 'forest',
    subject: `A vast resonant space over a still forest pool: rows of softly glowing translucent discs, each one a perfect circle seen face-on and facing the viewer like a full round moon, never a flat saucer, never an ellipse seen edge-on and never hanging from any thread, suspended at different depths like a solar system above the water that doubles them, golden-green rims, tall tree ferns and slender trunks along the far shore, warm filtered golden light between the canopy, a fine mist drifting, each disc lit from within like a soft lantern of light, not glass and not a bubble, with no hard outline, and the horizon a plain line of mist with no shore, rocks, hills, lamps or any object other than the discs and their reflections, cinematic depth of field`,
    frame: 'Discs receding from the upper right toward the center, the left third still water and soft out-of-focus foliage, low in detail',
  },
]

export const EDITORIAL_MEDIA_SLOTS = [
  'portal.hero',
  'portal.portal-field',
  'not-found.hero',
  'home.hero',
  'home.daily-frequency',
  'home.realms-banner',
  'home-marisol-portrait',
  'home-membership',
  'home.footer-banner',
  'about.hero',
  'about.angels',
  'auth.hero',
  'auth.form-atmosphere',
  'discover.hero',
  'discover.question-atmosphere',
  'discover.tuning',
  'discover.result',
  'resonario.hero',
  'resonario.featured',
  'resonario.archive-banner',
  'resonario.audio-cover.*',
  'academy.hero',
  'academy.featured-course',
  'academy-course-cover',
  'academy-lesson-visual',
  'academy.completion',
  'experiences.hero',
  'experiences.featured',
  'experiences-visual',
  'booking.hero',
  'booking.confirmation',
  'store.hero',
  'store-product-visual',
  'store.ritual-banner',
  'product.detail',
  'product.related',
  'cart.empty',
  'checkout.confirmation',
  'sanctuary.hero',
  'sanctuary.continue',
  'sanctuary.daily',
  'sanctuary.journal',
  'sanctuary.empty',
  'states.loading',
  'states.empty',
  'states.error',
  'states.offline',
  'atmosphere.forest-autumn',
  'resonario.celtic',
  'resonario.kind-banner.*',
] as const;

export type EditorialMediaSlot = (typeof EDITORIAL_MEDIA_SLOTS)[number];

/** Los cinco temas del sitio (`AtmosphereId`); se repite aquí para no importar de `types/` en el contrato. */
export type EditorialTheme = 'night' | 'dusk' | 'dawn' | 'moon' | 'forest';

const HERO_THEMES = ['dusk', 'dawn', 'moon', 'forest'] as const;
/** Bandas y fondos: Amanecer (el claro) y, desde 2026-10-18, Atardecer y Bosque, los dos temas cuyo tono la noche azul no sigue. */
const BAND_THEMES = ['dawn', 'dusk', 'forest'] as const;
/** Fondos de cristal: los mismos tres temas de banda, más Luna en Descúbrete, que es el lugar de la luna. */
const BACKDROP_THEMES = ['dawn', 'dusk', 'forest'] as const;
const DISCOVER_BACKDROP_THEMES = [...BACKDROP_THEMES, 'moon'] as const;

/**
 * Slots que tienen una variante de imagen por tema (`slot@tema` en el manifiesto,
 * `<archivo>-<tema>.avif`). La noche es siempre la base. Un tema que no figura aquí ve la
 * imagen base.
 *
 * - Los héroes de cada vista llevan variante en los cuatro temas que no son la noche (la base):
 *   son la primera impresión de cada vista y un paisaje nocturno azul no funciona bajo un tema
 *   cálido, claro o verde; Luna también tiene el suyo, con la misma escena bajo luz de luna.
 * - Las bandas con texto encima y los fondos de cristal llevan variante en Amanecer, el único
 *   tema claro: una foto oscura bajo un velo claro se ve sucia, y la tinta oscura del cristal
 *   no lee sobre ella. También en Atardecer y Bosque (2026-10-18): la noche azul funde con
 *   Luna, pero desentona con el ciruela y con el verde, y esos dos temas ya son el camino por
 *   defecto de Experiencias y Academia. Luna no lleva variantes de banda; sí en `discover.tuning`
 *   y `discover.result`, porque Descúbrete es su lugar.
 *   `booking.confirmation` (Atardecer) y `academy.completion` (Bosque) llevan sólo la del tema
 *   de su lugar.
 * - Portadas de audio, de curso, visuales de experiencia y productos son contenido del ítem y
 *   no cambian con el tema.
 *
 * Lo cruza `tests/lib/editorial-theme-variants.test.ts` con el brief (`Branding/src/data/photography-themes.js`).
 */
export const THEME_VARIANTS: Readonly<
  Partial<Record<EditorialMediaSlot, readonly Exclude<EditorialTheme, 'night'>[]>>
> = {
  'portal.hero': HERO_THEMES,
  'home.hero': HERO_THEMES,
  'about.hero': HERO_THEMES,
  'auth.hero': HERO_THEMES,
  'discover.hero': HERO_THEMES,
  'resonario.hero': HERO_THEMES,
  'academy.hero': HERO_THEMES,
  'experiences.hero': HERO_THEMES,
  'booking.hero': HERO_THEMES,
  'store.hero': HERO_THEMES,
  'sanctuary.hero': HERO_THEMES,
  // El retrato de Marisol: una versión por tema, hermana de la base publicada (misma persona, misma
  // pose y encuadre; cambian sólo la luz, el muro y la vista de la ventana). Retoque de luz sobre la
  // foto publicada, no un rostro nuevo.
  'home-marisol-portrait': HERO_THEMES,
  'home.daily-frequency': BAND_THEMES,
  'home.realms-banner': BAND_THEMES,
  'home.footer-banner': BAND_THEMES,
  'home-membership': BAND_THEMES,
  'about.angels': BAND_THEMES,
  'auth.form-atmosphere': BAND_THEMES,
  'discover.question-atmosphere': BAND_THEMES,
  'resonario.featured': BAND_THEMES,
  'resonario.archive-banner': BAND_THEMES,
  'resonario.celtic': BAND_THEMES,
  'academy.featured-course': BAND_THEMES,
  'academy.completion': ['forest', 'dawn'],
  'experiences.featured': BAND_THEMES,
  'booking.confirmation': ['dusk', 'dawn'],
  'store.ritual-banner': BAND_THEMES,
  // Fondos que Amanecer lavaba con un filtro: la misma escena, con la luz de Amanecer, Atardecer y
  // Bosque (2026-10-19), y también Luna en los dos de Descúbrete (2026-10-19). El 404 raíz
  // (`not-found.hero`) no entra: está fuera del proveedor de tema y `ThemedPhoto` lo necesita.
  'states.loading': BACKDROP_THEMES,
  'states.empty': BACKDROP_THEMES,
  'states.error': BACKDROP_THEMES,
  'states.offline': BACKDROP_THEMES,
  'sanctuary.continue': BACKDROP_THEMES,
  'sanctuary.daily': BACKDROP_THEMES,
  'sanctuary.journal': BACKDROP_THEMES,
  'sanctuary.empty': BACKDROP_THEMES,
  'cart.empty': BACKDROP_THEMES,
  'checkout.confirmation': BACKDROP_THEMES,
  'discover.tuning': DISCOVER_BACKDROP_THEMES,
  'discover.result': DISCOVER_BACKDROP_THEMES,
};

/**
 * Foco propio de una variante cuyo sujeto no está donde el de la base (`slot@tema` → `x% y%`). Las
 * que no figuran usan el foco del slot. Son las atmósferas de Ambientes v2, compuestas con el sujeto
 * a la derecha para dejar libre el titular.
 */
export const THEME_VARIANT_POSITIONS: Readonly<Record<string, string>> = {
  'academy.hero@dawn': '70% 50%',
  'store.hero@dawn': '60% 55%',
  'about.hero@dawn': '66% 50%',
};

export type EditorialMediaAspect = 'viewport' | '16:9' | '16:8' | '3:4' | '1:1';
export type EditorialMediaPriority = 'P0' | 'P1' | 'P2';

/**
 * Qué pinta un slot mientras no tiene fotografía, según su trabajo en la vista:
 *
 * - `zebra`: materia estructural con texto encima (héroes, retrato de Marisol).
 *   Bandas de la paleta, estáticas: la zebra es una ausencia deliberada, no
 *   una carga, y no late.
 * - `band`: contenido de un ítem del catálogo (curso, experiencia, producto,
 *   audio). Usa la banda de color del propio ítem para no perder su identidad.
 * - `none`: atmósfera sin trabajo narrativo propio. No pinta nada hasta que
 *   llegue la foto; la vista descansa en el world engine.
 * - `atmosphere`: paisaje de apoyo sin trabajo narrativo (`atmosphere.forest-autumn`). Sin
 *   foto pinta el degradado `--atmo-backdrop` del tema activo: nunca zebra ni caja gris.
 */
export type EditorialMediaFallback = 'zebra' | 'band' | 'none' | 'atmosphere';

export interface EditorialMediaDefinition {
  aspect: EditorialMediaAspect;
  position: string;
  priority: boolean;
  priorityTier: EditorialMediaPriority;
  fallback: EditorialMediaFallback;
  sizes: string;
  alt?: string;
  /**
   * Foco por debajo de 768 px, cuando el de escritorio deja el sujeto fuera de
   * la ventana visible en móvil. No sustituye a `position`: lo complementa.
   */
  mobilePosition?: string;
  /**
   * Atmósfera pintada como fondo a pantalla completa, por encima de su ratio.
   * Única excepción a «cada slot con su ratio»: sólo vale para una imagen de
   * bajo contraste y nada nítido, donde la ampliación no se percibe.
   */
  backdrop?: true;
}

const WIDE: Pick<EditorialMediaDefinition, 'position' | 'sizes'> = {
  position: '50% 40%',
  sizes: '100vw',
};

const CENTER: Pick<EditorialMediaDefinition, 'position' | 'sizes'> = {
  position: '50% 50%',
  sizes: '100vw',
};

const PORTRAIT: Pick<EditorialMediaDefinition, 'position' | 'sizes'> = {
  position: '50% 50%',
  sizes: '(min-width: 768px) 50vw, 100vw',
};

export const EDITORIAL_MEDIA_REGISTRY: Record<EditorialMediaSlot, EditorialMediaDefinition> = {
  'portal.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: true,
    priorityTier: 'P0',
    fallback: 'zebra',
    alt: 'Luz y cosmos en el umbral de Frecuencia Mágica',
  },
  'portal.portal-field': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'El campo del portal entre mundos',
  },
  'not-found.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Un rincón sereno del cosmos para retomar el camino',
  },
  'home.hero': {
    ...WIDE,
    position: '62% 40%',
    mobilePosition: '75% 40%',
    aspect: '16:9',
    priority: true,
    priorityTier: 'P0',
    fallback: 'zebra',
  },
  'home.daily-frequency': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
  },
  'home.realms-banner': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
  },
  'home-marisol-portrait': {
    ...PORTRAIT,
    aspect: '3:4',
    priority: true,
    priorityTier: 'P0',
    fallback: 'zebra',
  },
  'home-membership': {
    ...WIDE,
    position: '50% 15%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'zebra',
  },
  'home.footer-banner': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
  },
  'about.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: true,
    priorityTier: 'P1',
    fallback: 'zebra',
  },
  'about.angels': {
    ...WIDE,
    position: '50% 30%',
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
  },
  'auth.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'La puerta de entrada a tu santuario',
  },
  'auth.form-atmosphere': {
    ...PORTRAIT,
    aspect: '3:4',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Calma íntima alrededor del acceso',
  },
  'discover.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'El comienzo de tu descubrimiento',
  },
  'discover.question-atmosphere': {
    ...PORTRAIT,
    aspect: '3:4',
    backdrop: true,
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Atmósfera serena para escucharte',
  },
  'discover.tuning': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'Tu frecuencia encontrando su tono',
  },
  'discover.result': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'El resultado de tu descubrimiento',
  },
  'resonario.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'La resonario sonora de Frecuencia Mágica',
  },
  'resonario.featured': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'El audio destacado de la semana',
  },
  'resonario.archive-banner': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'El archivo completo de sonidos',
  },
  'resonario.audio-cover.*': {
    ...CENTER,
    aspect: '1:1',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Portada de audio de Frecuencia Mágica',
  },
  'academy.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'La academia de prácticas de Frecuencia Mágica',
  },
  'academy.featured-course': {
    ...WIDE,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Curso destacado de Frecuencia Mágica',
  },
  'academy-course-cover': {
    ...WIDE,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Escena de la práctica del curso',
  },
  'academy-lesson-visual': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Práctica de la lección',
  },
  'academy.completion': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'El curso completado: un ciclo cerrado con luz',
  },
  'experiences.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'Las experiencias que te esperan',
  },
  'experiences.featured': {
    ...WIDE,
    position: '50% 45%',
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Experiencia destacada de Frecuencia Mágica',
  },
  'experiences-visual': {
    position: '62% 45%',
    sizes: '100vw',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Atmósfera de la experiencia',
  },
  'booking.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'El lugar de tu experiencia',
  },
  'booking.confirmation': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'Tu experiencia te espera',
  },
  'store.hero': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'La tienda de los objetos del ritual',
  },
  'store-product-visual': {
    ...CENTER,
    aspect: '1:1',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Producto de Frecuencia Mágica',
  },
  'store.ritual-banner': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Los objetos del ritual',
  },
  'product.detail': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Detalle del producto',
  },
  'product.related': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P2',
    fallback: 'band',
    alt: 'Objetos que acompañan al ritual',
  },
  'cart.empty': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'El carrito en calma, esperando tu elección',
  },
  'checkout.confirmation': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'Tu ritual está en camino',
  },
  'sanctuary.hero': {
    ...WIDE,
    // El cuerpo de luz está en la mitad baja (45–90 % del alto) y a la derecha: el foco 40 % lo
    // dejaba fuera de la franja que muestra la caja del héroe. En móvil (franja estrecha)
    // se corre a la derecha para que el cuerpo entre en la ventana, en los cinco temas.
    position: '50% 72%',
    mobilePosition: '90% 72%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'zebra',
    alt: 'Tu santuario te espera',
  },
  'sanctuary.continue': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P1',
    fallback: 'band',
    alt: 'Continúa tu práctica desde donde la dejaste',
  },
  'sanctuary.daily': {
    ...CENTER,
    aspect: '1:1',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'La práctica de hoy en tu santuario',
  },
  // Fondo del campo de texto del diario, apaisado: el campo lo recorta a su franja central.
  'sanctuary.journal': {
    ...CENTER,
    aspect: '16:8',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Las páginas de tu diario',
  },
  'sanctuary.empty': {
    ...WIDE,
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Tu santuario espera sus primeras prácticas',
  },
  'states.loading': {
    ...WIDE,
    position: '50% 42%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
  },
  'states.empty': {
    ...WIDE,
    position: '50% 55%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
  },
  'states.error': {
    ...WIDE,
    position: '50% 58%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
  },
  'states.offline': {
    ...WIDE,
    position: '70% 45%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
  },
  // Atmósferas (spec 2026-10-17). Sin foto pintan el degradado de su atmósfera (`atmosphere`): la
  // zebra es de noche y desentona sobre una escena clara.
  'atmosphere.forest-autumn': {
    sizes: '100vw',
    position: '60% 50%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P2',
    fallback: 'atmosphere',
    alt: 'Un sendero de bosque otoñal en tonos ámbar y dorado',
  },
  'resonario.celtic': {
    sizes: '100vw',
    position: '66% 50%',
    aspect: '16:9',
    priority: false,
    priorityTier: 'P1',
    fallback: 'none',
    alt: 'Un arpa celta junto a una ventana sobre colinas verdes en la bruma',
  },
  'resonario.kind-banner.*': {
    sizes: '100vw',
    position: '50% 50%',
    aspect: '16:8',
    priority: false,
    priorityTier: 'P2',
    fallback: 'none',
    alt: 'Imagen de un tipo de escucha del Resonario',
  },
};

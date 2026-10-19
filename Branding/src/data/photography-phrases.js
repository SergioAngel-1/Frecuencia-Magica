/**
 * Frases fijas del brief fotográfico, compartidas por `photography.js` (los slots) y
 * `photography-themes.js` (las variantes por tema). Viven aparte para que los dos módulos
 * las importen sin dependerse entre sí.
 */

/** Rasgos de la silueta de luz, en positivo: «faceless» a secas produce un perfil con nariz y labios. */
export const LIGHT_BODY_TRAITS =
  'with natural human proportions, the head a smooth featureless glow with no nose, no lips, no eyes, no ear and no facial contour, ' +
  'the body a soft-edged form with no anatomical detail, more light than flesh'

/** Cuerpo de luz, sin artículo: `an ${BODY_OF_LIGHT}`, `a small ${BODY_OF_LIGHT}`. */
export const BODY_OF_LIGHT = `abstract translucent silhouette of pure light ${LIGHT_BODY_TRAITS}`

/** Firma de filamentos contada en positivo: sin «exactly … in total» los modelos pintan 4–6 líneas. */
export const filaments = (where) =>
  `exactly three thin vertical light filaments in total, one gold, one teal and one lavender, ${where}, and no other vertical lines anywhere`

/** Anillos y círculos de luz: sin esta frase salen como un tubo de neón fino y nítido. */
export const HALO =
  'a soft diffuse halo of light: a broad blurred glow about one fifth of the ring\'s diameter wide, brightest in the middle of its width and fading smoothly on both sides, ' +
  'with no outline and no hard edge, like the corona of an eclipse seen through mist, never a thin glowing line or neon tube'


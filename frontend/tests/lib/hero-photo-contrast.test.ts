import { resolve } from 'node:path';

import sharp from 'sharp';
import { describe, expect, it } from 'vitest';

import {
  contrast,
  parseColor,
  parseTriplet,
  readTokensCss,
  resolvedTokens,
  type RGB,
} from '../helpers/css-tokens';

/**
 * Contraste del texto del héroe sobre su foto (ambientes v2, T2.1). Reproduce lo
 * que pinta `RealmHero`: la foto publicada del tema con el velo `left` de
 * `EditorialOverlay` (denso 0,86 en el borde, 0,58 al 44 %, nada al 82 %) y mide
 * la tinta del tema sobre la zona del título, la entrada y el kicker
 * (x 8–40 %, y 20–55 % del héroe). Es el peor píxel, no la media: a 1440, 1280,
 * 768 y 390 px la medición con Chromium dio >= 10:1 en los cuatro héroes.
 */
const CSS = readTokensCss();
const PUBLIC = resolve(process.cwd(), 'public/editorial');
const MIN = 4.5;

/** Héroe con imagen propia de un tema publicada -> tema cuyos tokens pinta y archivo de la variante. */
const HEROES = [
  { place: 'Resonario', id: 'dusk', file: 'resonario-hero-dusk' },
  { place: 'Resonario', id: 'dawn', file: 'resonario-hero-dawn' },
  { place: 'Resonario', id: 'moon', file: 'resonario-hero-moon' },
  { place: 'Resonario', id: 'forest', file: 'resonario-hero-forest' },
  { place: 'Academia', id: 'dawn', file: 'academy-hero-dawn' },
  { place: 'Sobre Marisol', id: 'dawn', file: 'about-hero-dawn' },
  { place: 'Tienda', id: 'dawn', file: 'store-hero-dawn' },
  { place: 'Experiencias', id: 'dusk', file: 'experiences-hero-dusk' },
  { place: 'Home', id: 'dusk', file: 'home-hero-dusk' },
  { place: 'Home', id: 'dawn', file: 'home-hero-dawn' },
  { place: 'Home', id: 'forest', file: 'home-hero-forest' },
] as const;

const W = 640;
const H = 360;

describe.each(HEROES)('hero of $place (theme $id) over its photo', ({ id, file }) => {
  it('reads at 4.5:1 or more in the worst pixel of the text zone', async () => {
    const tokens = resolvedTokens(CSS, `[data-atmosphere='${id}']`);
    const ink = parseColor(tokens['--color-fg']!);
    const scrim = parseTriplet(tokens['--scrim']!);
    const dense = parseTriplet(tokens['--scrim-deep']!);

    const { data, info } = await sharp(resolve(PUBLIC, `${file}.avif`))
      .resize(W, H, { fit: 'cover' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    expect(info.channels).toBe(3);

    let worst = Infinity;
    for (let y = Math.floor(H * 0.2); y < Math.floor(H * 0.55); y++) {
      for (let x = Math.floor(W * 0.08); x < Math.floor(W * 0.4); x++) {
        const at = (y * W + x) * 3;
        const photo: RGB = { r: data[at]!, g: data[at + 1]!, b: data[at + 2]! };
        // Velo `left`: del peldaño denso (0,86) al medio (0,58) hasta el 44 %.
        const t = x / W / 0.44;
        const alpha = 0.86 + (0.58 - 0.86) * t;
        const tint = {
          r: dense.r + (scrim.r - dense.r) * t,
          g: dense.g + (scrim.g - dense.g) * t,
          b: dense.b + (scrim.b - dense.b) * t,
        };
        const veiled: RGB = {
          r: tint.r * alpha + photo.r * (1 - alpha),
          g: tint.g * alpha + photo.g * (1 - alpha),
          b: tint.b * alpha + photo.b * (1 - alpha),
        };
        worst = Math.min(worst, contrast(ink, veiled));
      }
    }

    expect(worst).toBeGreaterThanOrEqual(MIN);
  });
});

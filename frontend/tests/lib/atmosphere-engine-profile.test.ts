import { describe, expect, it } from 'vitest';

import { ATMOSPHERES } from '@/config/atmospheres';
import type { VisualMode } from '@/config/realms';
import { engineProfile, fadeDuration } from '@/lib/atmosphere/engine-profile';
import type { AtmosphereId } from '@/types/atmosphere';

/**
 * Opacidades del engine con la noche (la v1), tal como las pintaban los
 * componentes antes de existir los perfiles. La noche no debe cambiar nada.
 */
const NIGHT_BY_MODE: Record<VisualMode, { canvas: number; nebula: number; figures: number }> = {
  cosmic: { canvas: 1, nebula: 1, figures: 1 },
  editorial: { canvas: 0.52, nebula: 0.68, figures: 0.7 },
  quiet: { canvas: 0.34, nebula: 0.46, figures: 0.5 },
};

const MODES = Object.keys(NIGHT_BY_MODE) as VisualMode[];
const THEMES: AtmosphereId[] = ['night', 'dusk', 'dawn', 'moon', 'forest'];

describe('engineProfile', () => {
  it.each(MODES)('night reproduces the v1 opacity map for %s', (mode) => {
    expect(engineProfile('night', mode)).toEqual(NIGHT_BY_MODE[mode]);
  });

  // Cada tema pinta su escena: el motor se adapta, no se apaga en los claros.
  it.each(MODES)('no theme silences the engine under %s', (mode) => {
    for (const id of THEMES) {
      const profile = engineProfile(id, mode);

      expect(profile.canvas, `${id} canvas`).toBeGreaterThanOrEqual(
        NIGHT_BY_MODE[mode].canvas * 0.9,
      );
      expect(profile.nebula, `${id} nebula`).toBeGreaterThanOrEqual(
        NIGHT_BY_MODE[mode].nebula * 0.9,
      );
      expect(profile.figures, `${id} figures`).toBeGreaterThanOrEqual(
        NIGHT_BY_MODE[mode].figures * 0.5,
      );
    }
  });

  it('multiplies the visual mode level by the atmosphere multiplier', () => {
    const { canvas, nebula, figures } = ATMOSPHERES.dusk.engine;
    const editorial = NIGHT_BY_MODE.editorial;

    expect(engineProfile('dusk', 'editorial')).toEqual({
      canvas: editorial.canvas * canvas,
      nebula: editorial.nebula * nebula,
      figures: editorial.figures * figures,
    });
  });
});

describe('fadeDuration', () => {
  it('is instant under reduced motion', () => {
    expect(fadeDuration(true)).toBe(0);
  });

  it('is a positive number of seconds otherwise', () => {
    expect(fadeDuration(false)).toBeGreaterThan(0);
  });
});

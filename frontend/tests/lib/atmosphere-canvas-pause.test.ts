import { describe, expect, it } from 'vitest';

import { CANVAS_PAUSE_BELOW, pauseDelayMs, shouldRunCanvas } from '@/lib/atmosphere/canvas-pause';
import { engineProfile, fadeDuration } from '@/lib/atmosphere/engine-profile';
import type { VisualMode } from '@/config/realms';
import type { AtmosphereId } from '@/types/atmosphere';

const MODES: VisualMode[] = ['cosmic', 'editorial', 'quiet'];
const LIGHT: AtmosphereId[] = ['dawn', 'study', 'store', 'marisol'];
const DARK: AtmosphereId[] = ['night', 'dusk', 'moon', 'forest', 'gathering'];

describe('shouldRunCanvas', () => {
  it('runs with the night canvas under every visual mode', () => {
    for (const mode of MODES) {
      expect(shouldRunCanvas(engineProfile('night', mode).canvas), mode).toBe(true);
    }
  });

  it('stops at or below the threshold, not only at zero', () => {
    expect(CANVAS_PAUSE_BELOW).toBe(0.05);
    expect(shouldRunCanvas(0)).toBe(false);
    expect(shouldRunCanvas(0.026)).toBe(false);
    expect(shouldRunCanvas(0.05)).toBe(false);
    expect(shouldRunCanvas(0.051)).toBe(true);
  });

  it.each(MODES)('pauses the light atmospheres under %s', (mode) => {
    for (const id of LIGHT) {
      expect(shouldRunCanvas(engineProfile(id, mode).canvas), `${id} ${mode}`).toBe(false);
    }
  });

  it.each(MODES)('runs the dark atmospheres under %s', (mode) => {
    for (const id of DARK) {
      expect(shouldRunCanvas(engineProfile(id, mode).canvas), `${id} ${mode}`).toBe(true);
    }
  });
});

describe('pauseDelayMs', () => {
  const fade = fadeDuration(false);

  it('waits for the fade when a running canvas is turned off', () => {
    expect(pauseDelayMs(1, 0, fade)).toBe(fade * 1000);
  });

  it('pauses at once on mount or when it was already paused', () => {
    expect(pauseDelayMs(null, 0, fade)).toBe(0);
    expect(pauseDelayMs(0, 0, fade)).toBe(0);
    expect(pauseDelayMs(0.02, 0.03, fade)).toBe(0);
  });

  it('pauses at once under reduced motion', () => {
    expect(pauseDelayMs(1, 0, fadeDuration(true))).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';

import { CANVAS_PAUSE_BELOW, pauseDelayMs, shouldRunCanvas } from '@/lib/atmosphere/canvas-pause';
import { engineProfile, fadeDuration } from '@/lib/atmosphere/engine-profile';
import type { VisualMode } from '@/config/realms';
import type { AtmosphereId } from '@/types/atmosphere';

const MODES: VisualMode[] = ['cosmic', 'editorial', 'quiet'];
const THEMES: AtmosphereId[] = ['night', 'dusk', 'dawn', 'moon', 'forest'];

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

  // Cada tema pinta su propia escena: ninguno apaga el lienzo, ni siquiera el claro.
  it.each(MODES)('runs the canvas of every theme under %s', (mode) => {
    for (const id of THEMES) {
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

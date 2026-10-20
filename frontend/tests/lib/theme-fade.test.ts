import { describe, expect, it } from 'vitest';

import {
  ATMOSPHERE_FADE_SECONDS,
  THEME_FADE_SECONDS,
  THEME_PHOTO_LEAVE_GRACE_MS,
} from '@/config/motion';
import { photoLeaveMs, themeFadeSeconds, type ThemeFadeLayer } from '@/lib/atmosphere/theme-fade';

const LAYERS = Object.keys(THEME_FADE_SECONDS) as ThemeFadeLayer[];
const CALM = { reduced: false, ceremony: false } as const;

describe('themeFadeSeconds', () => {
  it.each(LAYERS)('reads its own %s duration without ceremony', (layer) => {
    expect(themeFadeSeconds(layer, CALM)).toBe(THEME_FADE_SECONDS[layer]);
    expect(themeFadeSeconds(layer, CALM)).toBeGreaterThan(0);
  });

  it.each(LAYERS)('is instant under reduced motion (%s)', (layer) => {
    expect(themeFadeSeconds(layer, { reduced: true, ceremony: false })).toBe(0);
  });

  it.each(LAYERS)('is instant under a ceremony (%s)', (layer) => {
    expect(themeFadeSeconds(layer, { reduced: false, ceremony: true })).toBe(0);
  });

  it.each(LAYERS)('is instant with both (%s)', (layer) => {
    expect(themeFadeSeconds(layer, { reduced: true, ceremony: true })).toBe(0);
  });
});

describe('theme fade coherence', () => {
  it('keeps every layer at or below the backdrop', () => {
    for (const layer of LAYERS) {
      expect(THEME_FADE_SECONDS[layer], layer).toBeLessThanOrEqual(THEME_FADE_SECONDS.backdrop);
    }
  });

  it('separates the layers instead of sharing a single duration', () => {
    expect(new Set(LAYERS.map((layer) => THEME_FADE_SECONDS[layer])).size).toBe(LAYERS.length);
  });

  it('makes the backdrop the base derived from the full portal crossing', () => {
    expect(THEME_FADE_SECONDS.backdrop).toBe(ATMOSPHERE_FADE_SECONDS);
  });

  it('sets the photo leaving expiry after its own fade', () => {
    const fade = THEME_FADE_SECONDS.photo;

    expect(photoLeaveMs(fade)).toBe(fade * 1000 + THEME_PHOTO_LEAVE_GRACE_MS);
    expect(photoLeaveMs(fade)).toBeGreaterThan(fade * 1000);
  });
});

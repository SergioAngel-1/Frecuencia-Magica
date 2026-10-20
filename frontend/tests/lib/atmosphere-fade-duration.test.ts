import { describe, expect, it } from 'vitest';

import {
  ATMOSPHERE_FADE_SECONDS,
  ATMOSPHERE_SHIFT_PARTS,
  ATMOSPHERE_SHIFT_TIMING,
  PORTAL_TIMING,
  THEME_FADE_SECONDS,
} from '@/config/motion';

/**
 * El fundido de tema sin velo debe durar lo mismo que el cruce completo del
 * portal. La constante se deriva de `PORTAL_TIMING.full`, así que ambos no
 * pueden divergir; esta guarda lo deja por escrito.
 */
describe('atmosphere fade duration', () => {
  it('lasts as long as the full portal crossing', () => {
    const { cover, settle, reveal } = PORTAL_TIMING.full;

    expect(ATMOSPHERE_FADE_SECONDS * 1000).toBe(cover + settle + reveal);
  });

  it('opens the veil, up to the phrase, as long as the portal opens', () => {
    const { cover, settle } = PORTAL_TIMING.full;

    expect(ATMOSPHERE_SHIFT_TIMING.full.cover).toBe(cover + settle);
  });

  it('is the backdrop layer base', () => {
    expect(THEME_FADE_SECONDS.backdrop).toBe(ATMOSPHERE_FADE_SECONDS);
  });

  it('keeps the veil choreography fractions', () => {
    expect(ATMOSPHERE_SHIFT_PARTS).toEqual({ washFrom: 0.55, phraseFrom: 0.7 });
  });
});

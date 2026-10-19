import { describe, expect, it } from 'vitest';

import { ATMOSPHERE_FADE_SECONDS, PORTAL_TIMING } from '@/config/motion';

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
});

import { describe, expect, it, vi } from 'vitest';

import { ATMOSPHERE_IDS, ATMOSPHERES } from '@/config/atmospheres';
import { atmospherePainting, scrimToneFor } from '@/lib/atmosphere/painting';

import es from '../../messages/es.json';
import en from '../../messages/en.json';

// La selección del paisaje no puede depender de las imágenes publicadas.
vi.mock('@/config/editorial-assets.generated', () => ({ EDITORIAL_ASSETS: {} }));

describe('atmosphere painting', () => {
  it('paints nothing for the night: its own hero stays', () => {
    expect(atmospherePainting('night', 'x')).toBeNull();
  });

  it('resolves the backdrop slot of an atmosphere with the translated alt', () => {
    const painting = atmospherePainting('dusk', 'Mar al atardecer');

    expect(painting).toMatchObject({
      slot: 'atmosphere.dusk',
      alt: 'Mar al atardecer',
      fallback: 'atmosphere',
      kind: 'fallback',
    });
    expect(painting?.src).toBeUndefined();
  });

  it('gives a light scrim only to the light atmospheres', () => {
    expect(scrimToneFor('light')).toBe('light');
    expect(scrimToneFor('dark')).toBe('dark');
    // Encuentro es cálida y su texto es marfil: se lee con el velo oscuro.
    expect(scrimToneFor('warm')).toBe('dark');
  });

  it('has a translated photo alt in both locales for every atmosphere with a painting', () => {
    for (const id of ATMOSPHERE_IDS) {
      if (!ATMOSPHERES[id].backdropSlot) continue;

      const key = id as keyof typeof es.atmospheres;
      expect(es.atmospheres[key], `es ${id}`).toHaveProperty('photoAlt');
      expect(en.atmospheres[key], `en ${id}`).toHaveProperty('photoAlt');
    }
  });
});

import { describe, expect, it, vi } from 'vitest';

import { resolveAudioCover } from '@/lib/editorial/audio-cover';

// El manifiesto real crece con cada imagen publicada: el contrato no puede depender de él.
vi.mock('@/config/editorial-assets.generated', () => ({
  EDITORIAL_ASSETS: {
    'resonario.audio-cover:a1': '/editorial/resonario-audio-cover-a1.avif',
  },
}));

const BAND = 'linear-gradient(135deg, #96C6BC, #B9B0D6)';

describe('resolveAudioCover', () => {
  it('resolves the published cover of each audio by its id', () => {
    const cover = resolveAudioCover({ id: 'a1', band: BAND }, { alt: 'Portada', sizes: '150px' });

    expect(cover).toMatchObject({
      slot: 'resonario.audio-cover.*',
      kind: 'photo',
      src: '/editorial/resonario-audio-cover-a1.avif',
      alt: 'Portada',
      sizes: '150px',
      band: BAND,
      aspect: '1:1',
    });
  });

  it('falls back to the audio band when the cover is not published', () => {
    const cover = resolveAudioCover({ id: 'a2', band: BAND }, { alt: '', sizes: '56px' });

    expect(cover.kind).toBe('fallback');
    expect(cover.src).toBeUndefined();
    expect(cover.fallback).toBe('band');
    expect(cover.band).toBe(BAND);
  });
});

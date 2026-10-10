import { describe, expect, it } from 'vitest';

import { mediaSizes } from '@/lib/editorial/media-sizes';

describe('mediaSizes', () => {
  it('sizes a viewport box by its height when the screen is narrower than the image', () => {
    // `cover` escala por el alto: en un móvil vertical la imagen mide 100svh × ratio, no 100vw.
    expect(mediaSizes('viewport', '16:9')).toBe(
      '(max-aspect-ratio: 16/9) calc(100svh * 16 / 9), 100vw',
    );
  });

  it('uses the ratio of the slot in the height term', () => {
    expect(mediaSizes('viewport', '16:8')).toBe(
      '(max-aspect-ratio: 16/8) calc(100svh * 16 / 8), 100vw',
    );
    expect(mediaSizes('viewport', '3:4')).toBe(
      '(max-aspect-ratio: 3/4) calc(100svh * 3 / 4), 100vw',
    );
  });

  it('treats a viewport slot as the 16:9 master it is produced at', () => {
    expect(mediaSizes('viewport', 'viewport')).toBe(mediaSizes('viewport', '16:9'));
  });

  it('keeps the full width for anchored boxes and banners, which paint at their own ratio', () => {
    expect(mediaSizes('anchored', '16:9')).toBe('100vw');
    expect(mediaSizes('anchored', '16:8')).toBe('100vw');
    expect(mediaSizes('banner', '16:9')).toBe('100vw');
  });
});

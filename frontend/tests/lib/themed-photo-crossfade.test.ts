import { describe, expect, it } from 'vitest';

import { ATMOSPHERE_FADE_SECONDS } from '@/config/motion';
import { readSource, SRC } from '../helpers/source-files';

const photo = readSource(`${SRC}/components/world/themed-photo.tsx`);
const css = readSource(`${SRC}/app/globals.css`);

/**
 * Al cambiar de tema sin velo, `ThemedPhoto` deja encima la foto anterior y la
 * desvanece. Estas guardas evitan que el fundido se pierda en un refactor: sin
 * el keyframe, sin la duración compartida o con el lavado del esquema claro en
 * la capa saliente, el cambio vuelve a saltar.
 */
describe('themed photo crossfade', () => {
  it('declares the leaving keyframe', () => {
    expect(css).toMatch(/@keyframes\s+fm-photo-leave\s*\{/);
  });

  it('drives the leaving layer with the shared atmosphere duration', () => {
    expect(photo).toContain('fm-photo-leave');
    expect(photo).toContain('ATMOSPHERE_FADE_SECONDS');
  });

  it('does not give the leaving layer the night wash', () => {
    const marker = photo.indexOf('data-photo-leaving');
    const start = photo.lastIndexOf('<Image', marker);
    const layer = photo.slice(start, photo.indexOf('/>', marker));

    expect(start).toBeGreaterThan(-1);
    expect(layer).toContain('data-photo-leaving');
    expect(layer).not.toContain('data-photo-night');
  });

  it('transitions theme colors at the same pace as the backdrop', () => {
    const start = css.indexOf('[data-theme-switching] *:not(canvas)');
    const block = css.slice(start, css.indexOf('}', start));

    expect(block).toContain(`transition-duration: ${ATMOSPHERE_FADE_SECONDS}s`);
  });
});

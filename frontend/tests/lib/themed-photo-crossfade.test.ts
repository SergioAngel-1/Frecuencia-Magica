import { describe, expect, it } from 'vitest';

import { THEME_INK_DURATION_PROPERTY } from '@/lib/atmosphere/theme-switching';
import { readSource, SRC } from '../helpers/source-files';

const photo = readSource(`${SRC}/components/world/themed-photo.tsx`);
const leavingLayer = readSource(`${SRC}/components/world/leaving-photo.tsx`);
const css = readSource(`${SRC}/app/globals.css`);

/**
 * Al cambiar de tema sin velo, `ThemedPhoto` deja encima la foto anterior y la
 * desvanece. Estas guardas evitan que el fundido se pierda en un refactor: sin
 * el keyframe, sin la duración propia de la foto o con el lavado del esquema
 * claro en la capa saliente, el cambio vuelve a saltar.
 */
describe('themed photo crossfade', () => {
  it('declares the leaving keyframe', () => {
    expect(css).toMatch(/@keyframes\s+fm-photo-leave\s*\{/);
  });

  it('drives the leaving layer with the photo duration, not a shared one', () => {
    expect(leavingLayer).toContain('fm-photo-leave');
    expect(photo).toContain("useThemeFade('photo')");
    expect(photo).toContain('duration: fade');
    expect(leavingLayer).toContain('photoLeaveMs(duration)');
    expect(leavingLayer).toContain('fm-photo-leave ${duration}s');
    expect(leavingLayer).toContain('photoLeaveMs');
    expect(photo).not.toContain('ATMOSPHERE_FADE_SECONDS');
    expect(leavingLayer).not.toContain('ATMOSPHERE_FADE_SECONDS');
  });

  it('does not give the leaving layer the night wash', () => {
    const marker = leavingLayer.indexOf('data-photo-leaving');
    const start = leavingLayer.lastIndexOf('<Image', marker);
    const layer = leavingLayer.slice(start, leavingLayer.indexOf('/>', marker));

    expect(start).toBeGreaterThan(-1);
    expect(layer).toContain('data-photo-leaving');
    expect(layer).not.toContain('data-photo-night');
  });

  it('stacks the leaving photos: each one fades on its own and the oldest stays on top', () => {
    expect(photo).toContain('<LeavingPhoto');
    expect(photo).toContain('[...leaving].reverse()');
    expect(photo).not.toMatch(/setLeaving\(\{/);
  });

  it('does not override the variant fade-in with the colour-only switching transition', () => {
    const start = css.indexOf('[data-theme-switching] *:not(canvas)');
    const selector = css.slice(start, css.indexOf('{', start));

    expect(selector).toContain(':not([data-photo-variant])');
  });

  it('reads the ink duration from the variable set by beginThemeSwitch', () => {
    const start = css.indexOf('[data-theme-switching] *:not(canvas)');
    const block = css.slice(start, css.indexOf('}', start));

    expect(block).toContain(`transition-duration: var(${THEME_INK_DURATION_PROPERTY})`);
    expect(block).not.toMatch(/transition-duration:\s*[\d.]+s/);
  });
});

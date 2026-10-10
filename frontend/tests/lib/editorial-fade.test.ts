import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

const TOKENS = readSource(`${SRC}/app/tokens.css`);
const IMAGE = readSource(`${SRC}/components/ui/editorial-image.tsx`);

/** Cuerpo de una `@utility` de `tokens.css`. */
function utility(name: string): string {
  const start = TOKENS.indexOf(`@utility ${name} {`);
  expect(start, name).toBeGreaterThan(-1);
  return TOKENS.slice(start, TOKENS.indexOf('\n}', start));
}

describe('editorial edge fades', () => {
  it('defines the fade band as one rhythm step', () => {
    expect(TOKENS).toMatch(/--fade-band:\s*clamp\(56px, 8vw, 112px\)/);
    expect(TOKENS).toMatch(/--spacing-section:\s*clamp\(56px, 8vw, 112px\)/);
  });

  it('fades with a mask, prefixed for WebKit, in tokens.css', () => {
    for (const name of ['fm-fade-top', 'fm-fade-bottom', 'fm-fade-radial']) {
      const body = utility(name);
      expect(body, name).toMatch(/(?<!-webkit-)mask-image:/);
      expect(body, name).toContain('-webkit-mask-image:');
    }
  });

  it('never writes a mask of its own anywhere else', () => {
    const offenders = sourceFiles(SRC, /\.(ts|tsx|css)$/)
      .filter((file) => !file.endsWith('/app/tokens.css'))
      .filter((file) => /mask-image|maskImage/.test(readSource(file)))
      .map(fromSrc);

    expect(offenders).toEqual([]);
  });

  it('masks the media layer of an editorial image, never the content around it', () => {
    expect(IMAGE).toContain('fade?: EditorialFade');
    expect(IMAGE).toContain("both: 'fm-fade-top fm-fade-bottom'");
    // La máscara cubre materia y scrim a la vez (un scrim sin fundir dibuja la arista)…
    expect(IMAGE).toContain('FADE_CLASSES[fade]');
    expect(IMAGE).not.toMatch(/<EditorialOverlay[^>]*fade/);
    // …y no acepta hijos: el contenido de una banda vive fuera y no se enmascara.
    expect(IMAGE).not.toContain('children');
    for (const name of ['full-bleed-section', 'editorial-banner']) {
      const band = readSource(`${SRC}/components/ui/${name}.tsx`);
      expect(band, name).not.toMatch(/fm-fade-(top|bottom|radial)/);
    }
  });

  it('passes the focal point as variables, with the mobile one only below 768px', () => {
    expect(IMAGE).toContain("'--fm-pos'");
    expect(IMAGE).toContain("'--fm-pos-mobile'");
    expect(IMAGE).toContain('object-[var(--fm-pos-mobile,var(--fm-pos))]');
    expect(IMAGE).toContain('md:object-[var(--fm-pos)]');
  });

  it('has no fill={false} branch left', () => {
    expect(IMAGE).not.toMatch(/fill\?: boolean/);
    expect(IMAGE).not.toContain('width={1600}');
    for (const file of sourceFiles(SRC)) {
      expect(readSource(file), fromSrc(file)).not.toContain('fill={false}');
    }
  });
});

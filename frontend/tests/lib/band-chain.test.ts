import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

const CSS_FILES = sourceFiles(SRC, /\.css$/);
const CHAIN = readSource(`${SRC}/components/ui/band-chain.tsx`);
const FOOTER = readSource(`${SRC}/components/layout/site-footer.tsx`);
const BANDS = ['full-bleed-section', 'editorial-banner'].map((name) => ({
  name,
  source: readSource(`${SRC}/components/ui/${name}.tsx`),
}));

describe('band chain', () => {
  it('uses :has() exactly once in the project CSS, for the footer exception', () => {
    const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
    const uses = CSS_FILES.flatMap((file) =>
      [...withoutComments(readSource(file)).matchAll(/:has\(/g)].map(() => fromSrc(file)),
    );

    expect(uses).toHaveLength(1);
    const css = CSS_FILES.map(readSource).join('\n');
    expect(css).toMatch(/main:has\(\[data-band-chain=['"]footer['"]\]\)/);
  });

  it('marks the footer lead that the exception collapses', () => {
    expect(FOOTER).toContain('data-footer-lead');
  });

  it('keeps full-bleed bands free of outer margins: the view or the chain spaces them', () => {
    for (const { name, source } of BANDS) {
      // La raíz de la banda: ni margen vertical propio ni `space-y` (sólo el
      // `margin-inline` de `fm-editorial-full-bleed` para salir a sangre).
      const root = source.match(/<section[\s\S]*?\n\s*>/)?.[0];
      expect(root, name).toBeDefined();
      expect(root, name).not.toMatch(/\b-?m[tby]-|\bspace-y-|\bmargin(?:Top|Bottom)/);
    }
  });

  it('lets each band media answer to the chain it sits in', () => {
    for (const { name, source } of BANDS) {
      expect(source, name).toContain('bandMedia');
    }
    const tokens = readSource(`${SRC}/app/tokens.css`);
    expect(tokens).toContain('[data-band-chain] > :not(:first-child) [data-band-media]');
    expect(tokens).toContain('[data-band-chain] > :not(:last-child) [data-band-media]');
  });

  it('stays a pure UI Kit primitive that works in Server Components', () => {
    expect(CHAIN).not.toMatch(/from '@\/(data|stores|i18n)/);
    expect(CHAIN).not.toContain("'use client'");
    expect(CHAIN).toContain('data-band-chain');
    expect(CHAIN).toContain('intoFooter');
    // Sin hueco interno: las bandas se tocan y se encuentran en la noche.
    expect(CHAIN).not.toMatch(/\bgap-|\bspace-y-/);
  });
});

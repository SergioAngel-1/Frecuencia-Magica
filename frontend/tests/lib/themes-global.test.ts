import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Un tema es global (spec 2026-10-17-temas-globales): lo fija `<html data-atmosphere>` y todo el
 * sitio lo lee. Ninguna vista re-tematiza una sección ni declara colores de tema por su cuenta.
 */
const FILES = sourceFiles(SRC, /\.(ts|tsx)$/).map((file) => ({
  path: fromSrc(file),
  source: readSource(file),
}));

/** Los únicos sitios que escriben `data-atmosphere`: el documento, el fondo en fundido, el velo del cruce (pinta el tema al que se va) y las muestras. */
const MAY_SET_ATTRIBUTE = new Set([
  'app/[locale]/layout.tsx',
  'components/world/atmosphere-provider.tsx',
  'components/world/atmosphere-backdrop.tsx',
  'components/world/atmosphere-shift-veil.tsx',
  'components/ui/theme-swatch.tsx',
  'components/layout/theme-switcher.tsx',
  'lib/atmosphere/boot-script.ts',
]);

describe('global themes', () => {
  it('has no local theme scopes: only the document, the backdrop and the swatches set data-atmosphere', () => {
    const offenders = FILES.filter(
      ({ path, source }) =>
        /data-atmosphere=|setAttribute\('data-atmosphere'/.test(source) &&
        !MAY_SET_ATTRIBUTE.has(path),
    ).map(({ path }) => path);

    expect(offenders).toEqual([]);
  });

  it('keeps no trace of the old place atmospheres or the per-section scope', () => {
    for (const { path, source } of FILES) {
      expect(source, path).not.toMatch(/AtmosphereScope|ScopeBackdrop|PICKER_ATMOSPHERES/);
      expect(source, path).not.toMatch(
        /atmosphere\.(study|store|gathering|marisol|dusk|dawn|moon|forest)['"]/,
      );
    }
  });

  it('keeps the theme choice out of sessionStorage: it lasts between visits', () => {
    const store = readSource(`${SRC}/stores/atmosphere-store.ts`);
    const boot = readSource(`${SRC}/lib/atmosphere/boot-script.ts`);

    expect(store).toContain('localStorage');
    expect(store).not.toContain('sessionStorage');
    expect(boot).toContain('window.localStorage');
    expect(boot).not.toContain('sessionStorage');
  });

  it('mounts the switcher in the header, so every view can change the theme', () => {
    expect(readSource(`${SRC}/components/layout/site-header.tsx`)).toContain('<ThemeSwitcher />');
  });

  it('paints the canvas and the nebulae with the active theme, not with fixed night colors', () => {
    expect(readSource(`${SRC}/components/world/nebula-layer.tsx`)).toContain('var(--nebula-a)');
    expect(readSource(`${SRC}/components/world/cosmic-canvas.tsx`)).toContain('setTheme');
  });
});

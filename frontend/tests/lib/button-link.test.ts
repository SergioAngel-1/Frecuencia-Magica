import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * `Button asChild` clona su hijo con `cloneElement`. Con el `Link` de
 * `@/i18n/navigation` creado en un Server Component, `isValidElement` lo
 * rechaza y el botón desaparece en silencio (sin error ni warning): así
 * quedaron sin CTA «Reservar» las experiencias y «Comenzar mi camino» en la
 * home. En Server Components se usa `ButtonLink` (`components/layout`).
 */
describe('Button asChild in Server Components', () => {
  it('is never used outside a client boundary', () => {
    const offenders = sourceFiles(SRC, /\.tsx$/)
      .map((file) => ({
        file: fromSrc(file),
        source: readSource(file),
      }))
      .filter(({ file }) => file !== 'components/ui/button.tsx')
      .filter(({ source }) => !/^\s*['"]use client['"]/.test(source))
      .filter(({ source }) => /<Button\b[^>]*\basChild\b/.test(source))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });
});

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

const SRC = resolve(process.cwd(), 'src');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);

    if (statSync(path).isDirectory()) return sourceFiles(path);

    return path.endsWith('.tsx') ? [path] : [];
  });
}

/**
 * `Button asChild` clona su hijo con `cloneElement`. Con el `Link` de
 * `@/i18n/navigation` creado en un Server Component, `isValidElement` lo
 * rechaza y el botón desaparece en silencio (sin error ni warning): así
 * quedaron sin CTA «Reservar» las experiencias y «Comenzar mi camino» en la
 * home. En Server Components se usa `ButtonLink` (`components/layout`).
 */
describe('Button asChild in Server Components', () => {
  it('is never used outside a client boundary', () => {
    const offenders = sourceFiles(SRC)
      .map((file) => ({
        file: relative(SRC, file).replaceAll('\\', '/'),
        source: readFileSync(file, 'utf8'),
      }))
      .filter(({ file }) => file !== 'components/ui/button.tsx')
      .filter(({ source }) => !/^\s*['"]use client['"]/.test(source))
      .filter(({ source }) => /<Button\b[^>]*\basChild\b/.test(source))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });
});

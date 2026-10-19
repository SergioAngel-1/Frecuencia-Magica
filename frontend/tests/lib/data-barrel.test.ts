import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

const FILES = sourceFiles(SRC);
/** El barrel `@/data` arrastra los cinco catálogos; no debe entrar en el cliente. */
const BARREL_IMPORT = /from\s+['"]@\/data['"]/;

/** Un módulo cliente, un store o un hook: todo lo que viaja al bundle del navegador. */
function reachesClient(path: string): boolean {
  const relativePath = fromSrc(path);
  if (relativePath.startsWith('stores/') || relativePath.startsWith('hooks/')) return true;

  const head = readSource(path).trimStart();
  return /^['"]use client['"]/.test(head);
}

describe('catalog barrel boundaries', () => {
  it('no arrastra el catálogo entero a módulos cliente, stores ni hooks', () => {
    const offenders = FILES.filter(reachesClient)
      .filter((path) => BARREL_IMPORT.test(readSource(path)))
      .map(fromSrc);

    // Importa el módulo concreto (`@/data/audios`, `@/data/products`, …).
    expect(offenders).toEqual([]);
  });
});

import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * `EDITORIAL_MEDIA_REGISTRY` guarda un alt de respaldo en español. Usarlo en
 * una ruta localizada entrega el alt en español al visitante inglés, y el
 * contrato editorial exige alt bilingüe vía `messages/{es,en}.json`.
 *
 * La única excepción es el 404 raíz (`app/not-found.tsx`): vive fuera de
 * `[locale]`, su `<html lang>` es fijo en `es` y no tiene proveedor i18n.
 */
const STATIC_ES_EXCEPTIONS = new Set(['app/not-found.tsx']);

describe('editorial media alt text', () => {
  it('passes a translated alt at every localized call site', () => {
    const offenders = sourceFiles(SRC, /\.tsx$/)
      .map((file) => ({
        file: fromSrc(file),
        source: readSource(file),
      }))
      .filter(({ file }) => !STATIC_ES_EXCEPTIONS.has(file))
      .filter(({ source }) => /resolveEditorialMedia\(\s*'[^']+'\s*\)/.test(source))
      .map(({ file }) => file);

    expect(offenders).toEqual([]);
  });
});

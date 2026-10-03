import { describe, expect, it } from 'vitest';

import { flatEs, icuArguments } from '../helpers/messages';
import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * next-intl sólo detecta en runtime un mensaje con variables llamado sin ellas
 * (`FORMATTING_ERROR`): ni el tipado ni el lint lo ven. Este guardia resuelve
 * cada `t('clave')` literal contra los namespaces que abre su archivo y exige
 * argumentos cuando el mensaje los declara.
 */

const NAMESPACE = /(?:namespace:\s*|useTranslations\(\s*|getTranslations\(\s*)['"]([\w.]+)['"]/g;
const CALL = /\bt\w*\(\s*['"]([\w.]+)['"]\s*(\)|,)/g;

function namespacesOf(source: string): string[] {
  return [...source.matchAll(NAMESPACE)].map((match) => match[1]!);
}

function lineOf(source: string, index: number): number {
  return source.slice(0, index).split('\n').length;
}

describe('ICU arguments', () => {
  it('passes the variables every message declares', () => {
    const offenders: string[] = [];

    for (const path of sourceFiles(SRC, /\.tsx?$/)) {
      const source = readSource(path);
      const namespaces = namespacesOf(source);

      for (const match of source.matchAll(CALL)) {
        const [, key, closing] = match;
        if (closing !== ')') continue;

        const candidates = [...namespaces.map((ns) => `${ns}.${key}`), key!].filter(
          (candidate) => candidate in flatEs,
        );
        if (candidates.length === 0) continue;

        const needsArguments = candidates.every(
          (candidate) => icuArguments(flatEs[candidate]!).length > 0,
        );
        if (needsArguments) {
          offenders.push(`${fromSrc(path)}:${lineOf(source, match.index)} ${candidates[0]}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('never fills a variable with its own placeholder', () => {
    const offenders = sourceFiles(SRC, /\.tsx?$/).flatMap((path) =>
      /:\s*['"]\{\w+\}['"]/.test(readSource(path)) ? [fromSrc(path)] : [],
    );

    expect(offenders).toEqual([]);
  });
});

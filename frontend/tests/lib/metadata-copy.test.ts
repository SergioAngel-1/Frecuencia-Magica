import { describe, expect, it } from 'vitest';

import en from '../../messages/en.json';
import es from '../../messages/es.json';
import { flatten } from '../helpers/messages';

type Locale = 'es' | 'en';

const BRAND = 'Frecuencia Mágica';
const BRAND_SUFFIX = ` · ${BRAND}`;
const PLACEHOLDER = /\{\w+\}/g;
/** Ejemplo realista de 20 caracteres para medir las plantillas ICU. */
const PLACEHOLDER_SAMPLE = 'Pausa de respiración';
const MIN_DESCRIPTION = 140;
const MAX_DESCRIPTION = 160;
const MAX_TITLE = 60;

/**
 * El portal es la raíz del sitio: declara su título completo con
 * `absoluteTitle: true` (`src/app/[locale]/page.tsx`), sin plantilla.
 */
const ABSOLUTE_TITLE_NAMESPACES = new Set(['portal']);

const CATALOGS: Record<Locale, Record<string, string>> = {
  es: flatten(es),
  en: flatten(en),
};

const PAGE_META = /^([^.]+)\.meta\.(title|description)$/;

type MetaEntry = { namespace: string; key: string; value: string };

function pageMeta(locale: Locale): { titles: MetaEntry[]; descriptions: MetaEntry[] } {
  const titles: MetaEntry[] = [];
  const descriptions: MetaEntry[] = [];

  for (const [key, value] of Object.entries(CATALOGS[locale])) {
    const match = PAGE_META.exec(key);
    if (!match) continue;

    const entry = { namespace: match[1]!, key, value };
    if (match[2] === 'title') titles.push(entry);
    else descriptions.push(entry);
  }

  return { titles, descriptions };
}

function measure(text: string): string {
  return text.replace(PLACEHOLDER, PLACEHOLDER_SAMPLE);
}

function duplicates(entries: MetaEntry[]): string[] {
  const seen = new Map<string, string>();
  const repeated: string[] = [];

  for (const entry of entries) {
    const previous = seen.get(entry.value);
    if (previous) repeated.push(`${previous} y ${entry.key}`);
    else seen.set(entry.value, entry.key);
  }

  return repeated;
}

describe('copy de los metadatos', () => {
  it.each(['es', 'en'] as const)(
    'cada description mide entre 140 y 160 caracteres (%s)',
    (locale) => {
      const { descriptions } = pageMeta(locale);
      const common = CATALOGS[locale]['common.metaDescription'];
      const all = [...descriptions.map((entry) => ({ key: entry.key, value: entry.value }))];

      if (common !== undefined) all.push({ key: 'common.metaDescription', value: common });

      expect(all.length).toBeGreaterThan(0);
      for (const { key, value } of all) {
        const length = measure(value).length;
        expect(
          length,
          `${locale} · ${key} · ${length} caracteres: ${value}`,
        ).toBeGreaterThanOrEqual(MIN_DESCRIPTION);
        expect(length, `${locale} · ${key} · ${length} caracteres: ${value}`).toBeLessThanOrEqual(
          MAX_DESCRIPTION,
        );
      }
    },
  );

  it.each(['es', 'en'] as const)(
    'cada title con la plantilla no pasa de 60 caracteres (%s)',
    (locale) => {
      const { titles } = pageMeta(locale);
      expect(titles.length).toBeGreaterThan(0);

      for (const { namespace, key, value } of titles) {
        const full = ABSOLUTE_TITLE_NAMESPACES.has(namespace)
          ? value
          : `${measure(value)}${BRAND_SUFFIX}`;

        expect(
          full.length,
          `${locale} · ${key} · ${full.length} caracteres: ${full}`,
        ).toBeLessThanOrEqual(MAX_TITLE);
      }
    },
  );

  it.each(['es', 'en'] as const)(
    'no repite titles ni descriptions entre namespaces (%s)',
    (locale) => {
      const { titles, descriptions } = pageMeta(locale);

      expect(duplicates(titles), `${locale} · titles repetidos`).toEqual([]);
      expect(duplicates(descriptions), `${locale} · descriptions repetidas`).toEqual([]);
    },
  );

  it.each(['es', 'en'] as const)(
    'la marca se escribe «Frecuencia Mágica» en todo meta (%s)',
    (locale) => {
      const metaTexts = Object.entries(CATALOGS[locale]).filter(
        ([key]) => key === 'common.metaDescription' || key.includes('.meta.'),
      );

      const translated = metaTexts.filter(([, text]) => /magic frequency/i.test(text));

      expect(translated, `${locale} · textos con «Magic Frequency»`).toEqual([]);
    },
  );
});

import { describe, expect, it } from 'vitest';

import { flatEn, flatEs } from '../helpers/messages';

type Locale = 'es' | 'en';

const CATALOGS: Record<Locale, Record<string, string>> = { es: flatEs, en: flatEn };

/**
 * Afirmaciones de salud y jerga que el copy no debe hacer: el producto no es
 * terapéutico y no hay backend que respalde una promesa de curación.
 */
const FORBIDDEN: Record<Locale, { term: string; pattern: RegExp }[]> = {
  es: [
    { term: 'sanar/sana/sanan/sanó', pattern: /\bsan(ar|a|an|ó)\b/iu },
    { term: 'curar/cura', pattern: /\bcurar\b|\bcura\b/iu },
    { term: 'detox', pattern: /detox/iu },
    { term: 'sistema nervioso', pattern: /sistema nervioso/iu },
    { term: 'biohack', pattern: /biohack/iu },
  ],
  en: [
    { term: 'heal/heals/healing/healed', pattern: /\bheal(s|ing|ed)?\b/iu },
    { term: 'cure/cures/cured', pattern: /\bcure[sd]?\b/iu },
    { term: 'detox', pattern: /detox/iu },
    { term: 'nervous system', pattern: /nervous system/iu },
    { term: 'biohack', pattern: /biohack/iu },
  ],
};

/**
 * Claves con usos legítimos del patrón, no afirmaciones de curación. Cada una
 * lleva su motivo para que la excepción no tape un cambio de copy futuro.
 */
const ALLOWED = new Set<string>([]);

describe('afirmaciones prohibidas en el copy', () => {
  it('ningún catálogo afirma curar ni alude a jerga de salud', () => {
    const violations: string[] = [];

    for (const locale of Object.keys(CATALOGS) as Locale[]) {
      for (const [key, text] of Object.entries(CATALOGS[locale])) {
        if (ALLOWED.has(key)) continue;

        for (const { term, pattern } of FORBIDDEN[locale]) {
          if (pattern.test(text)) violations.push(`${locale} · ${key} · «${term}»: ${text}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});

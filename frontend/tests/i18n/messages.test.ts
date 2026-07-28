import { describe, expect, it } from 'vitest';

import en from '../../messages/en.json';
import es from '../../messages/es.json';

type Json = string | Json[] | { [key: string]: Json };

/** Aplana el diccionario a rutas de clave tipo `home.heroKicker`. */
function flatten(value: Json, prefix = ''): Record<string, string> {
  if (typeof value === 'string') return { [prefix]: value };

  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(value);

  return entries.reduce<Record<string, string>>((acc, [key, child]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return { ...acc, ...flatten(child as Json, path) };
  }, {});
}

const flatEs = flatten(es as Json);
const flatEn = flatten(en as Json);

/**
 * Claves cuyo texto coincide legítimamente en ambos idiomas: nombres propios,
 * cifras, unidades y préstamos que no se traducen.
 */
const IDENTICAS_POR_DISENO = new Set([
  'common.brand',
  // "Realms" es término de marca: se usa en español tal cual.
  'nav.label',
  // "Nostalgia" se escribe igual en ambos idiomas.
  'journal.moods.nostalgia',
  'library.tags.ritual',
  'library.filters.ritual',
  'library.tags.grounding',
  'cart.total',
  'cart.subtotal',
  'auth.fields.password.placeholder',
  'discover.questions.q3.options.0',
  'home.stats.daily.value',
  'home.stats.meditations.value',
  'home.stats.realms.value',
  'sanctuary.stats.days.value',
  'sanctuary.stats.frequencies.value',
  'sanctuary.stats.courses.value',
  'sanctuary.stats.entries.value',
  'store.categories.aromas',
  'store.categories.rituals',
]);

describe('catálogos de mensajes', () => {
  it('ambos diccionarios tienen exactamente las mismas claves', () => {
    expect(Object.keys(flatEs).sort()).toEqual(Object.keys(flatEn).sort());
  });

  it('ningún valor está vacío', () => {
    for (const [clave, valor] of [...Object.entries(flatEs), ...Object.entries(flatEn)]) {
      expect(valor.trim(), `clave vacía: ${clave}`).not.toBe('');
      expect(valor, `clave sin traducir: ${clave}`).not.toContain('TODO');
    }
  });

  it('no queda texto sin traducir', () => {
    const sinTraducir = Object.keys(flatEs).filter(
      (clave) => !IDENTICAS_POR_DISENO.has(clave) && flatEs[clave] === flatEn[clave],
    );

    expect(sinTraducir).toEqual([]);
  });

  it('las claves declaradas por los datos existen en ambos diccionarios', async () => {
    const { AUDIOS, COURSES, EXPERIENCES, PRODUCTS, QUESTIONS } = await import('@/data');

    const referencias = [
      ...AUDIOS.flatMap((a) => [a.titleKey, a.tagKey]),
      ...COURSES.flatMap((c) => [c.titleKey, c.levelKey]),
      ...EXPERIENCES.flatMap((e) => [e.titleKey, e.modeKey]),
      ...PRODUCTS.flatMap((p) => [p.titleKey, p.catKey]),
      ...QUESTIONS.flatMap((q) => [q.promptKey, ...q.optionKeys]),
    ];

    for (const clave of referencias) {
      expect(flatEs, `falta en es.json: ${clave}`).toHaveProperty([clave]);
      expect(flatEn, `falta en en.json: ${clave}`).toHaveProperty([clave]);
    }
  });
});

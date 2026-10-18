import { describe, expect, it } from 'vitest';

import { NAV_REALMS } from '@/config/realms';
import { arrangeBento, buildRealmCards } from '@/lib/home/realm-cards';
import { buildResonarioSamples } from '@/lib/home/resonario-samples';
import { buildStoreItems } from '@/lib/home/store-items';
import type { Translator } from '@/lib/home/translator';

/** Traductor de mentira: devuelve la clave y los valores, para comprobar qué se pidió. */
const fakeT = ((key: string, values?: Record<string, string>) =>
  values ? `${key}|${JSON.stringify(values)}` : key) as unknown as Translator;

describe('home builders', () => {
  it('builds one card per navigation realm, with copy keys and band from accentKey', () => {
    const cards = buildRealmCards(NAV_REALMS, { home: fakeT, nav: fakeT });

    expect(cards).toHaveLength(NAV_REALMS.length);
    for (const card of cards) {
      expect(card.title).toBe(`realms.${card.id}`);
      expect(card.emotion).toBe(`emotions.${card.id}`);
      expect(card.description).toBe(`realms.descriptions.${card.id}`);
      expect(card.href).toBeTruthy();
      expect(card.band).toMatch(/gradient|linear|radial/);
    }
  });

  it('arranges the bento with Academia featured and the rest in bento order', () => {
    const cards = buildRealmCards(NAV_REALMS, { home: fakeT, nav: fakeT });
    const { academia, others } = arrangeBento(cards);

    expect(academia.id).toBe('academia');
    expect(others.map((card) => card.id)).toEqual([
      'descubrete',
      'resonario',
      'experiencias',
      'tienda',
      'sanctuario',
    ]);
  });

  it('fails loudly when the featured realm is missing', () => {
    const cards = buildRealmCards(
      NAV_REALMS.filter((realm) => realm.id !== 'academia'),
      { home: fakeT, nav: fakeT },
    );

    expect(() => arrangeBento(cards)).toThrow(/Academia/);
  });

  it('keeps the audios in order and composes the meta with tag and duration', () => {
    const samples = buildResonarioSamples(
      [{ id: 'a1', hz: 432, band: 'band-a', tagId: 'frequency', duration: '18:00' }],
      fakeT,
    );

    expect(samples).toEqual([
      {
        id: 'a1',
        hz: 432,
        band: 'band-a',
        title: 'audios.a1.title',
        meta: 'tags.frequency · 18:00',
      },
    ]);
  });

  it('keeps an empty duration as an empty suffix', () => {
    const [sample] = buildResonarioSamples(
      [{ id: 'a2', hz: null, band: 'band-b', tagId: 'meditation', duration: null }],
      fakeT,
    );

    expect(sample?.meta).toBe('tags.meditation · ');
  });

  it('prices and titles the store items, with the translated alt for the image', () => {
    const items = buildStoreItems([{ id: 'p1', price: 28 }], fakeT);
    const [item] = items;

    expect(item?.title).toBe('products.p1.title');
    expect(item?.price).toBe('$28');
    expect(item?.media.alt).toContain('media.alt.product');
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { getMediaQueryMatch, subscribeMediaQuery } from '@/lib/media-query-store';

const QUERY = '(prefers-reduced-motion: reduce)';

/** `MediaQueryList` de mentira: cuenta listeners y permite cambiar `matches`. */
type FakeMedia = {
  query: string;
  matches: boolean;
  listeners: Set<() => void>;
  mql: MediaQueryList;
};

let created: FakeMedia[];
const originalMatchMedia = window.matchMedia;

/** Bajas pendientes: cada test deja el store vacío para no contaminar al siguiente. */
const offs: Array<() => void> = [];
const subscribe = (query: string, listener: () => void): (() => void) => {
  const off = subscribeMediaQuery(query, listener);
  offs.push(off);
  return off;
};

function makeFake(query: string, matches: boolean): FakeMedia {
  const fake = { query, matches, listeners: new Set<() => void>() } as FakeMedia;
  fake.mql = {
    get matches() {
      return fake.matches;
    },
    media: query,
    addEventListener: (_type: string, listener: () => void) => fake.listeners.add(listener),
    removeEventListener: (_type: string, listener: () => void) => fake.listeners.delete(listener),
  } as unknown as MediaQueryList;
  return fake;
}

/** Cambia el valor de la consulta y dispara el evento `change` como el navegador. */
function setMatches(query: string, matches: boolean): void {
  const fake = created.filter((media) => media.query === query).at(-1);
  if (!fake) throw new Error(`no media for ${query}`);
  fake.matches = matches;
  for (const listener of [...fake.listeners]) listener();
}

beforeEach(() => {
  created = [];
  window.matchMedia = vi.fn((query: string) => {
    const fake = makeFake(query, false);
    created.push(fake);
    return fake.mql;
  }) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  for (const off of offs.splice(0)) off();
  window.matchMedia = originalMatchMedia;
});

describe('media-query-store', () => {
  it('comparte un único matchMedia y un único listener entre suscriptores', () => {
    const first = vi.fn();
    const second = vi.fn();
    const offFirst = subscribe(QUERY, first);
    const offSecond = subscribe(QUERY, second);

    expect(window.matchMedia).toHaveBeenCalledTimes(1);
    expect(created[0]?.listeners.size).toBe(1);

    offFirst();
    offSecond();
  });

  it('avisa a todos los suscriptores cuando cambia el valor', () => {
    const first = vi.fn();
    const second = vi.fn();
    const offFirst = subscribe(QUERY, first);
    const offSecond = subscribe(QUERY, second);

    setMatches(QUERY, true);

    expect(first).toHaveBeenCalledTimes(1);
    expect(second).toHaveBeenCalledTimes(1);
    expect(getMediaQueryMatch(QUERY)).toBe(true);

    offFirst();
    offSecond();
  });

  it('no avisa si el valor no cambia', () => {
    const listener = vi.fn();
    const off = subscribe(QUERY, listener);

    setMatches(QUERY, false);

    expect(listener).not.toHaveBeenCalled();
    off();
  });

  it('retira el listener del navegador al quedarse sin suscriptores', () => {
    const offFirst = subscribe(QUERY, vi.fn());
    const offSecond = subscribe(QUERY, vi.fn());

    offFirst();
    expect(created[0]?.listeners.size).toBe(1);

    offSecond();
    expect(created[0]?.listeners.size).toBe(0);
  });

  it('una baja repetida no retira el listener de otro suscriptor', () => {
    const listener = vi.fn();
    const other = vi.fn();
    const off = subscribe(QUERY, listener);
    subscribe(QUERY, other);

    off();
    off();

    expect(created[0]?.listeners.size).toBe(1);
  });

  it('lee en directo sin suscriptores y usa el valor visto con ellos', () => {
    expect(getMediaQueryMatch(QUERY)).toBe(false);

    const off = subscribe(QUERY, vi.fn());
    setMatches(QUERY, true);
    expect(getMediaQueryMatch(QUERY)).toBe(true);

    off();
  });

  it('una consulta distinta tiene su propia entrada', () => {
    const other = '(min-width: 768px)';
    const offA = subscribe(QUERY, vi.fn());
    const offB = subscribe(other, vi.fn());

    expect(window.matchMedia).toHaveBeenCalledTimes(2);

    offA();
    offB();
  });

  it('sin matchMedia no casa nada y la baja es inocua', () => {
    window.matchMedia = undefined as unknown as typeof window.matchMedia;

    const off = subscribe(QUERY, vi.fn());

    expect(getMediaQueryMatch(QUERY)).toBe(false);
    expect(() => off()).not.toThrow();
  });
});

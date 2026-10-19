import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Ritmo de bandas (spec 2026-10-18, §3.4): nunca dos bandas fotográficas a
 * sangre seguidas. Entre dos bandas va un bloque de contenido sobre la noche.
 * Banda = `RealmHero`, `FullBleedSection` con foto o `EditorialBanner` con
 * materia. La única excepción es la última banda, que puede encontrarse con el
 * pie (`BandChain intoFooter`).
 */
const BANDS = new Set(['RealmHero', 'FullBleedSection', 'EditorialBanner']);

/**
 * Cada `<BandChain` sin `intoFooter` debe justificarse aquí. Una entrada nueva
 * es una decisión de ritmo, no un atajo: si la pareja de bandas es real, se
 * separa con contenido.
 */
const CHAIN_WITHOUT_FOOTER_ALLOWED: Record<string, string> = {
  // Héroe (`AuthAside`) → formulario (`AuthForm`). El formulario es contenido
  // con atmósfera velada (la foto al 30 % bajo scrim, sin fundido a sangre), no
  // una banda: en escritorio van en columnas y en móvil el formulario es lo
  // que sigue al héroe. La cadena une los bordes para que no quede filete.
  // Demostración del primitivo en el UI Kit: dos bandas encadenadas a propósito.
  // `/kit` está cerrado en producción (ver CLAUDE.md), así que no entra en ninguna vista.
  'app/[locale]/kit/kit-catalog.tsx': 'demostración del primitivo BandChain en el UI Kit',
  'app/[locale]/acceso/page.tsx': 'héroe → panel de formulario velado (contenido, no banda)',
};

/** Las etiquetas de nivel superior de una vista, en orden de aparición. */
function tagsIn(source: string, tags: readonly string[]): string[] {
  const pattern = new RegExp(`<(${tags.join('|')})\\b`, 'g');
  return [...source.matchAll(pattern)].map((match) => match[1]!);
}

function expectNoAdjacentBands(sequence: readonly string[], label: string) {
  expect(
    sequence.some((name) => BANDS.has(name)),
    `${label}: sin bandas`,
  ).toBe(true);
  for (let index = 1; index < sequence.length; index++) {
    const pair = [sequence[index - 1]!, sequence[index]!];
    expect(
      pair.every((name) => BANDS.has(name)),
      `${label}: ${pair.join(' → ')}`,
    ).toBe(false);
  }
}

const view = (path: string) => readSource(`${SRC}/${path}`);

describe('band rhythm', () => {
  it('chains a BandChain only into the footer, or from the allowlist with its reason', () => {
    const chains = sourceFiles(SRC, /\.tsx$/).flatMap((file) =>
      [...readSource(file).matchAll(/<BandChain\b([^>]*)>/g)].map((match) => ({
        file: fromSrc(file),
        attrs: match[1]!,
      })),
    );
    expect(chains.length).toBeGreaterThan(0);

    for (const { file, attrs } of chains) {
      if (/\bintoFooter\b/.test(attrs)) continue;
      expect(
        CHAIN_WITHOUT_FOOTER_ALLOWED[file],
        `<BandChain sin intoFooter en ${file}`,
      ).toBeDefined();
    }

    // Una excepción que ya no existe en el código es ruido: se borra.
    for (const file of Object.keys(CHAIN_WITHOUT_FOOTER_ALLOWED)) {
      expect(
        chains.some((chain) => chain.file === file && !/\bintoFooter\b/.test(chain.attrs)),
        `excepción obsoleta: ${file}`,
      ).toBe(true);
    }
  });

  it('Resonario: the hero is the only band at the top; the archive reads as text, then the system', () => {
    const page = view('app/[locale]/resonario/page.tsx');
    const sequence = tagsIn(page, [
      'RealmHero',
      'Kicker',
      'Display',
      'ResonarioSystem',
      'EditorialBanner',
      'FullBleedSection',
      'BandChain',
    ]);

    expectNoAdjacentBands(sequence, 'resonario');
    expect(sequence.indexOf('RealmHero')).toBe(0);
    expect(sequence).not.toContain('EditorialBanner');
    expect(sequence).not.toContain('BandChain');
    expect(sequence.indexOf('Display')).toBeLessThan(sequence.indexOf('ResonarioSystem'));

    // Dentro del sistema, cada banner de tipo de escucha va seguido de su
    // contenido (la explicación y las pistas): dos tipos nunca quedan pegados.
    const kind = view('components/features/resonario/kind-section.tsx');
    expect(kind.indexOf('<EditorialBanner')).toBeLessThan(kind.indexOf('{children}'));
  });

  it('Experiencias: hero → text header → featured card (contained, not a band) → archive', () => {
    const list = view('components/features/experiences/experience-list.tsx');

    // El héroe es la única banda antes del encabezado; luego ninguna banda más
    // en la lista: la destacada es una tarjeta con foto dentro del eje.
    const sequence = tagsIn(list, [
      'section',
      'ExperienceRow',
      'EditorialBanner',
      'FullBleedSection',
      'RealmHero',
    ]);
    expect(list.indexOf('{hero}')).toBeGreaterThan(-1);
    expect(list.indexOf('{hero}')).toBeLessThan(list.indexOf('<section'));
    expect(list.indexOf('<section')).toBeLessThan(list.indexOf('<ExperienceRow'));
    expect(sequence).not.toContain('EditorialBanner');
    expect(sequence).not.toContain('FullBleedSection');
    expect(list).not.toContain('<BandChain');

    // La destacada no declara sangre: su tarjeta redondea y no lleva `bandMedia`.
    const featuredRow = list.slice(
      list.indexOf('<ExperienceRow'),
      list.indexOf('/>', list.indexOf('<ExperienceRow')),
    );
    expect(featuredRow).toMatch(/^\s+featured$/m);
    expect(featuredRow).not.toContain('fm-editorial-full-bleed');

    const row = view('components/features/experiences/experience-row.tsx');
    // El bloque `if (featured)` acaba donde empieza el `return` de la fila normal.
    const featuredArticle = row.slice(row.indexOf('if (featured)'), row.lastIndexOf('return ('));
    expect(featuredArticle).toContain('rounded-card-lg');
    expect(featuredArticle).not.toContain('bandMedia');
  });
});

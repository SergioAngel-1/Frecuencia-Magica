import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

const CSS_FILES = sourceFiles(SRC, /\.css$/);
const CHAIN = readSource(`${SRC}/components/ui/band-chain.tsx`);
const FOOTER = readSource(`${SRC}/components/layout/site-footer.tsx`);
const BANDS = ['full-bleed-section', 'editorial-banner'].map((name) => ({
  name,
  source: readSource(`${SRC}/components/ui/${name}.tsx`),
}));

describe('band chain', () => {
  it('uses :has() exactly once in the project CSS, for the footer exception', () => {
    const withoutComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '');
    const uses = CSS_FILES.flatMap((file) =>
      [...withoutComments(readSource(file)).matchAll(/:has\(/g)].map(() => fromSrc(file)),
    );

    expect(uses).toHaveLength(1);
    const css = CSS_FILES.map(readSource).join('\n');
    expect(css).toMatch(/main:has\(\[data-band-chain=['"]footer['"]\]\)/);
  });

  it('marks the footer lead that the exception collapses', () => {
    expect(FOOTER).toContain('data-footer-lead');
  });

  it('keeps full-bleed bands free of outer margins: the view or the chain spaces them', () => {
    for (const { name, source } of BANDS) {
      // La raíz de la banda: ni margen vertical propio ni `space-y` (sólo el
      // `margin-inline` de `fm-editorial-full-bleed` para salir a sangre).
      const root = source.match(/<section[\s\S]*?\n\s*>/)?.[0];
      expect(root, name).toBeDefined();
      expect(root, name).not.toMatch(/\b-?m[tby]-|\bspace-y-|\bmargin(?:Top|Bottom)/);
    }
  });

  it('lets each band media answer to the chain it sits in', () => {
    for (const { name, source } of BANDS) {
      expect(source, name).toContain('bandMedia');
    }
    const tokens = readSource(`${SRC}/app/tokens.css`);
    expect(tokens).toContain('[data-band-chain] > :not(:first-child) [data-band-media]');
    expect(tokens).toContain('[data-band-chain] > :not(:last-child) [data-band-media]');
  });

  it('chains the consecutive full-bleed bands of each view listed in the spec', () => {
    const view = (path: string) => readSource(`${SRC}/${path}`);
    const chainOf = (source: string, attrs = '') => {
      const start = source.indexOf(`<BandChain${attrs}>`);
      expect(start, `<BandChain${attrs}>`).toBeGreaterThan(-1);
      return source.slice(start, source.indexOf('</BandChain>', start));
    };

    // Inicio: héroe → frecuencia del día → banner de realms, encadenados. Después,
    // con el ritmo `section`, la membresía (banda suelta) y Marisol, que cierra
    // la página antes de la despedida del footer.
    const home = view('app/[locale]/inicio/page.tsx');
    const homeChain = chainOf(home);
    expect(homeChain.indexOf('<HeroSection')).toBeGreaterThan(-1);
    expect(homeChain.indexOf('<DailyFrequency')).toBeGreaterThan(homeChain.indexOf('<HeroSection'));
    expect(homeChain.indexOf('<RealmsGrid')).toBeGreaterThan(homeChain.indexOf('<DailyFrequency'));
    expect(homeChain).not.toContain('<MembershipSection');
    const afterChain = home.slice(home.indexOf('</BandChain>'));
    expect(afterChain).toContain('py-section gap-section');
    expect(afterChain.indexOf('<MembershipSection')).toBeGreaterThan(-1);
    expect(afterChain.indexOf('<AboutSection')).toBeGreaterThan(
      afterChain.indexOf('<MembershipSection'),
    );
    // Marisol no es una banda: el footer recupera su filete y su hueco.
    expect(home).not.toContain('<BandChain intoFooter>');
    // `intoFooter` sigue siendo una primitiva disponible del UI Kit.
    expect(CHAIN).toMatch(/data-band-chain=\{intoFooter \? 'footer' : 'true'\}/);
    expect(view('components/features/home/daily-frequency.tsx')).toContain('mode="anchored"');

    // Resonario: héroe → banner del archivo.
    const resonario = chainOf(view('app/[locale]/resonario/page.tsx'));
    expect(resonario).toContain('<AtmosphereHero');
    expect(resonario).toContain('<EditorialBanner');

    // Experiencias: héroe → destacada.
    const experiences = chainOf(view('components/features/experiences/experience-list.tsx'));
    expect(experiences).toContain('{hero}');
    expect(experiences).toContain('featured');

    // Acceso: héroe → atmósfera del formulario (en móvil, una sobre otra).
    const access = view('app/[locale]/acceso/page.tsx');
    expect(access).toContain('<BandChain');
    expect(access.indexOf('<AuthForm')).toBeGreaterThan(access.indexOf('<AuthAside'));
  });

  it('stays a pure UI Kit primitive that works in Server Components', () => {
    expect(CHAIN).not.toMatch(/from '@\/(data|stores|i18n)/);
    expect(CHAIN).not.toContain("'use client'");
    expect(CHAIN).toContain('data-band-chain');
    expect(CHAIN).toContain('intoFooter');
    // Sin hueco interno: las bandas se tocan y se encuentran en la noche.
    expect(CHAIN).not.toMatch(/\bgap-|\bspace-y-/);
  });
});

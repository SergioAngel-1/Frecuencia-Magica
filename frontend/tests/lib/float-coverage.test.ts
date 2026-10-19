import { describe, expect, it } from 'vitest';

import { fromSrc, readSource, SRC, sourceFiles } from '../helpers/source-files';

/**
 * Todo contenedor suelto de una vista —una tarjeta, un panel, una foto enmarcada, no una banda a
 * sangre— respira con `Float` (`ui/float.tsx`, `lib/motion/float.ts`). La lista es el contrato:
 * si una vista gana o pierde una tarjeta, se actualiza aquí.
 *
 * Quedan fuera, a propósito: las bandas a sangre, el resumen del pedido (`sticky`) y los
 * formularios (acceso, reserva, pago, diario): se escribe dentro de ellos y no deben moverse.
 */
const MUST_FLOAT = [
  'components/features/home/realm-card.tsx',
  'components/features/home/arrival-section.tsx',
  'components/features/arrival/arrival-panel.tsx',
  'components/features/home/store-showcase.tsx',
  'components/features/home/about-section.tsx',
  'components/features/about/marisol-portrait.tsx',
  'app/[locale]/sobre-marisol/page.tsx',
  'components/layout/framed-heading.tsx',
  'components/ui/confirmation-panel.tsx',
  'components/features/sanctuary/stats-row.tsx',
  'app/[locale]/mi-santuario/page.tsx',
  'components/features/resonario/resonario-system.tsx',
  'components/features/academy/course-list.tsx',
  'components/features/academy/course-detail.tsx',
  'components/features/academy/module-list.tsx',
  'components/features/academy/lesson-player.tsx',
  'components/features/experiences/experience-list.tsx',
  'components/features/store/product-grid.tsx',
  'components/features/store/product-detail.tsx',
  'components/features/store/product-gallery.tsx',
  'components/features/store/cart-view.tsx',
  'components/features/descubrete/result-step.tsx',
];

describe('floating containers', () => {
  it.each(MUST_FLOAT)('%s wraps its contained cards in <Float>', (file) => {
    expect(readSource(`${SRC}/${file}`), file).toMatch(/<Float[\s>]/);
  });

  it('keeps the flotation in one helper: nobody writes the float animation by hand', () => {
    const offenders = sourceFiles(SRC, /\.(ts|tsx)$/)
      .map((file) => ({ path: fromSrc(file), source: readSource(file) }))
      .filter(({ source }) => /animate-fm-float\b|fm-float-s\b/.test(source))
      .map(({ path }) => path)
      // El helper, y la zebra: es la única pieza que flota sin ser un contenedor (`animated`).
      .filter(
        (path) => !path.startsWith('lib/motion/') && path !== 'components/ui/media-skeleton.tsx',
      );

    expect(offenders).toEqual([]);
  });
});

import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { floatStyle } from '@/lib/motion/float';

import { fromSrc, readSource, sourceFiles, SRC } from '../helpers/source-files';

const read = (file: string) => readSource(join(SRC, file));

describe('floatStyle', () => {
  it('flota suave por defecto, sin desfase para el primero', () => {
    expect(floatStyle()).toEqual({
      animation: 'fm-float-s 7s ease-in-out infinite',
      animationDelay: '0s',
    });
  });

  it('usa el recorrido largo para los discos', () => {
    expect(floatStyle({ depth: 'deep' }).animation).toBe('fm-float 7s ease-in-out infinite');
  });

  it('desfasa duración y arranque entre hermanos para que no suban a la vez', () => {
    const styles = [0, 1, 2, 3].map((order) => floatStyle({ order }));

    expect(new Set(styles.map((style) => style.animationDelay)).size).toBe(4);
    expect(new Set(styles.slice(0, 3).map((style) => style.animation)).size).toBe(3);
    // El arranque es negativo: el elemento empieza a mitad de ciclo, no parado.
    for (const style of styles.slice(1)) expect(style.animationDelay).toMatch(/^-\d/);
  });

  it('respeta una duración y un arranque explícitos, para piezas que flotan juntas', () => {
    expect(floatStyle({ depth: 'deep', duration: '9s', delay: '0.35s', order: 2 })).toEqual({
      animation: 'fm-float 9s ease-in-out infinite',
      animationDelay: '0.35s',
    });
  });
});

describe('el flotado del sitio', () => {
  it('sale siempre del helper: ninguna vista escribe la animación a mano', () => {
    for (const file of sourceFiles(SRC)) {
      if (fromSrc(file) === 'lib/motion/float.ts') continue;

      expect(readSource(file), fromSrc(file)).not.toMatch(/animation:\s*[`'"]fm-float/);
    }
  });

  it('lo comparten las tarjetas, los discos y el retrato de Marisol', () => {
    const floating = [
      'components/features/home/realm-card.tsx',
      'components/features/about/marisol-portrait.tsx',
      'components/features/descubrete/result-step.tsx',
      'components/features/academy/course-list.tsx',
      'components/features/academy/course-detail.tsx',
      'components/features/experiences/experience-list.tsx',
      'components/features/store/product-grid.tsx',
      'components/features/store/product-detail.tsx',
      'app/[locale]/mi-santuario/page.tsx',
    ];

    for (const file of floating) expect(read(file), file).toContain('<Float');

    // Los discos flotan por dentro, con el mismo helper, y todo disco de audio flota.
    expect(read('components/ui/frequency-disc.tsx')).toContain("floatStyle({ depth: 'deep'");
    expect(read('components/features/player/audio-disc.tsx')).toContain(
      'floatDuration = DEFAULT_FLOAT',
    );
    // El envoltorio se detiene bajo el cursor o el foco: lo pulsable no se mueve.
    expect(read('components/ui/float.tsx')).toContain('hover:[animation-play-state:paused]');
  });
});

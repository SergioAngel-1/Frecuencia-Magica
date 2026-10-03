import { describe, expect, it } from 'vitest';

import { EASE, STAGGER } from '@/config/motion';
import { fadeIn, fadeUp, scaleIn, staggerContainer } from '@/lib/motion-variants';

describe('variantes de movimiento', () => {
  it('fadeUp desplaza 26px en el estado oculto', () => {
    expect(fadeUp.hidden).toMatchObject({ opacity: 0, y: 26 });
  });

  it('fadeUp termina sin desplazamiento', () => {
    expect(fadeUp.visible).toMatchObject({ opacity: 1, y: 0 });
  });

  it('staggerContainer escalona los hijos con el primer delay del sistema', () => {
    const { transition } = staggerContainer.visible as {
      transition: { staggerChildren: number; delayChildren: number };
    };

    expect(transition.staggerChildren).toBe(0.15);
    expect(transition.delayChildren).toBe(STAGGER[0]);
  });

  it('todas las variantes usan un easing del sistema', () => {
    for (const variante of [fadeUp, fadeIn, scaleIn]) {
      const { transition } = variante.visible as { transition: { ease: readonly number[] } };
      expect(transition.ease).toEqual(EASE.soft);
    }
  });
});

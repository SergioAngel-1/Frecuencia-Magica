import type { Variants } from 'motion/react';

import { DURATION, EASE, STAGGER } from '@/config/motion';

/**
 * Variantes de entrada del sistema.
 *
 * Equivalen a los keyframes `fmFadeUp` y `fmFadeIn` del prototipo, pero como
 * variantes de Motion para poder ligarlas al scroll y al cambio de estado.
 * Ningún componente debe escribir sus propias duraciones o easings.
 */

/** Emerge desde 26px abajo. La entrada por defecto de todo contenido. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.entrance, ease: EASE.soft },
  },
};

/** Materialización sin desplazamiento. Para vistas y capas de fondo. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE.soft },
  },
};

/** Aparición desde una escala ligeramente menor. Para paneles y orbes. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE.soft },
  },
};

/** Contenedor que escalona la entrada de sus hijos. */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: STAGGER[0] },
  },
};

/** Hijo de {@link staggerContainer}. Hereda el retardo del contenedor. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.entrance, ease: EASE.soft },
  },
};

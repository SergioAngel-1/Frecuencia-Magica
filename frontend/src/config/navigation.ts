import { NAV_REALMS } from './realms';

/** El marfil de la paleta: la entrada de la narrativa no es un realm y no toma su acento. */
const IVORY = '#F7F4EA';

/**
 * La entrada de la narrativa del sitio en la navegación: «Sobre Marisol» no
 * es un realm (hereda el de la home), pero cuenta quién hay detrás y por qué.
 * Va después de los realms, en marfil, para no confundirse con ellos.
 */
export const NAV_STORY = {
  id: 'story',
  href: '/sobre-marisol',
  accent: IVORY,
} as const;

export { NAV_REALMS };
